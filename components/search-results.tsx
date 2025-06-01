"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Eye, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { db, collection, getDocs } from "../lib/firebase"

// Données fictives pour les résultats de recherche
const searchResults = [
	{
		id: "INV001",
		reference: "EL-CAB-001",
		name: "Câble électrique 2.5mm",
		category: "Électrique",
		currentStock: 65,
		minStock: 20,
		location: "Rayon A-12",
		status: "Normal",
	},
	{
		id: "INV002",
		reference: "EL-DIS-020",
		name: "Disjoncteur 20A",
		category: "Électrique",
		currentStock: 12,
		minStock: 15,
		location: "Rayon B-03",
		status: "Low",
	},
	{
		id: "INV005",
		reference: "EL-AMP-010",
		name: "Ampoules LED 10W",
		category: "Électrique",
		currentStock: 145,
		minStock: 50,
		location: "Rayon A-05",
		status: "Normal",
	},
]

export function SearchResults() {
	const [results, setResults] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setLoading(true)
		setError(null)
		getDocs(collection(db, "products"))
			.then((snap) => {
				setResults(
					snap.docs.map((doc: any) => {
						const item = { id: doc.id, ...doc.data() }
						return {
							id: item.id,
							reference: item.reference || item.ref || "",
							name: item.piece || item.nom || "",
							category: item.categorie || item.category || "",
							currentStock: item.stockActuel ?? 0,
							minStock: item.seuilAlerte ?? 0,
							location: item.emplacement || item.location || "",
							status:
								(item.stockActuel ?? 0) <= (item.seuilAlerte ?? 0) ? "Low" : "Normal",
						}
					})
				)
			})
			.catch(() => setError("Erreur lors du chargement des résultats de recherche."))
			.finally(() => setLoading(false))
	}, [])

	if (loading) return <div>Chargement...</div>
	if (error) return <div className="text-red-500">{error}</div>

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle>Résultats de recherche</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Référence</TableHead>
							<TableHead>Produit</TableHead>
							<TableHead>Catégorie</TableHead>
							<TableHead>Stock Actuel</TableHead>
							<TableHead>Emplacement</TableHead>
							<TableHead>Statut</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{results.map((item: any) => (
							<TableRow key={item.id}>
								<TableCell className="font-medium">{item.reference}</TableCell>
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.category}</TableCell>
								<TableCell className="font-medium">{item.currentStock}</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<MapPin className="h-4 w-4 text-muted-foreground" />
										{item.location}
									</div>
								</TableCell>
								<TableCell>
									{item.status === "Low" ? (
										<Badge
											variant="destructive"
											className="flex items-center gap-1 w-fit"
										>
											<AlertTriangle className="h-3 w-3" />
											Stock bas
										</Badge>
									) : (
										<Badge variant="outline" className="w-fit">
											Normal
										</Badge>
									)}
								</TableCell>
								<TableCell className="text-right">
									<Button variant="ghost" size="icon">
										<Eye className="h-4 w-4" />
										<span className="sr-only">Voir détails</span>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
