"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { ReportsDashboard } from "@/components/reports-dashboard"
import { EmployeeManagement } from "@/components/employee-management"
import { EvaluationTemplates } from "@/components/evaluation-templates"
import { SystemSettings } from "@/components/system-settings"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  const [activeView, setActiveView] = useState("chat")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 flex flex-col">
        {activeView === "chat" && <ChatInterface />}
        {activeView === "reports" && <ReportsDashboard />}
        {activeView === "employees" && <EmployeeManagement />}
        {activeView === "templates" && <EvaluationTemplates />}
        {activeView === "analytics" && <ReportsDashboard />}
        {activeView === "settings" && <SystemSettings />}
      </main>
    </div>
  )
}
