/**
 * logo.png dan barcha PWA icon o'lchamlarini avtomatik yaratish
 * Ishlatish: node scripts/generate-icons.mjs
 */
import sharp from 'sharp'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root  = join(__dir, '..')
const src   = join(root, 'public', 'logo.png')
const dest  = join(root, 'public', 'icons')

if (!existsSync(dest)) mkdirSync(dest, { recursive: true })

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

async function run() {
  console.log('📦 Iconlar yasalmoqda...\n')

  for (const size of sizes) {
    const out = join(dest, `icon-${size}.png`)
    await sharp(src)
      .resize(size, size, { fit: 'cover', background: { r: 15, g: 23, b: 42, alpha: 1 } })
      .png()
      .toFile(out)
    console.log(`✅ icon-${size}.png`)
  }

  // Maskable icon — logo kichikroq (safe zone 80%), qora fon
  const maskOut = join(dest, 'maskable-512.png')
  const inner   = Math.round(512 * 0.75) // 384px
  const pad     = Math.round((512 - inner) / 2)

  const logoBuf = await sharp(src)
    .resize(inner, inner, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
    .png()
    .toBuffer()

  await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 15, g: 23, b: 42, alpha: 255 } },
  })
    .composite([{ input: logoBuf, top: pad, left: pad }])
    .png()
    .toFile(maskOut)
  console.log('✅ maskable-512.png (safe zone 75%)')

  console.log(`\n🎉 Barcha iconlar: public/icons/ da`)
  console.log('📌 manifest.json allaqachon yangilangan.')
}

run().catch(e => { console.error('❌', e.message); process.exit(1) })
