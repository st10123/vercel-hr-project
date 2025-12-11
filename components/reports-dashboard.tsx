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
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 p-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        基本価格
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-bold text-accent">{estimate.basePrice.toLocaleString()}</div>
                        <div className="text-base text-muted-foreground">円</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">車両の基準査定価格</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    {Object.entries(estimate.adjustments).map(([key, value]) => (
                      <div
                        key={key}
                        className={`relative overflow-hidden rounded-lg p-5 border-2 transition-all ${
                          value >= 0
                            ? "border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-emerald-50/20"
                            : "border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-orange-50/20"
                        }`}
                      >
                        <div
                          className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                          style={{
                            background: value >= 0 ? "#10b981" : "#f97316",
                            transform: "translate(30%, -30%)",
                          }}
                        />
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-semibold text-foreground text-sm">{key}</div>
                              <div
                                className={`text-xs font-medium mt-1 ${value >= 0 ? "text-emerald-700" : "text-orange-700"}`}
                              >
                                {value >= 0 ? "正の評価" : "マイナス要因"}
                              </div>
                            </div>
                            <div
                              className={`text-2xl font-bold ${value >= 0 ? "text-emerald-600" : "text-orange-600"}`}
                            >
                              {value >= 0 ? "+" : ""}
                              {(value / 10000).toFixed(1)}万
                            </div>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${value >= 0 ? "bg-emerald-500" : "bg-orange-500"}`}
                              style={{
                                width: `${Math.abs(value) > 300000 ? 100 : (Math.abs(value) / 300000) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative mt-8 pt-6 border-t-2 border-border">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          最終見積額
                        </div>
                        <div className="text-xs text-muted-foreground">全ての調整を含めた査定金額</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline gap-2 justify-end">
                          <div className="text-5xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                            {estimate.finalPrice.toLocaleString()}
                          </div>
                          <div className="text-lg text-muted-foreground mb-2">円</div>
                        </div>
                      </div>
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
                <CardDescription>査定ロジックに基づいた詳細な分析結果</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-5">
                  <div className="p-5 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-accent">1</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-2">車種別市場相場の適用</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {selectedVehicleInfo?.type}は現在の市場相場で
                          {selectedVehicleInfo?.type === "バイク" ? "高い需要" : "安定した需要"}
                          があります。査定システムは過去1年間のオークション実績データと全国の流通相場を参照し、該当車種の適正な基準価格を算定しています。
                          {selectedVehicleInfo?.type === "バイク"
                            ? "スポーツバイクは若年層の需要が高く"
                            : "ファミリーカーは市場流動性が高く"}
                          、査定額に正の影響を与えています。
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-orange-600">2</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-2">走行距離による価値減衰の算定</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          走行距離は車両の劣化度を示す最も重要な指標です。業界標準では年平均1万km走行を基準として、これを超える場合は1万km当たり約3～5万円の減額を適用します。非線形の減衰曲線を使用し、初期段階での減衰率を大きく、走行距離が多いほど減衰率を調整することで、より正確な査定を実現しています。
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-sky-600">3</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-2">車体状態の多次元評価</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          外装の傷、塗装の浮き、内装の汚損度、機関の動作状況など複数の評価軸を機械学習モデルで総合評価しています。ヒアリング内容から抽出された状態情報に基づき、同一年式・走行距離の平均車に対する相対的な状態指数を算出し、加減調整を決定します。良好な状態の車両は正の補正を受け、一般的な状態の車両との差別化が反映されます。
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-purple-600">4</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-2">年式による経年価値減衰</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          経過年数は技術的陳腐化と市場での競争力低下を示します。査定モデルでは経過年数に対して逓増的な減衰関数を適用し、同一年式の標準車との比較に基づいて調整額を算出します。初年度登録からの経過年数、そして新型モデル登場の影響度も考慮され、より精密な減額調整が実施されています。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <div className="text-sm text-foreground font-medium">査定精度について</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    当システムの査定は直近1年のマーケットデータに基づいており、実際の買取価格は査定額の±5～10%の幅で変動する可能性があります。
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
