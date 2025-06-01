import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-[#0066CC] p-8 flex flex-col justify-center items-center">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-white mb-6">ONEE-Branche Eau</h1>
          <p className="text-white/90 text-xl mb-12">Gestion de stocks</p>
          <Image
            src="/logo.jpg"
            alt="ONEE Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
      </div>
      <div className="flex-1 bg-[#0000FF] p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}