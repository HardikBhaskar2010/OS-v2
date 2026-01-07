import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Cookie, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FloatingHearts from "@/components/FloatingHearts";

const SpaceSelection = () => {
  const navigate = useNavigate();

  const handleSpaceSelect = (space: 'cookie' | 'senorita') => {
    localStorage.setItem('selectedSpace', space);
    navigate(`/${space}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      <FloatingHearts />
      
      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-primary/10 backdrop-blur-sm">
              <Heart className="w-16 h-16 text-primary fill-current animate-pulse-heart" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-pink-500 to-primary bg-clip-text text-transparent">
            Love OS 💕
          </h1>
          <p className="text-xl text-muted-foreground">Choose Your Space</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Cookie's Space */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              data-testid="cookie-space-card"
              className="cursor-pointer bg-gradient-to-br from-blue-500/20 via-primary/20 to-blue-600/10 border-2 border-primary/40 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden group h-full"
              onClick={() => handleSpaceSelect('cookie')}
            >
              <CardContent className="p-8 relative">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="p-6 bg-primary/20 rounded-3xl">
                    <Cookie className="w-20 h-20 text-primary" />
                  </div>
                  
                  <div>
                    <h2 className="text-4xl font-bold text-primary mb-2">Cookie's Space</h2>
                    <div className="inline-block px-4 py-1 bg-primary/20 rounded-full mb-4">
                      <span className="text-sm font-semibold text-primary">👑 Boyfriend's Domain</span>
                    </div>
                    <p className="text-muted-foreground text-lg">
                      Your command center to make her smile every day
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap justify-center pt-4">
                    <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary border border-primary/20">
                      Love Letters 💌
                    </div>
                    <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary border border-primary/20">
                      Mood Tracker 😊
                    </div>
                    <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary border border-primary/20">
                      Photo Gallery 📸
                    </div>
                  </div>

                  <motion.div
                    className="text-primary font-semibold text-lg pt-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Click to Enter →
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Senorita's Space */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              data-testid="senorita-space-card"
              className="cursor-pointer bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-pink-600/10 border-2 border-pink-500/40 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 overflow-hidden group h-full"
              onClick={() => handleSpaceSelect('senorita')}
            >
              <CardContent className="p-8 relative">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-colors" />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="p-6 bg-pink-500/20 rounded-3xl">
                    <Sparkles className="w-20 h-20 text-pink-500" />
                  </div>
                  
                  <div>
                    <h2 className="text-4xl font-bold text-pink-500 mb-2">Senorita's Space</h2>
                    <div className="inline-block px-4 py-1 bg-pink-500/20 rounded-full mb-4">
                      <span className="text-sm font-semibold text-pink-500">👸 Girlfriend's Sanctuary</span>
                    </div>
                    <p className="text-muted-foreground text-lg">
                      Your beautiful world filled with love and joy
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap justify-center pt-4">
                    <div className="px-3 py-1 bg-pink-500/10 rounded-full text-xs font-semibold text-pink-500 border border-pink-500/20">
                      Love Notes 💝
                    </div>
                    <div className="px-3 py-1 bg-pink-500/10 rounded-full text-xs font-semibold text-pink-500 border border-pink-500/20">
                      Mood Diary ✨
                    </div>
                    <div className="px-3 py-1 bg-pink-500/10 rounded-full text-xs font-semibold text-pink-500 border border-pink-500/20">
                      Memories 🌸
                    </div>
                  </div>

                  <motion.div
                    className="text-pink-500 font-semibold text-lg pt-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Click to Enter →
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground/60 text-sm italic">
            Cookie 💕 Senorita • Forever & Always
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SpaceSelection;