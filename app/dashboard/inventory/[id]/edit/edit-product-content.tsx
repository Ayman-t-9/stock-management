'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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

export function EditProductContent({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product>({
    reference: '',
    piece: '',
    categorie: '',
    stockInitial: 0,
    stockActuel: 0,
    seuilAlerte: 0,
    emplacement: '',
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const docRef = doc(db, "inventory", id);
      await updateDoc(docRef, {
        reference: product.reference,
        piece: product.piece,
        categorie: product.categorie,
        stockInitial: Number(product.stockInitial),
        stockActuel: Number(product.stockActuel),
        seuilAlerte: Number(product.seuilAlerte),
        emplacement: product.emplacement,
      });

      toast({
        title: "Succès",
        description: "Le produit a été mis à jour avec succès",
      });

      router.push('/dashboard/inventory');
      router.refresh();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev: Product) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modifier le Produit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="piece">Nom du Produit</Label>
                <Input 
                  id="piece" 
                  name="piece" 
                  value={product.piece} 
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select 
                  name="categorie" 
                  value={product.categorie} 
                  onValueChange={(value) => setProduct((prev: Product) => ({ ...prev, categorie: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Électrique</SelectItem>
                    <SelectItem value="mechanical">Mécanique</SelectItem>
                    <SelectItem value="plumbing">Plomberie</SelectItem>
                    <SelectItem value="tools">Outillage</SelectItem>
                    <SelectItem value="safety">Sécurité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reference">Référence</Label>
                <Input 
                  id="reference" 
                  name="reference" 
                  value={product.reference} 
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stockInitial">Stock Initial</Label>
                <Input 
                  id="stockInitial" 
                  name="stockInitial" 
                  type="number" 
                  value={product.stockInitial} 
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stockActuel">Stock Actuel</Label>
                <Input 
                  id="stockActuel" 
                  name="stockActuel" 
                  type="number" 
                  value={product.stockActuel} 
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="seuilAlerte">Seuil Minimal</Label>
                <Input 
                  id="seuilAlerte" 
                  name="seuilAlerte" 
                  type="number" 
                  value={product.seuilAlerte} 
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="emplacement">Emplacement</Label>
                <Input 
                  id="emplacement" 
                  name="emplacement" 
                  value={product.emplacement} 
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
