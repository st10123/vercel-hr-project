"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Bot, User, Clock, CheckCircle, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  questionType?: "rating" | "text" | "multiple-choice" | "scale-rating"
  options?: string[]
  isCompleted?: boolean
  scale?: number
}

const evaluationTemplates = {
  standard: {
    name: "標準評価テンプレート",
    description: "一般的な従業員評価用",
    questions: [
      {
        question: "こんにちは！人事評価のためのヒアリングを開始します。まず、評価対象者のお名前を教えてください。",
        type: "text",
        key: "employee_name",
      },
      {
        question: "評価対象者の部署を教えてください。",
        type: "multiple-choice",
        options: ["営業部", "開発部", "マーケティング部", "人事部", "財務部", "その他"],
        key: "department",
      },
      {
        question: "評価対象者の現在の役職や担当業務について詳しく教えてください。",
        type: "text",
        key: "role_description",
      },
      {
        question:
          "この評価期間中に、評価対象者が担当した主要なプロジェクトや業務について教えてください。具体的な内容や規模も含めて説明してください。",
        type: "text",
        key: "main_projects",
      },
      {
        question:
          "評価対象者の責任感について具体的なエピソードがあれば教えてください。例：締切を守る姿勢、問題発生時の対応、チームへの貢献など。",
        type: "text",
        key: "responsibility_examples",
      },
      {
        question:
          "評価対象者の仕事の進め方やスピードについて教えてください。例：タスクの処理速度、効率性、時間管理能力など。",
        type: "text",
        key: "work_speed_examples",
      },
      {
        question:
          "評価対象者の仕事の正確性について教えてください。例：ミスの頻度、品質管理への取り組み、確認作業の丁寧さなど。",
        type: "text",
        key: "accuracy_examples",
      },
      {
        question:
          "評価対象者のコミュニケーション能力や協調性について教えてください。チームワークや他部署との連携はいかがでしたか？",
        type: "text",
        key: "communication_teamwork",
      },
      {
        question: "評価対象者の成長や改善が見られた点があれば教えてください。",
        type: "text",
        key: "improvements",
      },
      {
        question: "評価対象者に今後改善してほしい点や課題があれば教えてください。",
        type: "text",
        key: "areas_for_improvement",
      },
      {
        question: "その他、評価対象者について特記すべき点や印象に残ったエピソードがあれば教えてください。",
        type: "text",
        key: "additional_comments",
      },
    ],
  },
  leadership: {
    name: "リーダーシップ評価テンプレート",
    description: "管理職・リーダー向け評価用",
    questions: [
      {
        question:
          "こんにちは！リーダーシップ評価のためのヒアリングを開始します。まず、評価対象者のお名前と役職を教えてください。",
        type: "text",
        key: "employee_name_position",
      },
      {
        question: "評価対象者の部署と管理している人数を教えてください。",
        type: "text",
        key: "department_team_size",
      },
      {
        question: "評価対象者のリーダーシップスタイルについて教えてください。チームをどのように導いていますか？",
        type: "text",
        key: "leadership_style",
      },
      {
        question: "チームの目標達成に向けて、どのような取り組みを行いましたか？具体的な成果も含めて教えてください。",
        type: "text",
        key: "team_achievements",
      },
      {
        question: "部下の育成やメンタリングについて、具体的な取り組みがあれば教えてください。",
        type: "text",
        key: "mentoring_examples",
      },
      {
        question: "困難な状況や問題が発生した際の対応について教えてください。",
        type: "text",
        key: "crisis_management",
      },
      {
        question: "他部署との連携や組織全体への貢献について教えてください。",
        type: "text",
        key: "cross_department_collaboration",
      },
      {
        question: "戦略的思考や長期的な視点での取り組みがあれば教えてください。",
        type: "text",
        key: "strategic_thinking",
      },
    ],
  },
  technical: {
    name: "技術職評価テンプレート",
    description: "エンジニア・技術職向け評価用",
    questions: [
      {
        question:
          "こんにちは！技術職評価のためのヒアリングを開始します。まず、評価対象者のお名前と担当技術領域を教えてください。",
        type: "text",
        key: "employee_name_tech",
      },
      {
        question: "評価対象者の技術領域と専門分野を教えてください。",
        type: "text",
        key: "technical_domain",
      },
      {
        question: "この期間中に取り組んだ主要な技術プロジェクトについて教えてください。",
        type: "text",
        key: "technical_projects",
      },
      {
        question: "新しい技術の習得や技術力向上への取り組みについて教えてください。",
        type: "text",
        key: "skill_development",
      },
      {
        question: "コードの品質や技術的な正確性について教えてください。",
        type: "text",
        key: "code_quality",
      },
      {
        question: "技術的な問題解決能力について具体例があれば教えてください。",
        type: "text",
        key: "problem_solving",
      },
      {
        question: "チーム内での技術共有や知識の伝達について教えてください。",
        type: "text",
        key: "knowledge_sharing",
      },
      {
        question: "技術的な革新や改善提案があれば教えてください。",
        type: "text",
        key: "technical_innovation",
      },
    ],
  },
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [evaluationData, setEvaluationData] = useState<{ [key: string]: any }>({})
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof evaluationTemplates>("standard")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const evaluationQuestions = evaluationTemplates[selectedTemplate].questions

  useEffect(() => {
    const initializeChat = () => {
      const firstQuestion = evaluationQuestions[0]
      const initialMessage: Message = {
        id: "initial",
        type: "bot",
        content: firstQuestion.question,
        timestamp: new Date(),
        questionType: firstQuestion.type as any,
        options: firstQuestion.options,
      }
      setMessages([initialMessage])
      setCurrentQuestion(1)
    }

    initializeChat()
  }, [selectedTemplate])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const analyzeResponsesAndGenerateScores = (responses: { [key: string]: any }) => {
    // Simple AI-like scoring based on keywords and response length
    const analyzeResponsibility = (text: string) => {
      const positiveKeywords = ["責任", "締切", "完了", "達成", "貢献", "積極的", "自主的", "信頼"]
      const negativeKeywords = ["遅れ", "忘れ", "ミス", "問題", "不注意"]

      let score = 5 // Base score
      positiveKeywords.forEach((keyword) => {
        if (text.includes(keyword)) score += 0.8
      })
      negativeKeywords.forEach((keyword) => {
        if (text.includes(keyword)) score -= 0.5
      })

      if (text.length > 100) score += 0.5 // Detailed response bonus
      return Math.min(Math.max(Math.round(score), 1), 10)
    }

    const analyzeSpeed = (text: string) => {
      const positiveKeywords = ["早い", "迅速", "効率", "スピード", "素早く", "短時間", "効率的"]
      const negativeKeywords = ["遅い", "時間がかかる", "効率が悪い", "スローペース"]

      let score = 5
      positiveKeywords.forEach((keyword) => {
        if (text.includes(keyword)) score += 0.8
      })
      negativeKeywords.forEach((keyword) => {
        if (text.includes(keyword)) score -= 0.5
      })

      if (text.length > 100) score += 0.5
      return Math.min(Math.max(Math.round(score), 1), 10)
    }

    const analyzeAccuracy = (text: string) => {
      const positiveKeywords = ["正確", "丁寧", "確認", "品質", "チェック", "精密", "間違いない"]
      const negativeKeywords = ["ミス", "間違い", "不正確", "雑", "確認不足"]

      let score = 5
      positiveKeywords.forEach((keyword) => {
        if (text.includes(keyword)) score += 0.8
      })
      negativeKeywords.forEach((keyword) => {
        if (text.includes(keyword)) score -= 0.5
      })

      if (text.length > 100) score += 0.5
      return Math.min(Math.max(Math.round(score), 1), 10)
    }

    const responsibilityScore = analyzeResponsibility(responses.responsibility_examples || "")
    const speedScore = analyzeSpeed(responses.work_speed_examples || "")
    const accuracyScore = analyzeAccuracy(responses.accuracy_examples || "")
    const overallScore = Math.round((responsibilityScore + speedScore + accuracyScore) / 3)

    return {
      responsibility: responsibilityScore,
      speed: speedScore,
      accuracy: accuracyScore,
      overall: overallScore,
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    if (currentQuestion > 0 && currentQuestion <= evaluationQuestions.length) {
      const currentQ = evaluationQuestions[currentQuestion - 1]
      if (currentQ.key) {
        setEvaluationData((prev) => ({
          ...prev,
          [currentQ.key]: inputValue,
        }))
      }
    }

    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)

      if (currentQuestion < evaluationQuestions.length) {
        const nextQuestion = evaluationQuestions[currentQuestion]
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: nextQuestion.question,
          timestamp: new Date(),
          questionType: nextQuestion.type as any,
          options: nextQuestion.options,
          scale: nextQuestion.scale,
        }

        setMessages((prev) => [...prev, botMessage])
        setCurrentQuestion((prev) => prev + 1)
      } else {
        const aiScores = analyzeResponsesAndGenerateScores(evaluationData)

        const summary = `ヒアリングが完了しました。ご協力ありがとうございました。

AIによる分析結果:
• 責任感: ${aiScores.responsibility}/10
• 仕事の早さ: ${aiScores.speed}/10
• 正確性: ${aiScores.accuracy}/10
• 総合評価: ${aiScores.overall}/10

※この評価は、ヒアリング内容をAIが分析して算出した参考値です。
詳細な結果とヒアリング内容はレポート画面で確認できます。`

        const completionMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: summary,
          timestamp: new Date(),
          isCompleted: true,
        }
        setMessages((prev) => [...prev, completionMessage])

        // Store AI scores for reports
        setEvaluationData((prev) => ({
          ...prev,
          ai_scores: aiScores,
        }))
      }
    }, 1500)
  }

  const handleQuickResponse = (option: string) => {
    setInputValue(option)
  }

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey as keyof typeof evaluationTemplates)
    setCurrentQuestion(0)
    setEvaluationData({})
    setInputValue("")
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">人事評価チャットボット</h1>
            <p className="text-sm text-muted-foreground">従業員評価のためのヒアリングシステム</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="評価テンプレートを選択" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(evaluationTemplates).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-muted-foreground">{template.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">評価期間: 2024年度 第4四半期</div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6">
        <Card className="h-full flex flex-col">
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">HR評価アシスタント</h3>
                  <p className="text-xs text-muted-foreground">
                    {evaluationTemplates[selectedTemplate].name} | オンライン
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                進捗: {Math.min(currentQuestion, evaluationQuestions.length)}/{evaluationQuestions.length}
              </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.type === "user" ? "justify-end" : "justify-start")}
                >
                  {message.type === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-card border border-border",
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString("ja-JP", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.isCompleted && <CheckCircle className="h-3 w-3 text-accent ml-1" />}
                    </div>

                    {message.options && message.type === "bot" && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left h-auto p-2 text-xs bg-transparent"
                            onClick={() => handleQuickResponse(option)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="回答を入力してください..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="px-3">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
