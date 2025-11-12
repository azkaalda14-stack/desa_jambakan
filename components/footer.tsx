import { Phone, Mail, MapPin, Youtube, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Footer Content Grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_Klaten_Regency.svg"
                alt="Logo Kabupaten Klaten (transparan)"
                className="w-8 h-8 object-contain"
              />
              <h3 className="text-white font-bold">DESA JAMBAKAN</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Portal informasi resmi Desa Jambakan dengan konten budaya, kerajinan, dan berita terkini dari masyarakat
              lokal.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Hubungi Kami</h4>
            <div className="space-y-3 text-sm">
  <div className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-all duration-300 hover:translate-x-1">
                <Phone size={16} className="flex-shrink-0" />
                <span>0821-0000-0000</span>
              </div>
  <div className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-all duration-300 hover:translate-x-1">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@desajambakan.id</span>
              </div>
  <div className="flex items-start gap-3 text-gray-400 hover:text-red-400 transition-all duration-300 hover:translate-x-1">
                <MapPin size={16} className="flex-shrink-0 mt-1" />
                <span>Jambakan, Kabupaten Klaten, Jawa Tengah</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a
                href="#"
  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-125 hover:-translate-y-1 active:scale-95"
                title="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="#"
  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-125 hover:-translate-y-1 active:scale-95"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Bottom Footer */}
        <div className="pt-8 mt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 Desa Jambakan. All rights reserved | Dikelola oleh Pemerintah Desa</p>
        </div>
      </div>
    </footer>
  )
}
