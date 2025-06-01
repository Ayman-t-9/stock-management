import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrScanner } from "@/components/qr-scanner"
import { QrGenerator } from "@/components/qr-generator"
import { QrCode, ScanLine } from "lucide-react"

export default function QrScannerPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scanner QR Code</h2>
          <p className="text-muted-foreground">Scanner et générer des codes QR pour les produits</p>
        </div>
      </div>

      <Tabs defaultValue="scanner" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <ScanLine className="h-4 w-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Générer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner">
          <QrScanner />
        </TabsContent>

        <TabsContent value="generator">
          <QrGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
