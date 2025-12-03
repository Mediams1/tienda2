import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
}

export interface Purchase {
  id: string
  userId: string
  items: {
    productId: number
    name: string
    price: number
    quantity: number
    image: string
  }[]
  total: number
  date: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  purchases: Purchase[]
  addPurchase: (purchase: Omit<Purchase, "id" | "userId" | "date">) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      loadUserPurchases(parsedUser.id)
    }
    setIsLoading(false)
  }, [])

  const loadUserPurchases = (userId: string) => {
    const allPurchases = JSON.parse(localStorage.getItem("purchases") || "[]")
    const userPurchases = allPurchases.filter((p: Purchase) => p.userId === userId)
    setPurchases(userPurchases)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = users.find(
      (u: { email: string; password: string }) => u.email === email && u.password === password,
    )

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      loadUserPurchases(foundUser.id)
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const existingUser = users.find((u: { email: string }) => u.email === email)

    if (existingUser) {
      return false
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
    setPurchases([])
    return true
  }

  const logout = () => {
    setUser(null)
    setPurchases([])
    localStorage.removeItem("currentUser")
  }

  const addPurchase = (purchase: Omit<Purchase, "id" | "userId" | "date">) => {
    if (!user) return

    const newPurchase: Purchase = {
      ...purchase,
      id: crypto.randomUUID(),
      userId: user.id,
      date: new Date().toISOString(),
    }

    const allPurchases = JSON.parse(localStorage.getItem("purchases") || "[]")
    allPurchases.push(newPurchase)
    localStorage.setItem("purchases", JSON.stringify(allPurchases))
    setPurchases((prev) => [...prev, newPurchase])
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, purchases, addPurchase }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}