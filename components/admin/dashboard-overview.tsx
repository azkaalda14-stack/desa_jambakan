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
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {items.map((item, idx) => (
          <Card
            key={`stat-${idx}`}
            className="bg-white border-rose-100 min-w-0 group fade-up transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="text-red-900/50 text-xl font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-red-900/70">
                  {item.count || 0}
                </div>
                <div className="p-3 rounded-lg bg-rose-100 text-red-700 float-icon transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <item.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900 transition-opacity duration-300 group-hover:opacity-90">
                Total {item.title.split(" ")[1] || item.title}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Management cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <a
            key={`manage-${idx}`}
            href={item.href}
            className="block rounded-xl border bg-white shadow-sm hover:shadow-md transition border-rose-200/70 hover:border-rose-300 group fade-up hover:-translate-y-0.5 duration-300"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-rose-100 text-red-700 float-icon transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-red-900/50 text-xl font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-red-900/70">
                  {item.count || 0}
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900 transition-opacity duration-300 group-hover:opacity-90">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600 transition-opacity duration-300 group-hover:opacity-90">{item.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}