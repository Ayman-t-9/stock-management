'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Printer } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, FormEvent, useEffect } from "react"
import { addInventoryItem, addEntryVoucher, getSuppliers, getPieces, Supplier, Piece } from "@/lib/firebase"
import { toast } from "sonner"

export default function AddEntryVoucherPage() {  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>(() => ({
    date: new Date().toISOString().split('T')[0]
  }));
  const [selectedCategory, setSelectedCategory] = useState<'electrical' | 'mechanical'>(() => {
    if (typeof window !== 'undefined') {
      return (sessionStorage.getItem('selectedCategory') as 'electrical' | 'mechanical') || 'electrical';
    }
    return 'electrical';
  });const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Add to inventory
      const inventoryData = {
        ...formData,
        category: selectedCategory,
      };
      const inventoryId = await addInventoryItem(inventoryData);

      // Create entry voucher
      const entryData = {
        ...formData,
        category: selectedCategory,
        inventoryId,
        status: 'completed'
      };
      await addEntryVoucher(entryData);

      toast.success('Bon d\'entrée créé avec succès');
      router.push('/dashboard/entry-voucher');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erreur lors de la création du bon d\'entrée');
    }
  };
  // Common metadata fields for all entry vouchers
  const metadataFields = [
    { id: "numeroMarche", label: "N° marche", type: "text", required: true },
    { id: "date", label: "Date", type: "date", required: true },
    { id: "fournisseur", label: "Fournisseur", type: "select", required: true },
  ];

  // Data structures for form fields based on category
  const electricalFields = [
    { id: "code", label: "Code", type: "text", required: true },
    { id: "piece", label: "Piece", type: "select", required: true },
    { id: "marque", label: "Marque", type: "text", required: true },
    { id: "reference", label: "Reference", type: "text", required: true },
    { id: "caracteristique", label: "Caracteristique", type: "textarea", required: true },
    { id: "quantite", label: "Quantité", type: "number", required: true },
    { id: "emplacement", label: "Emplacement", type: "text", required: true },
    { id: "observation", label: "Observation", type: "textarea", required: false },
  ];

  const mechanicalFields = [
    { id: "code", label: "Code", type: "text", required: true },
    { id: "piece", label: "Piece", type: "select", required: true },
    { id: "reference", label: "Reference", type: "text", required: true },
    { id: "marque", label: "Marque", type: "text", required: true },
    { id: "quantite", label: "Quantité", type: "number", required: true },
    { id: "pompe", label: "Pompe", type: "text", required: true },
    { id: "referencePompe", label: "Reference Pompe", type: "text", required: true },
    { id: "marquePompe", label: "Marque Pompe", type: "text", required: true },
    { id: "emplacement", label: "Emplacement", type: "text", required: true },
    { id: "observation", label: "Observation", type: "textarea", required: false },
  ];

  const electricalPieces = [
    { value: "cable", label: "Câble électrique 2.5mm" },
    { value: "disjoncteur", label: "Disjoncteur 20A" },
    { value: "interrupteur", label: "Interrupteur double" },
    { value: "prise", label: "Prise de courant" },
  ];
  const mechanicalPieces = [
    { value: "tuyau", label: "Tuyau PVC 50mm" },
    { value: "valve", label: "Valve de contrôle" },
    { value: "pompe", label: "Pompe hydraulique" },
    { value: "joint", label: "Joint d'étanchéité" },
  ];

  // Reset form when category changes
  useEffect(() => {
    setFormData({}); // Reset form data when category changes
  }, [selectedCategory]);

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer un Bon d'Entrée</CardTitle>
        </CardHeader>        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button
              type="button"
              variant={selectedCategory === 'electrical' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('electrical')}
            >
              Électrique
            </Button>
            <Button
              type="button"
              variant={selectedCategory === 'mechanical' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('mechanical')}
            >
              Mécanique
            </Button>          </div>          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Render metadata fields first */}
            {metadataFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === 'select' ? (
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}>
                    <SelectTrigger id={field.id}>
                      <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electropro">ElectroPro</SelectItem>
                      <SelectItem value="lumiereplus">LumièrePlus</SelectItem>
                      <SelectItem value="hydraumax">HydrauMax</SelectItem>
                      <SelectItem value="securipro">SecuriPro</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={`${field.label}...`}
                    required={field.required}
                    defaultValue={field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    value={formData[field.id] || ''}
                  />
                )}
              </div>
            ))}

            {/* Divider between metadata and category-specific fields */}
            <div className="my-6 border-t" />

            {/* Render fields based on selected category */}
            {(selectedCategory === 'electrical' ? electricalFields : mechanicalFields).map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === 'select' ? (
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}>
                    <SelectTrigger id={field.id}>
                      <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(selectedCategory === 'electrical' ? electricalPieces : mechanicalPieces).map((piece) => (
                        <SelectItem key={piece.value} value={piece.value}>
                          {piece.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    placeholder={`${field.label}...`}
                    required={field.required}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    value={formData[field.id] || ''}
                  />
                ) : (                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={`${field.label}...`}
                    required={field.required}
                    min={field.type === 'number' ? "1" : undefined}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      [field.id]: field.type === 'number' ? Number(e.target.value) : e.target.value 
                    }))}
                    value={formData[field.id] ?? (field.type === 'number' ? '1' : '')}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1">
                Créer le Bon d'Entrée
              </Button>
              <Button type="button" variant="outline" className="w-10 flex-shrink-0 px-0">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
