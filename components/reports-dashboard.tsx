"use client"

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  Users,
  CheckCircle,
  Download,
  Filter,
  Calendar,
  Star,
  Search,
  User,
  X,
  MessageCircle,
} from "lucide-react"
import { useState } from "react"

const performanceData = [
  { name: "営業部", responsibility: 7.8, speed: 7.2, accuracy: 8.1, overall: 7.7, completed: 28, total: 30 },
  { name: "開発部", responsibility: 8.5, speed: 7.8, accuracy: 9.2, overall: 8.5, completed: 25, total: 25 },
  { name: "マーケティング部", responsibility: 7.1, speed: 8.3, accuracy: 7.5, overall: 7.6, completed: 22, total: 24 },
  { name: "人事部", responsibility: 8.9, speed: 7.5, accuracy: 8.7, overall: 8.4, completed: 15, total: 15 },
  { name: "財務部", responsibility: 8.2, speed: 6.8, accuracy: 9.1, overall: 8.0, completed: 18, total: 20 },
]

const evaluationTrends = [
  { month: "1月", responsibility: 7.2, speed: 7.0, accuracy: 8.1, overall: 7.4 },
  { month: "2月", responsibility: 7.4, speed: 7.2, accuracy: 8.2, overall: 7.6 },
  { month: "3月", responsibility: 7.8, speed: 7.5, accuracy: 8.4, overall: 7.9 },
  { month: "4月", responsibility: 7.6, speed: 7.3, accuracy: 8.3, overall: 7.7 },
  { month: "5月", responsibility: 8.0, speed: 7.7, accuracy: 8.6, overall: 8.1 },
  { month: "6月", responsibility: 8.2, speed: 7.9, accuracy: 8.8, overall: 8.3 },
]

const skillDistribution = [
  { name: "優秀 (9-10点)", value: 25, color: "#15803d" },
  { name: "良好 (7-8点)", value: 45, color: "#84cc16" },
  { name: "普通 (5-6点)", value: 25, color: "#f97316" },
  { name: "改善必要 (1-4点)", value: 5, color: "#dc2626" },
]

const radarData = [
  { skill: "責任感", average: 8.1, max: 10 },
  { skill: "仕事の早さ", average: 7.5, max: 10 },
  { skill: "正確性", average: 8.6, max: 10 },
  { skill: "総合評価", average: 8.0, max: 10 },
]

const employees = [
  { id: 1, name: "田中太郎", department: "営業部" },
  { id: 2, name: "佐藤花子", department: "開発部" },
  { id: 3, name: "鈴木一郎", department: "マーケティング部" },
  { id: 4, name: "高橋美咲", department: "人事部" },
  { id: 5, name: "山田健太", department: "財務部" },
  { id: 6, name: "伊藤直子", department: "営業部" },
  { id: 7, name: "渡辺健", department: "開発部" },
  { id: 8, name: "中村優子", department: "マーケティング部" },
]

const generateRandomScore = () => Math.round((Math.random() * 6 + 4) * 10) / 10 // 4.0-10.0の範囲
const generateRandomTrend = (baseScore: number) => {
  const months = ["1月", "2月", "3月", "4月"]
  return months.map((month) => ({
    month,
    responsibility: Math.round((baseScore + (Math.random() - 0.5) * 2) * 10) / 10,
    speed: Math.round((baseScore + (Math.random() - 0.5) * 2) * 10) / 10,
    accuracy: Math.round((baseScore + (Math.random() - 0.5) * 2) * 10) / 10,
    overall: Math.round((baseScore + (Math.random() - 0.5) * 2) * 10) / 10,
  }))
}

const generateIndividualData = () => {
  const data: any = {}
  employees.forEach((employee) => {
    const responsibility = generateRandomScore()
    const speed = generateRandomScore()
    const accuracy = generateRandomScore()
    const overall = Math.round(((responsibility + speed + accuracy) / 3) * 10) / 10

    // 昇進可能性を評価スコアに基づいて計算（30-95%の範囲）
    const avgScore = (responsibility + speed + accuracy + overall) / 4
    const promotionProbability = Math.round(Math.min(95, Math.max(30, (avgScore - 4) * 10.8 + 30)))

    // SHAP値をランダムに生成（-2.0から+3.0の範囲）
    const generateShapValue = (score: number) => {
      const baseValue = (score - 7) * 0.8 + (Math.random() - 0.5) * 1.5
      return Math.round(baseValue * 10) / 10
    }

    data[employee.id] = {
      responsibility,
      speed,
      accuracy,
      overall,
      promotionProbability,
      shapValues: {
        responsibility: generateShapValue(responsibility),
        speed: generateShapValue(speed),
        accuracy: generateShapValue(accuracy),
        overall: generateShapValue(overall),
      },
      monthlyTrends: generateRandomTrend(overall),
    }
  })
  return data
}

