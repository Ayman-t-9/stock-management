"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Edit, Eye, FileText, MoreHorizontal } from "lucide-react"

const salaryRecords = [
  {
    id: "SAL001",
    employee: {
      name: "Sophia Martinez",
      email: "sophia.m@example.com",
      department: "Engineering",
      position: "Senior Developer",
    },
    baseSalary: 85000,
    bonus: 5000,
    totalCompensation: 90000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: "SAL002",
    employee: {
      name: "James Wilson",
      email: "james.w@example.com",
      department: "Marketing",
      position: "Marketing Specialist",
    },
    baseSalary: 65000,
    bonus: 3000,
    totalCompensation: 68000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: "SAL003",
    employee: {
      name: "Emma Johnson",
      email: "emma.j@example.com",
      department: "HR",
      position: "HR Manager",
    },
    baseSalary: 75000,
    bonus: 4000,
    totalCompensation: 79000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: "SAL004",
    employee: {
      name: "Michael Brown",
      email: "michael.b@example.com",
      department: "Finance",
      position: "Financial Analyst",
    },
    baseSalary: 70000,
    bonus: 3500,
    totalCompensation: 73500,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: "SAL005",
    employee: {
      name: "Olivia Davis",
      email: "olivia.d@example.com",
      department: "Design",
      position: "UI/UX Designer",
    },
    baseSalary: 72000,
    bonus: 3000,
    totalCompensation: 75000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: "SAL006",
    employee: {
      name: "William Taylor",
      email: "william.t@example.com",
      department: "Engineering",
      position: "Frontend Developer",
    },
    baseSalary: 78000,
    bonus: 4000,
    totalCompensation: 82000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: "SAL007",
    employee: {
      name: "Ava Anderson",
      email: "ava.a@example.com",
      department: "Sales",
      position: "Sales Representative",
    },
    baseSalary: 68000,
    bonus: 8000,
    totalCompensation: 76000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: "SAL008",
    employee: {
      name: "Ethan Thomas",
      email: "ethan.t@example.com",
      department: "Engineering",
      position: "Backend Developer",
    },
    baseSalary: 80000,
    bonus: 4000,
    totalCompensation: 84000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: "SAL009",
    employee: {
      name: "Isabella Jackson",
      email: "isabella.j@example.com",
      department: "Marketing",
      position: "Content Writer",
    },
    baseSalary: 62000,
    bonus: 2000,
    totalCompensation: 64000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: "SAL010",
    employee: {
      name: "Mason White",
      email: "mason.w@example.com",
      department: "Customer Support",
      position: "Support Specialist",
    },
    baseSalary: 58000,
    bonus: 2500,
    totalCompensation: 60500,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
]

export function SalaryTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(salaryRecords.length / itemsPerPage)

  const currentSalaryRecords = salaryRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Base Salary</TableHead>
            <TableHead>Bonus</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Last Pay Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSalaryRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`/placeholder.svg?height=36&width=36&text=${record.employee.name.charAt(0)}`}
                      alt={record.employee.name}
                    />
                    <AvatarFallback>
                      {record.employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{record.employee.name}</div>
                    <div className="text-xs text-muted-foreground">{record.employee.position}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{record.employee.department}</TableCell>
              <TableCell>{formatCurrency(record.baseSalary)}</TableCell>
              <TableCell>{formatCurrency(record.bonus)}</TableCell>
              <TableCell className="font-medium">{formatCurrency(record.totalCompensation)}</TableCell>
              <TableCell>{new Date(record.lastPayDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Salary
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Payslip
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, salaryRecords.length)}</span> of{" "}
          <span className="font-medium">{salaryRecords.length}</span> salary records
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
