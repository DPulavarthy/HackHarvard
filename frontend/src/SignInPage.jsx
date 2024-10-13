import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignInPage() {
  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const [truckId, setTruckId] = useState('')
  const navigate = useNavigate()

  const handleSignIn = (e) => {
    e.preventDefault()
    // Here you would typically validate the input and authenticate the user
    // For this example, we'll navigate to the waiting page with user data
    navigate('/waiting', { state: { name, userId, truckId } })
  }

  return (
    <div className="min-h-screen bg-green-950 text-green-100 flex">
      {/* Left side with logo and slogan */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-green-900 p-8">
        <img 
          src="/logo.png?height=200&width=200" 
          alt="Clean Sweep Logo" 
          className="w-48 h-48 object-contain mb-8"
        />
        <h1 className="text-4xl font-bold text-green-300 mb-4" style={{ fontFamily: 'cursive, sans-serif' }}>Clean Sweep</h1>
        <p className="text-xl text-green-400 text-center">Sweeping the city clean, one route at a time.</p>
      </div>

      {/* Right side with sign-in form */}
      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleSignIn} className="space-y-6 w-80">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-green-300">Name</label>
            <input 
              id="name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-green-100 placeholder-green-400"
            />
          </div>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-green-300">User ID</label>
            <input 
              id="userId" 
              type="text" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-green-100 placeholder-green-400"
            />
          </div>
          <div>
            <label htmlFor="truckId" className="block text-sm font-medium text-green-300">Truck ID</label>
            <input 
              id="truckId" 
              type="text" 
              value={truckId} 
              onChange={(e) => setTruckId(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-green-100 placeholder-green-400"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}