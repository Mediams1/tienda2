"use client"

import Link from "next/link"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import "../styles/globals.css"

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const { user, addPurchase } = useAuth()
  const [showLoginWarning, setShowLoginWarning] = useState(false)
  const [purchaseComplete, setPurchaseComplete] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [ticketData, setTicketData] = useState<{
    items: typeof items
    total: number
    date: string
    id: string
  } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheckout = () => {
    if (!user) {
      setShowLoginWarning(true)
      return
    }

    const purchaseData = {
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total,
    }

    addPurchase(purchaseData)

    setTicketData({
      items: [...items],
      total,
      date: new Date().toLocaleString("es-MX"),
      id: crypto.randomUUID().slice(0, 8).toUpperCase(),
    })

    clearCart()
    setPurchaseComplete(true)
  }

  const handleExportPDF = () => {
    if (!ticketData || typeof window === 'undefined') return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket de Compra - SoftBenny</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 5px 0; color: #666; }
          .item { display: flex; justify-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .item-name { font-weight: 500; }
          .item-details { color: #666; font-size: 14px; }
          .total { display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 10px; border-top: 2px dashed #000; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SoftBenny</h1>
          <p>Ticket de Compra</p>
          <p>Orden #${ticketData.id}</p>
          <p>${ticketData.date}</p>
        </div>
        ${ticketData.items
          .map(
            (item) => `
          <div class="item">
            <div>
              <div class="item-name">${item.name}</div>
              <div class="item-details">Cant: ${item.quantity} x $${item.price.toFixed(2)}</div>
            </div>
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `,
          )
          .join("")}
        <div class="total">
          <span>TOTAL</span>
          <span>$${ticketData.total.toFixed(2)}</span>
        </div>
        <div class="footer">
          <p>¡Gracias por tu compra!</p>
          <p>Visítanos en softbenny.com</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-8"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-4 h-32"></div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-lg p-6 h-64"></div>
          </div>
        </div>
      </div>
    )
  }

  if (purchaseComplete && ticketData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">¡Compra Realizada!</h1>
          <p className="text-muted-foreground mb-6">Tu orden #{ticketData.id} ha sido procesada</p>

          <div className="bg-muted rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-3">Resumen de compra</h3>
            {ticketData.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-foreground">
                  {item.name} x{item.quantity}
                </span>
                <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 font-bold text-foreground">
              <span>Total</span>
              <span>${ticketData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportPDF}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Exportar a PDF
            </button>
            <Link
              href="/"
              className="flex-1 bg-muted text-foreground py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors text-center"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-6">Agrega algunos productos para comenzar</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Tu Carrito</h1>

      {showLoginWarning && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
          <div>
            <p className="text-destructive font-medium">Debes iniciar sesión para realizar la compra</p>
            <Link href="/login" className="text-primary hover:underline text-sm">
              Iniciar sesión
            </Link>
            {" o "}
            <Link href="/register" className="text-primary hover:underline text-sm">
              Crear cuenta
            </Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-4">Resumen</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span className="text-green-500">Gratis</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Finalizar Compra
            </button>
            <Link
              href="/"
              className="block text-center mt-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
