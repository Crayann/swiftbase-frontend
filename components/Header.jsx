'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // Don't show header on landing page
  if (pathname === '/') return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          SwiftBase
        </Link>
        
        <div className="flex gap-4">
          <Link 
            href="/send" 
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              pathname === '/send' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Send Money
          </Link>
          
          <Link 
            href="/history" 
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              pathname === '/history' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}