"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Download, Filter, Search, User } from "lucide-react"
import { useState } from "react"

const vehicles = [
  { id: 1, name: "トヨタ プリウス 2018年", type: "普通自動車" },
  { id: 2, name: "ホンダ フィット 2020年", type: "普通自動車" },
  { id: 3, name: "スズキ ジムニー 2015年", type: "軽自動車" },
  { id: 4, name: "ヤマハ YZF-R6 2019年", type: "バイク" },
  { id: 5, name: "日産 セレナ 2017年", type: "普通自動車" },
  { id: 6, name: "ダイハツ ムーヴ 2016年", type: "軽自動車" },
  { id: 7, name: "カワサキ Ninja 2021年", type: "バイク" },
  { id: 8, name: "マツダ CX-5 2018年", type: "普通自動車" },
]

const generateVehicleEstimate = (vehicleId: number) => {
  const vehicle = vehicles[vehicleId - 1]
  const basePrice = 1200000
  const adjustments = {
    車種: Math.round((Math.random() - 0.5) * 400000),
    走行距離: -Math.round(Math.random() * 300000),
    状態: Math.round((Math.random() - 0.5) * 300000),
    年式: -Math.round(Math.random() * 250000),
  }

  const finalPrice = Math.round(basePrice + Object.values(adjustments).reduce((a, b) => a + b, 0))

  return {
    vehicle,
    basePrice,
    adjustments,
    finalPrice: Math.max(finalPrice, 50000),
  }
}

export function ReportsDashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVehicles = vehicles.filter((v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedVehicleInfo = vehicles.find((v) => v.id === selectedVehicle)
  const estimate = generateVehicleEstimate(selectedVehicle)

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-gradient-to-r from-card to-card/50 px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">見積額分析</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedVehicleInfo ? `${selectedVehicleInfo.name}の見積額と内訳` : "車・バイク見積もり分析"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 p-3 bg-card/50 rounded-lg border border-border/50">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">車両選択</div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="車両名で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48 h-9"
                  />
                </div>
                <Select
                  value={selectedVehicle.toString()}
                  onValueChange={(value) => setSelectedVehicle(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-64 h-9">
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="車両を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.name} ({vehicle.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
              <Button size="sm" className="h-9">
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent">最終見積額</CardTitle>
              <CardDescription>このシステムで計算された査定額</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-accent">
                  {estimate.finalPrice.toLocaleString()}
                  <span className="text-lg text-muted-foreground ml-2">円</span>
                </div>
                <div className="text-sm text-muted-foreground">{selectedVehicleInfo?.name}の見積額です</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">車両</div>
                <div className="font-medium">{selectedVehicleInfo?.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">車種</div>
                <div className="font-medium">{selectedVehicleInfo?.type}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">見積内訳</TabsTrigger>
            <TabsTrigger value="details">詳細分析</TabsTrigger>
            <TabsTrigger value="comparison">比較</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>見積額の構成要素</CardTitle>
                <CardDescription>各要素がどのように見積額に寄与しているか</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                    <div>
                      <div className="font-medium">基本価格</div>
                      <div className="text-xs text-muted-foreground">車両の基準価格</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{estimate.basePrice.toLocaleString()}円</div>
                    </div>
                  </div>

                  {Object.entries(estimate.adjustments).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        value >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{key}</div>
                        <div className="text-xs text-muted-foreground">{value >= 0 ? "加算" : "減算"}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${value >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {value >= 0 ? "+" : ""}
                          {value.toLocaleString()}円
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t-2 border-border pt-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">最終見積額</div>
                      <div className="text-xs text-muted-foreground">全ての調整を含める</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-3xl text-accent">{estimate.finalPrice.toLocaleString()}円</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>見積額計算の根拠</CardTitle>
                <CardDescription>各項目がどのように計算されたか</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="font-medium mb-1">車種による調整</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedVehicleInfo?.type}の相場に基づいて基本価格を調整しました。
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="font-medium mb-1">走行距離による減額</div>
                    <div className="text-sm text-muted-foreground">走行距離が多いほど査定額が下がります。</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="font-medium mb-1">状態評価による調整</div>
                    <div className="text-sm text-muted-foreground">
                      外装、内装の状態に基づいて加算または減算されます。
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="font-medium mb-1">年式による減額</div>
                    <div className="text-sm text-muted-foreground">年式が古いほど査定額が下がります。</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>他の車両との比較</CardTitle>
                <CardDescription>同じ車種の他の車両との見積額比較</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vehicles
                    .filter((v) => v.type === selectedVehicleInfo?.type)
                    .slice(0, 4)
                    .map((vehicle) => {
                      const vehicleEstimate = generateVehicleEstimate(vehicle.id)
                      return (
                        <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{vehicle.name}</div>
                            <div className="text-xs text-muted-foreground">{vehicle.type}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{vehicleEstimate.finalPrice.toLocaleString()}円</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