const individualEvaluationData = generateIndividualData()

const generateChatResponses = (employeeId: number, criterion: string) => {
  const responses = {
    responsibility: [
      {
        question: "最近のプロジェクトで、期限に間に合わせるために何か工夫したことはありますか？",
        answer:
          "毎日進捗を確認し、問題が発生した際は即座にチームに報告して対策を立てました。また、余裕を持ったスケジュールを組むよう心がけています。",
        impact: "高い責任感を示す回答",
        score_contribution: "+2.1",
      },
      {
        question: "チームメンバーが困っている時、どのようにサポートしますか？",
        answer: "積極的に声をかけて、自分の経験や知識を共有します。必要に応じて作業を分担することも提案します。",
        impact: "協調性と責任感のバランスが良い",
        score_contribution: "+1.8",
      },
    ],
    speed: [
      {
        question: "効率的に作業を進めるために、どのような工夫をしていますか？",
        answer:
          "タスクの優先順位を明確にし、集中できる時間帯に重要な作業を行います。また、定期的に作業方法を見直しています。",
        impact: "計画性があり効率的",
        score_contribution: "+1.5",
      },
      {
        question: "急な依頼が来た時の対応方法を教えてください。",
        answer:
          "現在の作業との優先度を比較し、必要に応じて上司に相談します。可能な限り迅速に対応するよう努めています。",
        impact: "適切な判断力を示している",
        score_contribution: "+1.2",
      },
    ],
    accuracy: [
      {
        question: "ミスを防ぐために、どのような対策を取っていますか？",
        answer:
          "作業完了後は必ずダブルチェックを行い、重要な書類は同僚にも確認してもらいます。チェックリストも活用しています。",
        impact: "非常に高い品質意識",
        score_contribution: "+2.8",
      },
      {
        question: "過去にミスをした経験から学んだことはありますか？",
        answer: "詳細な確認を怠ったことでミスが発生したため、今では段階的な確認プロセスを導入しています。",
        impact: "学習能力と改善意識が高い",
        score_contribution: "+2.0",
      },
    ],
    overall: [
      {
        question: "今後のキャリア目標について教えてください。",
        answer:
          "チームリーダーとして、メンバーの成長をサポートしながら、部署全体の成果向上に貢献したいと考えています。",
        impact: "リーダーシップ志向が強い",
        score_contribution: "+1.7",
      },
      {
        question: "仕事で最も大切にしていることは何ですか？",
        answer: "お客様の満足度を最優先に考え、チーム一丸となって質の高いサービスを提供することです。",
        impact: "顧客志向と協調性のバランスが良い",
        score_contribution: "+1.9",
      },
    ],
  }

  return responses[criterion as keyof typeof responses] || []
}

