import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import { faB, faCheckSquare, faCoffee, faDatabase, faHouseLaptop, faS, faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
library.add(faB, faS)
config.autoAddCss = false;

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Read the bible',
  description: 'Simple app to read the bible',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
