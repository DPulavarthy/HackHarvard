import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export default function WaitingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { name, userId, truckId } = location.state || {}
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate a loading process
    const timer = setTimeout(() => {
      setIsLoading(false)
      navigate('/main', { state: { name, userId, truckId } })
    }, 5000) // Navigate after 5 seconds

    return () => clearTimeout(timer)
  }, [navigate, name, userId, truckId])

  return (
    <div className="min-h-screen bg-green-950 text-green-100 flex flex-col">
      <header className="bg-green-900 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 mr-4">
              <img 
                src="/logo.png?height=48&width=48" 
                alt="Clean Sweep Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-green-300" style={{ fontFamily: 'cursive, sans-serif' }}>Clean Sweep</h1>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="bg-green-900 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-green-300 mb-6 text-center">Please Wait</h2>
          <p className="text-green-200 mb-6 text-center">Information is being processed and collected.</p>
          <div className="space-y-4">
            <div className="bg-green-800 p-4 rounded">
              <h3 className="text-lg font-semibold text-green-300 mb-2">User Information</h3>
              <p><span className="font-medium">Name:</span> {name || 'N/A'}</p>
              <p><span className="font-medium">User ID:</span> {userId || 'N/A'}</p>
              <p><span className="font-medium">Truck ID:</span> {truckId || 'N/A'}</p>
            </div>
            <div className="bg-green-800 p-4 rounded">
              <h3 className="text-lg font-semibold text-green-300 mb-2">Service Details</h3>
              <p><span className="font-medium">Location:</span> Cambridge, Massachusetts</p>
              <p><span className="font-medium">Garbage Service:</span> Curbside Collections</p>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-green-300 animate-spin" />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-green-900 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-green-400">
          © 2024 Clean Sweep. All rights reserved.
        </div>
      </footer>
    </div>
  )
}