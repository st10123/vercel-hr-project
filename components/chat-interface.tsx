"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Clock, CheckCircle, Upload } from "lucide-react"
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

const estimationTemplates = {
  vehicle: {
    name: "車・バイク見積もりテンプレート",
    description: "車やバイクの見積額を算出",
    questions: [
      {
        question:
          "こんにちは！車・バイクの見積もりサービスへようこそ。まず、見積もりの対象となる車両の種類を教えてください。",
        type: "multiple-choice",
        options: ["軽自動車", "普通自動車", "バイク", "その他"],
        key: "vehicle_type",
      },
      {
        question: "車両の製造メーカーと車種を教えてください。",
        type: "text",
        key: "make_model",
      },
      {
        question: "製造年（年式）を教えてください。",
        type: "text",
        key: "year",
      },
      {
        question: "現在の走行距離を教えてください。",
        type: "text",
        key: "mileage",
      },
      {
        question: "車両の状態について教えてください。（例：良好、標準的、経年劣化がある、修復歴あり等）",
        type: "text",
        key: "condition",
      },
      {
        question: "内装や外装に傷やへこみなどがあれば詳しく教えてください。",
        type: "text",
        key: "damage_details",
      },
      {
        question: "エンジンやその他機械的な問題や異常音があれば教えてください。",
        type: "text",
        key: "mechanical_issues",
      },
      {
        question: "その他、見積もりの際に考慮してほしい特記事項があれば教えてください。",
        type: "text",
        key: "additional_notes",
      },
    ],
  },
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [estimationData, setEstimationData] = useState<{ [key: string]: any }>({})
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof estimationTemplates>("vehicle")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const estimationQuestions = estimationTemplates[selectedTemplate].questions

  useEffect(() => {
    const initializeChat = () => {
      const initialMessage: Message = {
        id: "initial",
        type: "bot",
        content:
          "お待たせしました！まず、見積もりの対象となる車両の写真をアップロードしていただけますか？外観がよくわかる角度からの写真をお願いします。",
        timestamp: new Date(),
        questionType: "text",
      }
      setMessages([initialMessage])
    }

    initializeChat()
  }, [selectedTemplate])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const calculateEstimate = (data: { [key: string]: any }) => {
    let basePrice = 1000000 // 基本価格

    // 車種による価格調整
    const vehicleTypeMultipliers: { [key: string]: number } = {
      軽自動車: 0.8,
      普通自動車: 1.0,
      バイク: 0.4,
      その他: 0.9,
    }
    basePrice *= vehicleTypeMultipliers[data.vehicle_type] || 1.0

    // 年式による減価
    const yearMatch = data.year?.match(/(\d{4})/)
    if (yearMatch) {
      const year = Number.parseInt(yearMatch[1])
      const age = new Date().getFullYear() - year
      const depreciationRate = Math.max(0.3, 1 - age * 0.08)
      basePrice *= depreciationRate
    }

    // 走行距離による調整
    const mileageMatch = data.mileage?.match(/(\d+)/)
    if (mileageMatch) {
      const mileage = Number.parseInt(mileageMatch[1])
      const mileageDeduction = Math.min(mileage / 1000, 300) * 1000 // 最大30万円減
      basePrice -= mileageDeduction
    }

    // 状態による調整
    const conditionMultipliers: { [key: string]: number } = {
      良好: 1.15,
      標準的: 1.0,
      経年劣化: 0.85,
      修復歴: 0.7,
    }
    for (const [condition, multiplier] of Object.entries(conditionMultipliers)) {
      if (data.condition?.includes(condition)) {
        basePrice *= multiplier
        break
      }
    }

    // ダメージによる減額
    const damageDeduction = data.damage_details && data.damage_details.length > 30 ? 100000 : 0

    // 機械的問題による減額
    const mechanicalDeduction = data.mechanical_issues && data.mechanical_issues.length > 20 ? 150000 : 0

    const finalPrice = Math.max(basePrice - damageDeduction - mechanicalDeduction, 10000)

    return {
      basePrice: Math.round(basePrice / 100) * 100,
      vehicleTypeAdjustment:
        Math.round((basePrice * (vehicleTypeMultipliers[data.vehicle_type] || 1.0) - basePrice) / 100) * 100,
      depreciation: yearMatch
        ? -Math.round(
            (basePrice *
              (1 - (Math.max(0.3, 1 - (new Date().getFullYear() - Number.parseInt(yearMatch[1])) * 0.08) || 1.0))) /
              100,
          ) * 100
        : 0,
      mileageDeduction: mileageMatch ? -Math.min(Number.parseInt(mileageMatch[1]) / 1000, 300) * 1000 : 0,
      damageDeduction: -damageDeduction,
      mechanicalDeduction: -mechanicalDeduction,
      finalPrice: Math.round(finalPrice / 100) * 100,
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

    if (currentQuestion > 0 && currentQuestion <= estimationQuestions.length) {
      const currentQ = estimationQuestions[currentQuestion - 1]
      if (currentQ.key) {
        setEstimationData((prev) => ({
          ...prev,
          [currentQ.key]: inputValue,
        }))
      }
    }

    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)

      if (currentQuestion < estimationQuestions.length) {
        const nextQuestion = estimationQuestions[currentQuestion]
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: nextQuestion.question,
          timestamp: new Date(),
          questionType: nextQuestion.type as any,
          options: nextQuestion.options,
        }

        setMessages((prev) => [...prev, botMessage])
        setCurrentQuestion((prev) => prev + 1)
      } else {
        const estimate = calculateEstimate(estimationData)

        const summary = `ヒアリングが完了しました。ご協力ありがとうございました。

見積額: ${estimate.finalPrice.toLocaleString()}円

※詳細な見積内訳は分析画面で確認できます。`

        const completionMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: summary,
          timestamp: new Date(),
          isCompleted: true,
        }
        setMessages((prev) => [...prev, completionMessage])

        setEstimationData((prev) => ({
          ...prev,
          estimate,
        }))
      }
    }, 1500)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target?.result as string
        setUploadedImage(imageData)

        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "[写真をアップロードしました]",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])

        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "bot",
            content: estimationQuestions[0].question,
            timestamp: new Date(),
            questionType: "multiple-choice",
            options: estimationQuestions[0].options,
          }
          setMessages((prev) => [...prev, botMessage])
          setCurrentQuestion(1)
        }, 1500)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleQuickResponse = (option: string) => {
    setInputValue(option)
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">車・バイク見積もりチャットボット</h1>
            <p className="text-sm text-muted-foreground">
              写真アップロードと情報入力で、あなたの車・バイクの査定額を算出します
            </p>
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
                  <h3 className="font-medium text-foreground">見積もりアシスタント</h3>
                  <p className="text-xs text-muted-foreground">オンライン</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                進捗: {currentQuestion}/{estimationQuestions.length}
              </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {uploadedImage && (
                <div className="flex justify-center mb-4">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded vehicle"
                    className="max-w-xs max-h-xs rounded-lg border border-border"
                  />
                </div>
              )}

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

          <div className="p-4 border-t border-border space-y-3">
            {currentQuestion === 0 && !uploadedImage && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  写真をアップロード
                </Button>
              </div>
            )}

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
