"use client"

import type React from "react"

import { useState } from "react"
import { Search, Calendar, Users } from "lucide-react"

export default function SearchBar() {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ destination, checkIn, checkOut, guests })
    // Implement actual search functionality here
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-md shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Where do you want?"
            className="w-full py-3 pl-10 pr-3 outline-none"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Calendar size={18} />
          </div>
          <input
            type="date"
            placeholder="Check in"
            className="w-full py-3 pl-10 pr-3 outline-none"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Calendar size={18} />
          </div>
          <input
            type="date"
            placeholder="Check out"
            className="w-full py-3 pl-10 pr-3 outline-none"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Users size={18} />
          </div>
          <select
            className="w-full py-3 pl-10 pr-3 outline-none appearance-none bg-transparent"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          >
            <option value="">Guests</option>
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 font-medium transition-colors"
        >
          Find venues
        </button>
      </div>
    </form>
  )
}

