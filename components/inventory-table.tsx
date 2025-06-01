"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { ChevronLeft, ChevronRight, Edit, Eye, MoreHorizontal, Trash2, AlertTriangle, QrCode, Download } from "lucide-react"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrGenerator } from "./qr-generator"
import { useToast } from "@/components/ui/use-toast"

interface InventoryTableProps {
  showLowStock?: boolean
}

export function InventoryTable({ showLowStock = false }: InventoryTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>({})
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [exporting, setExporting] = useState(false)
  const itemsPerPage = 5

  useEffect(() => {
    setLoading(true)
    setError(null)
    async function fetchItems() {
      try {
        const colRef = collection(db, "inventory")
        const snapshot = await getDocs(colRef)
        console.log("Fetched products:", snapshot.docs.length)
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setItems(products)
      } catch (err) {
        setError("Erreur lors du chargement des produits.")
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  // Filtrer les éléments si nécessaire
  const filteredItems = showLowStock
    ? items.filter((item) => typeof item.stockActuel === "number" && typeof item.seuilAlerte === "number" && item.stockActuel <= item.seuilAlerte)
    : items

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  const handleAdd = () => {
    setCurrentItem({})
    setIsEditing(false)
    setDialogOpen(true)
  }

  const handleEdit = (item: any) => {
    setCurrentItem(item)
    setIsEditing(true)
    setDialogOpen(true)
  }

  const handleDelete = async (item: any) => {
    if (window.confirm(`Supprimer ${item.piece || item.reference || item.nom}?`)) {
      await deleteDoc(doc(db, "inventory", String(item.id)))
      setItems(items.filter((i) => i.id !== item.id))
    }
  }

  const handleDialogInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericFields = ["stockInitial", "stockActuel", "seuilAlerte"]
    setCurrentItem({
      ...currentItem,
      [name]: numericFields.includes(name) ? Number(value) : value,
    })
  }

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && currentItem.id) {
      await updateDoc(doc(db, "inventory", String(currentItem.id)), {
        piece: currentItem.piece,
        categorie: currentItem.categorie,
        reference: currentItem.reference,
        stockInitial: currentItem.stockInitial,
        stockActuel: currentItem.stockActuel,
        seuilAlerte: currentItem.seuilAlerte,
        emplacement: currentItem.emplacement,
      })
      setItems(items.map((i) => (i.id === currentItem.id ? { ...i, ...currentItem } : i)))
    } else {
      const docRef = await addDoc(collection(db, "inventory"), {
        piece: currentItem.piece,
        categorie: currentItem.categorie,
        reference: currentItem.reference,
        stockInitial: currentItem.stockInitial,
        stockActuel: currentItem.stockActuel,
        seuilAlerte: currentItem.seuilAlerte,
        emplacement: currentItem.emplacement,
      })
      setItems([
        ...items,
        {
          id: docRef.id,
          ...currentItem,
        },
      ])
    }
    setDialogOpen(false)
  }

  const handleQrCodeClick = (item: any) => {
    setSelectedProduct(item)
    setQrDialogOpen(true)
  }

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      
      // Convert data to CSV format
      const headers = [
        'Référence',
        'Nom du Produit',
        'Catégorie',
        'Stock Initial',
        'Stock Actuel',
        'Seuil Minimal',
        'Emplacement',
        'Statut'
      ];

      const rows = items.map(item => [
        item.reference || '',
        item.piece || '',
        item.categorie || '',
        item.stockInitial || 0,
        item.stockActuel || 0,
        item.seuilAlerte || 0,
        item.emplacement || '',
        (item.stockActuel <= item.seuilAlerte) ? 'Stock bas' : 'Normal'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell}"`
            : cell
        ).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `inventaire_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "L'inventaire a été exporté avec succès",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'exportation",
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button onClick={handleAdd}>Ajouter un produit</Button>
        <Button 
          variant="outline" 
          onClick={handleExportToExcel} 
          disabled={exporting || loading || items.length === 0}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {exporting ? 'Exportation...' : 'Exporter'}
        </Button>
      </div>

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer un QR Code</DialogTitle>
          </DialogHeader>
          {selectedProduct && <QrGenerator product={selectedProduct} onClose={() => setQrDialogOpen(false)} />}
        </DialogContent>
      </Dialog>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Stock Initial</TableHead>
              <TableHead>Stock Actuel</TableHead>
              <TableHead>Seuil Minimal</TableHead>
              <TableHead>Emplacement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.reference}</TableCell>
                <TableCell>{item.piece || item.name}</TableCell>
                <TableCell>{item.categorie || item.category}</TableCell>
                <TableCell>{item.stockInitial || item.initialStock}</TableCell>
                <TableCell className="font-medium">{item.stockActuel || item.currentStock}</TableCell>
                <TableCell>{item.seuilAlerte || item.minStock}</TableCell>
                <TableCell>{item.emplacement || item.location}</TableCell>
                <TableCell>
                  {typeof item.stockActuel === "number" && typeof item.seuilAlerte === "number" && item.stockActuel <= item.seuilAlerte ? (
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <AlertTriangle className="h-3 w-3" />
                      Stock bas
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="w-fit">
                      Normal
                    </Badge>
                  )}
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
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/inventory/${item.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/inventory/${item.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQrCodeClick(item)}>
                        <QrCode className="mr-2 h-4 w-4" />
                        Générer QR Code
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
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
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> sur{" "}
            <span className="font-medium">{filteredItems.length}</span> produits
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Modifier un produit" : "Ajouter un produit"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDialogSubmit} className="space-y-4">
            <div>
              <Label htmlFor="piece">Produit</Label>
              <Input name="piece" value={currentItem.piece || ""} onChange={handleDialogInput} required />
            </div>
            <div>
              <Label htmlFor="categorie">Catégorie</Label>
              <Input name="categorie" value={currentItem.categorie || ""} onChange={handleDialogInput} required />
            </div>
            <div>
              <Label htmlFor="reference">Référence</Label>
              <Input name="reference" value={currentItem.reference || ""} onChange={handleDialogInput} required />
            </div>
            <div>
              <Label htmlFor="stockInitial">Stock Initial</Label>
              <Input name="stockInitial" type="number" value={currentItem.stockInitial || 0} onChange={handleDialogInput} required />
            </div>
            <div>
              <Label htmlFor="stockActuel">Stock Actuel</Label>
              <Input name="stockActuel" type="number" value={currentItem.stockActuel || 0} onChange={handleDialogInput} required />
            </div>
            <div>
              <Label htmlFor="seuilAlerte">Seuil Minimal</Label>
              <Input name="seuilAlerte" type="number" value={currentItem.seuilAlerte || 0} onChange={handleDialogInput} required />
            </div>
            <div>
              <Label htmlFor="emplacement">Emplacement</Label>
              <Input name="emplacement" value={currentItem.emplacement || ""} onChange={handleDialogInput} required />
            </div>
            <DialogFooter>
              <Button type="submit">{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
