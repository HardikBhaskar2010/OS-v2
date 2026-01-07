import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Stars } from "lucide-react";
import heroBg from "@/hero-bg.jpg";
import { useState, useEffect } from "react";
import { useCouple } from "@/contexts/CoupleContext";

const HeroSection = () => {
  const { partnerNames } = useCouple();
  const [index, setIndex] = useState(0);
  
  // Create dynamic nicknames from partner names
  const nicknames = [partnerNames[0], partnerNames[1], "Us", "Forever"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % nicknames.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [nicknames.length]);

  return (
    <div className="relative h-[55vh] min-h-[450px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/20 to-background" />
      </div>

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-5"
        >
          {/* Decorative Icons */}
          <motion.div
            className="flex items-center justify-center gap-3"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-primary-foreground/80" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-primary fill-primary drop-shadow-lg" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-primary-foreground/80" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-primary-foreground drop-shadow-lg tracking-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Love OS
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-primary-foreground/90 max-w-md mx-auto drop-shadow font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Our Private Little Universe ✨
          </motion.p>

          {/* Tagline */}
          <motion.div
            className="flex items-center justify-center gap-2 text-primary-foreground/80 text-sm md:text-base"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Stars className="w-4 h-4" />
            <span>Celebrating our love, one memory at a time</span>
            <Stars className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Hearts */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex gap-3 items-end">
          {[0.6, 1, 0.6].map((scale, i) => (
            <motion.div
              key={i}
              animate={{ scale: [scale, scale * 1.1, scale] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            >
              <Heart
                className="text-primary fill-primary drop-shadow-md"
                style={{ width: 16 * scale, height: 16 * scale }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decorative sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <Sparkles className="w-3 h-3 text-primary-foreground/50" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
