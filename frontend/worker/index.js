/**
 * KOTIBAJON — Custom Service Worker: Notification Engine
 * next-pwa v5.6+ merges this file into the generated sw.js via customWorkerSrc
 *
 * Architecture:
 *   - IndexedDB  → persistent storage (survives browser restart)
 *   - setTimeout → in-memory timer (reliable while SW is alive)
 *   - activate   → re-schedules all pending on every SW start
 *   - message    → SCHEDULE / CANCEL / SYNC / TEST from the React app
 */

/* ── IndexedDB ──────────────────────────────────────────────────── */
const DB_NAME    = 'kj-notif-db'
const DB_VERSION = 1
const STORE      = 'notifications'

function openDB () {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = e => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('scheduledAt', 'scheduledAt', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror  = () => reject(req.error)
  })
}

async function dbGetAll () {
  const db = await openDB()
  return new Promise(resolve => {
    const tx  = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror   = () => resolve([])
  })
}

async function dbPut (record) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(record)
    tx.oncomplete = resolve
    tx.onerror    = reject
  })
}

async function dbDelete (id) {
  const db = await openDB()
  return new Promise(resolve => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = resolve
    tx.onerror    = resolve
  })
}

/* ── In-memory timer registry ───────────────────────────────────── */
const timers = new Map()

/* ── Core: schedule one notification ───────────────────────────── */
function scheduleOne (notif) {
  const { id, scheduledAt } = notif
  const delay = scheduledAt - Date.now()

  // Clear any existing timer for this id
  if (timers.has(id)) {
    clearTimeout(timers.get(id))
    timers.delete(id)
  }

  if (delay <= 0) {
    // Fire immediately if missed within a 2-minute window
    if (delay > -120_000) fireNotification(notif)
    return
  }

  // Clamp to JS max safe timeout (~24.8 days)
  // For longer delays, reschedule daily until it's close
  const wait = Math.min(delay, 86_400_000)

  const tid = setTimeout(async () => {
    timers.delete(id)
    if (delay > 86_400_000) {
      // Not yet — reschedule for tomorrow
      scheduleOne(notif)
    } else {
      await fireNotification(notif)
    }
  }, wait)

  timers.set(id, tid)
}

/* ── Fire: show OS notification + notify open clients ───────────── */
async function fireNotification (notif) {
  const { id, title, body = '', url = '/tasks' } = notif

  // Persist "fired" state so we don't re-fire on next SW activation
  await dbPut({ ...notif, firedAt: Date.now() })

  // Tell every open page: play sound + update UI
  const allClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  })
  allClients.forEach(c =>
    c.postMessage({
      type      : 'KJ_NOTIF_FIRED',
      id,
      title,
      body,
      playSound : notif.sound !== false,
    })
  )

  // Show native OS notification (works even with no open tab)
  try {
    await self.registration.showNotification(title, {
      body,
      icon            : '/icons/icon-192.png',
      badge           : '/icons/icon-192.png',
      tag             : `kj-${id}`,
      data            : { url, id },
      vibrate         : [200, 100, 200, 100, 400],
      requireInteraction: false,
    })
  } catch (_) {
    // Notification permission denied or API unavailable
  }
}

/* ── SW lifecycle: re-schedule all pending on every start ───────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const all     = await dbGetAll()
      const now     = Date.now()
      const pending = all.filter(n => !n.firedAt)
      pending.forEach(n => scheduleOne(n))
      // Clean up very old fired notifications (> 7 days)
      const stale = all.filter(n => n.firedAt && now - n.firedAt > 7 * 86_400_000)
      await Promise.all(stale.map(n => dbDelete(n.id)))
    })()
  )
})

/* ── Message handler (called from React app) ────────────────────── */
self.addEventListener('message', async event => {
  const { type, payload } = event.data || {}

  switch (type) {

    /* Schedule a new notification */
    case 'KJ_SCHEDULE': {
      await dbPut({ ...payload, firedAt: null })
      scheduleOne(payload)
      event.source?.postMessage({ type: 'KJ_ACK', id: payload.id })
      break
    }

    /* Cancel a scheduled notification */
    case 'KJ_CANCEL': {
      if (timers.has(payload.id)) {
        clearTimeout(timers.get(payload.id))
        timers.delete(payload.id)
      }
      await dbDelete(payload.id)
      break
    }

    /*
     * SYNC — called on every page load.
     * Re-register all pending (needed after browser restarts the SW)
     */
    case 'KJ_SYNC': {
      const all     = await dbGetAll()
      const pending = all.filter(n => !n.firedAt && n.scheduledAt > Date.now() - 120_000)
      pending.forEach(n => scheduleOne(n))
      event.source?.postMessage({ type: 'KJ_SYNC_ACK', count: pending.length })
      break
    }

    /* Return full list (for Settings page display) */
    case 'KJ_LIST': {
      const all = await dbGetAll()
      event.source?.postMessage({ type: 'KJ_LIST_ACK', data: all })
      break
    }

    /* Test notification — fires after 3 seconds */
    case 'KJ_TEST': {
      const testNotif = {
        id          : `kj-test-${Date.now()}`,
        title       : 'KOTIBAJON — Test bildirishnoma',
        body        : 'Bildirishnomalar muvaffaqiyatli ishlayapti!',
        scheduledAt : Date.now() + 3_000,
        url         : '/settings',
        sound       : true,
      }
      await dbPut({ ...testNotif, firedAt: null })
      scheduleOne(testNotif)
      break
    }
  }
})

/* ── Notification click → open / focus the app ─────────────────── */
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const { url = '/tasks' } = event.notification.data || {}

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(async clients => {
        // Focus an already-open window
        const existing = clients.find(c =>
          c.url.startsWith(self.location.origin)
        )
        if (existing) {
          await existing.focus()
          existing.postMessage({ type: 'KJ_NAVIGATE', url })
          return
        }
        // Otherwise open a new tab
        await self.clients.openWindow(url)
      })
  )
})
