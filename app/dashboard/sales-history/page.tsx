import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SalesHistoryTable } from "@/components/sales-history-table"
import { Download, Search, Calendar } from "lucide-react"

export default function SalesHistoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Historique des Ventes</h2>
          <p className="text-muted-foreground">Consultez l'historique des sorties de stock</p>
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
                placeholder="Rechercher par référence, produit ou agent..."
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
                  <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les agents</SelectItem>
                  <SelectItem value="ahmed">Ahmed Benali</SelectItem>
                  <SelectItem value="mohammed">Mohammed Tazi</SelectItem>
                  <SelectItem value="fatima">Fatima Amrani</SelectItem>
                  <SelectItem value="karim">Karim Alaoui</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <SalesHistoryTable />
    </div>
  )
}
