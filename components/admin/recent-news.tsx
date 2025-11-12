import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecentNews({ news }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Berita Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news && news.length > 0 ? (
            news.map((item: any) => (
              <div key={item.id} className="border-b pb-4 last:border-b-0">
                <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{new Date(item.created_at).toLocaleDateString("id-ID")}</p>
                <p
                  className={`text-xs mt-2 inline-block px-2 py-1 rounded ${
                    item.status === "published" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.status === "published" ? "Publikasi" : "Draft"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Belum ada berita</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