export function ReportsDashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(employees[0].id)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCriterion, setSelectedCriterion] = useState<string | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const filteredEmployees = employees.filter((emp) => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const currentData = selectedEmployee ? individualEvaluationData[selectedEmployee] : null
  const selectedEmployeeInfo = selectedEmployee ? employees.find((emp) => emp.id === selectedEmployee) : null

  const displayData = currentData
    ? {
        responsibility: currentData.responsibility,
        speed: currentData.speed,
        accuracy: currentData.accuracy,
        overall: currentData.overall,
        radarData: [
          { skill: "責任感", average: currentData.responsibility, max: 10 },
          { skill: "仕事の早さ", average: currentData.speed, max: 10 },
          { skill: "正確性", average: currentData.accuracy, max: 10 },
          { skill: "総合評価", average: currentData.overall, max: 10 },
        ],
        monthlyTrends: currentData.monthlyTrends,
        promotionProbability: currentData.promotionProbability,
        shapValues: currentData.shapValues,
      }
    : {
        responsibility: 8.1,
        speed: 7.5,
        accuracy: 8.6,
        overall: 8.0,
        radarData: radarData,
        monthlyTrends: evaluationTrends,
        promotionProbability: 80,
        shapValues: { responsibility: 2.1, speed: 1.2, accuracy: 2.8, overall: 1.7 },
      }

  const handleCardClick = (criterion: string) => {
    setSelectedCriterion(criterion)
    setShowDetailDialog(true)
  }

  const getCriterionDetails = (criterion: string) => {
    const details = {
      responsibility: { title: "責任感", icon: Star, description: "タスクへの責任感と信頼性" },
      speed: { title: "仕事の早さ", icon: TrendingUp, description: "作業効率と時間管理能力" },
      accuracy: { title: "正確性", icon: CheckCircle, description: "品質管理と注意深さ" },
      overall: { title: "総合評価", icon: Users, description: "全体的なパフォーマンス評価" },
    }
    return details[criterion as keyof typeof details]
  }

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
                <h1 className="text-3xl font-bold text-foreground tracking-tight">評価分析</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedEmployeeInfo
                    ? `${selectedEmployeeInfo.name}（${selectedEmployeeInfo.department}）の個別分析`
                    : "全体分析とインサイト"}
                </p>
              </div>
            </div>
            {selectedEmployeeInfo && (
              <div className="ml-13 flex items-center gap-2">
                <div className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                  個別分析モード
                </div>
                <div className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  {selectedEmployeeInfo.department}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Employee Selection Group */}
            <div className="flex items-center gap-2 p-3 bg-card/50 rounded-lg border border-border/50">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">従業員選択</div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="従業員名で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48 h-9"
                  />
                </div>
                <Select
                  value={selectedEmployee?.toString() || employees[0].id.toString()}
                  onValueChange={(value) => setSelectedEmployee(value ? Number.parseInt(value) : employees[0].id)}
                >
                  <SelectTrigger className="w-48 h-9">
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="従業員を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.name} ({employee.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Controls Group */}
            <div className="flex items-center gap-2">
              <Select defaultValue="2024-q4">
                <SelectTrigger className="w-40 h-9">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-q4">2024年 Q4</SelectItem>
                  <SelectItem value="2024-q3">2024年 Q3</SelectItem>
                  <SelectItem value="2024-q2">2024年 Q2</SelectItem>
                  <SelectItem value="2024-q1">2024年 Q1</SelectItem>
                </SelectContent>
              </Select>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("responsibility")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">責任感</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayData.responsibility}
                <span className="text-sm text-muted-foreground">/10</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent font-medium">+0.4</span> 前四半期比
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("speed")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">仕事の早さ</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayData.speed}
                <span className="text-sm text-muted-foreground">/10</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent font-medium">+0.2</span> 前四半期比
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("accuracy")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">正確性</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayData.accuracy}
                <span className="text-sm text-muted-foreground">/10</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent font-medium">+0.3</span> 前四半期比
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("overall")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総合評価</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayData.overall}
                <span className="text-sm text-muted-foreground">/10</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent font-medium">+0.3</span> 前四半期比
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="criteria">評価項目別</TabsTrigger>
            <TabsTrigger value="promotion">昇進可能性</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>スキル総合分析</CardTitle>
                  <CardDescription>
                    {selectedEmployeeInfo
                      ? `${selectedEmployeeInfo.name}の評価項目スコア`
                      : "4つの評価項目の平均スコア"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={displayData.radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} />
                      <Radar
                        name={selectedEmployeeInfo ? "個人スコア" : "平均スコア"}
                        dataKey="average"
                        stroke="#15803d"
                        fill="#84cc16"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="criteria" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>評価項目別トレンド</CardTitle>
                  <CardDescription>
                    {selectedEmployeeInfo ? `${selectedEmployeeInfo.name}の月次推移` : "4つの評価項目の月次推移"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={displayData.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[3, 10]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="responsibility" stroke="#15803d" strokeWidth={2} name="責任感" />
                      <Line type="monotone" dataKey="speed" stroke="#84cc16" strokeWidth={2} name="仕事の早さ" />
                      <Line type="monotone" dataKey="accuracy" stroke="#f97316" strokeWidth={2} name="正確性" />
                      <Line type="monotone" dataKey="overall" stroke="#dc2626" strokeWidth={2} name="総合評価" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>評価項目別スコア</CardTitle>
                  <CardDescription>
                    {selectedEmployeeInfo
                      ? `${selectedEmployeeInfo.name}の各項目スコア`
                      : "各項目の全社平均（10段階評価）"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {displayData.radarData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.skill}</span>
                          <span className="text-sm text-muted-foreground">{item.average}/10</span>
                        </div>
                        <Progress value={(item.average / 10) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="promotion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>昇進可能性分析（SHAP値）</CardTitle>
                <CardDescription>
                  {selectedEmployeeInfo
                    ? `${selectedEmployeeInfo.name}の各評価項目が昇進可能性${displayData.promotionProbability}%にどう寄与しているか`
                    : `各評価項目が昇進可能性${displayData.promotionProbability}%にどう寄与しているか`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-accent">{displayData.promotionProbability}%</div>
                    <div className="text-sm text-muted-foreground">昇進可能性</div>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(displayData.shapValues).map(([key, value], index) => {
                      const labels = {
                        responsibility: "責任感",
                        speed: "仕事の早さ",
                        accuracy: "正確性",
                        overall: "総合評価",
                      }
                      const isNegative = value < 0
                      return (
                        <div key={index} className="flex items-center">
                          <div className="w-20 text-sm text-right pr-4">{labels[key as keyof typeof labels]}</div>
                          <div className="flex-1 relative">
                            <div className="h-8 bg-muted rounded flex items-center relative">
                              <div className="absolute left-1/2 w-px h-full bg-border"></div>
                              <div
                                className={`h-6 bg-gradient-to-r ${isNegative ? "from-red-400 to-blue-500" : "from-blue-400 to-red-500"} rounded`}
                                style={{
                                  width: `${Math.abs(value / 3) * 100}%`,
                                  marginLeft: isNegative ? `${50 - Math.abs(value / 3) * 100}%` : "50%",
                                }}
                              ></div>
                              <span className={`absolute ${isNegative ? "left-2" : "right-2"} text-xs text-foreground`}>
                                {isNegative ? value : `+${value}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-4 px-24">
                    <span>-3</span>
                    <span>-2</span>
                    <span>-1</span>
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                  <div className="text-center text-xs text-muted-foreground">SHAP値（モデル出力への影響）</div>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                      <span className="text-xs">低スコア</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-2 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
                      <span className="text-xs">高スコア</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detailed Score Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedCriterion && getCriterionDetails(selectedCriterion) && (
                  <>
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      {React.createElement(getCriterionDetails(selectedCriterion)!.icon, {
                        className: "h-5 w-5 text-accent",
                      })}
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold">
                        {getCriterionDetails(selectedCriterion)!.title}の詳細分析
                      </DialogTitle>
                      <DialogDescription className="text-sm text-muted-foreground">
                        {selectedEmployeeInfo?.name}の{getCriterionDetails(selectedCriterion)!.description}
                        に関する評価根拠
                      </DialogDescription>
                    </div>
                  </>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowDetailDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedCriterion && selectedEmployee && (
            <div className="space-y-6">
              {/* Score Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">評価サマリー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-accent">
                        {displayData[selectedCriterion as keyof typeof displayData] as number}/10
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getCriterionDetails(selectedCriterion)!.title}スコア
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {(displayData[selectedCriterion as keyof typeof displayData] as number) >= 8
                          ? "優秀"
                          : (displayData[selectedCriterion as keyof typeof displayData] as number) >= 6
                            ? "良好"
                            : "改善必要"}
                      </Badge>
                      <div className="text-xs text-muted-foreground">全社平均: 7.2/10</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Responses Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    ヒアリング内容と評価根拠
                  </CardTitle>
                  <CardDescription>
                    チャット評価での回答内容がどのようにスコアに反映されたかを表示しています
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generateChatResponses(selectedEmployee, selectedCriterion).map((response, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-accent">質問 {index + 1}</div>
                          <div className="text-sm bg-muted p-3 rounded">{response.question}</div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">回答</div>
                          <div className="text-sm p-3 border-l-4 border-accent bg-accent/5">{response.answer}</div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="space-y-1">
                            <div className="text-xs font-medium">AI分析結果</div>
                            <div className="text-xs text-muted-foreground">{response.impact}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={response.score_contribution.startsWith("+") ? "default" : "destructive"}>
                              スコア寄与: {response.score_contribution}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                    <div className="text-sm font-medium mb-2">スコア算出方法</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• 各回答をAIが分析し、キーワードと文脈から評価ポイントを抽出</div>
                      <div>• 積極性、具体性、実践性などの観点から寄与度を算出</div>
                      <div>• 複数の回答から総合的にスコアを決定（基準値7.0 + 寄与度の合計）</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
