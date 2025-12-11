import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  questionType?: "rating" | "text" | "multiple-choice" | "scale-rating"
  options?: string[]
}

const evaluationQuestions = [
  {
    question: "評価対象者の部署を教えてください。",
    type: "multiple-choice",
    options: ["営業部", "開発部", "マーケティング部", "人事部", "財務部", "その他"],
  },
  {
    question: "責任感について10段階で評価してください。（1: 非常に低い ～ 10: 非常に高い）",
    type: "scale-rating",
    scale: 10,
    key: "responsibility",
  },
  {
    question: "仕事の早さについて10段階で評価してください。（1: 非常に遅い ～ 10: 非常に早い）",
    type: "scale-rating",
    scale: 10,
    key: "speed",
  },
  {
    question: "正確性について10段階で評価してください。（1: 非常に低い ～ 10: 非常に高い）",
    type: "scale-rating",
    scale: 10,
    key: "accuracy",
  },
  {
    question: "総合評価について10段階で評価してください。（1: 非常に低い ～ 10: 非常に高い）",
    type: "scale-rating",
    scale: 10,
    key: "overall",
  },
  {
    question: "今期の具体的な成果や改善点について詳しく教えてください。",
    type: "text",
    key: "achievements",
  },
  {
    question: "来期に向けての目標設定や期待について記載してください。",
    type: "text",
    key: "goals",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, currentQuestion, evaluationData } = body

    console.log("[v0] Chat API called with:", { message, currentQuestion, evaluationData })

    if (currentQuestion < evaluationQuestions.length) {
      const nextQuestion = evaluationQuestions[currentQuestion]

      const response = {
        success: true,
        data: {
          question: nextQuestion.question,
          type: nextQuestion.type,
          options: nextQuestion.options,
          scale: nextQuestion.scale,
          questionIndex: currentQuestion,
        },
      }

      console.log("[v0] Returning next question:", response)
      return NextResponse.json(response)
    } else {
      // Evaluation completed - save to database
      console.log("[v0] Evaluation completed, saving data:", evaluationData)

      // Here you would save the evaluation data to the database
      // For now, we'll just return a completion message

      return NextResponse.json({
        success: true,
        data: {
          completed: true,
          message: `評価アンケートが完了しました。ご協力ありがとうございました。

評価結果サマリー:
• 責任感: ${evaluationData.responsibility || "N/A"}/10
• 仕事の早さ: ${evaluationData.speed || "N/A"}/10
• 正確性: ${evaluationData.accuracy || "N/A"}/10
• 総合評価: ${evaluationData.overall || "N/A"}/10

詳細な結果はレポート画面で確認できます。`,
          evaluationData,
        },
      })
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ success: false, error: "Failed to process chat message" }, { status: 500 })
  }
}
