import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Desa Website - Portal Desa Modern",
    template: "%s | Desa Jambakan",
  },
  description: "Portal informasi resmi desa dengan layanan digital modern",
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_Klaten_Regency.svg",
        type: "image/svg+xml",
      },
    ],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${geistSans.className} bg-background text-foreground`}>{children}</body>
    </html>
  )
}
