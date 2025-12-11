"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"

const mockEmployees = [
  {
    id: 1,
    name: "田中太郎",
    department: "営業部",
    position: "営業主任",
    email: "tanaka@company.com",
    lastEvaluation: "2024-01-15",
  },
  {
    id: 2,
    name: "佐藤花子",
    department: "開発部",
    position: "シニアエンジニア",
    email: "sato@company.com",
    lastEvaluation: "2024-01-14",
  },
  {
    id: 3,
    name: "鈴木一郎",
    department: "マーケティング部",
    position: "マーケティングマネージャー",
    email: "suzuki@company.com",
    lastEvaluation: "2024-01-13",
  },
  {
    id: 4,
    name: "高橋美咲",
    department: "人事部",
    position: "人事スペシャリスト",
    email: "takahashi@company.com",
    lastEvaluation: "2024-01-12",
  },
  {
    id: 5,
    name: "山田健太",
    department: "財務部",
    position: "財務アナリスト",
    email: "yamada@company.com",
    lastEvaluation: "2024-01-11",
  },
  {
    id: 6,
    name: "伊藤直子",
    department: "営業部",
    position: "営業担当",
    email: "ito@company.com",
    lastEvaluation: "2024-01-10",
  },
  {
    id: 7,
    name: "渡辺健",
    department: "開発部",
    position: "エンジニア",
    email: "watanabe@company.com",
    lastEvaluation: "2024-01-09",
  },
  {
    id: 8,
    name: "中村優子",
    department: "マーケティング部",
    position: "マーケティング担当",
    email: "nakamura@company.com",
    lastEvaluation: "2024-01-08",
  },
]

const departments = ["営業部", "開発部", "マーケティング部", "人事部", "財務部"]

export function EmployeeManagement() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">従業員管理</h1>
            <p className="text-sm text-muted-foreground">従業員情報の管理と評価状況の確認</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                従業員追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しい従業員を追加</DialogTitle>
                <DialogDescription>従業員の基本情報を入力してください。</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">氏名</Label>
                  <Input id="name" placeholder="田中太郎" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input id="email" type="email" placeholder="tanaka@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">部署</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="部署を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">役職</Label>
                  <Input id="position" placeholder="営業主任" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>追加</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-xs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総従業員数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>従業員一覧</CardTitle>
            <CardDescription>従業員の検索・フィルタリング・管理</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="名前またはメールアドレスで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部署</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee List */}
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{employee.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{employee.department}</div>
                      <div className="text-muted-foreground">{employee.position}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">最終評価: {employee.lastEvaluation}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
