import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DepartmentTable } from "@/components/department-table"
import { Plus, Search } from "lucide-react"

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departments</h2>
          <p className="text-muted-foreground">Manage your company departments and teams</p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search departments..." className="pl-8 w-full max-w-sm" />
          </div>
        </CardContent>
      </Card>

      <DepartmentTable />
    </div>
  )
}
