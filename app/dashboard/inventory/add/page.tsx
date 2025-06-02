'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as 'electrical' | 'mechanical';    // Common fields for both categories
    const baseData = {
      code: formData.get('code'),
      categorie: category,
      marque: formData.get('marque'),
      reference: formData.get('reference'),
      observation: formData.get('observation'),
      emplacement: formData.get('location'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };    // Add category-specific fields
    const productData = category === 'electrical' 
      ? {
          ...baseData,
          caracteristique: formData.get('caracteristique'),
        }
      : {
          ...baseData,
          pompe: formData.get('pompe'),
          referencePompe: formData.get('referencePompe'),
          marquePompe: formData.get('marquePompe'),
        };

    try {
      // Add to Firestore
      const productsRef = collection(db, 'inventory');
      await addDoc(productsRef, productData);

      toast({
        title: "Succès",
        description: "Le produit a été ajouté avec succès",
      });

      // Navigate back to inventory page after successful addition
      router.push('/dashboard/inventory');
      router.refresh();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du produit",
      });
    } finally {
      setLoading(false);
    }
  };
  const [selectedCategory, setSelectedCategory] = useState<'electrical' | 'mechanical'>('electrical');

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un Nouveau Produit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">              {/* Common Fields */}              <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input id="code" name="code" placeholder="Code du produit" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="piece">Piece</Label>
                <Input id="piece" name="piece" placeholder="Désignation du produit" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  name="category" 
                  required
                  onValueChange={(value: 'electrical' | 'mechanical') => setSelectedCategory(value)}
                  defaultValue={selectedCategory}
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
              {selectedCategory === 'electrical' ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="marque">Marque</Label>
                    <Input id="marque" name="marque" placeholder="Marque du produit" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reference">Référence</Label>
                    <Input id="reference" name="reference" placeholder="Référence du produit" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantite">Quantité</Label>
                    <Input id="quantite" name="quantite" type="number" placeholder="Quantité en stock" min="0" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="caracteristique">Caractéristiques</Label>
                    <Input id="caracteristique" name="caracteristique" placeholder="Caractéristiques techniques" />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="reference">Référence</Label>
                    <Input id="reference" name="reference" placeholder="Référence de la pièce" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="marque">Marque</Label>
                    <Input id="marque" name="marque" placeholder="Marque de la pièce" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantite">Quantité</Label>
                    <Input id="quantite" name="quantite" type="number" placeholder="Quantité en stock" min="0" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pompe">Pompe</Label>
                    <Input id="pompe" name="pompe" placeholder="Type de pompe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="referencePompe">Référence Pompe</Label>
                    <Input id="referencePompe" name="referencePompe" placeholder="Référence de la pompe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="marquePompe">Marque Pompe</Label>
                    <Input id="marquePompe" name="marquePompe" placeholder="Marque de la pompe" />
                  </div>
                </>
              )}

              {/* Stock Management Fields */}
              <div className="grid gap-2">
                <Label htmlFor="location">Emplacement</Label>
                <Input id="location" name="location" placeholder="Localisation du produit" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="observation">Observations</Label>
                <Input id="observation" name="observation" placeholder="Observations supplémentaires" />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Ajout en cours...' : 'Ajouter le Produit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
