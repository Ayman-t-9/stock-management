'use client'
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaBoxes, FaUsers, FaTruck, FaDollarSign } from "react-icons/fa"

export function DashboardStats() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    totalStockValue: 0,
  })

  useEffect(() => {
    setLoading(true)
    setError(null)
    async function fetchStats() {
      try {
        const [productsSnap, categoriesSnap, fournisseursSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "fournisseurs")),
        ])
        const products = productsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { stockActuel?: number; prixUnitaire?: number }) }))
        const categories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const fournisseurs = fournisseursSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const totalStockValue = products.reduce(
          (sum, p) => sum + (typeof p.stockActuel === "number" && typeof p.prixUnitaire === "number" ? p.stockActuel * p.prixUnitaire : 0),
          0
        )
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalSuppliers: fournisseurs.length,
          totalStockValue,
        })
      } catch {
        setError("Erreur lors du chargement des statistiques.")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produits en stock</CardTitle>
          <FaBoxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Catégories</CardTitle>
          <FaUsers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCategories}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fournisseurs</CardTitle>
          <FaTruck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valeur totale du stock</CardTitle>
          <FaDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStockValue.toLocaleString("fr-FR", { style: "currency", currency: "MAD" })}</div>
        </CardContent>
      </Card>
    </div>
  )
}
