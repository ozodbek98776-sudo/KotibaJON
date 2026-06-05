export const metadata = {
  title: 'Tom AI — Desktop Assistant',
  description: 'KotibaJON desktop voice assistant',
}

export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=220,height=440,initial-scale=1"/>
        <meta name="theme-color" content="#6366f1"/>
        <link rel="manifest" href="/widget-manifest.json"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-title" content="Tom AI"/>
      </head>
      <body style={{ margin: 0, padding: 0, background: 'transparent', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
