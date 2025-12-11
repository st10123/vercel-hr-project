"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, FileText, Edit, Copy, Trash2, Star, Save, X } from "lucide-react"

const mockTemplates = [
  {
    id: 1,
    name: "標準評価テンプレート",
    description: "4項目の基本評価（責任感、仕事の早さ、正確性、総合評価）",
    questions: [
      "担当している業務に対してどの程度責任を持って取り組んでいますか？",
      "期限内に業務を完了する能力はどの程度ですか？",
      "業務の正確性やミスの少なさはどの程度ですか？",
      "チームワークやコミュニケーション能力はいかがですか？",
      "新しい課題に対する取り組み姿勢はどうですか？",
      "業務改善や効率化への貢献度はいかがですか？",
      "全体的な業務パフォーマンスをどう評価しますか？",
    ],
    isDefault: true,
    lastUsed: "2024-01-15",
    usageCount: 45,
  },
  {
    id: 2,
    name: "管理職評価テンプレート",
    description: "リーダーシップとマネジメント能力を重視した評価",
    questions: [
      "チームメンバーへの指導力はどの程度ですか？",
      "部下のモチベーション向上にどの程度貢献していますか？",
      "意思決定の迅速さと適切さはいかがですか？",
      "組織目標の達成に向けた取り組みはどうですか？",
      "部門間の調整能力はどの程度ですか？",
      "人材育成への取り組み姿勢はいかがですか？",
      "戦略的思考力はどの程度ですか？",
      "危機管理能力はいかがですか？",
      "業務プロセスの改善提案はどの程度ありますか？",
      "全体的なリーダーシップをどう評価しますか？",
    ],
    isDefault: false,
    lastUsed: "2024-01-10",
    usageCount: 12,
  },
  {
    id: 3,
    name: "新入社員評価テンプレート",
    description: "新入社員向けの基礎的な評価項目",
    questions: [
      "基本的な業務スキルの習得状況はいかがですか？",
      "指示に対する理解力と実行力はどの程度ですか？",
      "学習意欲と成長への取り組み姿勢はどうですか？",
      "職場でのコミュニケーション能力はいかがですか？",
      "今後の成長可能性をどう評価しますか？",
    ],
    isDefault: false,
    lastUsed: "2024-01-08",
    usageCount: 8,
  },
]

export function EvaluationTemplates() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<(typeof mockTemplates)[0] | null>(null)
  const [editedQuestions, setEditedQuestions] = useState<string[]>([])

  const handleEditTemplate = (template: (typeof mockTemplates)[0]) => {
    setEditingTemplate(template)
    setEditedQuestions([...template.questions])
    setIsEditDialogOpen(true)
  }

  const handleSaveQuestions = () => {
    if (editingTemplate) {
      setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? { ...t, questions: editedQuestions } : t)))
      setIsEditDialogOpen(false)
      setEditingTemplate(null)
      setEditedQuestions([])
    }
  }

  const addQuestion = () => {
    setEditedQuestions((prev) => [...prev, ""])
  }

  const removeQuestion = (index: number) => {
    setEditedQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, text: string) => {
    setEditedQuestions((prev) => prev.map((q, i) => (i === index ? text : q)))
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">評価テンプレート</h1>
            <p className="text-sm text-muted-foreground">評価質問のテンプレート管理</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                テンプレート作成
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>新しい評価テンプレートを作成</DialogTitle>
                <DialogDescription>評価テンプレートの基本情報を入力してください。</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">テンプレート名</Label>
                  <Input id="template-name" placeholder="例: 営業部専用評価テンプレート" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">説明</Label>
                  <Textarea id="template-description" placeholder="このテンプレートの用途や特徴を説明してください" />
                </div>
                <div className="space-y-2">
                  <Label>評価項目</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input placeholder="評価項目名（例: コミュニケーション能力）" />
                      <Button variant="outline" size="sm">
                        削除
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="評価項目名（例: 問題解決能力）" />
                      <Button variant="outline" size="sm">
                        削除
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      項目追加
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>作成</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総テンプレート数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">デフォルトテンプレート</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.filter((t) => t.isDefault).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今月の使用回数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.reduce((sum, t) => sum + t.usageCount, 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Templates List */}
        <Card>
          <CardHeader>
            <CardTitle>テンプレート一覧</CardTitle>
            <CardDescription>評価テンプレートの管理と編集</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{template.name}</div>
                        {template.isDefault && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            デフォルト
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        質問数: {template.questions.length} | 使用回数: {template.usageCount} | 最終使用:{" "}
                        {template.lastUsed}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>テンプレート編集: {editingTemplate?.name}</DialogTitle>
            <DialogDescription>質問内容を編集してください。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>評価質問一覧</Label>
              {editedQuestions.map((question, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm text-muted-foreground">質問 {index + 1}</Label>
                    <Textarea
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      placeholder="質問内容を入力してください"
                      className="min-h-[60px]"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => removeQuestion(index)} className="mt-6">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addQuestion} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                質問を追加
              </Button>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSaveQuestions}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
