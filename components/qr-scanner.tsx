"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanLine, Upload, AlertCircle } from "lucide-react"
import { db, collection, getDocs } from "../lib/firebase"

export function QrScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
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

  const startScanner = () => {
    setIsScanning(true)
    setScanResult(null)
    setScanError(null)

    // Simuler un scan après 3 secondes
    setTimeout(() => {
      setIsScanning(false)
      // Pour la démo, choisir une référence de produit aléatoire dans Firestore
      if (products.length > 0) {
        const random = products[Math.floor(Math.random() * products.length)]
        setScanResult(random.reference)
      } else {
        setScanError("Aucun produit trouvé dans la base de données.")
      }
    }, 3000)
  }

  const uploadQrCode = () => {
    setScanResult(null)
    setScanError(null)

    // Simuler un résultat de téléchargement après 1 seconde
    setTimeout(() => {
      if (products.length > 1) {
        const random = products[Math.floor(Math.random() * products.length)]
        setScanResult(random.reference)
      } else {
        setScanError("Aucun produit trouvé dans la base de données.")
      }
    }, 1000)
  }

  const scannedProduct = products.find((p) => p.reference === scanResult)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Scanner un Code QR</CardTitle>
          <CardDescription>Utilisez la caméra pour scanner un code QR</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full max-w-md aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
            {isScanning ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-primary/50 animate-[scan_3s_ease-in-out_infinite]"></div>
                </div>
                <style jsx global>{`
                  @keyframes scan {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(100%); }
                    100% { transform: translateY(0); }
                  }
                `}</style>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ScanLine className="h-16 w-16 text-muted-foreground opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 border-2 border-dashed border-primary/50 m-8 rounded"></div>
          </div>

          <p className="text-center text-muted-foreground mb-4">
            {isScanning
              ? "Scanning en cours... Placez le code QR dans le cadre"
              : "Placez un code QR devant la caméra pour scanner automatiquement"}
          </p>

          <div className="flex gap-2">
            <Button onClick={startScanner} disabled={isScanning}>
              {isScanning ? "Scanning..." : "Activer la caméra"}
            </Button>
            <Button variant="outline" onClick={uploadQrCode}>
              <Upload className="h-4 w-4 mr-2" />
              Télécharger QR
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultat du scan</CardTitle>
          <CardDescription>Informations du produit scanné</CardDescription>
        </CardHeader>
        <CardContent>
          {scanResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Code QR scanné avec succès</h3>
                <p className="text-sm text-green-700 dark:text-green-400">Référence: {scanResult}</p>
              </div>

              {scannedProduct ? (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{scannedProduct.piece || scannedProduct.nom || "Produit inconnu"}</h3>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                      {scannedProduct.categorie || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Stock actuel</p>
                      <p className="font-medium">{scannedProduct.stockActuel ?? "-"} unités</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Emplacement</p>
                      <p className="font-medium">{scannedProduct.emplacement || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Seuil minimal</p>
                      <p className="font-medium">{scannedProduct.seuilAlerte ?? "-"} unités</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Statut</p>
                      <p className="font-medium">{(scannedProduct.stockActuel ?? 0) <= (scannedProduct.seuilAlerte ?? 0) ? "Alerte" : "Normal"}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm">Voir détails</Button>
                    <Button size="sm" variant="outline">
                      Créer bon de sortie
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4">Produit non trouvé dans la base de données.</div>
              )}
            </div>
          ) : scanError ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">Erreur de scan</h3>
                <p className="text-sm text-red-700 dark:text-red-400">{scanError}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-muted-foreground">Aucun résultat de scan</p>
              <p className="text-sm text-muted-foreground mt-1">Scannez un code QR pour voir les détails du produit</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
