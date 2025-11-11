import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecentSubmissions({ submissions }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesan Kontak Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions && submissions.length > 0 ? (
            submissions.map((item: any) => (
              <div key={item.id} className="border-b pb-4 last:border-b-0">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.email}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.message}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Belum ada pesan</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
