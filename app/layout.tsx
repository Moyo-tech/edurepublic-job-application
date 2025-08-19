import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import mylogo from "../public/logomark.png"

<meta name="apple-mobile-web-app-title" content="MyWebSite" />

export const metadata: Metadata = {
  title: "EduRepublic - Job Application",
  description: "Apply for positions at EduRepublic",
  icons: {
  icon: "/web-app-manifest-192x192.png",
  shortcut: "/web-app-manifest-192x192.png",
  apple: "/web-app-manifest-192x192.png",
},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
