import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase, MessageSquare, Users } from "lucide-react"

export default function DashboardStats({ newsCount, programsCount }: any) {
  const stats = [
    {
      title: "Berita",
      value: newsCount?.length || 0,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Program",
      value: programsCount?.length || 0,
      icon: Briefcase,
      color: "bg-green-500",
    },
    {
      title: "Pesan",
      value: "12",
      icon: MessageSquare,
      color: "bg-orange-500",
    },
    {
      title: "Pengguna",
      value: "1",
      icon: Users,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`${stat.color} p-2 rounded-lg`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
