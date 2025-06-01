import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EntryVoucherTable } from "@/components/entry-voucher-table"
import { Plus, Search, Download, Printer } from "lucide-react"

export default function EntryVoucherPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bon d'Entrée</h2>
          <p className="text-muted-foreground">Gérer les entrées de stock et les bons de réception</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Nouveau Bon
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historique des Bons d'Entrée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Rechercher par référence ou fournisseur..." className="pl-8 w-full" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="completed">Complété</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <EntryVoucherTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créer un Bon d'Entrée</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fournisseur</Label>
                <Select>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Sélectionner un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electro">Electro Plus</SelectItem>
                    <SelectItem value="matbat">MatBat SARL</SelectItem>
                    <SelectItem value="outillage">Outillage Pro</SelectItem>
                    <SelectItem value="securite">Sécurité Industrielle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Produit</Label>
                <Select>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cable">Câble électrique 2.5mm</SelectItem>
                    <SelectItem value="disjoncteur">Disjoncteur 20A</SelectItem>
                    <SelectItem value="tuyau">Tuyau PVC 50mm</SelectItem>
                    <SelectItem value="gants">Gants isolants</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input id="quantity" type="number" min="1" defaultValue="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice">N° Facture</Label>
                <Input id="invoice" placeholder="Numéro de facture..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Informations supplémentaires..." />
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="submit" className="w-full">
                  Créer
                </Button>
                <Button type="button" variant="outline" className="w-10 flex-shrink-0 px-0">
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
