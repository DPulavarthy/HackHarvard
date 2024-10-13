import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import garbageData from './data.json'

export default function MainPage() {
  const mapRef = useRef(null)
  const [mapInstance, setMapInstance] = useState(null)
  const [directionsRenderer, setDirectionsRenderer] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { name, userId, truckId } = location.state || {}

  const [routeStarted, setRouteStarted] = useState(false)
  const [current, setCurrent] = useState(null)
  const [upcoming, setUpcoming] = useState(garbageData)
  const [completed, setCompleted] = useState([])
  const [completedRoute, setCompletedRoute] = useState([])
  const [isLastPickup, setIsLastPickup] = useState(false)
  const [markers, setMarkers] = useState([])
  const [estimatedTime, setEstimatedTime] = useState(null)
  const [totalEstimatedTime, setTotalEstimatedTime] = useState(0)
  const [initialTotalEstimatedTime, setInitialTotalEstimatedTime] = useState(null)

  const startingLocation = {
    id: 0,
    latitude: 42.366519,
    longitude: -71.103802,
    location: "Public Works, 147 Hampshire St, Cambridge, MA 02139",
    fill_level: 0,
    durations: [],
    days_since_last_picked: 0
  }

  useEffect(() => {
    const googleMapScript = document.createElement('script')
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA9wdextBbNhCbxfZ5qpObUUe9qX7Kcl2o&libraries=places`
    googleMapScript.async = true
    window.document.body.appendChild(googleMapScript)

    googleMapScript.addEventListener('load', () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: startingLocation.latitude, lng: startingLocation.longitude },
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeId: 'roadmap',
        styles: [
          { elementType: "geometry", stylers: [{ color: "#1b4332" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#1b4332" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#2d6a4f" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#2d6a4f" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1b4332" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0d3320" }],
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      setMapInstance(map)

      const renderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#2196F3',
          strokeWeight: 5,
        },
      })
      setDirectionsRenderer(renderer)

      // Add markers for all garbage cans and starting location
      const allMarkers = [
        new window.google.maps.Marker({
          position: { lat: startingLocation.latitude, lng: startingLocation.longitude },
          map: map,
          icon: {
            url: '/startingPin.png',
            scaledSize: new window.google.maps.Size(36, 36),
            anchor: new window.google.maps.Point(18, 36),
          },
          title: "Starting Location",
        }),
        ...garbageData.map(can => new window.google.maps.Marker({
          position: { lat: can.latitude, lng: can.longitude },
          map: map,
          icon: {
            url: '/trashCanPin.png',
            scaledSize: new window.google.maps.Size(32, 32),
          },
          title: `Garbage Can ${can.id}`,
        }))
      ]

      setMarkers(allMarkers)

      // Fit the map to show all markers
      const bounds = new window.google.maps.LatLngBounds()
      allMarkers.forEach(marker => bounds.extend(marker.getPosition()))
      map.fitBounds(bounds)

      // Calculate initial total estimated time
      calculateInitialTotalEstimatedTime()
    })

    return () => {
      window.document.body.removeChild(googleMapScript)
    }
  }, [])

  const calculateInitialTotalEstimatedTime = () => {
    const directionsService = new window.google.maps.DirectionsService()
    const waypoints = garbageData.map(can => ({
      location: new window.google.maps.LatLng(can.latitude, can.longitude),
      stopover: true
    }))

    directionsService.route(
      {
        origin: new window.google.maps.LatLng(startingLocation.latitude, startingLocation.longitude),
        destination: new window.google.maps.LatLng(startingLocation.latitude, startingLocation.longitude),
        waypoints: waypoints,
        optimizeWaypoints: false,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          let totalTime = 0
          result.routes[0].legs.forEach(leg => {
            totalTime += leg.duration.value
          })
          const hours = Math.floor(totalTime / 3600)
          const minutes = Math.floor((totalTime % 3600) / 60)
          const seconds = totalTime % 60
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          setInitialTotalEstimatedTime(formattedTime)
        }
      }
    )
  }

  const handleSignOut = () => {
    navigate('/')
  }

  const handleStartRoute = () => {
    setRouteStarted(true)
    setCurrent(upcoming[0])
    setUpcoming(upcoming.slice(1))
    setCompletedRoute([startingLocation])
    updateMarkers(startingLocation, upcoming[0])
    drawRoute(startingLocation, upcoming[0])
  }

  const updateMarkers = (start, end) => {
    // Remove all existing markers from the map
    markers.forEach(marker => marker.setMap(null))

    // Add marker for start location
    const startMarker = new window.google.maps.Marker({
      position: { lat: start.latitude, lng: start.longitude },
      map: mapInstance,
      icon: {
        url: '/startingPin.png',
        scaledSize: new window.google.maps.Size(36, 36),
        anchor: new window.google.maps.Point(18, 36),
      },
      title: "Current Location",
    })

    // Add marker for end location
    const endMarker = new window.google.maps.Marker({
      position: { lat: end.latitude, lng: end.longitude },
      map: mapInstance,
      icon: {
        url: end === startingLocation ? '/endingPin.png' : '/trashCanPin.png',
        scaledSize: new window.google.maps.Size(32, 32),
      },
      title: end === startingLocation ? "Ending Location" : `Garbage Can ${end.id}`,
    })

    setMarkers([startMarker, endMarker])

    // Fit the map to show both markers
    const bounds = new window.google.maps.LatLngBounds()
    bounds.extend(startMarker.getPosition())
    bounds.extend(endMarker.getPosition())
    mapInstance.fitBounds(bounds)
  }

  const drawRoute = (start, end) => {
    const directionsService = new window.google.maps.DirectionsService()
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(start.latitude, start.longitude),
        destination: new window.google.maps.LatLng(end.latitude, end.longitude),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result)
          // Get the estimated time from the result
          const route = result.routes[0]
          if (route && route.legs.length > 0) {
            const estimatedTimeValue = route.legs[0].duration.value // Get time in seconds
            setEstimatedTime(route.legs[0].duration.text)
            setTotalEstimatedTime(prevTotal => prevTotal + estimatedTimeValue)
          }
        }
      }
    )
  }

  const handleGarbagePickedUp = () => {
    if (upcoming.length > 0) {
      setCompleted([current, ...completed])
      setCurrent(upcoming[0])
      setUpcoming(upcoming.slice(1))
      setCompletedRoute([...completedRoute, current])
      updateMarkers(current, upcoming[0])
      drawRoute(current, upcoming[0])
    } else {
      // This is the last garbage pickup, returning to start
      setCompleted([current, ...completed])
      setCurrent(startingLocation)
      setIsLastPickup(true)
      const finalRoute = [...completedRoute, current, startingLocation]
      setCompletedRoute(finalRoute)
      updateMarkers(current, startingLocation)
      drawRoute(current, startingLocation)
    }
  }

  const handleEndRoute = () => {
    const hours = Math.floor(totalEstimatedTime / 3600)
    const minutes = Math.floor((totalEstimatedTime % 3600) / 60)
    const seconds = totalEstimatedTime % 60
    const formattedTotalTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    const finalRoute = [...completedRoute, current, startingLocation]
    navigate('/completion', { 
      state: { 
        name, 
        completedRoute: finalRoute,
        totalEstimatedTime: formattedTotalTime
      } 
    })
  }

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
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col h-full">
          <div className="bg-green-800 p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-green-300 mb-2">User Information</h2>
                <p className="text-green-100">Name: {name || 'N/A'} | User ID: {userId || 'N/A'} | Truck ID: {truckId || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-green-100">Location: Cambridge, Massachusetts</p>
                <p className="text-green-100">Garbage Service: Curbside Collections</p>
              </div>
            </div>
          </div>
          <div className="flex gap-8 flex-grow">
            <div className="w-1/3 space-y-4">
              <div className="bg-green-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-green-300 mb-2">
                  {!routeStarted ? "Starting Location" : current.id === 0 ? "Ending Location" : "Current"}
                </h2>
                {!routeStarted ? (
                  <div>
                    <p>Address: {startingLocation.location}</p>
                    <p>Status: Ready to Start</p>
                    {initialTotalEstimatedTime && (
                      <p className="mt-2 text-lg font-semibold text-yellow-300">
                        Estimated Total Route Time: {initialTotalEstimatedTime}
                      </p>
                    )}
                  </div>
                ) : (
                  current && (
                    <div>
                      <p>Address: {current.location}</p>
                      <p>Status: {current.id === 0 ? "Route Completed" : "In Progress"}</p>
                      {estimatedTime && (
                        <p className="mt-2 text-lg font-semibold text-yellow-300">
                          Estimated Time to Next Stop: {estimatedTime}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
              {!routeStarted ? (
                <button 
                  onClick={handleStartRoute}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                >
                  Start Route
                </button>
              ) : current.id === 0 ? (
                <button 
                  onClick={handleEndRoute}
                
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                >
                  End Route
                </button>
              ) : (
                <button 
                  onClick={handleGarbagePickedUp}
                  className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                >
                  Garbage Picked Up
                </button>
              )}
              {upcoming.length > 0 && (
                <div className="bg-green-800 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-green-300 mb-2">
                    {!routeStarted ? "Garbage to Pick Up" : "Upcoming"}
                  </h2>
                  <ul className="space-y-2">
                    {upcoming.map(can => (
                      <li key={can.id}>
                        ID: {can.id} - {can.location}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {routeStarted && completed.length > 0 && (
                <div className="bg-green-800 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-green-300 mb-2">Completed</h2>
                  <ul className="space-y-2">
                    {completed.map(can => (
                      <li key={can.id}>
                        ID: {can.id} - {can.location}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="w-2/3 flex items-stretch">
              <div ref={mapRef} className="w-full h-full border-2 border-green-700 rounded-lg"></div>
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