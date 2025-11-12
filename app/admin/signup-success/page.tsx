import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignupSuccessPage() {
  return (
  <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-red-700 to-red-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
  <div className="rounded-full bg-red-100 p-3">
              <Mail className="h-6 w-6 text-red-700" />
            </div>
          </div>
          <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
          <CardDescription>Akun admin Anda telah dibuat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              Terima kasih telah mendaftar sebagai admin website desa. Silakan cek email Anda untuk verifikasi akun.
            </p>
            <p className="font-semibold text-gray-900">Langkah berikutnya:</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Cek email untuk link verifikasi</li>
              <li>Klik link di email untuk mengkonfirmasi akun</li>
              <li>Kembali ke login dan masuk dengan email dan password Anda</li>
              <li>Mulai kelola konten website desa</li>
            </ol>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Link href="/admin/login" className="block">
              <Button className="w-full bg-red-700 hover:bg-red-800">Kembali ke Login</Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Kembali ke Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
