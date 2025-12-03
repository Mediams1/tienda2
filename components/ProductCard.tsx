"use client"

import { useState } from "react"
import type { Product } from "@/data/products"
import { useCart } from "@/context/CartContext"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setQuantity(1)
    }, 1500)
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 group">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <span className="text-xs text-primary font-medium">{product.category}</span>
        <h3 className="font-semibold text-foreground mt-1 line-clamp-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-muted transition-colors"
              disabled={added}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-muted transition-colors"
              disabled={added}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-300 ${
              added ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Agregado
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
