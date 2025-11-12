import { Card } from "@/components/ui/card"
import { FileText, Briefcase, MessageSquare, Users } from "lucide-react"

export default function DashboardStats({ newsCount, programsCount }: any) {
  const stats = [
    {
      title: "Berita",
      value: newsCount?.length || 0,
      icon: FileText,
    },
    {
      title: "Program",
      value: programsCount?.length || 0,
      icon: Briefcase,
    },
    {
      title: "Pesan",
      value: "12",
      icon: MessageSquare,
    },
    {
      title: "Pengguna",
      value: "1",
      icon: Users,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-white border-rose-100 min-w-0 group fade-up transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-lg bg-rose-100 text-red-700 float-icon transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-red-900/50 text-xl font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-red-900/70">
                {stat.value}
              </div>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900 transition-opacity duration-300 group-hover:opacity-90">{stat.title}</h3>
          </div>
        </Card>
      ))}
    </div>
  )
}