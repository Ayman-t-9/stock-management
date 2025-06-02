'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InventoryTable } from "@/components/inventory-table"
import { Download, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface InventoryItem {
  id: string;
  code: string;
  piece: string;
  marque: string;
  reference: string;
  caracteristique: string;
  quantite: number;
  remplacement: string;
  observation?: string;
  [key: string]: any;
}

export default function InventoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'electrical' | 'mechanical'>('electrical');

  const handleAddProduct = () => {
    router.push("/dashboard/inventory/add");
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Get reference to inventory collection
      const colRef = collection(db, "inventory");
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InventoryItem[];

      // Convert data to CSV format
      const headers = [
        'Référence',
        'Nom du Produit',
        'Catégorie',
        'Stock Initial',
        'Stock Actuel',
        'Seuil Minimal',
        'Emplacement',
        'Statut'
      ];

      const rows = items.map(item => [
        item.reference || '',
        item.piece || '',
        item.categorie || '',
        item.stockInitial || 0,
        item.stockActuel || 0,
        item.seuilAlerte || 0,
        item.emplacement || '',
        (item.stockActuel && item.seuilAlerte && item.stockActuel <= item.seuilAlerte) ? 'Stock bas' : 'Normal'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell}"`
            : cell
        ).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `inventaire_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "L'inventaire a été exporté avec succès",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        variant: "destructive",
        title: "Erreur", 
        description: "Une erreur s'est produite lors de l'exportation",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventaire</h1>
          <p className="text-muted-foreground">Gérez votre stock de pièces détachées</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/dashboard/inventory/add')}>
            Ajouter une pièce
          </Button>
          <Button variant="outline" size="default" onClick={handleExport} disabled={exporting}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exportation..." : "Exporter"}
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <Button
          variant={selectedCategory === 'electrical' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('electrical')}
        >
          Électrique
        </Button>
        <Button
          variant={selectedCategory === 'mechanical' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('mechanical')}
        >
          Mécanique
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 sm:max-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher produits..." className="pl-8 w-full" />
          </div>
        </div>

        <InventoryTable category={selectedCategory} />
      </div>
    </div>
  );
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
