"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { db, collection, getDocs } from "../lib/firebase"

export function MovementReports() {
  const [monthlyMovements, setMonthlyMovements] = useState<{ month: string; entries: number; exits: number }[]>([])
  const [topMovements, setTopMovements] = useState<any[]>([])
  const [stats, setStats] = useState({ totalEntries: 0, totalExits: 0, balance: 0, turnover: 0 as number })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      getDocs(collection(db, "entrees")),
      getDocs(collection(db, "sorties")),
      getDocs(collection(db, "products")),
    ])
      .then(([entreesSnap, sortiesSnap, productsSnap]) => {
        const entrees = entreesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        const sorties = sortiesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        const products = productsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        // Monthly aggregation
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
        const monthMap: Record<string, { entries: number; exits: number }> = {}
        months.forEach((m) => (monthMap[m] = { entries: 0, exits: 0 }))
        entrees.forEach((e) => {
          const d = new Date(e.date)
          const m = months[d.getMonth()]
          if (m) monthMap[m].entries += Number(e.quantite) || 0
        })
        sorties.forEach((s) => {
          const d = new Date(s.date)
          const m = months[d.getMonth()]
          if (m) monthMap[m].exits += Number(s.quantite) || 0
        })
        setMonthlyMovements(months.map((m) => ({ month: m, entries: monthMap[m].entries, exits: monthMap[m].exits })))
        // Top movements by product
        const productMap: Record<string, { product: string; reference: string; entries: number; exits: number }> = {}
        products.forEach((p) => {
          productMap[p.id] = {
            product: p.piece || p.nom || "",
            reference: p.reference || "",
            entries: 0,
            exits: 0,
          }
        })
        entrees.forEach((e) => {
          const ref = e.productId || e.pieceId || e.reference || Object.keys(productMap).find(
            (k) => productMap[k].product === e.piece || productMap[k].reference === e.reference
          )
          if (ref && productMap[ref]) productMap[ref].entries += Number(e.quantite) || 0
        })
        sorties.forEach((s) => {
          const ref = s.productId || s.pieceId || s.reference || Object.keys(productMap).find(
            (k) => productMap[k].product === s.piece || productMap[k].reference === s.reference
          )
          if (ref && productMap[ref]) productMap[ref].exits += Number(s.quantite) || 0
        })
        const top = Object.values(productMap)
          .map((p) => ({ ...p, balance: p.entries - p.exits }))
          .sort((a, b) => Math.abs(b.entries + b.exits) - Math.abs(a.entries + a.exits))
          .slice(0, 5)
        setTopMovements(top)
        // Stats
        const totalEntries = entrees.reduce((sum, e) => sum + (Number(e.quantite) || 0), 0)
        const totalExits = sorties.reduce((sum, s) => sum + (Number(s.quantite) || 0), 0)
        const balance = totalEntries - totalExits
        const turnover = totalExits !== 0 ? Number((totalEntries / totalExits).toFixed(2)) : 0
        setStats({ totalEntries, totalExits, balance, turnover })
      })
      .catch(() => setError("Erreur lors du chargement des mouvements."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Card className="md:col-span-2"><CardHeader><CardTitle>Mouvements mensuels</CardTitle></CardHeader><CardContent>Chargement...</CardContent></Card>
  if (error) return <Card className="md:col-span-2"><CardHeader><CardTitle>Mouvements mensuels</CardTitle></CardHeader><CardContent className="text-red-500">{error}</CardContent></Card>

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Mouvements mensuels</CardTitle>
          <CardDescription>Entrées et sorties de stock par mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {/* Graphique à lignes */}
            <div className="h-full flex items-end gap-2 pt-10 pb-4 px-4">
              {monthlyMovements.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-4 bg-blue-500 rounded-t-sm" style={{ height: `${item.entries * 1.5}px` }}></div>
                    <div className="w-4 bg-red-500 rounded-t-sm" style={{ height: `${item.exits * 1.5}px` }}></div>
                  </div>
                  <div className="text-sm font-medium">{item.month}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                <span className="text-sm">Entrées</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span className="text-sm">Sorties</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques de mouvements</CardTitle>
          <CardDescription>Aperçu des mouvements de stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Total Entrées" value={stats.totalEntries.toString()} color="blue" />
            <StatCard title="Total Sorties" value={stats.totalExits.toString()} color="red" />
            <StatCard title="Balance" value={(stats.balance > 0 ? "+" : "") + stats.balance} color={stats.balance > 0 ? "green" : "red"} />
            <StatCard title="Taux de rotation" value={stats.turnover.toString()} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top produits en mouvement</CardTitle>
          <CardDescription>Produits avec le plus de mouvements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Entrées</TableHead>
                <TableHead>Sorties</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topMovements.map((item) => (
                <TableRow key={item.reference}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.product}</div>
                      <div className="text-xs text-muted-foreground">{item.reference}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.entries}</TableCell>
                  <TableCell>{item.exits}</TableCell>
                  <TableCell>
                    <Badge variant={item.balance > 0 ? "default" : "destructive"} className="w-fit">
                      {item.balance > 0 ? `+${item.balance}` : item.balance}
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

function StatCard({ title, value, color = "default" }: { title: string; value: string; color?: string }) {
  const getColorClass = () => {
    switch (color) {
      case "blue":
        return "text-blue-600 dark:text-blue-400"
      case "red":
        return "text-red-600 dark:text-red-400"
      case "green":
        return "text-green-600 dark:text-green-400"
      default:
        return ""
    }
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className={`text-2xl font-bold mt-1 ${getColorClass()}`}>{value}</div>
    </div>
  )
}
