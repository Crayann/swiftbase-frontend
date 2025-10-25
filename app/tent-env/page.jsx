export default function TestEnv() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Environment Variable Test</h1>
      <p className="mt-4">API URL: {apiUrl}</p>
      {apiUrl ? (
        <p className="text-green-600">✅ Environment variable loaded!</p>
      ) : (
        <p className="text-red-600">❌ Environment variable NOT loaded!</p>
      )}
    </div>
  );
}