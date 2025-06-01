"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Eye, FileText, MoreHorizontal, Printer } from "lucide-react"
import { db, collection, getDocs } from "../lib/firebase"

// Référence de la collection Firestore
const COLLECTION_NAME = "entrees"

export function PurchaseHistoryTable() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getDocs(collection(db, COLLECTION_NAME))
      .then((snap) => {
        setPurchases(
          snap.docs.map((item) => {
            const e = item.data() as any
            return {
              id: item.id,
              date: e.date || "",
              reference: e.reference || e.ref || "",
              supplier: e.fournisseur || e.supplier || "",
              product: e.piece || e.produit || "",
              quantity: e.quantite || e.quantity || 0,
              status: e.status || "Completed",
              orderReference: e.orderReference || e.commande || "",
            }
          })
        )
      })
      .catch(() => setError("Erreur lors du chargement de l'historique des achats."))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(purchases.length / itemsPerPage)
  const currentItems = purchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Fournisseur</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Réf. Commande</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((purchase: any) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">{purchase.reference}</TableCell>
              <TableCell>{purchase.date ? new Date(purchase.date).toLocaleDateString() : ""}</TableCell>
              <TableCell>
                <Badge variant="outline">{purchase.supplier}</Badge>
              </TableCell>
              <TableCell>{purchase.product}</TableCell>
              <TableCell>{purchase.quantity}</TableCell>
              <TableCell>{purchase.orderReference}</TableCell>
              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, purchases.length)}</span> sur{" "}
          <span className="font-medium">{purchases.length}</span> achats
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Page précédente</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Page suivante</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
