import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KOTIBAJON — Shaxsiy Raqamli Kotiba',
    short_name: 'KOTIBAJON',
    description: "Vazifalar, moliya, maqsadlar va muhim sanalarni bitta aqlli platformada boshqaring. O'zbekiston uchun.",
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#0F0F0F',
    theme_color: '#F59E0B',
    orientation: 'portrait',
    lang: 'uz',
    categories: ['productivity', 'utilities', 'finance'],
    icons: [
      {
        src: '/icons/icon-72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/icons/icon-96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icons/icon-128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/icons/icon-144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/icons/icon-152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Vazifalar',
        short_name: 'Vazifalar',
        description: 'Bugungi vazifalar',
        url: '/tasks',
        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
      },
      {
        name: 'Moliya',
        short_name: 'Moliya',
        description: 'Moliya nazorati',
        url: '/finance',
        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
      },
    ],
  }
}
