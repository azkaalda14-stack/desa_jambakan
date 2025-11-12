"use client";

import { useMemo, useState } from "react";
import { ChartContainer, ChartTooltip, ChartLegend, ChartConfig } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

type YearStats = { year: number; births: number; deaths: number; households: number };

export default function DemographicsChart({ data }: { data: YearStats[] }) {
  const [yearIndex, setYearIndex] = useState(0);
  const sorted = useMemo(() => [...data].sort((a, b) => b.year - a.year), [data]);
  const current = sorted[yearIndex] || sorted[0];

  const chartData = [
    { name: "Kelahiran", value: current?.births || 0, fill: "var(--color-births)" },
    { name: "Kematian", value: current?.deaths || 0, fill: "var(--color-deaths)" },
    { name: "Kepala Keluarga", value: current?.households || 0, fill: "var(--color-households)" },
  ];

  const config: ChartConfig = {
  births: { label: "Kelahiran", color: "#ef4444" },
    deaths: { label: "Kematian", color: "#ef4444" },
    households: { label: "Kepala Keluarga", color: "#3b82f6" },
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600">Statistik demografis per tahun</p>
        <div className="flex items-center gap-2">
          {sorted.map((item, idx) => (
            <button
              key={item.year}
              className={`px-3 py-1 rounded border text-sm ${idx === yearIndex ? "bg-red-700 text-white border-transparent" : "bg-white text-gray-700 border-gray-200"}`}
              onClick={() => setYearIndex(idx)}
            >
              {item.year}
            </button>
          ))}
        </div>
      </div>
      <ChartContainer config={config} className="h-64">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend />
          <ChartTooltip />
        </PieChart>
      </ChartContainer>
    </div>
  );
}