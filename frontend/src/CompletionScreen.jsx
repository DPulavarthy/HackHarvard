import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function CompletionScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { name, completedRoute, totalEstimatedTime } = location.state || {}
  const mapRef = useRef(null)
  const [mapInstance, setMapInstance] = useState(null)

  useEffect(() => {
    const googleMapScript = document.createElement('script')
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA9wdextBbNhCbxfZ5qpObUUe9qX7Kcl2o&libraries=places`
    googleMapScript.async = true
    window.document.body.appendChild(googleMapScript)

    googleMapScript.addEventListener('load', () => {
      const cambridge = { lat: 42.3736, lng: -71.1097 }
      const map = new window.google.maps.Map(mapRef.current, {
        center: cambridge,
        zoom: 13,
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

      if (completedRoute && completedRoute.length > 0) {
        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#2196F3',
            strokeOpacity: 1.0,
            strokeWeight: 3
          }
        })

        const waypoints = completedRoute.slice(1, -1).map(point => ({
          location: new window.google.maps.LatLng(point.latitude, point.longitude),
          stopover: true
        }))

        const origin = new window.google.maps.LatLng(completedRoute[0].latitude, completedRoute[0].longitude)
        const destination = new window.google.maps.LatLng(
          completedRoute[completedRoute.length - 1].latitude,
          completedRoute[completedRoute.length - 1].longitude
        )

        directionsService.route(
          {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            optimizeWaypoints: false,
            travelMode: window.google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result)

              // Add markers for each stop (excluding the starting and ending points)
              completedRoute.slice(1, -1).forEach((point, index) => {
                new window.google.maps.Marker({
                  position: { lat: point.latitude, lng: point.longitude },
                  map: map,
                  icon: {
                    url: '/trashCanPin.png',
                    scaledSize: new window.google.maps.Size(24, 24),
                    anchor: new window.google.maps.Point(12, 24),
                  },
                  title: `Stop ${index + 2}`,
                })
              })

              // Add starting point marker
              new window.google.maps.Marker({
                position: { lat: completedRoute[0].latitude, lng: completedRoute[0].longitude },
                map: map,
                icon: {
                  url: '/startingPin.png',
                  scaledSize: new window.google.maps.Size(36, 36),
                  anchor: new window.google.maps.Point(18, 36),
                },
                title: "Starting Point",
              })

              // Add ending point marker
              new window.google.maps.Marker({
                position: { lat: completedRoute[completedRoute.length - 1].latitude, lng: completedRoute[completedRoute.length - 1].longitude },
                map: map,
                icon: {
                  url: '/endingPin.png',
                  scaledSize: new window.google.maps.Size(36, 36),
                  anchor: new window.google.maps.Point(18, 36),
                },
                title: "Ending Point",
              })

              // Fit the map to the route
              const bounds = new window.google.maps.LatLngBounds()
              result.routes[0].overview_path.forEach((point) => bounds.extend(point))
              map.fitBounds(bounds)
            }
          }
        )
      }
    })

    return () => {
      window.document.body.removeChild(googleMapScript)
    }
  }, [completedRoute])

  const handleSignOut = () => {
    navigate('/')
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
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="bg-green-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-green-300 mb-6">Congratulations, {name}!</h2>
            <p className="text-xl mb-4">Thank you for your hard work in keeping our city clean.</p>
            <p className="text-lg mb-4">Your dedication to maintaining a clean environment is truly appreciated.</p>
            {totalEstimatedTime && (
              <p className="text-2xl font-semibold text-yellow-300 mb-4">
                Total Estimated Route Time: {totalEstimatedTime}
              </p>
            )}
            <p className="text-lg mb-8">Thanks for your work today. You can go ahead and sign out now!</p>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div ref={mapRef} className="w-full h-[400px] md:h-[600px] border-2 border-green-700 rounded-lg"></div>
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