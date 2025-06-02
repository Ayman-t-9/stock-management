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

export function EditProductContent({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);  const [product, setProduct] = useState<Product>({
    code: '',
    piece: '',
    marque: '',
    reference: '',
    quantite: 0,
    observation: '',
    emplacement: '',
    categorie: 'electrical',
    caracteristique: '',
    pompe: '',
    referencePompe: '',
    marquePompe: '',
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {      const docRef = doc(db, "inventory", id);
      const baseData = {
        code: product.code,
        piece: product.piece,
        marque: product.marque,
        reference: product.reference,
        quantite: Number(product.quantite),
        observation: product.observation,
        emplacement: product.emplacement,
        categorie: product.categorie,
      };

      const updateData = product.categorie === 'electrical'
        ? {
            ...baseData,
            caracteristique: product.caracteristique,
          }
        : {
            ...baseData,
            pompe: product.pompe,
            referencePompe: product.referencePompe,
            marquePompe: product.marquePompe,
          };

      await updateDoc(docRef, updateData);

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
        <CardContent>          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              {/* Common Fields */}
              <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input 
                  id="code" 
                  name="code" 
                  value={product.code} 
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="piece">Piece</Label>
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
                  onValueChange={(value: 'electrical' | 'mechanical') => setProduct((prev: Product) => ({ ...prev, categorie: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Électrique</SelectItem>
                    <SelectItem value="mechanical">Mécanique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Specific Fields */}
              {product.categorie === 'electrical' ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="marque">Marque</Label>
                    <Input 
                      id="marque" 
                      name="marque" 
                      value={product.marque} 
                      onChange={handleChange}
                      required 
                    />
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
                    <Label htmlFor="caracteristique">Caractéristiques</Label>
                    <Input 
                      id="caracteristique" 
                      name="caracteristique" 
                      value={product.caracteristique} 
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <>
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
                    <Label htmlFor="marque">Marque</Label>
                    <Input 
                      id="marque" 
                      name="marque" 
                      value={product.marque} 
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pompe">Pompe</Label>
                    <Input 
                      id="pompe" 
                      name="pompe" 
                      value={product.pompe} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="referencePompe">Référence Pompe</Label>
                    <Input 
                      id="referencePompe" 
                      name="referencePompe" 
                      value={product.referencePompe} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="marquePompe">Marque Pompe</Label>
                    <Input 
                      id="marquePompe" 
                      name="marquePompe" 
                      value={product.marquePompe} 
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="quantite">Quantité</Label>
                <Input 
                  id="quantite" 
                  name="quantite" 
                  type="number" 
                  value={product.quantite} 
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

              <div className="grid gap-2">
                <Label htmlFor="observation">Observation</Label>
                <Input 
                  id="observation" 
                  name="observation" 
                  value={product.observation} 
                  onChange={handleChange}
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
