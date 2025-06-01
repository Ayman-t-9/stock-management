"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail } from "lucide-react"
import { auth, signInWithEmailAndPassword } from "../lib/firebase"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError("Invalid email or password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full bg-white/10 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="space-y-4 items-center text-center">
        <Image 
          src="/logo.jpg" 
          alt="ONEP Logo" 
          width={160} 
          height={160}
          className="mx-auto"
        />
        <div className="space-y-2">
          <CardTitle className="text-3xl font-bold text-white">Login</CardTitle>
          <CardDescription className="text-white/80">Enter your credentials to access your account</CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && <div className="text-red-300 text-sm text-center">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-white/60" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Button variant="link" className="p-0 h-auto text-sm text-white/80 hover:text-white" type="button">
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-white/60" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-white hover:bg-white/90 text-blue-600 font-semibold py-6" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
