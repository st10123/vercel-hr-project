"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export function SystemSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">システム設定</h1>
            <p className="text-sm text-muted-foreground">システム全体の設定と管理</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">一般</TabsTrigger>
            <TabsTrigger value="security">セキュリティ</TabsTrigger>
            <TabsTrigger value="notifications">通知</TabsTrigger>
            <TabsTrigger value="backup">バックアップ</TabsTrigger>
            <TabsTrigger value="users">ユーザー管理</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本設定</CardTitle>
                <CardDescription>システムの基本的な設定項目</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">会社名</Label>
                  <Input id="company-name" defaultValue="株式会社サンプル" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-name">システム名</Label>
                  <Input id="system-name" defaultValue="HR評価システム" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evaluation-period">評価期間</Label>
                  <Select defaultValue="quarterly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">月次</SelectItem>
                      <SelectItem value="quarterly">四半期</SelectItem>
                      <SelectItem value="semi-annual">半期</SelectItem>
                      <SelectItem value="annual">年次</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-language">デフォルト言語</Label>
                  <Select defaultValue="ja">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>設定を保存</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>セキュリティ設定</CardTitle>
                <CardDescription>システムのセキュリティに関する設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>二要素認証</Label>
                    <div className="text-sm text-muted-foreground">ログイン時に追加の認証を要求します</div>
                  </div>
                  <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">セッションタイムアウト（分）</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-policy">パスワードポリシー</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低（8文字以上）</SelectItem>
                      <SelectItem value="medium">中（8文字以上、英数字混在）</SelectItem>
                      <SelectItem value="high">高（12文字以上、英数字記号混在）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>設定を保存</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>システム通知の設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>メール通知</Label>
                    <div className="text-sm text-muted-foreground">評価完了時などにメール通知を送信します</div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">SMTPサーバー</Label>
                  <Input id="smtp-server" placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTPポート</Label>
                  <Input id="smtp-port" type="number" defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">送信者メールアドレス</Label>
                  <Input id="from-email" type="email" placeholder="noreply@company.com" />
                </div>
                <Button>設定を保存</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>バックアップ設定</CardTitle>
                <CardDescription>データのバックアップに関する設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>自動バックアップ</Label>
                    <div className="text-sm text-muted-foreground">定期的にデータを自動バックアップします</div>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">バックアップ頻度</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">毎時</SelectItem>
                      <SelectItem value="daily">毎日</SelectItem>
                      <SelectItem value="weekly">毎週</SelectItem>
                      <SelectItem value="monthly">毎月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention-days">保持期間（日）</Label>
                  <Input id="retention-days" type="number" defaultValue="30" />
                </div>
                <div className="flex gap-2">
                  <Button>設定を保存</Button>
                  <Button variant="outline">今すぐバックアップ</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ユーザー管理設定</CardTitle>
                <CardDescription>ユーザーアカウントの管理設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="default-role">新規ユーザーのデフォルト権限</Label>
                  <Select defaultValue="user">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">管理者</SelectItem>
                      <SelectItem value="manager">マネージャー</SelectItem>
                      <SelectItem value="user">一般ユーザー</SelectItem>
                      <SelectItem value="viewer">閲覧者</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-users">最大ユーザー数</Label>
                  <Input id="max-users" type="number" defaultValue="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-registration">ユーザー登録方法</Label>
                  <Select defaultValue="admin-only">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin-only">管理者のみ</SelectItem>
                      <SelectItem value="self-registration">自己登録可能</SelectItem>
                      <SelectItem value="invitation-only">招待制</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>設定を保存</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
