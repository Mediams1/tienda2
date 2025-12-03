"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import { Package, Calendar, ArrowLeft } from "lucide-react"

function History() {
  const { user, purchases } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsClient(typeof window !== 'undefined')
  }, [])

  const handleExportPDF = (purchase: (typeof purchases)[0]) => {
    if (!isClient || typeof window === 'undefined') return
    
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const date = new Date(purchase.date).toLocaleString("es-MX")

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
          .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
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
          <p>Orden #${purchase.id.slice(0, 8).toUpperCase()}</p>
          <p>${date}</p>
        </div>
        ${purchase.items
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
          <span>$${purchase.total.toFixed(2)}</span>
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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-muted rounded w-64 mx-auto mb-2"></div>
          <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Inicia sesión para ver tu historial</h1>
        <p className="text-muted-foreground mb-6">Necesitas una cuenta para ver tus compras</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  if (purchases.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Sin compras aún</h1>
        <p className="text-muted-foreground mb-6">Aún no has realizado ninguna compra</p>
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
      <h1 className="text-3xl font-bold text-foreground mb-8">Historial de Compras</h1>

      <div className="space-y-6">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-muted px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(purchase.date).toLocaleString("es-MX")}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Orden #{purchase.id.slice(0, 8).toUpperCase()}</span>
                <span className="font-bold text-foreground">${purchase.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {purchase.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {isClient && (
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <button
                    onClick={() => handleExportPDF(purchase)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Exportar Ticket PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Exportar con dynamic para deshabilitar SSR completamente
export default dynamic(() => Promise.resolve(History), {
  ssr: false
})
