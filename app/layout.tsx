import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import Footer from "@/components/footer"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Laterz - The Ultimate Todo Avoidance App",
  description: "Find creative ways to avoid your responsibilities",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <main className="min-h-screen bg-lavender-50 flex flex-col">
        <Header />
          {children}
          <Footer />
        </main>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
import Header from "@/components/header"

