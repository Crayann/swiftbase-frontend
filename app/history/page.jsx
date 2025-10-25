export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Transaction History
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-600">
            Your transaction history will appear here.
          </p>
          
          <div className="mt-8 space-y-4">
            <div className="border-l-4 border-green-500 bg-gray-50 p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">Sent $500 to Maria</p>
                  <p className="text-sm text-gray-600">Completed - Jan 15, 2025</p>
                </div>
                <span className="text-green-600 font-bold">-$500</span>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 bg-gray-50 p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">Sent $200 to Juan</p>
                  <p className="text-sm text-gray-600">Completed - Jan 14, 2025</p>
                </div>
                <span className="text-green-600 font-bold">-$200</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}