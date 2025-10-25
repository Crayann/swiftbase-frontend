import './globals.css'

export const metadata = {
  title: 'SwiftBridge - Send Money Globally',
  description: 'Fast, low-cost international money transfers using blockchain',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}