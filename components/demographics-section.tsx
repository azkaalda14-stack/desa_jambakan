"use client";

import { useMemo, useState } from "react";
import { ChartContainer, ChartTooltip, ChartLegend, ChartConfig } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { Baby, Skull, Users } from "lucide-react";

type YearStats = { year: number; births: number; deaths: number; households: number };

export default function DemographicsSection({ data }: { data: YearStats[] }) {
  const [yearIndex, setYearIndex] = useState(0);
  const sorted = useMemo(() => [...data].sort((a, b) => b.year - a.year), [data]);
  const current = sorted[yearIndex] || sorted[0];

  const configs: ChartConfig = {
  births: { label: "Kelahiran", color: "#ef4444" },
    deaths: { label: "Kematian", color: "#ef4444" },
    households: { label: "Kepala Keluarga", color: "#3b82f6" },
  };

  const cards = [
    { icon: Baby, label: "Kelahiran", value: current?.births ?? 0 },
    { icon: Skull, label: "Kematian", value: current?.deaths ?? 0 },
    { icon: Users, label: "Kepala Keluarga", value: current?.households ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Tahun selector */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Statistik Demografis Tahun</h4>
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

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-md flex items-center gap-4">
          <c.icon className="w-10 h-10 text-red-700" />
            <div>
              <p className="text-gray-600 text-sm">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900">{c.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Three individual donut charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SingleDonut title="Kelahiran" value={current?.births ?? 0} colorVar="var(--color-births)" configKey="births" configs={configs} />
        <SingleDonut title="Kematian" value={current?.deaths ?? 0} colorVar="var(--color-deaths)" configKey="deaths" configs={configs} />
        <SingleDonut title="Kepala Keluarga" value={current?.households ?? 0} colorVar="var(--color-households)" configKey="households" configs={configs} />
      </div>

      {/* Descriptive info similar to examples */}
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-900">
        Pada tahun <span className="font-semibold">{current?.year}</span>, jumlah kelahiran tercatat
        <span className="font-semibold"> {current?.births?.toLocaleString() || 0} </span>jiwa, sedangkan kematian
        <span className="font-semibold"> {current?.deaths?.toLocaleString() || 0} </span>jiwa. Total kepala keluarga
        mencapai <span className="font-semibold">{current?.households?.toLocaleString() || 0}</span> KK.
      </div>
    </div>
  );
}

function SingleDonut({ title, value, colorVar, configKey, configs }: { title: string; value: number; colorVar: string; configKey: keyof ChartConfig; configs: ChartConfig }) {
  const data = [{ name: title, value, fill: colorVar }];
  const config: ChartConfig = { [configKey]: configs[configKey] } as ChartConfig;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md overflow-hidden">
      <h5 className="font-semibold mb-2">{title}</h5>
      <ChartContainer config={config} className="aspect-auto h-56 w-full">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
            <Cell key={`cell-0`} fill={data[0].fill} />
          </Pie>
          <ChartLegend />
          <ChartTooltip />
        </PieChart>
      </ChartContainer>
      <div className="mt-2 text-center text-sm text-gray-600">Total {title.toLowerCase()} tahun ini</div>
    </div>
  );
}