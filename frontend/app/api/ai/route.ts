import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `You are Tom — a smart AI assistant built into KotibaJON, a productivity app for Uzbek users.

IMPORTANT: Always respond in the SAME language the user writes in:
- User writes Uzbek → respond in Uzbek
- User writes Russian → respond in Russian
- User writes English → respond in English

Be helpful, friendly, and concise. Max 3-4 sentences.

KotibaJON app sections:
- Vazifalar (Tasks): add/manage tasks, priorities, kanban board
- Moliya (Finance): income/expense tracking, budgets, charts
- Kutubxona (Library): 8 books (Atomic Habits, Deep Work, Rich Dad, 7 Habits...)
- Maqsadlar (Goals): yearly goals, milestones, progress tracking
- Sanalar (Dates): important dates with auto-reminders
- Hisobotlar (Reports): weekly/monthly productivity stats
- Sozlamalar (Settings): profile, notifications, desktop widget (Tom)

You are Tom — the desktop voice assistant of KotibaJON.`

/* ── Provider: Groq (bepul) ──────────────────────────────────── */
async function askGroq(message: string): Promise<string> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('GROQ_API_KEY topilmadi')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 300,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user',   content: message },
      ],
    }),
  })

  if (!res.ok) throw new Error(`Groq ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? 'Javob topilmadi.'
}

/* ── Provider: Anthropic (to'lovli, lekin eng kuchli) ────────── */
async function askAnthropic(message: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY topilmadi')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM,
      messages: [{ role: 'user', content: message }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic ${res.status}`)
  const data = await res.json()
  return data.content?.[0]?.text ?? 'Javob topilmadi.'
}

/* ── Handler ─────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const { message } = await req.json()
  if (!message?.trim()) {
    return NextResponse.json({ reply: 'Savol bo\'sh.' })
  }

  /* Groq (bepul) → agar yo'q bo'lsa Anthropic → agar ikkalasi ham yo'q */
  const providers = [
    { name: 'Groq',      fn: askGroq },
    { name: 'Anthropic', fn: askAnthropic },
  ]

  for (const p of providers) {
    try {
      const reply = await p.fn(message)
      return NextResponse.json({ reply })
    } catch (e: any) {
      if (e.message?.includes('topilmadi')) continue  // key yo'q, keyingiga o't
      console.error(`${p.name} error:`, e.message)
      return NextResponse.json({
        reply: 'Kechirasiz, hozir javob bera olmayman. Keyinroq urinib ko\'ring.'
      })
    }
  }

  /* Hech bir provider yo'q */
  return NextResponse.json({
    reply: 'AI sozlanmagan. .env.local ga GROQ_API_KEY (bepul: console.groq.com) qo\'shing.'
  })
}
