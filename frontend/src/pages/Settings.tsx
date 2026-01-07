import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, ArrowLeft, Palette, Sun, Moon, Monitor, Heart, User, Calendar, Sparkles, Save, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, ColorTheme, AppearanceMode } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const colorOptions: { value: ColorTheme; label: string; color: string }[] = [
  { value: 'pink', label: 'Pink Romance', color: '#ec4899' },
  { value: 'purple', label: 'Purple Dream', color: '#8b5cf6' },
  { value: 'blue', label: 'Blue Ocean', color: '#3b82f6' },
  { value: 'green', label: 'Green Nature', color: '#22c55e' },
  { value: 'orange', label: 'Orange Sunset', color: '#f97316' },
  { value: 'red', label: 'Red Passion', color: '#ef4444' },
];

const appearanceOptions: { value: AppearanceMode; label: string; icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const { colorTheme, setColorTheme, appearanceMode, setAppearanceMode } = useTheme();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    display_name: '',
    anniversary_date: '',
    relationship_start: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        display_name: user.display_name || '',
        anniversary_date: user.anniversary_date || '',
        relationship_start: user.relationship_start || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: profileData.display_name,
          anniversary_date: profileData.anniversary_date || null,
          relationship_start: profileData.relationship_start || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser();
      
      toast({
        title: "Saved! 💕",
        description: "Your profile has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden p-4 md:p-8">
      <FloatingHearts />
      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary" data-testid="back-button">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <SettingsIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Settings</CardTitle>
                  <CardDescription>Customize your Love OS experience</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Theme Settings */}
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Palette className="w-5 h-5 text-primary" />
                Color Theme
              </CardTitle>
              <CardDescription>Choose a color palette for your app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {colorOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setColorTheme(option.value)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      colorTheme === option.value
                        ? 'border-primary shadow-lg'
                        : 'border-border hover:border-primary/50'
                    }`}
                    data-testid={`color-theme-${option.value}`}
                  >
                    <div
                      className="w-10 h-10 rounded-full shadow-inner"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="text-xs font-medium text-center">{option.label}</span>
                    {colorTheme === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 bg-primary text-primary-foreground p-1 rounded-full"
                      >
                        <Check className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appearance Mode */}
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sun className="w-5 h-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>Switch between light and dark mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {appearanceOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAppearanceMode(option.value)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      appearanceMode === option.value
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border hover:border-primary/50'
                    }`}
                    data-testid={`appearance-mode-${option.value}`}
                  >
                    <option.icon className={`w-8 h-8 ${appearanceMode === option.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-medium">{option.label}</span>
                    {appearanceMode === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 bg-primary text-primary-foreground p-1 rounded-full"
                      >
                        <Check className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="w-5 h-5 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name" className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  Display Name
                </Label>
                <Input
                  id="display_name"
                  value={profileData.display_name}
                  onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
                  placeholder="Your display name"
                  className="border-primary/20"
                  data-testid="display-name-input"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relationship_start" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Relationship Start Date
                  </Label>
                  <Input
                    id="relationship_start"
                    type="date"
                    value={profileData.relationship_start}
                    onChange={(e) => setProfileData({ ...profileData, relationship_start: e.target.value })}
                    className="border-primary/20"
                    data-testid="relationship-start-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anniversary_date" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Anniversary Date
                  </Label>
                  <Input
                    id="anniversary_date"
                    type="date"
                    value={profileData.anniversary_date}
                    onChange={(e) => setProfileData({ ...profileData, anniversary_date: e.target.value })}
                    className="border-primary/20"
                    data-testid="anniversary-date-input"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full gap-2"
                data-testid="save-profile-button"
              >
                {isSaving ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="w-5 h-5 text-primary fill-current" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize flex items-center gap-2">
                  {user?.role === 'boyfriend' ? '🧑 Boyfriend' : '👩 Girlfriend'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Username</span>
                <span className="font-medium">@{user?.username}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Partner Status</span>
                <span className="font-medium text-primary">
                  {user?.partner_id ? '💑 Connected' : '💔 Not linked'}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
