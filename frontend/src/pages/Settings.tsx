import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, ArrowLeft, Palette, Sun, Moon, Monitor, Heart, Sparkles, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";
import { useSpace } from "@/contexts/SpaceContext";
import { useTheme, ColorTheme, AppearanceMode } from "@/contexts/ThemeContext";

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
  const navigate = useNavigate();
  const { currentSpace, displayName, partnerName } = useSpace();
  const { colorTheme, setColorTheme, appearanceMode, setAppearanceMode } = useTheme();

  const goBack = () => {
    navigate(currentSpace === 'cookie' ? '/cookie' : '/senorita');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden p-4 md:p-8">
      <FloatingHearts />
      <div className="max-w-3xl mx-auto relative z-10">
        <Button 
          onClick={goBack}
          variant="ghost" 
          className="mb-6 gap-2 text-muted-foreground hover:text-primary" 
          data-testid="back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

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

          {/* Space Info */}
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="w-5 h-5 text-primary fill-current" />
                Your Space
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-muted-foreground">Current Space</span>
                <span className="font-semibold text-lg flex items-center gap-2">
                  {currentSpace === 'cookie' ? '🍪 Cookie\'s Command Center' : '💃 Senorita\'s Sanctuary'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-muted-foreground">Your Name</span>
                <span className="font-medium text-primary">{displayName}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground">Partner</span>
                <span className="font-medium text-primary flex items-center gap-2">
                  {partnerName} <Heart className="w-4 h-4 fill-current animate-pulse" />
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Love Message */}
          <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30 shadow-xl">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Made With Love</h3>
              <p className="text-muted-foreground text-lg">
                This space is dedicated to Cookie 🍪 and Senorita 💃
              </p>
              <p className="text-muted-foreground mt-2">
                Forever & Always 💕
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;