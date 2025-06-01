import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchResults } from "@/components/search-results"
import { Search, QrCode, Filter, ScanLine } from "lucide-react"

export default function StockSearchPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recherche de Stock</h2>
          <p className="text-muted-foreground">Rechercher et localiser des produits dans l'inventaire</p>
        </div>
      </div>

      <Tabs defaultValue="text" className="space-y-4">
        <TabsList>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Recherche Texte
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Scanner QR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Recherche Avancée</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-term">Terme de recherche</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-term"
                        type="search"
                        placeholder="Référence, nom ou description..."
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem value="electrical">Électrique</SelectItem>
                        <SelectItem value="mechanical">Mécanique</SelectItem>
                        <SelectItem value="plumbing">Plomberie</SelectItem>
                        <SelectItem value="tools">Outillage</SelectItem>
                        <SelectItem value="safety">Sécurité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Emplacement</Label>
                    <Select>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Tous les emplacements" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les emplacements</SelectItem>
                        <SelectItem value="a">Rayon A</SelectItem>
                        <SelectItem value="b">Rayon B</SelectItem>
                        <SelectItem value="c">Rayon C</SelectItem>
                        <SelectItem value="d">Rayon D</SelectItem>
                        <SelectItem value="e">Rayon E</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock-status">Statut du stock</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="stock-status">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="in-stock">En stock</SelectItem>
                        <SelectItem value="low-stock">Stock bas</SelectItem>
                        <SelectItem value="out-of-stock">Épuisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2 flex items-end">
                    <Button className="gap-2">
                      <Filter className="h-4 w-4" />
                      Rechercher
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <SearchResults />
        </TabsContent>

        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle>Scanner un Code QR</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="h-16 w-16 text-muted-foreground opacity-50" />
                </div>
                <div className="absolute inset-0 border-2 border-dashed border-primary/50 m-8 rounded"></div>
              </div>

              <p className="text-center text-muted-foreground mb-4">
                Placez un code QR devant la caméra pour scanner automatiquement
              </p>

              <div className="flex gap-2">
                <Button>Activer la caméra</Button>
                <Button variant="outline">Télécharger QR</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
