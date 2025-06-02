'use client'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { collection, db, getDocs } from "../lib/firebase"

interface EntryVoucherTableProps {
  category?: 'electrical' | 'mechanical';
}

export function EntryVoucherTable({ category }: EntryVoucherTableProps) {
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    async function fetchVouchers() {
      try {
        const snap = await getDocs(collection(db, "entrees"))
        const allVouchers = snap.docs.map((item) => {
            const data = item.data() as any
            return {
              id: String(item.id),
              reference: data.referenceCommande || "",
              date: data.date || "",
              fournisseur: data.fournisseur || "",
              fournisseurCategorie: data.fournisseurCategorie || "",
              produit: data.piece || "",
              category: data.category || "electrical",
              quantite: typeof data.quantite === "number" ? data.quantite : Number(data.quantite) || 0,
              statut: data.statut || "Complété",
            }
          })
          
        setVouchers(category ? allVouchers.filter(v => v.category === category) : allVouchers)
      } catch {
        setError("Erreur lors du chargement des bons d'entrée.")
      } finally {
        setLoading(false)
      }
    }
    fetchVouchers()
  }, [category]) // Add category as a dependency to re-fetch when it changes

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[600px] caption-bottom text-sm">
        <thead>
          <tr className="border-b">
            <th className="h-12 px-4 text-left align-middle font-medium">Référence</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Fournisseur</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Piece</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Quantité</th>
            <th className="h-12 px-4 text-left align-middle font-medium">N° marche</th>
            <th className="h-12 px-4 text-left align-middle font-medium sr-only">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle font-medium">{voucher.reference}</td>
              <td className="p-4 align-middle">{voucher.date ? new Date(voucher.date).toLocaleDateString() : ""}</td>
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {voucher.fournisseur
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{voucher.fournisseur}</div>
                    <div className="text-xs text-muted-foreground">{voucher.fournisseurCategorie || ""}</div>
                  </div>
                </div>
              </td>
              <td className="p-4 align-middle">{voucher.produit}</td>
              <td className="p-4 align-middle">{voucher.quantite}</td>
              <td className="p-4 align-middle">
                <Badge variant="outline" className={
                  voucher.statut === "Complété"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : voucher.statut === "Approuvé"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : voucher.statut === "En attente"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : ""
                }>
                  {voucher.statut}
                </Badge>
              </td>
              <td className="p-4 align-middle">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem>Imprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
