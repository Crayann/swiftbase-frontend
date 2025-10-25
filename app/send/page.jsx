'use client'

import { useState, useEffect, useCallback } from 'react';  // Add useCallback
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
        type: 'traditional',
        amountSent: amount,
        fee: amount * 0.05 + 5,
        exchangeRate: rate * 0.97,
        estimatedTime: '1-3 days',
        amountReceived: ((amount - (amount * 0.05 + 5)) * rate * 0.97).toFixed(2),
        savings: -50
      },
      {
        provider: 'Competitor Service',
        type: 'competitor',
        amountSent: amount,
        fee: amount * 0.015 + 3,
        exchangeRate: rate * 0.99,
        estimatedTime: '1 day',
        amountReceived: ((amount - (amount * 0.015 + 3)) * rate * 0.99).toFixed(2),
        savings: -20
      }
    ].sort((a, b) => b.amountReceived - a.amountReceived);
  }, []);

  // Fetch routes - wrapped in useCallback
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

  // Fetch routes when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) >= 10) {
      const timer = setTimeout(() => {
        fetchRoutes();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [amount, fetchRoutes]); // Now includes fetchRoutes ✅

  const pollTransactionStatus = useCallback(async (txId) => {
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
  }, []);

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

  const resetForm = () => {
    setAmount('');
    setRoutes([]);
    setSelectedRoute(null);
    setStep('amount');
    setTransactionId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Send Money Instantly</h1>
          <Link 
            href="/"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <Home size={20} />
            Home
          </Link>
        </div>

        {/* Amount Input */}
        {step === 'amount' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Send
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 text-4xl font-bold border-0 focus:ring-2 focus:ring-indigo-500 p-4 rounded-lg"
                min="10"
                autoFocus
              />
              <span className="text-2xl text-gray-500 font-semibold">{fromCurrency}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Minimum: $10</p>
            
            {loading && (
              <div className="mt-4 text-center text-indigo-600">
                Finding best rates...
              </div>
            )}
          </div>
        )}

        {/* Route Comparison */}
        {step === 'routes' && routes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Choose Your Route
              </h2>
              <button
                onClick={() => setStep('amount')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Change Amount
              </button>
            </div>
            
            {routes.map((route, index) => (
              <div
                key={index}
                onClick={() => setSelectedRoute(route)}
                className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer transition-all ${
                  selectedRoute?.provider === route.provider
                    ? 'ring-4 ring-indigo-500 transform scale-[1.02]'
                    : 'hover:shadow-2xl'
                } ${index === 0 ? 'border-4 border-green-400' : ''}`}
              >
                {index === 0 && (
                  <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                    BEST VALUE
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{route.provider}</h3>
                    <p className="text-sm text-gray-600">{route.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">
                      {route.amountReceived} <span className="text-lg">{toCurrency}</span>
                    </p>
                    {parseFloat(route.savings) > 0 && (
                      <p className="text-sm text-green-600 font-semibold flex items-center gap-1 justify-end">
                        <TrendingDown size={16} />
                        Save ${route.savings}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Fee</p>
                    <p className="font-semibold">${route.fee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Rate</p>
                    <p className="font-semibold">{route.exchangeRate.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 flex items-center gap-1">
                      <Clock size={14} /> Time
                    </p>
                    <p className="font-semibold">{route.estimatedTime}</p>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleSendMoney}
              disabled={!selectedRoute}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              Continue with {selectedRoute?.provider}
              <ArrowRight />
            </button>
          </div>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Transfer</h2>
            <p className="text-gray-600">
              Converting {amount} {fromCurrency} via XRPL...
            </p>
            <div className="mt-8 space-y-2 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                <span>Payment captured from your Visa card</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500 animate-pulse"></div>
                <span>Converting via XRPL network...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                <span className="text-gray-400">Sending to recipient&apos;s Visa card</span>
              </div>
            </div>
          </div>
        )}

        {/* Complete State */}
        {step === 'complete' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Transfer Complete!
            </h2>
            <p className="text-gray-600 mb-8">
              Your money has been sent successfully
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-gray-600">Amount Sent</span>
                <span className="font-bold text-gray-900">${amount} {fromCurrency}</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-gray-600">Recipient Receives</span>
                <span className="font-bold text-gray-900">
                  {selectedRoute?.amountReceived} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-gray-600">Exchange Rate</span>
                <span className="font-bold text-gray-900">
                  {selectedRoute?.exchangeRate.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-gray-600">Fee</span>
                <span className="font-bold text-gray-900">
                  ${selectedRoute?.fee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-sm text-gray-700">
                  {transactionId?.substring(0, 16)}...
                </span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetForm}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Send Another
              </button>
              <Link
                href="/"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
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