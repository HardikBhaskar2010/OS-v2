import { motion } from "framer-motion";
import { Heart, Calendar, Clock, Sparkles, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format, isBefore } from "date-fns";
import { useEffect, useState } from "react";

import { NicknameCycle1, NicknameCycle2 } from "./NicknameCycle";

interface DaysCounterProps {
  anniversaryDate: Date;
  partnerNames: [string, string];
  relationshipStart: Date;
}

const DaysCounter = ({ anniversaryDate, partnerNames, relationshipStart }: DaysCounterProps) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get next anniversary (if the date has passed this year, show next year)
  const getNextAnniversary = () => {
    const thisYear = new Date(now.getFullYear(), anniversaryDate.getMonth(), anniversaryDate.getDate());
    if (isBefore(thisYear, now)) {
      return new Date(now.getFullYear() + 1, anniversaryDate.getMonth(), anniversaryDate.getDate());
    }
    return thisYear;
  };

  const nextAnniversary = getNextAnniversary();
  
  // Calculate time remaining
  const totalSeconds = Math.max(0, Math.floor((nextAnniversary.getTime() - now.getTime()) / 1000));
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  // Calculate days together
  const daysTogether = differenceInDays(now, relationshipStart);

  const timeUnits = [
    { value: days, label: "Days", icon: Calendar },
    { value: hours, label: "Hours", icon: Clock },
    { value: minutes, label: "Minutes", icon: Sparkles },
    { value: seconds, label: "Seconds", icon: Heart },
  ];

  const isAnniversaryToday = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-card/90 backdrop-blur-md border-primary/20 overflow-hidden shadow-lg">
        <CardContent className="p-8">
          {/* Partner Names */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-3 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <Heart className="w-8 h-8 text-primary fill-current animate-heart-beat" />
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <NicknameCycle1 />
              <span className="text-primary">&</span>
              <NicknameCycle2 />
            </h2>
            
            <p className="text-muted-foreground text-sm">
              {daysTogether} beautiful days together 💕
            </p>
          </div>

          {/* Anniversary Countdown Header */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Gift className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                {isAnniversaryToday ? "🎉 Happy Anniversary! 🎉" : "Countdown to Anniversary"}
              </span>
              <Gift className="w-5 h-5 text-primary" />
            </motion.div>
            
            <p className="text-muted-foreground mt-2 text-sm">
              {format(nextAnniversary, "MMMM d, yyyy")}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative bg-gradient-to-br from-accent/50 to-accent/30 rounded-2xl p-5 text-center border border-primary/10 overflow-hidden group hover:border-primary/30 transition-colors">
                  {/* Decorative glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <motion.div
                    key={unit.value}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative"
                  >
                    <span className="block text-4xl md:text-5xl font-bold text-primary tabular-nums">
                      {unit.value.toString().padStart(2, "0")}
                    </span>
                  </motion.div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <unit.icon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">
                      {unit.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Message */}
          <motion.div
            className="text-center"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <p className="text-foreground/80 flex items-center justify-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              Every second counts when I'm waiting to celebrate with you
              <Heart className="w-4 h-4 text-primary fill-current" />
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DaysCounter;
