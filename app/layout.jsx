import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Header from '@/components/Header'

export const metadata = {
  title: 'SwiftBase - Send Money Globally',
  description: 'Fast, secure international money transfers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}