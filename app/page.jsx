import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <nav className="p-6 flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          SwiftBase
        </h1>
        <Link 
          href="/send" 
          className="bg-gradient-to-r from-gray-200 to-gray-400 text-black px-6 py-2 rounded-lg font-semibold hover:from-gray-300 hover:to-gray-500 transition-all"
        >
          Send Money
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20 text-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Send Money Globally in Minutes
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Save up to 90% on fees using blockchain technology
          </p>
          <Link 
            href="/send"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-200 to-gray-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-gray-300 hover:to-gray-500 transition-all shadow-lg hover:shadow-gray-500/50"
          >
            Start Sending <ArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all">
            <Zap className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold mb-3 text-gray-100">Instant Transfers</h3>
            <p className="text-gray-400">
              Money arrives in 5-10 minutes via XRPL blockchain
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all">
            <Shield className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold mb-3 text-gray-100">Secure & Transparent</h3>
            <p className="text-gray-400">
              Every transaction verified on the blockchain
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all">
            <Globe className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold mb-3 text-gray-100">Low Fees</h3>
            <p className="text-gray-400">
              Pay just 1% instead of traditional 5-10% fees
            </p>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-12 rounded-2xl border border-gray-700">
          <h3 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-200 to-gray-400 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <p className="text-gray-300">Enter amount and recipient</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-200 to-gray-400 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <p className="text-gray-300">Compare best routes</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-200 to-gray-400 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <p className="text-gray-300">Pay with Visa card</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-200 to-gray-400 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                4
              </div>
              <p className="text-gray-300">Recipient gets money instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}