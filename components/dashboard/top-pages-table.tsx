import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TopPage {
  page: string
  visitors: number
  conversionRate: number
}

interface TopPagesTableProps {
  data: TopPage[]
}

export function TopPagesTable({ data }: TopPagesTableProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Top Landing Pages</CardTitle>
        <CardDescription>Most visited pages this month</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Conversion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((page, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{page.page}</TableCell>
                <TableCell className="text-right">{page.visitors.toLocaleString()}</TableCell>
                <TableCell className="text-right">{page.conversionRate}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
