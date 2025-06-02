'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EntryVoucherTable } from "@/components/entry-voucher-table"
import { Plus, Search, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function EntryVoucherPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'electrical' | 'mechanical'>('electrical');
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bon d'Entrée</h2>
          <p className="text-muted-foreground">Gérer les entrées de stock et les bons de réception</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            className="gap-1" 
            onClick={() => {
              router.push('/dashboard/entry-voucher/add');
              sessionStorage.setItem('selectedCategory', selectedCategory);
            }}
          >
            <Plus className="h-4 w-4" />
            Nouveau Bon
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Exporter
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

      <Card>
        <CardHeader>
          <CardTitle>Historique des Bons d'Entrée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher par N° marche ou fournisseur..." className="pl-8 w-full" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="N° marche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <EntryVoucherTable category={selectedCategory} />
        </CardContent>
      </Card>
    </div>
  )
}
