"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Bell, Shield, Lock, Eye, EyeOff, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Header from "@/components/header"

export default function SettingsPage() {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    promotions: false,
    twoFactorAuth: false,
    loginAlerts: true,
    showBalance: false,
    autoLogout: true,
  })

  const handleToggle = (setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))
  }

  const handleSaveSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
        duration: 3000,
      })
    }, 1500)
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/auth/login?returnUrl=/user/settings")
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton backUrl="/dashboard" backLabel="Back to dashboard" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how you receive notifications from HanyThrift</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive order updates and important alerts via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle("emailNotifications")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications" className="font-medium">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={() => handleToggle("pushNotifications")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderUpdates" className="font-medium">
                      Order Updates
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified about changes to your orders</p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={settings.orderUpdates}
                    onCheckedChange={() => handleToggle("orderUpdates")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="promotions" className="font-medium">
                      Promotions and Offers
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive updates about deals and special offers</p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={settings.promotions}
                    onCheckedChange={() => handleToggle("promotions")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth" className="font-medium">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={() => handleToggle("twoFactorAuth")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginAlerts" className="font-medium">
                      Login Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
                  </div>
                  <Switch
                    id="loginAlerts"
                    checked={settings.loginAlerts}
                    onCheckedChange={() => handleToggle("loginAlerts")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showBalance" className="font-medium">
                      Show Account Balance
                    </Label>
                    <p className="text-sm text-muted-foreground">Display your balance on the dashboard</p>
                  </div>
                  <Switch
                    id="showBalance"
                    checked={settings.showBalance}
                    onCheckedChange={() => handleToggle("showBalance")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoLogout" className="font-medium">
                      Auto Logout
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after 30 minutes of inactivity
                    </p>
                  </div>
                  <Switch
                    id="autoLogout"
                    checked={settings.autoLogout}
                    onCheckedChange={() => handleToggle("autoLogout")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">
                    Your privacy is important to us. We only use your information to process orders, improve our
                    services, and provide you with a better experience. You can review our full privacy policy{" "}
                    <a href="#" className="text-primary hover:underline">
                      here
                    </a>
                    .
                  </p>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Eye className="h-4 w-4 mr-2" />
                    View My Data
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Delete My Data
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">Last updated: March 19, 2025</p>
              </CardFooter>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Saving...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

