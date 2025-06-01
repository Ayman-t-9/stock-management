"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { db, collection, getDocs } from "../lib/firebase"

export function InventoryReports() {
  const [inventoryByCategory, setInventoryByCategory] = useState<any[]>([])
  const [lowStockItems, setLowStockItems] = useState<any[]>([])
  const [stats, setStats] = useState({ totalProducts: 0, totalCategories: 0, totalValue: 0, alertCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "categories")),
    ])
      .then(([productsSnap, categoriesSnap]) => {
        const productsArr = productsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        const categoriesArr = categoriesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        // Inventory by category
        const catMap: Record<string, { category: string; count: number }> = {}
        productsArr.forEach((p) => {
          const cat = p.categorie || "Autre"
          if (!catMap[cat]) catMap[cat] = { category: cat, count: 0 }
          catMap[cat].count += 1
        })
        const totalProducts = productsArr.length
        const totalCategories = categoriesArr.length
        // Compute percentages
        const invByCat = Object.values(catMap).map((c) => ({
          ...c,
          percentage: totalProducts ? Math.round((c.count / totalProducts) * 100) : 0,
        }))
        setInventoryByCategory(invByCat)
        // Low stock items
        const lowStock = productsArr.filter(
          (p) => typeof p.stockActuel === "number" && typeof p.seuilAlerte === "number" && p.stockActuel < p.seuilAlerte
        ).map((p) => ({
          name: p.piece || p.nom || "",
          reference: p.reference || "",
          currentStock: p.stockActuel,
          minStock: p.seuilAlerte,
          category: p.categorie || "",
        }))
        setLowStockItems(lowStock)
        // Stats
        const totalValue = productsArr.reduce(
          (sum, p) => sum + (typeof p.stockActuel === "number" && typeof p.prixUnitaire === "number" ? p.stockActuel * p.prixUnitaire : 0),
          0
        )
        setStats({
          totalProducts,
          totalCategories,
          totalValue,
          alertCount: lowStock.length,
        })
      })
      .catch(() => setError("Erreur lors du chargement des données d'inventaire."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Répartition de l'inventaire par catégorie</CardTitle>
          <CardDescription>Distribution des produits par catégorie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {/* Graphique à barres */}
            <div className="h-full flex items-end gap-4 pt-10 pb-4 px-4">
              {inventoryByCategory.map((item: any) => (
                <div key={item.category} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/90 rounded-t-md"
                    style={{ height: `${item.percentage * 2}%` }}
                  ></div>
                  <div className="text-sm font-medium">{item.category}</div>
                  <div className="text-xs text-muted-foreground">{item.count} produits</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Statistiques d'inventaire</CardTitle>
          <CardDescription>Aperçu global de l'inventaire</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Total Produits" value={stats.totalProducts.toString()} />
            <StatCard title="Catégories" value={stats.totalCategories.toString()} />
            <StatCard title="Valeur Totale" value={stats.totalValue.toLocaleString("fr-FR", { style: "currency", currency: "MAD" })} />
            <StatCard title="Produits en Alerte" value={stats.alertCount.toString()} alert />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Produits en alerte de stock</CardTitle>
          <CardDescription>Produits dont le stock est inférieur au seuil minimal</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Seuil</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.map((item: any) => (
                <TableRow key={item.reference}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.reference}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.currentStock}</TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <AlertTriangle className="h-3 w-3" />
                      Stock bas
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, alert = false }: { title: string; value: string; alert?: boolean }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className={`text-2xl font-bold mt-1 ${alert ? "text-red-500" : ""}`}>{value}</div>
    </div>
  )
}
