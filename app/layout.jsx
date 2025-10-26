import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'SwiftBase - Send Money Globally',
  description: 'Fast, secure international money transfers powered by XRPL',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}