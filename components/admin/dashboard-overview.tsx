import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Item = {
  title: string
  href: string
  description: string
  icon: React.ElementType
  count: number
}

export default function DashboardOverview({ items }: { items: Item[] }) {
  return (
    <div className="space-y-8">
      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {items.map((item, idx) => (
          <Card key={`stat-${idx}`} className="bg-white border-rose-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-red-900/70">Total {item.title.split(" ")[1] || item.title}</CardTitle>
                <div className="p-2 rounded-lg bg-rose-100 text-red-700">
                  <item.icon className="w-4 h-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Management cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <a
            key={`manage-${idx}`}
            href={item.href}
            className="block rounded-xl border bg-white shadow-sm hover:shadow-md transition border-rose-200/70 hover:border-rose-300"
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-rose-100 text-red-700">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">{item.count || 0}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}