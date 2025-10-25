import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700">
      <nav className="p-6 flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold">SwiftBridge</h1>
        <Link 
          href="/send" 
          className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
        >
          Send Money
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20 text-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Send Money Globally in Minutes
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Save up to 90% on fees using blockchain technology
          </p>
          <Link 
            href="/send"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition"
          >
            Start Sending <ArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
            <Zap className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Instant Transfers</h3>
            <p className="text-blue-100">
              Money arrives in 5-10 minutes via XRPL blockchain
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
            <Shield className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Secure & Transparent</h3>
            <p className="text-blue-100">
              Every transaction verified on the blockchain
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
            <Globe className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Low Fees</h3>
            <p className="text-blue-100">
              Pay just 1% instead of traditional 5-10% fees
            </p>
          </div>
        </div>

        <div className="mt-20 bg-white/10 backdrop-blur-lg p-12 rounded-2xl">
          <h3 className="text-3xl font-bold mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <p>Enter amount and recipient</p>
            </div>
            <div className="text-center">
              <div className="bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <p>Compare best routes</p>
            </div>
            <div className="text-center">
              <div className="bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <p>Pay with Visa card</p>
            </div>
            <div className="text-center">
              <div className="bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <p>Recipient gets money instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}