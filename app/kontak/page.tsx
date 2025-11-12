"use client"

import type React from "react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const { error } = await supabase.from("contact_submissions").insert([formData])

      if (error) throw error

      setSubmitMessage("Pesan Anda telah terkirim. Terima kasih!")
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })

      setTimeout(() => setSubmitMessage(""), 5000)
    } catch (error) {
      setSubmitMessage("Gagal mengirim pesan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
  <section className="py-12 md:py-16 bg-gradient-to-r from-red-700 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4 text-balance">Hubungi Kami</h1>
          <p className="text-white/90 text-lg">Kami siap melayani pertanyaan Anda</p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Kontak</h2>

              {submitMessage && (
                <div
                  className={`p-4 rounded-lg ${
  submitMessage.includes("terkirim") ? "bg-red-100 text-red-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <div>
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama Anda"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Anda"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nomor Telepon"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subjek</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subjek Pesan"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Pesan</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Pesan Anda"
                  rows={6}
                  required
                />
              </div>

  <Button type="submit" className="w-full bg-red-700 hover:bg-red-800" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
              </Button>
            </form>

            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Informasi Kontak</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Alamat</h3>
                  <p className="text-gray-600">Jalan Desa No. 1, Kecamatan, Kabupaten, Provinsi</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Telepon</h3>
                  <p className="text-gray-600">+62 XXX XXXX XXXX</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">info@desa.com</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Jam Operasional</h3>
                  <p className="text-gray-600">
                    Senin - Jumat: 08:00 - 17:00 WIB
                    <br />
                    Sabtu: 08:00 - 12:00 WIB
                    <br />
                    Minggu: Tutup
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
