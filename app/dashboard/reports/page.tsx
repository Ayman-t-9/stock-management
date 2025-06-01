import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InventoryReports } from "@/components/inventory-reports"
import { MovementReports } from "@/components/movement-reports"
import { AgentReports } from "@/components/agent-reports"
import { Download, FileText, BarChart, PieChart, TrendingUp } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rapports & Analyses</h2>
          <p className="text-muted-foreground">Visualiser et exporter les données d'inventaire</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-1">
            <FileText className="h-4 w-4" />
            Générer PDF
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Exporter Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
        <Select defaultValue="current-month">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Mois courant</SelectItem>
            <SelectItem value="last-month">Mois précédent</SelectItem>
            <SelectItem value="last-quarter">Dernier trimestre</SelectItem>
            <SelectItem value="year-to-date">Année en cours</SelectItem>
            <SelectItem value="custom">Période personnalisée</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground">Données du 1 août 2023 au 31 août 2023</div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Inventaire
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Mouvements
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Par Agent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <InventoryReports />
        </TabsContent>

        <TabsContent value="movements">
          <MovementReports />
        </TabsContent>

        <TabsContent value="agents">
          <AgentReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
