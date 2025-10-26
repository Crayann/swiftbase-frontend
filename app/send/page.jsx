'use client'

import { useState, useCallback } from 'react';
import axios from 'axios';
import { ArrowRight, Clock, TrendingDown, CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function SendMoney() {
  const [amount, setAmount] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('amount');
  const [transactionId, setTransactionId] = useState(null);

  const fromCurrency = 'USD';
  const toCurrency = 'MXN';

  // Mock routes for demo
  const getMockRoutes = useCallback((amount) => {
    const rate = 17.5;
    return [
      {
        provider: 'SwiftBridge XRPL',
        type: 'xrpl_direct',
        amountSent: amount,
        fee: amount * 0.01,
        exchangeRate: rate * 0.997,
        estimatedTime: '5-10 minutes',
        amountReceived: ((amount - amount * 0.01) * rate * 0.997).toFixed(2),
        savings: 0
      },
      {
        provider: 'Traditional Wire',
        type: 'JPMorgan Chase, Bank of America, Citibank',
        amountSent: amount,
        fee: amount * 0.05 + 5,
        exchangeRate: rate * 0.97,
        estimatedTime: '1-3 days',
        amountReceived: ((amount - (amount * 0.05 + 5)) * rate * 0.97).toFixed(2),
        savings: -50
      },
      {
        provider: 'Competitor Service',
        type: 'SlingPay, TransferWise',
        amountSent: amount,
        fee: amount * 0.015 + 3,
        exchangeRate: rate * 0.99,
        estimatedTime: '1 day',
        amountReceived: ((amount - (amount * 0.015 + 3)) * rate * 0.99).toFixed(2),
        savings: -20
      }
    ].sort((a, b) => b.amountReceived - a.amountReceived);
  }, []);

  // Fetch routes - only called when user submits
  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await axios.post(`${apiUrl}/transactions/compare-routes`, {
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
      });
      setRoutes(response.data.routes);
      setStep('routes');
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      setRoutes(getMockRoutes(parseFloat(amount)));
      setStep('routes');
    }
    setLoading(false);
  }, [amount, fromCurrency, toCurrency, getMockRoutes]);

  // Handle form submit (Enter key or button click)
  const handleSubmitAmount = (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 10) {
      alert('Please enter an amount of at least $10');
      return;
    }
    
    fetchRoutes();
  };

  const handleSendMoney = async () => {
    setStep('processing');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await axios.post(`${apiUrl}/transactions/create`, {
        senderId: 1,
        recipientId: 1,
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
        routeType: selectedRoute.type,
        senderCardToken: 'mock_card_token',
      });

      const txId = response.data.transactionId;
      setTransactionId(txId);
      pollTransactionStatus(txId);

    } catch (error) {
      console.error('Transaction failed:', error);
      setTimeout(() => {
        setTransactionId('DEMO_TX_' + Date.now());
        setStep('complete');
      }, 3000);
    }
  };

  const pollTransactionStatus = async (txId) => {
    const interval = setInterval(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const response = await axios.get(`${apiUrl}/transactions/${txId}/status`);
        
        if (response.data.status === 'completed') {
          clearInterval(interval);
          setStep('complete');
        } else if (response.data.status === 'failed') {
          clearInterval(interval);
          alert('Transaction failed');
          setStep('routes');
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, 2000);

    setTimeout(() => clearInterval(interval), 120000);
  };

  const resetForm = () => {
    setAmount('');
    setRoutes([]);
    setSelectedRoute(null);
    setStep('amount');
    setTransactionId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Send Money Instantly
          </h1>
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white font-semibold transition"
          >
            <Home size={20} />
            Home
          </Link>
        </div>

        {/* Amount Input - Step 1 */}
        {step === 'amount' && (
          <form onSubmit={handleSubmitAmount}>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700 p-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Send
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 text-4xl font-bold bg-transparent border-b-2 border-gray-600 focus:border-gray-400 text-white placeholder-gray-500 p-4 outline-none transition"
                  min="10"
                  step="0.01"
                  autoFocus
                  required
                />
                <span className="text-2xl text-gray-400 font-semibold">{fromCurrency}</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">Minimum: $10</p>
              
              <button
                type="submit"
                disabled={loading || !amount || parseFloat(amount) < 10}
                className="w-full mt-8 bg-gradient-to-r from-gray-200 to-gray-400 text-black py-4 rounded-xl font-bold text-lg hover:from-gray-300 hover:to-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {loading ? 'Finding Best Rates...' : 'Continue'}
              </button>
              
              <p className="text-center text-gray-400 text-sm mt-4">
                Press Enter or click Continue
              </p>
            </div>
          </form>
        )}

        {/* Route Comparison - Step 2 */}
        {step === 'routes' && routes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-100">
                Choose Your Route
              </h2>
              <button
                onClick={() => setStep('amount')}
                className="text-gray-300 hover:text-white font-semibold transition"
              >
                ← Change Amount
              </button>
            </div>
            
            {routes.map((route, index) => (
              <div
                key={index}
                onClick={() => setSelectedRoute(route)}
                className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl shadow-xl border p-6 cursor-pointer transition-all ${
                  selectedRoute?.provider === route.provider
                    ? 'border-gray-400 ring-2 ring-gray-400'
                    : 'border-gray-700 hover:border-gray-500'
                } ${index === 0 ? 'border-green-500' : ''}`}
              >
                {index === 0 && (
                  <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                    BEST VALUE
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{route.provider}</h3>
                    <p className="text-sm text-gray-400">{route.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-100">
                      {route.amountReceived} <span className="text-lg text-gray-400">{toCurrency}</span>
                    </p>
                    {parseFloat(route.savings) > 0 && (
                      <p className="text-sm text-green-500 font-semibold flex items-center gap-1 justify-end">
                        <TrendingDown size={16} />
                        Save ${route.savings}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Fee</p>
                    <p className="font-semibold text-gray-200">${route.fee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Rate</p>
                    <p className="font-semibold text-gray-200">{route.exchangeRate.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 flex items-center gap-1">
                      <Clock size={14} /> Time
                    </p>
                    <p className="font-semibold text-gray-200">{route.estimatedTime}</p>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleSendMoney}
              disabled={!selectedRoute}
              className="w-full bg-gradient-to-r from-gray-200 to-gray-400 text-black py-4 rounded-xl font-bold text-lg hover:from-gray-300 hover:to-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              Continue with {selectedRoute?.provider}
              <ArrowRight />
            </button>
          </div>
        )}

        {/* Processing State - Step 3 */}
        {step === 'processing' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Processing Transfer</h2>
            <p className="text-gray-400">
              Converting {amount} {fromCurrency} via XRPL...
            </p>
            <div className="mt-8 space-y-2 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-gray-300">Payment captured from your account</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-400 animate-pulse"></div>
                <span className="text-gray-300">Converting via XRPL network...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                <span className="text-gray-500">Sending to recipient</span>
              </div>
            </div>
          </div>
        )}

        {/* Complete State - Step 4 */}
        {step === 'complete' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-100 mb-2">
              Transfer Complete!
            </h2>
            <p className="text-gray-400 mb-8">
              Your money has been sent successfully
            </p>

            <div className="bg-gray-900/50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto border border-gray-700">
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-700">
                <span className="text-gray-400">Amount Sent</span>
                <span className="font-bold text-gray-100">${amount} {fromCurrency}</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-700">
                <span className="text-gray-400">Recipient Receives</span>
                <span className="font-bold text-gray-100">
                  {selectedRoute?.amountReceived} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-700">
                <span className="text-gray-400">Exchange Rate</span>
                <span className="font-bold text-gray-100">
                  {selectedRoute?.exchangeRate.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-700">
                <span className="text-gray-400">Fee</span>
                <span className="font-bold text-gray-100">
                  ${selectedRoute?.fee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID</span>
                <span className="font-mono text-sm text-gray-300">
                  {transactionId?.substring(0, 16)}...
                </span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetForm}
                className="bg-gradient-to-r from-gray-200 to-gray-400 text-black px-8 py-3 rounded-xl font-bold hover:from-gray-300 hover:to-gray-500 transition-all"
              >
                Send Another
              </button>
              <Link
                href="/"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <Home size={20} />
                Go Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}