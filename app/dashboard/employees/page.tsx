import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmployeeTable } from "@/components/employee-table"
import { Plus, Search } from "lucide-react"

export default function EmployeesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">Manage your employee records and information</p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search employees..." className="pl-8 w-full" />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="probation">Probation</SelectItem>
                  <SelectItem value="leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <EmployeeTable />
    </div>
  )
}
