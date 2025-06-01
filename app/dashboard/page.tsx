import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StockStats } from "@/components/stock-stats"
import { StockMovementChart } from "@/components/stock-movement-chart"
import { RecentActivities } from "@/components/recent-activities"
import {
  PlusCircle,
  FileSpreadsheet,
  BarChart3,
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <StockStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button className="justify-start" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
            <Button className="justify-start" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une catégorie
            </Button>
            <Button className="justify-start" variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Enregistrer une vente
            </Button>
            <Button className="justify-start" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Enregistrer un achat
            </Button>
            <Button className="justify-start sm:col-span-2" variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Importer/Exporter des données
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Alertes de stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <span>Câble électrique 2.5mm</span>
                </div>
                <Badge variant="outline">Stock faible: 5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <span>Disjoncteur 20A</span>
                </div>
                <Badge variant="outline">Stock faible: 3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  <span>Gants isolants</span>
                </div>
                <Badge variant="destructive">Rupture de stock</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  <span>Multimètre digital</span>
                </div>
                <Badge variant="destructive">Rupture de stock</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="movement">
            <BarChart3 className="h-4 w-4 mr-2" />
            Mouvement de stock
          </TabsTrigger>
          <TabsTrigger value="activities">
            <TrendingUp className="h-4 w-4 mr-2" />
            Activités récentes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="movement" className="space-y-4">
          <StockMovementChart />
        </TabsContent>
        <TabsContent value="activities" className="space-y-4">
          <RecentActivities />
        </TabsContent>
      </Tabs>
    </div>
  )
}
