"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Download, Printer } from "lucide-react"
import { db, collection, getDocs } from "../lib/firebase"

export function QrGenerator() {
  const [reference, setReference] = useState("")
  const [size, setSize] = useState("medium")
  const [generated, setGenerated] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getDocs(collection(db, "products"))
      .then((snap) => setProducts(snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any[]))
      .catch(() => setError("Erreur lors du chargement des produits."))
      .finally(() => setLoading(false))
  }, [])

  const generateQrCode = () => {
    if (reference) {
      setGenerated(true)
    }
  }

  const selectedProduct = products.find((p) => p.reference === reference)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Générer un Code QR</CardTitle>
          <CardDescription>Créez des codes QR pour vos produits</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Référence du produit</Label>
              <Select onValueChange={(value) => setReference(value)} value={reference}>
                <SelectTrigger id="reference">
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.reference}>
                      {p.reference} - {p.piece || p.nom || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-reference">Ou entrez une référence personnalisée</Label>
              <Input
                id="custom-reference"
                placeholder="Ex: PROD-001"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Taille du code QR</Label>
              <Select defaultValue="medium" onValueChange={setSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petit</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="large">Grand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="button" onClick={generateQrCode} disabled={!reference}>
              Générer QR Code
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu du Code QR</CardTitle>
          <CardDescription>Prévisualisation du code QR généré</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {generated ? (
            <>
              <div
                className={`bg-white p-4 rounded-lg mb-4 ${
                  size === "small" ? "w-32 h-32" : size === "medium" ? "w-48 h-48" : "w-64 h-64"
                }`}
              >
                <QrCode className="w-full h-full" />
              </div>

              <div className="text-center mb-4">
                <p className="font-medium">{reference}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct ? (selectedProduct.piece || selectedProduct.nom || "") : ""}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Télécharger
                </Button>
                <Button variant="outline" className="gap-1">
                  <Printer className="h-4 w-4" />
                  Imprimer
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <QrCode className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
              <p className="text-muted-foreground">Aucun code QR généré</p>
              <p className="text-sm text-muted-foreground mt-1">Sélectionnez un produit et générez un code QR</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
