"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { db, collection, getDocs } from "../lib/firebase"

export function StockMovementChart() {
  const [monthlyMovements, setMonthlyMovements] = useState<{ month: string; entries: number; exits: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      getDocs(collection(db, "entrees")),
      getDocs(collection(db, "sorties")),
    ])
      .then(([entreesSnap, sortiesSnap]) => {
        const entrees = entreesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
        const sorties = sortiesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
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
      })
      .catch(() => setError("Erreur lors du chargement des mouvements."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Card><CardHeader><CardTitle>Mouvement de stock</CardTitle></CardHeader><CardContent>Chargement...</CardContent></Card>
  if (error) return <Card><CardHeader><CardTitle>Mouvement de stock</CardTitle></CardHeader><CardContent className="text-red-500">{error}</CardContent></Card>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mouvement de stock</CardTitle>
        <CardDescription>Entrées vs sorties au cours des 8 derniers mois</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {/* Graphique à barres */}
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
  )
}
