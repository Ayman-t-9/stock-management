'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowLeft, Edit } from "lucide-react"

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

export function ProductDetailsContent({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, "inventory", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            reference: data.reference || '',
            piece: data.piece || '',
            categorie: data.categorie || '',
            stockInitial: data.stockInitial || 0,
            stockActuel: data.stockActuel || 0,
            seuilAlerte: data.seuilAlerte || 0,
            emplacement: data.emplacement || '',
            ...data
          });
        } else {
          router.push('/dashboard/inventory');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  const isLowStock = product.stockActuel <= product.seuilAlerte;

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <Button 
          onClick={() => router.push(`/dashboard/inventory/${id}/edit`)}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Modifier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails du Produit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Référence</h3>
              <p className="text-lg font-medium">{product.reference}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nom du Produit</h3>
              <p className="text-lg font-medium">{product.piece || product.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Catégorie</h3>
              <p className="text-lg font-medium">{product.categorie || product.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Emplacement</h3>
              <p className="text-lg font-medium">{product.emplacement || product.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Stock Initial</h3>
              <p className="text-lg font-medium">{product.stockInitial || product.initialStock}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Stock Actuel</h3>
              <p className="text-lg font-medium">{product.stockActuel || product.currentStock}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Seuil Minimal</h3>
              <p className="text-lg font-medium">{product.seuilAlerte || product.minStock}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Statut</h3>
            {isLowStock ? (
              <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                <AlertTriangle className="h-3 w-3" />
                Stock bas
              </Badge>
            ) : (
              <Badge variant="outline" className="w-fit">
                Normal
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
