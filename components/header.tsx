"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import { auth } from "../lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebase"

export function Header() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Get page title from pathname
  const getPageTitle = () => {
    const path = (pathname ?? "").split("/").pop() || "dashboard"
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
  }

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for auth user and fetch profile from Firestore
  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            setProfile(userDoc.data())
          } else {
            setProfile(null)
          }
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (!mounted || loading) {
    return null
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-white px-4 dark:bg-slate-950 lg:h-[60px] lg:px-6">
      <div className="flex flex-1 items-center gap-2">
        <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                {profile && profile.avatarUrl ? (
                  <AvatarImage src={profile.avatarUrl} alt={profile.displayName || "Avatar"} />
                ) : user && user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.displayName || "Avatar"} />
                ) : (
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                )}
                <AvatarFallback>
                  {profile && profile.displayName
                    ? profile.displayName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                    : user && user.displayName
                    ? user.displayName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                    : "AD"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
