import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" defaultValue="User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself" />
                </div>
              </div>
              <Button>Save changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc-8">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-12">UTC-12:00</SelectItem>
                    <SelectItem value="utc-11">UTC-11:00</SelectItem>
                    <SelectItem value="utc-10">UTC-10:00</SelectItem>
                    <SelectItem value="utc-9">UTC-09:00</SelectItem>
                    <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
                    <SelectItem value="utc-7">UTC-07:00 (MST)</SelectItem>
                    <SelectItem value="utc-6">UTC-06:00 (CST)</SelectItem>
                    <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
                    <SelectItem value="utc-4">UTC-04:00</SelectItem>
                    <SelectItem value="utc-3">UTC-03:00</SelectItem>
                    <SelectItem value="utc-2">UTC-02:00</SelectItem>
                    <SelectItem value="utc-1">UTC-01:00</SelectItem>
                    <SelectItem value="utc">UTC+00:00</SelectItem>
                    <SelectItem value="utc+1">UTC+01:00</SelectItem>
                    <SelectItem value="utc+2">UTC+02:00</SelectItem>
                    <SelectItem value="utc+3">UTC+03:00</SelectItem>
                    <SelectItem value="utc+4">UTC+04:00</SelectItem>
                    <SelectItem value="utc+5">UTC+05:00</SelectItem>
                    <SelectItem value="utc+5:30">UTC+05:30</SelectItem>
                    <SelectItem value="utc+6">UTC+06:00</SelectItem>
                    <SelectItem value="utc+7">UTC+07:00</SelectItem>
                    <SelectItem value="utc+8">UTC+08:00</SelectItem>
                    <SelectItem value="utc+9">UTC+09:00</SelectItem>
                    <SelectItem value="utc+10">UTC+10:00</SelectItem>
                    <SelectItem value="utc+11">UTC+11:00</SelectItem>
                    <SelectItem value="utc+12">UTC+12:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark mode</Label>
                  <div className="text-sm text-muted-foreground">Enable dark mode for the interface</div>
                </div>
                <Switch id="dark-mode" />
              </div>
              <Button>Save preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company-name">Company name</Label>
                  <Input id="company-name" defaultValue="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue="tech">
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-size">Company size</Label>
                  <Select defaultValue="50-100">
                    <SelectTrigger id="company-size">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="50-100">50-100 employees</SelectItem>
                      <SelectItem value="101-500">101-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Textarea id="company-address" defaultValue="123 Business St, Suite 100, San Francisco, CA 94107" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input id="company-email" type="email" defaultValue="info@acmeinc.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone</Label>
                  <Input id="company-phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input id="company-website" type="url" defaultValue="https://acmeinc.com" />
                </div>
              </div>
              <Button>Update company information</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </div>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifications">Browser notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive browser notifications when you are online
                    </div>
                  </div>
                  <Switch id="browser-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive text messages for critical alerts</div>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notification types</Label>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-employee" className="flex items-center gap-2 font-normal">
                      New employee registrations
                    </Label>
                    <Switch id="new-employee" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="leave-requests" className="flex items-center gap-2 font-normal">
                      Leave requests
                    </Label>
                    <Switch id="leave-requests" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payroll-updates" className="flex items-center gap-2 font-normal">
                      Payroll updates
                    </Label>
                    <Switch id="payroll-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-updates" className="flex items-center gap-2 font-normal">
                      System updates
                    </Label>
                    <Switch id="system-updates" />
                  </div>
                </div>
              </div>
              <Button>Save notification settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Update password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-factor authentication</Label>
                  <div className="text-sm text-muted-foreground">Enable two-factor authentication for your account</div>
                </div>
                <Switch />
              </div>
              <Button variant="outline">Set up two-factor authentication</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>Manage your active sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Chrome on Windows</div>
                    <div className="text-sm text-muted-foreground">Active now • Last active: Just now</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Current session
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Safari on Mac</div>
                    <div className="text-sm text-muted-foreground">Last active: 2 days ago</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Log out
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Firefox on Windows</div>
                    <div className="text-sm text-muted-foreground">Last active: 5 days ago</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Log out
                  </Button>
                </div>
              </div>
              <Button variant="destructive">Log out of all sessions</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
