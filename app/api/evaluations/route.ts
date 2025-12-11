import { type NextRequest, NextResponse } from "next/server"

// Mock database functions (replace with actual database calls)
const mockEvaluations = [
  {
    id: 1,
    employee_name: "田中太郎",
    department: "営業部",
    responsibility_score: 8,
    speed_score: 7,
    accuracy_score: 8,
    overall_score: 8,
    status: "completed",
    created_at: "2024-01-15",
  },
  {
    id: 2,
    employee_name: "佐藤花子",
    department: "開発部",
    responsibility_score: 9,
    speed_score: 8,
    accuracy_score: 9,
    overall_score: 9,
    status: "completed",
    created_at: "2024-01-14",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const status = searchParams.get("status")

    let filteredEvaluations = mockEvaluations

    if (department) {
      filteredEvaluations = filteredEvaluations.filter((e) => e.department === department)
    }

    if (status) {
      filteredEvaluations = filteredEvaluations.filter((e) => e.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredEvaluations,
      total: filteredEvaluations.length,
    })
  } catch (error) {
    console.error("Error fetching evaluations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch evaluations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employee_name,
      department,
      evaluator_name,
      responsibility_score,
      speed_score,
      accuracy_score,
      overall_score,
      achievements,
      goals,
    } = body

    // Validate required fields
    if (!employee_name || !department || !responsibility_score || !speed_score || !accuracy_score || !overall_score) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate score ranges
    const scores = [responsibility_score, speed_score, accuracy_score, overall_score]
    if (scores.some((score) => score < 1 || score > 10)) {
      return NextResponse.json({ success: false, error: "Scores must be between 1 and 10" }, { status: 400 })
    }

    // Mock database insert (replace with actual database call)
    const newEvaluation = {
      id: Date.now(),
      employee_name,
      department,
      evaluator_name,
      responsibility_score,
      speed_score,
      accuracy_score,
      overall_score,
      achievements,
      goals,
      status: "completed",
      created_at: new Date().toISOString(),
    }

    console.log("[v0] New evaluation created:", newEvaluation)

    return NextResponse.json({
      success: true,
      data: newEvaluation,
      message: "Evaluation created successfully",
    })
  } catch (error) {
    console.error("Error creating evaluation:", error)
    return NextResponse.json({ success: false, error: "Failed to create evaluation" }, { status: 500 })
  }
}
