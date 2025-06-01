"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"

export function AgentReports() {
  const [agentActivity, setAgentActivity] = useState<any[]>([])
  const [productsByAgent, setProductsByAgent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    async function fetchData() {
      try {
        const agentsSnap = await getDocs(collection(db, "agents"))
        const sortiesSnap = await getDocs(collection(db, "sorties"))
        const agents = agentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const sorties = sortiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        // Agent activity: count sorties per agent
        const agentMap: Record<string, { name: string; department: string; count: number }> = {}
        const productsMap: Record<string, { agent: string; products: { name: string; quantity: number }[] }> = {}
        agents.forEach((agent: any) => {
          const name = agent.nom || agent.name || "";
          const department = agent.departement || agent.department || "";
          if (!name) return; // skip if no name
          agentMap[name] = {
            name,
            department,
            count: 0,
          }
          productsMap[name] = { agent: name, products: [] }
        })
        sorties.forEach((sortie: any) => {
          const agentName = sortie.agent || sortie.nom || sortie.name || "";
          if (!agentName || !agentMap[agentName]) return;
          agentMap[agentName].count += 1
          // Group products by agent
          const piece = sortie.piece || sortie.product || sortie.nomProduit || "";
          const quantite = typeof sortie.quantite === "number" ? sortie.quantite : Number(sortie.quantite) || 0;
          if (!piece) return;
          const existing = productsMap[agentName].products.find((p: any) => p.name === piece)
          if (existing) {
            existing.quantity += quantite
          } else {
            productsMap[agentName].products.push({ name: piece, quantity: quantite })
          }
        })
        setAgentActivity(Object.values(agentMap))
        setProductsByAgent(Object.values(productsMap))
      } catch {
        setError("Erreur lors du chargement des données Firestore.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Activité des agents</CardTitle>
          <CardDescription>Nombre de sorties par agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentActivity.map((item: any, index: number) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32&text=${item.name.charAt(0)}`}
                      alt={item.name}
                    />
                    <AvatarFallback>
                      {item.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-medium">{item.count} sorties</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.department}</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(item.count / Math.max(...agentActivity.map((i) => i.count))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Répartition des sorties</CardTitle>
          <CardDescription>Distribution des sorties par département</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-center justify-center">
            {/* Graphique circulaire */}
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="188.4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="125.6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="75.36"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="251.2"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">76</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
            <div className="ml-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#f43f5e] rounded-sm"></div>
                <span className="text-sm">Maintenance (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3b82f6] rounded-sm"></div>
                <span className="text-sm">Installation (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#10b981] rounded-sm"></div>
                <span className="text-sm">Sécurité (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#f59e0b] rounded-sm"></div>
                <span className="text-sm">Plomberie (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#8b5cf6] rounded-sm"></div>
                <span className="text-sm">Électricité (10%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Produits par agent</CardTitle>
          <CardDescription>Détail des produits sortis par agent</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Pourcentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsByAgent.flatMap((agent: any) =>
                agent.products.map((product: any, productIndex: number) => (
                  <TableRow key={`${agent.agent}-${product.name}`}>
                    {productIndex === 0 ? (
                      <TableCell rowSpan={agent.products.length} className="align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32&text=${agent.agent.charAt(0)}`}
                              alt={agent.agent}
                            />
                            <AvatarFallback>
                              {agent.agent
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{agent.agent}</div>
                        </div>
                      </TableCell>
                    ) : null}
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(product.quantity / 15) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{Math.round((product.quantity / 15) * 100)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
