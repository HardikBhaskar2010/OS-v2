import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSpace } from "@/contexts/SpaceContext";
import { useCouple } from "@/contexts/CoupleContext";
import FloatingHearts from "@/components/FloatingHearts";
import HeroSection from "@/components/HeroSection";
import DaysCounter from "@/components/DaysCounter";
import LoveLetters from "@/components/LoveLetters";
import PhotoGallery from "@/components/PhotoGallery";
import MoodSharing from "@/components/MoodSharing";
import DailyQuestion from "@/components/DailyQuestion";
import { Heart, Sparkles, LogOut, Settings, Cookie } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CookieDashboard = () => {
  const navigate = useNavigate();
  const { currentSpace, logout, displayName, partnerName } = useSpace();
  const { anniversaryDate, relationshipStart } = useCouple();
  
  useEffect(() => {
    if (!currentSpace || currentSpace !== 'cookie') {
      navigate('/');
    }
  }, [currentSpace, navigate]);

  // Fallback dates if not set in profile
  const displayAnniversary = anniversaryDate || new Date(2024, 4, 14); // May 14th
  const displayRelationshipStart = relationshipStart || new Date(2024, 1, 14); // Feb 14th
  const partnerNames = ['Cookie', 'Senorita'];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <FloatingHearts />
      
      <HeroSection />
      
      <main className="relative z-10 px-4 py-8 max-w-6xl mx-auto -mt-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Full width - Days Counter */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DaysCounter 
              anniversaryDate={displayAnniversary} 
              partnerNames={partnerNames}
              relationshipStart={displayRelationshipStart}
            />
          </motion.div>

          {/* Cookie's Dashboard Header */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-8 bg-gradient-to-br from-blue-500/10 via-primary/20 to-primary/5 rounded-3xl border border-primary/20 shadow-lg relative group overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Link to="/settings">
                  <Button variant="ghost" size="icon" data-testid="settings-button">
                    <Settings className="w-4 h-4 text-primary" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} data-testid="logout-button">
                  <LogOut className="w-4 h-4 text-primary" />
                </Button>
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-left">
                <div className="p-4 bg-primary/20 rounded-2xl">
                  <Cookie className="w-12 h-12 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-3xl font-bold text-primary">Cookie's Command Center 👑</h2>
                  <p className="text-muted-foreground text-lg">Welcome back, {displayName}. {partnerName}'s heart is waiting for your touch today.</p>
                  <div className="flex gap-4 pt-2">
                    <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary border border-primary/20">
                      Status: Guardian
                    </div>
                    <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary border border-primary/20">
                      Mission: Make her smile
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Left Column */}
          <div className="space-y-6">
            <Link to="/letters" className="block hover-elevate active-elevate-2 transition-transform">
              <LoveLetters />
            </Link>
            <Link to="/questions" className="block hover-elevate active-elevate-2 transition-transform">
              <DailyQuestion />
            </Link>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Link to="/gallery" className="block hover-elevate active-elevate-2 transition-transform">
              <PhotoGallery />
            </Link>
            <Link to="/mood" className="block hover-elevate active-elevate-2 transition-transform">
              <MoodSharing />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="text-center py-10 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/80 backdrop-blur-sm border border-primary/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-muted-foreground flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-primary fill-current animate-pulse-heart" /> for us
            </p>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          
          <motion.p 
            className="text-xs text-muted-foreground/60 mt-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Cookie 💕 Senorita • Forever & Always
          </motion.p>
        </motion.footer>
      </main>
    </div>
  );
};

export default CookieDashboard;