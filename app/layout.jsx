import './globals.css'

export const metadata = {
  title: 'SwiftBridge - Send Money Instantly',
  description: 'Fast, secure international money transfers powered by XRPL and Visa',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}