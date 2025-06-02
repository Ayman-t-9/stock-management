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
  code: string;
  piece: string;
  marque: string;
  reference: string;
  quantite: number;
  observation?: string;
  emplacement: string;
  categorie: 'electrical' | 'mechanical';
  caracteristique?: string;
  pompe?: string;
  referencePompe?: string;
  marquePompe?: string;
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
        
        if (docSnap.exists()) {          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            code: data.code || '',
            piece: data.piece || '',
            marque: data.marque || '',
            reference: data.reference || '',
            quantite: data.quantite || 0,
            observation: data.observation || '',
            emplacement: data.emplacement || '',
            categorie: data.categorie || 'electrical',
            caracteristique: data.caracteristique || '',
            pompe: data.pompe || '',
            referencePompe: data.referencePompe || '',
            marquePompe: data.marquePompe || '',
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
          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
              <p className="text-lg font-medium">{product.code}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Piece</h3>
              <p className="text-lg font-medium">{product.piece}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Catégorie</h3>
            <p className="text-lg font-medium">
              {product.categorie === 'electrical' ? 'Électrique' : 'Mécanique'}
            </p>
          </div>

          {/* Category Specific Fields */}
          {product.categorie === 'electrical' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Marque</h3>
                <p className="text-lg font-medium">{product.marque}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Référence</h3>
                <p className="text-lg font-medium">{product.reference}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Caractéristique</h3>
                <p className="text-lg font-medium">{product.caracteristique || '-'}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Référence</h3>
                <p className="text-lg font-medium">{product.reference}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Marque</h3>
                <p className="text-lg font-medium">{product.marque}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Pompe</h3>
                <p className="text-lg font-medium">{product.pompe || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Référence Pompe</h3>
                <p className="text-lg font-medium">{product.referencePompe || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Marque Pompe</h3>
                <p className="text-lg font-medium">{product.marquePompe || '-'}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Quantité</h3>
              <p className="text-lg font-medium">{product.quantite}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Emplacement</h3>
              <p className="text-lg font-medium">{product.emplacement}</p>
            </div>
          </div>

          {product.observation && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Observation</h3>
              <p className="text-lg font-medium">{product.observation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
