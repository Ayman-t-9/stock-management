'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InventoryTable } from "@/components/inventory-table"
import { Plus, Search, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function InventoryPage() {
  const router = useRouter();
  
  const handleAddProduct = () => {
    router.push("/dashboard/inventory/add");
  };

  const handleExport = async () => {
    try {
      // This is a placeholder - you would typically get this data from your API
      const response = await fetch('/api/inventory/export');
      const data = await response.json();
      
      // Convert the data to CSV format
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Nom,Catégorie,Quantité,Prix\n"
        + data.map((row: any) => 
          Object.values(row).join(",")
        ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "inventaire.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      // You might want to show an error toast here
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventaire</h2>
          <p className="text-muted-foreground">Gérer votre inventaire et stock</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-1" onClick={handleAddProduct}>
            <Plus className="h-4 w-4" />
            Ajouter Produit
          </Button>
          <Button variant="outline" className="gap-1" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">Tous les produits</TabsTrigger>
            <TabsTrigger value="low-stock">Stock minimal</TabsTrigger>
            <TabsTrigger value="categories">Par catégorie</TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher produits..." className="pl-8 w-full" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="electrical">Électrique</SelectItem>
                <SelectItem value="mechanical">Mécanique</SelectItem>
                <SelectItem value="plumbing">Plomberie</SelectItem>
                <SelectItem value="tools">Outillage</SelectItem>
                <SelectItem value="safety">Sécurité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <InventoryTable showLowStock={false} />
        </TabsContent>

        <TabsContent value="low-stock">
          <InventoryTable showLowStock={true} />
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CategoryCard name="Électrique" count={78} />
                <CategoryCard name="Mécanique" count={45} />
                <CategoryCard name="Plomberie" count={62} />
                <CategoryCard name="Outillage" count={35} />
                <CategoryCard name="Sécurité" count={25} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CategoryCard({ name, count }: { name: string; count: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-3xl font-bold mt-2">{count}</p>
          <p className="text-sm text-muted-foreground mt-1">produits</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 flex justify-between items-center">
          <Button variant="ghost" size="sm">
            Voir détails
          </Button>
          <span className="text-sm text-muted-foreground">{Math.round((count / 245) * 100)}% du total</span>
        </div>
      </CardContent>
    </Card>
  )
}
