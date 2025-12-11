"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, BarChart3, Users, Settings, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { id: "chat", label: "チャット評価", icon: MessageSquare },
  { id: "analytics", label: "分析", icon: BarChart3 },
  { id: "employees", label: "従業員管理", icon: Users },
  { id: "templates", label: "評価テンプレート", icon: FileText },
  { id: "settings", label: "設定", icon: Settings },
]

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">HR評価システム</h2>
        <p className="text-sm text-muted-foreground mt-1">Enterprise Edition</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                activeView === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
