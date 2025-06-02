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
  category: 'electrical' | 'mechanical'
}

interface InventoryItem {
  id: string
  code: string
  piece: string
  marque: string
  reference: string
  quantite: number
  observation?: string
  emplacement: string
  // Additional fields for mechanical items
  pompe?: string
  referencePompe?: string
  marquePompe?: string
  // Additional fields for electrical items
  caracteristique?: string
}

export function InventoryTable({ showLowStock = false, category }: InventoryTableProps) {
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
  const filteredItems = items.filter((item) => {
    // First filter by category if specified
    if (category) {
      if (item.categorie?.toLowerCase() !== category.toLowerCase()) {
        return false
      }
    }
    // Then filter by stock level if needed
    if (showLowStock) {
      return typeof item.stockActuel === "number" && 
             typeof item.seuilAlerte === "number" && 
             item.stockActuel <= item.seuilAlerte
    }
    return true
  })

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
    if (window.confirm(`Voulez-vous vraiment supprimer cette pièce: ${item.reference}?`)) {
      try {
        await deleteDoc(doc(db, "inventory", String(item.id)));
        setItems(items.filter((i) => i.id !== item.id));
        toast({
          title: "Succès",
          description: "Le produit a été supprimé avec succès",
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur s'est produite lors de la suppression",
        });
      }
    }
  }

  const handleDialogInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericFields = ["quantite"]
    setCurrentItem({
      ...currentItem,
      [name]: numericFields.includes(name) ? Number(value) : value,
    })
  }

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && currentItem.id) {
      const baseData = {
        code: currentItem.code,
        piece: currentItem.piece,
        marque: currentItem.marque,
        reference: currentItem.reference,
        quantite: Number(currentItem.quantite) || 0,
        emplacement: currentItem.emplacement,
        observation: currentItem.observation,
      };
      
      const updateData = currentItem.categorie === 'mechanical' 
        ? {
            ...baseData,
            pompe: currentItem.pompe,
            referencePompe: currentItem.referencePompe,
            marquePompe: currentItem.marquePompe,
          }
        : {
            ...baseData,
            caracteristique: currentItem.caracteristique,
          };

      await updateDoc(doc(db, "inventory", String(currentItem.id)), updateData)
      setItems(items.map((i) => (i.id === currentItem.id ? { ...i, ...currentItem } : i)))
    } else {
      const baseData = {
        code: currentItem.code,
        piece: currentItem.piece,
        marque: currentItem.marque,
        reference: currentItem.reference,
        quantite: Number(currentItem.quantite) || 0,
        emplacement: currentItem.emplacement,
        observation: currentItem.observation,
      };
      
      const addData = currentItem.categorie === 'mechanical' 
        ? {
            ...baseData,
            pompe: currentItem.pompe,
            referencePompe: currentItem.referencePompe,
            marquePompe: currentItem.marquePompe,
          }
        : {
            ...baseData,
            caracteristique: currentItem.caracteristique,
          };

      const docRef = await addDoc(collection(db, "inventory"), addData)
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

  // Export functionality moved to page component

  return (
    <>
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
              <TableHead>Code</TableHead>
              {category === 'mechanical' ? (
                <>
                  <TableHead>Piece</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Pompe</TableHead>
                  <TableHead>Reference Pompe</TableHead>
                  <TableHead>Marque Pompe</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead>Observation</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Piece</TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Caracteristique</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead>Observation</TableHead>
                </>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.code}</TableCell>
                {category === 'mechanical' ? (
                  <>
                    <TableCell>{item.piece}</TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.marque}</TableCell>
                    <TableCell>{item.quantite}</TableCell>
                    <TableCell>{item.pompe}</TableCell>
                    <TableCell>{item.referencePompe}</TableCell>
                    <TableCell>{item.marquePompe}</TableCell>
                    <TableCell>{item.emplacement}</TableCell>
                    <TableCell>{item.observation}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.piece}</TableCell>
                    <TableCell>{item.marque}</TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.caracteristique}</TableCell>
                    <TableCell>{item.quantite}</TableCell>
                    <TableCell>{item.emplacement}</TableCell>
                    <TableCell>{item.observation}</TableCell>
                  </>
                )}
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
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/inventory/${item.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/inventory/${item.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQrCodeClick(item)}>
                        <QrCode className="mr-2 h-4 w-4" />
                        Générer QR Code
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600">
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
        <div className="flex items-center justify-end px-4 py-4 border-t space-x-2">
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
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Modifier un produit" : "Ajouter un produit"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDialogSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input name="code" value={currentItem.code || ""} onChange={handleDialogInput} required />
            </div>
            <div>
              <Label htmlFor="piece">Piece</Label>
              <Input name="piece" value={currentItem.piece || ""} onChange={handleDialogInput} required />
            </div>
            {currentItem.categorie === 'mechanical' ? (
              <>
                <div>
                  <Label htmlFor="reference">Référence</Label>
                  <Input name="reference" value={currentItem.reference || ""} onChange={handleDialogInput} required />
                </div>
                <div>
                  <Label htmlFor="marque">Marque</Label>
                  <Input name="marque" value={currentItem.marque || ""} onChange={handleDialogInput} required />
                </div>
                <div>
                  <Label htmlFor="quantite">Quantité</Label>
                  <Input name="quantite" type="number" value={currentItem.quantite || 0} onChange={handleDialogInput} required />
                </div>
                <div>
                  <Label htmlFor="pompe">Pompe</Label>
                  <Input name="pompe" value={currentItem.pompe || ""} onChange={handleDialogInput} />
                </div>
                <div>
                  <Label htmlFor="referencePompe">Référence Pompe</Label>
                  <Input name="referencePompe" value={currentItem.referencePompe || ""} onChange={handleDialogInput} />
                </div>
                <div>
                  <Label htmlFor="marquePompe">Marque Pompe</Label>
                  <Input name="marquePompe" value={currentItem.marquePompe || ""} onChange={handleDialogInput} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="marque">Marque</Label>
                  <Input name="marque" value={currentItem.marque || ""} onChange={handleDialogInput} required />
                </div>
                <div>
                  <Label htmlFor="reference">Référence</Label>
                  <Input name="reference" value={currentItem.reference || ""} onChange={handleDialogInput} required />
                </div>
                <div>
                  <Label htmlFor="quantite">Quantité</Label>
                  <Input name="quantite" type="number" value={currentItem.quantite || 0} onChange={handleDialogInput} required />
                </div>
                <div>
                  <Label htmlFor="caracteristique">Caractéristiques</Label>
                  <Input name="caracteristique" value={currentItem.caracteristique || ""} onChange={handleDialogInput} />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="emplacement">Emplacement</Label>
              <Input name="emplacement" value={currentItem.emplacement || ""} onChange={handleDialogInput} required />
            </div>
            <div>
              <Label htmlFor="observation">Observation</Label>
              <Input name="observation" value={currentItem.observation || ""} onChange={handleDialogInput} />
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
