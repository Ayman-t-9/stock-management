'use client'
import { useEffect, useState } from "react"
import { db, collection, getDocs } from "../lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"

export function StockStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    outOfStock: 0,
    lowStock: 0,
    totalSales: 0,
    totalPurchases: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "sorties")),
      getDocs(collection(db, "entrees")),
    ])
      .then(([productsSnap, categoriesSnap, sortiesSnap, entreesSnap]) => {
        const productsArr = productsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        const categoriesArr = categoriesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        const sortiesArr = sortiesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        const entreesArr = entreesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        const outOfStock = productsArr.filter((p) => (p.stockActuel ?? 0) === 0).length
        const lowStock = productsArr.filter((p) => (p.stockActuel ?? 0) > 0 && (p.stockActuel ?? 0) <= (p.seuilAlerte ?? 0)).length
        setStats({
          totalProducts: productsArr.length,
          totalCategories: categoriesArr.length,
          outOfStock,
          lowStock,
          totalSales: sortiesArr.reduce((sum, s) => sum + (Number(s.quantite) || 0), 0),
          totalPurchases: entreesArr.reduce((sum, e) => sum + (Number(e.quantite) || 0), 0),
        })
      })
      .catch(() => setError("Erreur lors du chargement des statistiques."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">Dans {stats.totalCategories} catégories</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rupture de Stock</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.outOfStock}</div>
          <p className="text-xs text-muted-foreground">Produits à zéro stock</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.lowStock}</div>
          <p className="text-xs text-muted-foreground">Nécessitent une action</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSales}</div>
          <p className="text-xs text-muted-foreground">Sorties cumulées</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achats Totaux</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPurchases}</div>
          <p className="text-xs text-muted-foreground">Entrées cumulées</p>
        </CardContent>
      </Card>
    </div>
  )
}
