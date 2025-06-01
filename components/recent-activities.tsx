"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { db, collection, getDocs } from "../lib/firebase"

export function RecentActivities() {
  const [activities, setActivities] = useState<any[]>([])
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
        // Normalize entries
        const entreeActs = entrees.map((e) => ({
          id: e.id,
          type: "entry",
          date: e.date || "",
          user: e.agent || e.utilisateur || "",
          product: e.piece || e.produit || "",
          quantity: e.quantite || e.quantity || 0,
          reference: e.reference || e.ref || "",
        }))
        // Normalize exits
        const sortieActs = sorties.map((s) => ({
          id: s.id,
          type: "exit",
          date: s.date || "",
          user: s.agent || s.utilisateur || "",
          product: s.piece || s.produit || "",
          quantity: s.quantite || s.quantity || 0,
          reference: s.reference || s.ref || "",
        }))
        // Combine and sort by date desc
        const allActs = [...entreeActs, ...sortieActs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setActivities(allActs.slice(0, 10)) // Show only latest 10
      })
      .catch(() => setError("Erreur lors du chargement des activités récentes."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Card><CardHeader><CardTitle>Activités récentes</CardTitle></CardHeader><CardContent>Chargement...</CardContent></Card>
  )
  if (error) return (
    <Card><CardHeader><CardTitle>Activités récentes</CardTitle></CardHeader><CardContent className="text-red-500">{error}</CardContent></Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>Les dernières opérations d'entrée et de sortie</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length === 0 && <div className="text-muted-foreground">Aucune activité récente.</div>}
          {activities.map((activity) => (
            <div key={activity.id + activity.type} className="flex items-start gap-4">
              <div className="mt-1">
                {activity.type === "entry" ? (
                  <ArrowDownCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <ArrowUpCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {activity.product} {" "}
                    <Badge variant={activity.type === "entry" ? "default" : "secondary"} className="ml-2">
                      {activity.type === "entry" ? "Entrée" : "Sortie"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src={`/placeholder.svg?height=24&width=24&text=${activity.user?.charAt(0) || "U"}`}
                        alt={activity.user}
                      />
                      <AvatarFallback>
                        {(activity.user || "U")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{activity.user}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{activity.quantity} unités</span> • {activity.reference}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
