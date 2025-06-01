"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Eye, FileText, MoreHorizontal, Printer, X } from "lucide-react"
import { useEffect, useState } from "react"
import { collection, getDocs } from "../lib/firebase"
import { db } from "../lib/firebase"

export function ExitVoucherTable() {
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    async function fetchVouchers() {
      try {
        const snap = await getDocs(collection(db, "sorties"))
        setVouchers(
          snap.docs.map((item) => {
            const data = item.data() as any
            return {
              id: String(item.id),
              date: data.date || "",
              reference: data.reference || data.referenceCommande || "",
              agent: {
                name: data.agent || "",
                department: data.agentDepartment || data.departement || "",
              },
              product: data.piece || data.product || "",
              quantity: typeof data.quantite === "number" ? data.quantite : Number(data.quantite) || 0,
              status: data.status || data.statut || "Pending",
              reason: data.observations || data.reason || "",
            }
          })
        )
      } catch {
        setError("Erreur lors du chargement des bons de sortie.")
      } finally {
        setLoading(false)
      }
    }
    fetchVouchers()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
      case "En attente":
        return <Badge variant="outline">En attente</Badge>
      case "Approved":
      case "Approuvé":
        return <Badge variant="secondary">Approuvé</Badge>
      case "Completed":
      case "Complété":
        return <Badge variant="default">Complété</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Référence</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Produit</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vouchers.map((voucher) => (
          <TableRow key={voucher.id}>
            <TableCell className="font-medium">{voucher.reference}</TableCell>
            <TableCell>{voucher.date ? new Date(voucher.date).toLocaleDateString() : ""}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`/placeholder.svg?height=32&width=32&text=${voucher.agent.name.charAt(0)}`}
                    alt={voucher.agent.name}
                  />
                  <AvatarFallback>
                    {voucher.agent.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{voucher.agent.name}</div>
                  <div className="text-xs text-muted-foreground">{voucher.agent.department}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{voucher.product}</TableCell>
            <TableCell>{voucher.quantity}</TableCell>
            <TableCell>{getStatusBadge(voucher.status)}</TableCell>
            <TableCell className="text-right">
              {voucher.status === "Pending" || voucher.status === "En attente" ? (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="sr-only">Approuver</span>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Rejeter</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Générer PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
