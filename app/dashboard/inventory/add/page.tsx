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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price') as string),
      quantity: parseInt(formData.get('quantity') as string),
      minStock: parseInt(formData.get('minStock') as string),
      location: formData.get('location'),
      description: formData.get('description'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un Nouveau Produit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom du Produit</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select name="category" required>
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
                <Label htmlFor="price">Prix</Label>
                <Input id="price" name="price" type="number" step="0.01" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input id="quantity" name="quantity" type="number" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="minStock">Stock Minimal</Label>
                <Input id="minStock" name="minStock" type="number" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Emplacement</Label>
                <Input id="location" name="location" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" />
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
