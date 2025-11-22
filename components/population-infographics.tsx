"use client";

import { ChartContainer, ChartTooltip, ChartLegend, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type Summary = { population: number; households: number };
type AgeItem = { group: string; male: number; female: number };
type DusunItem = { name: string; value: number };
type EducationItem = { level: string; value: number };
type JobItem = { name: string; value: number };
type StatItem = { name: string; value: number };

export default function PopulationInfographics({
  summary,
  ageGroups,
  dusun,
  education,
  jobs,
  marriage,
  religion,
}: {
  summary: Summary;
  ageGroups: AgeItem[];
  dusun: DusunItem[];
  education: EducationItem[];
  jobs?: JobItem[];
  marriage?: StatItem[];
  religion?: StatItem[];
}) {
  const ageData = ageGroups.map((x) => ({ group: x.group, male: -Math.abs(x.male || 0), female: Math.abs(x.female || 0) }));

  const ageConfig: ChartConfig = {
  male: { label: "Laki-laki", color: "#ef4444" },
    female: { label: "Perempuan", color: "#f59e0b" },
  };

const pieColors = ["#2563eb", "#ef4444", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div className="space-y-12 overflow-x-hidden">
      {/* Ringkasan jumlah penduduk & KK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SummaryCard title="Jumlah Penduduk" value={summary.population} />
        <SummaryCard title="Kepala Keluarga" value={summary.households} />
      </div>

      {/* Tiga grafik ditata satu kolom, lebar konsisten dan terpusat */}
      <div className="space-y-10 max-w-7xl mx-auto">
        {/* Piramida penduduk berdasarkan kelompok umur */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Berdasarkan Kelompok Umur</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[560px] sm:min-w-0">
              <ChartContainer config={ageConfig} className="h-[420px]">
                <ResponsiveContainer>
                  <BarChart data={ageData} layout="vertical" margin={{ left: 24, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => Math.abs(Number(v)).toLocaleString()} />
                  <YAxis dataKey="group" type="category" width={100} />
                  <Tooltip formatter={(v) => Math.abs(Number(v)).toLocaleString()} />
                  <Legend />
                  <Bar dataKey="male" name="Laki-laki" fill="var(--color-male)" />
                  <Bar dataKey="female" name="Perempuan" fill="var(--color-female)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Pie chart berdasarkan Dusun */}
        <div className="bg-white rounded-xl p-8 shadow-md overflow-hidden">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Berdasarkan Dusun</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <ChartContainer config={{ dusun: { label: "Dusun" } }} className="aspect-auto h-[360px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={dusun} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100}>
                    {dusun.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-sm sm:text-base text-gray-700 w-full">
              <p className="font-medium mb-2">Keterangan:</p>
              {dusun.map((d, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] items-center py-1">
                  <span className="truncate">{d.name}</span>
                  <span className="font-mono tabular-nums" suppressHydrationWarning={true}>{d.value.toLocaleString()} Jiwa</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart pendidikan */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Berdasarkan Pendidikan</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[640px] sm:min-w-0">
              <ChartContainer config={{ edu: { label: "Pendidikan" } }} className="h-[420px]">
                <ResponsiveContainer>
                  <BarChart data={education}>
                  <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" interval={0} angle={-30} tick={{ fontSize: 11 }} height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Jumlah" fill="#b91c1c" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Pekerjaan */}
        {jobs && jobs.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Berdasarkan Pekerjaan</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Pekerjaan</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((j, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{j.name}</TableCell>
                        <TableCell className="text-right font-semibold" suppressHydrationWarning={true}>{j.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {jobs.slice(0, 6).map((j, idx) => (
                  <div key={idx} className="rounded-lg border bg-white p-6 text-center">
                    <p className="text-base text-gray-600 mb-2">{j.name}</p>
                    <p className="text-3xl font-bold text-gray-900" suppressHydrationWarning={true}>{j.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Perkawinan */}
        {marriage && marriage.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Berdasarkan Perkawinan</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {marriage.map((m, idx) => (
                <div key={idx} className="rounded-lg border bg-white p-6 text-center">
                  <p className="text-base text-gray-600 mb-2">{m.name}</p>
                  <p className="text-3xl font-bold text-gray-900" suppressHydrationWarning={true}>{m.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agama */}
        {religion && religion.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Berdasarkan Agama</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {religion.map((r, idx) => (
                <div key={idx} className="rounded-lg border bg-white p-6 text-center">
                  <p className="text-base text-gray-600 mb-2">{r.name}</p>
                  <p className="text-3xl font-bold text-gray-900" suppressHydrationWarning={true}>{r.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-4">
      <Users className="w-10 h-10 text-red-700" />
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-900" suppressHydrationWarning={true}>{(value || 0).toLocaleString()}</p>
      </div>
    </div>
  );
}