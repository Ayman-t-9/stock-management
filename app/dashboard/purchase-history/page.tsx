import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PurchaseHistoryTable } from "@/components/purchase-history-table"
import { Download, Search, Calendar } from "lucide-react"

export default function PurchaseHistoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Historique des Achats</h2>
          <p className="text-muted-foreground">Consultez l'historique des entrées de stock</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-1">
            <Calendar className="h-4 w-4" />
            Filtrer par date
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par référence, produit ou fournisseur..."
                className="pl-8 w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les fournisseurs</SelectItem>
                  <SelectItem value="electropro">ElectroPro</SelectItem>
                  <SelectItem value="lumiereplus">LumièrePlus</SelectItem>
                  <SelectItem value="hydraumax">HydrauMax</SelectItem>
                  <SelectItem value="securipro">SecuriPro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <PurchaseHistoryTable />
    </div>
  )
}
