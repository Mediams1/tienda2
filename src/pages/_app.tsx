"use client"

import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"
import { CartProvider } from "../context/CartContext"
import { Navbar } from "../components/Navbar"
import Home from "./Home"
import Login from "./Login"
import Register from "./Register"
import Cart from "./Cart"
import History from "./History"
import "../../styles/globals.css"

function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // No renderizar nada hasta que esté montado en el cliente
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
