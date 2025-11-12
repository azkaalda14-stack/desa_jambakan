"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function AdminSignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [position, setPosition] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validasi form
    if (!fullName.trim()) {
      setError("Nama lengkap tidak boleh kosong")
      return
    }

    if (!email.trim()) {
      setError("Email tidak boleh kosong")
      return
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    if (password !== passwordConfirm) {
      setError("Password tidak cocok")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Sign up dengan Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            position: position || "Admin",
          },
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin/signup-success`,
        },
      })

      if (signUpError) throw signUpError

      // Redirect ke success page
      router.push("/admin/signup-success")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Gagal membuat akun admin"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
  <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-red-700 to-red-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Registrasi Admin</CardTitle>
          <CardDescription>Buat akun admin untuk website desa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nama Anda"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Posisi (Opsional)</Label>
              <Input
                id="position"
                type="text"
                placeholder="Misal: Kepala Desa, Admin"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@desa.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Konfirmasi Password</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="Ulangi password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

  <Button type="submit" className="w-full bg-red-700 hover:bg-red-800" disabled={isLoading}>
              {isLoading ? "Membuat akun..." : "Daftar"}
            </Button>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
  <Link href="/admin/login" className="text-red-700 font-semibold hover:underline">
                  Login di sini
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
