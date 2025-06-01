"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

// Component to display sales history table
export function SalesHistoryTable() {
  const [sales, setSales] = useState<any[]>([]) // State to store sales data
  const [currentPage, setCurrentPage] = useState(1) // State to manage current page
  const itemsPerPage = 5 // Number of items to display per page
  const [loading, setLoading] = useState(true) // State to manage loading state
  const [error, setError] = useState<string | null>(null) // State to manage error messages

  // Effect to fetch sales data from Firestore
  useEffect(() => {
    setLoading(true)
    setError(null)
    getDocs(collection(db, "sorties"))
      .then((snap) => {
        setSales(
          snap.docs.map((doc: any) => {
            const s = { id: doc.id, ...doc.data() }
            return {
              id: s.id,
              date: s.date || "",
              reference: s.reference || s.ref || "",
              agent: {
                name: s.agent || "-",
                department: s.departement || s.department || "-",
              },
              product: s.piece || s.produit || "",
              quantity: s.quantite || s.quantity || 0,
              status: s.status || "Completed",
              destination: s.destination || s.lieu || "",
            }
          })
        )
      })
      .catch(() => setError("Erreur lors du chargement de l'historique des ventes."))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(sales.length / itemsPerPage) // Calculate total number of pages
  const currentItems = sales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) // Get items for the current page

  // Render loading state
  if (loading) return <div>Chargement...</div>
  // Render error message
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((sale: any) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.reference}</TableCell>
              <TableCell>{sale.date ? new Date(sale.date).toLocaleDateString() : ""}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32&text=${sale.agent.name.charAt(0)}`}
                      alt={sale.agent.name}
                    />
                    <AvatarFallback>
                      {sale.agent.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{sale.agent.name}</div>
                    <div className="text-xs text-muted-foreground">{sale.agent.department}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{sale.product}</TableCell>
              <TableCell>{sale.quantity}</TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate" title={sale.destination}>
                  {sale.destination}
                </div>
              </TableCell>
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
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, sales.length)}</span> sur{" "}
          <span className="font-medium">{sales.length}</span> ventes
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
