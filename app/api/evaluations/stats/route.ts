import { NextResponse } from "next/server"

// Mock statistics data (replace with actual database queries)
const mockStats = {
  total_evaluations: 108,
  completion_rate: 92,
  average_scores: {
    responsibility: 8.1,
    speed: 7.5,
    accuracy: 8.6,
    overall: 8.0,
  },
  department_stats: [
    { name: "営業部", responsibility: 7.8, speed: 7.2, accuracy: 8.1, overall: 7.7, completed: 28, total: 30 },
    { name: "開発部", responsibility: 8.5, speed: 7.8, accuracy: 9.2, overall: 8.5, completed: 25, total: 25 },
    {
      name: "マーケティング部",
      responsibility: 7.1,
      speed: 8.3,
      accuracy: 7.5,
      overall: 7.6,
      completed: 22,
      total: 24,
    },
    { name: "人事部", responsibility: 8.9, speed: 7.5, accuracy: 8.7, overall: 8.4, completed: 15, total: 15 },
    { name: "財務部", responsibility: 8.2, speed: 6.8, accuracy: 9.1, overall: 8.0, completed: 18, total: 20 },
  ],
  monthly_trends: [
    { month: "1月", responsibility: 7.2, speed: 7.0, accuracy: 8.1, overall: 7.4 },
    { month: "2月", responsibility: 7.4, speed: 7.2, accuracy: 8.2, overall: 7.6 },
    { month: "3月", responsibility: 7.8, speed: 7.5, accuracy: 8.4, overall: 7.9 },
    { month: "4月", responsibility: 7.6, speed: 7.3, accuracy: 8.3, overall: 7.7 },
    { month: "5月", responsibility: 8.0, speed: 7.7, accuracy: 8.6, overall: 8.1 },
    { month: "6月", responsibility: 8.2, speed: 7.9, accuracy: 8.8, overall: 8.3 },
  ],
}

export async function GET() {
  try {
    console.log("[v0] Fetching evaluation statistics")

    return NextResponse.json({
      success: true,
      data: mockStats,
    })
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch statistics" }, { status: 500 })
  }
}
