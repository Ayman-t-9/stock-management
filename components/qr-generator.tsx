"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Printer } from "lucide-react"
import { cn } from '@/lib/utils'
import QRCode from 'qrcode'

interface Product {
  id?: string;
  reference: string;
  piece: string;
  categorie: string;
  stockInitial: number;
  stockActuel: number;
  seuilAlerte: number;
  emplacement: string;
  [key: string]: any;
}

interface QrGeneratorProps {
  product: Product;
  onClose?: () => void;
}

export function QrGenerator({ product, onClose }: QrGeneratorProps) {
  const [size, setSize] = useState("medium")
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const getSizeInPixels = (size: string) => {
    switch (size) {
      case "small": return 200
      case "large": return 400
      default: return 300 // medium
    }
  }

  useEffect(() => {
    generateQRCode()
  }, [size, product])

  const generateQRCode = async () => {
    setLoading(true)
    try {
      const productData = {
        id: product.id,
        reference: product.reference,
        piece: product.piece,
        categorie: product.categorie,
        emplacement: product.emplacement
      }
      const dataUrl = await QRCode.toDataURL(JSON.stringify(productData), {
        width: getSizeInPixels(size),
        margin: 2,
        color: {
          dark: '#000',
          light: '#fff'
        }
      })
      setQrDataUrl(dataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
    setLoading(false)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qr-${product.reference}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${product.reference}</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 20px; }
              .container { text-align: center; }
              .product-info { margin: 20px 0; }
              img { max-width: 100%; height: auto; }
              @media print {
                @page { margin: 0.5cm; }
                body { margin: 0; padding: 10px; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="product-info">
                <h2>${product.piece}</h2>
                <p>Référence: ${product.reference}</p>
                <p>Catégorie: ${product.categorie}</p>
                <p>Emplacement: ${product.emplacement}</p>
              </div>
              <img src="${qrDataUrl}" alt="QR Code" />
            </div>
            <script>
              window.onload = () => window.print();
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Code QR du Produit</CardTitle>
          <CardDescription>
            {product.piece} - {product.reference}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center space-x-4">
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Taille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Petit</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="large">Grand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={cn(
            "flex justify-center items-center bg-white rounded-lg p-4",
            loading && "animate-pulse"
          )}>
            {qrDataUrl && (
              <img 
                src={qrDataUrl} 
                alt="QR Code" 
                className="max-w-full h-auto"
                style={{ width: getSizeInPixels(size) }}
              />
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button variant="outline" onClick={handleDownload} disabled={loading}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline" onClick={handlePrint} disabled={loading}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
