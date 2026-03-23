import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Settings, Globe, Bell, Shield, Save, Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const AdminSettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: "Admin User",
    email: "admin@binxtrade.in",
    phone: "+1234567890",
    role: "Super Admin",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Binxtrade",
    siteUrl: "https://binxtrade.in",
    supportEmail: "support@binxtrade.in",
    timezone: "UTC",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    twoFactorEnabled: false,
  });

  const [notifications, setNotifications] = useState({
    emailNewUser: true,
    emailWithdrawal: true,
    emailDeposit: true,
    pushAlerts: true,
    systemAlerts: true,
  });

  const handleSaveProfile = () => {
    // Simulate save
    console.log("Profile saved:", profileForm);
  };

  const handleChangePassword = () => {
    // Simulate password change
    console.log("Password changed");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleSaveSettings = () => {
    // Simulate save
    console.log("Settings saved:", siteSettings);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and site settings</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="glass-card p-1 w-full sm:w-auto">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <Lock className="w-4 h-4" />
              Password
            </TabsTrigger>
            <TabsTrigger value="site" className="gap-2">
              <Globe className="w-4 h-4" />
              Site
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <GlassCard className="p-6">
              <h3 className="font-semibold text-lg mb-6">Admin Profile</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">A</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Role</label>
                    <input
                      type="text"
                      value={profileForm.role}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} className="btn-glow">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="mt-6">
            <GlassCard className="p-6 max-w-md">
              <h3 className="font-semibold text-lg mb-6">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 pr-12 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 pr-12 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 pr-12 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleChangePassword} 
                  className="w-full btn-glow"
                  disabled={!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Site Settings Tab */}
          <TabsContent value="site" className="mt-6">
            <GlassCard className="p-6">
              <h3 className="font-semibold text-lg mb-6">Site Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Site Name</label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Site URL</label>
                    <input
                      type="url"
                      value={siteSettings.siteUrl}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Support Email</label>
                    <input
                      type="email"
                      value={siteSettings.supportEmail}
                      onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Timezone</label>
                    <input
                      type="text"
                      value={siteSettings.timezone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, timezone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6 space-y-4">
                  <h4 className="font-medium">System Options</h4>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Disable public access temporarily</p>
                    </div>
                    <Switch 
                      checked={siteSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, maintenanceMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">User Registration</p>
                      <p className="text-sm text-muted-foreground">Allow new user signups</p>
                    </div>
                    <Switch 
                      checked={siteSettings.registrationEnabled}
                      onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, registrationEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">Email Verification</p>
                      <p className="text-sm text-muted-foreground">Require email verification for new users</p>
                    </div>
                    <Switch 
                      checked={siteSettings.emailVerificationRequired}
                      onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, emailVerificationRequired: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin login</p>
                    </div>
                    <Switch 
                      checked={siteSettings.twoFactorEnabled}
                      onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, twoFactorEnabled: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} className="btn-glow">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <GlassCard className="p-6">
              <h3 className="font-semibold text-lg mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">New User Registration</p>
                    <p className="text-sm text-muted-foreground">Get notified when a new user signs up</p>
                  </div>
                  <Switch 
                    checked={notifications.emailNewUser}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNewUser: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">Withdrawal Requests</p>
                    <p className="text-sm text-muted-foreground">Get notified for new withdrawal requests</p>
                  </div>
                  <Switch 
                    checked={notifications.emailWithdrawal}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailWithdrawal: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">Deposit Confirmations</p>
                    <p className="text-sm text-muted-foreground">Get notified for new deposits</p>
                  </div>
                  <Switch 
                    checked={notifications.emailDeposit}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailDeposit: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch 
                    checked={notifications.pushAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">System Alerts</p>
                    <p className="text-sm text-muted-foreground">Critical system notifications</p>
                  </div>
                  <Switch 
                    checked={notifications.systemAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                  />
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
