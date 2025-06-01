"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Package,
  Search,
  QrCode,
  Layers,
  PieChart,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import { auth } from "../lib/firebase"
import { signOut } from "firebase/auth"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Inventaire",
    href: "/dashboard/inventory",
    icon: Layers,
  },
  {
    title: "Bon d'Entrée",
    href: "/dashboard/entry-voucher",
    icon: FileText,
  },
    {
    title: "Bon de Sortie",
    href: "/dashboard/exit-voucher",
    icon: FileText,
  },
  {
    title: "Recherche Stock",
    href: "/dashboard/stock-search",
    icon: Search,
  },
  {
    title: "Rapports & Analyses",
    href: "/dashboard/reports",
    icon: PieChart,
  },
  {
    title: "Historique des Ventes",
    href: "/dashboard/sales-history",
    icon: ShoppingCart,
  },
  {
    title: "Historique des Achats",
    href: "/dashboard/purchase-history",
    icon: TrendingUp,
  },
  {
    title: "Scanner QR",
    href: "/dashboard/qr-scanner",
    icon: QrCode,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = "/" // Redirect to login or home
    } catch (err) {
      // Optionally show a toast or error
    }
  }

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)} className="rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-sm transition-transform lg:translate-x-0 lg:static lg:w-64 lg:shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>ONEE-Branche Eau</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="mt-auto border-t p-4">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
