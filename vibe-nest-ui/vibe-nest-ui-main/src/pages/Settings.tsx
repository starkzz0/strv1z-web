import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Shield, 
  Bell, 
  Eye, 
  Palette, 
  Globe, 
  Accessibility,
  Settings as SettingsIcon,
  ChevronRight,
  Moon,
  Sun,
  Type,
  Volume,
  RotateCcw,
  Save
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const settingSections = [
  { id: "account", title: "Account", icon: User, description: "Profile info, security, notifications" },
  { id: "privacy", title: "Privacy", icon: Eye, description: "Anonymous posting, journal privacy" },
  { id: "appearance", title: "Appearance", icon: Palette, description: "Dark mode, themes, customization" },
  { id: "language", title: "Language", icon: Globe, description: "Regional support and localization" },
  { id: "accessibility", title: "Accessibility", icon: Accessibility, description: "Text size, contrast, voice interaction" },
  { id: "controls", title: "App Controls", icon: SettingsIcon, description: "Notifications, reminders, data management" },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("account");
  const { theme, setTheme, colorTheme, setColorTheme, fontSize, setFontSize, highContrast, setHighContrast } = useTheme();
  const [settings, setSettings] = useState({
    anonymousPosting: false,
    journalPrivacy: true,
    notifications: true,
    emailNotifications: false,
    reminderFrequency: "daily",
    voiceInteraction: false,
    language: "en",
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Display Name</label>
            <Input placeholder="Alex Johnson" defaultValue="Alex Johnson" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            <Input placeholder="alex@example.com" defaultValue="alex@example.com" type="email" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
            <Input placeholder="Computer Science Student" defaultValue="Computer Science Student" />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Security</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-between">
            <span>Change Password</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <span>Two-Factor Authentication</span>
            <Badge variant="outline">Disabled</Badge>
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about replies and mentions</p>
            </div>
            <Switch 
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Weekly digest and important updates</p>
            </div>
            <Switch 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Posting Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Anonymous Posting by Default</p>
              <p className="text-sm text-muted-foreground">Post anonymously unless you choose otherwise</p>
            </div>
            <Switch 
              checked={settings.anonymousPosting}
              onCheckedChange={(checked) => updateSetting('anonymousPosting', checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Journal Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Private Journal Entries</p>
              <p className="text-sm text-muted-foreground">Keep your mood logs and journal entries private</p>
            </div>
            <Switch 
              checked={settings.journalPrivacy}
              onCheckedChange={(checked) => updateSetting('journalPrivacy', checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Data Sharing</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-between">
            <span>Download My Data</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between text-destructive">
            <span>Delete Account</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Mode</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={theme === "light" ? "secondary" : "outline"}
            onClick={() => setTheme("light")}
            className="h-auto p-4 flex-col gap-2"
          >
            <Sun className="h-5 w-5" />
            <span>Light</span>
          </Button>
          <Button
            variant={theme === "dark" ? "secondary" : "outline"}
            onClick={() => setTheme("dark")}
            className="h-auto p-4 flex-col gap-2"
          >
            <Moon className="h-5 w-5" />
            <span>Dark</span>
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Color Theme</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "teal", name: "Teal", color: "bg-[hsl(186,85%,45%)]" },
            { id: "blue", name: "Blue", color: "bg-[hsl(220,85%,55%)]" },
            { id: "purple", name: "Purple", color: "bg-[hsl(270,75%,60%)]" },
            { id: "neutral", name: "Neutral", color: "bg-[hsl(215,25%,45%)]" },
          ].map((themeOption) => (
            <Button
              key={themeOption.id}
              variant={colorTheme === themeOption.id ? "secondary" : "outline"}
              onClick={() => setColorTheme(themeOption.id as any)}
              className="h-auto p-4 flex-col gap-2"
            >
              <div className={`w-6 h-6 rounded-full ${themeOption.color}`}></div>
              <span>{themeOption.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguageSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Language Preference</h3>
        <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Regional Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Time Zone</label>
            <Select defaultValue="est">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="est">Eastern Time (EST)</SelectItem>
                <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="cet">Central European Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Text Size</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "small", name: "Small", icon: Type },
            { id: "medium", name: "Medium", icon: Type },
            { id: "large", name: "Large", icon: Type },
          ].map((size) => (
            <Button
              key={size.id}
              variant={fontSize === size.id ? "secondary" : "outline"}
              onClick={() => setFontSize(size.id as any)}
              className="h-auto p-4 flex-col gap-2"
            >
              <size.icon className={`${size.id === "small" ? "h-4 w-4" : size.id === "large" ? "h-7 w-7" : "h-5 w-5"}`} />
              <span>{size.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Visual Accessibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">High Contrast Mode</p>
              <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
            </div>
            <Switch 
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Interaction</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Voice Interaction</p>
              <p className="text-sm text-muted-foreground">Enable voice commands and audio feedback</p>
            </div>
            <Switch 
              checked={settings.voiceInteraction}
              onCheckedChange={(checked) => updateSetting('voiceInteraction', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderControlsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mute All Notifications</p>
              <p className="text-sm text-muted-foreground">Temporarily disable all notifications</p>
            </div>
            <Switch />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Reminder Frequency</label>
            <Select value={settings.reminderFrequency} onValueChange={(value) => updateSetting('reminderFrequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Reset Mood Data</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Volume className="h-4 w-4" />
              <span>Clear Cache</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "account": return renderAccountSection();
      case "privacy": return renderPrivacySection();
      case "appearance": return renderAppearanceSection();
      case "language": return renderLanguageSection();
      case "accessibility": return renderAccessibilitySection();
      case "controls": return renderControlsSection();
      default: return renderAccountSection();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your Vibenest experience and manage your preferences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Settings Navigation */}
          <Card className="md:col-span-1 p-4">
            <div className="space-y-2">
              {settingSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "secondary" : "ghost"}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full justify-start gap-3 h-auto p-3"
                >
                  <section.icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs text-muted-foreground hidden md:block">
                      {section.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Settings Content */}
          <Card className="md:col-span-2 p-6">
            {renderSectionContent()}
            
            <Separator className="my-6" />
            
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}