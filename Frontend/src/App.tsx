import { useState } from 'react'

function App() {
    const [count, setCount] = useState(0)
    const [health, setHealth] = useState<{ status: string; database: string } | null>(null)

    const checkHealth = async () => {
        try {
            const response = await fetch('/api/health')
            const data = await response.json()
            setHealth({ status: data.status, database: data.database })
        } catch (error) {
            setHealth({ status: 'Error', database: 'Failed to connect' })
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-4">Web Movie App</h1>
            <div className="mb-6 p-4 border border-gray-700 rounded bg-gray-800 text-center">
                <h2 className="text-xl font-semibold mb-2">System Status</h2>
                <div className="flex gap-4 mb-4 justify-center">
                    <span className={`px-2 py-1 rounded ${health?.status === 'Healthy' ? 'bg-green-600' : 'bg-red-600'}`}>
                        API: {health?.status || 'Unknown'}
                    </span>
                    <span className={`px-2 py-1 rounded ${health?.database === 'Connected' ? 'bg-green-600' : 'bg-red-600'}`}>
                        DB: {health?.database || 'Unknown'}
                    </span>
                </div>
                <button
                    className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
                    onClick={checkHealth}
                >
                    Check Connection
                </button>
            </div>

            <p className="mb-4">Backend: .NET 9 | Frontend: React + Tailwind | DB: Postgres</p>
            <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                onClick={() => setCount((count) => count + 1)}
            >
                Count is {count}
            </button>
        </div>
    )
}

export default App
