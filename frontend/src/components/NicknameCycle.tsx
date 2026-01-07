import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCouple } from "@/contexts/CoupleContext";
import { useSpace } from "@/contexts/SpaceContext";

// Default nicknames - will be replaced by display names when available
const defaultNicknames1 = ["My Love", "Sweetheart", "Darling"];
const defaultNicknames2 = ["My Love", "Sweetheart", "Honey"];

export const NicknameCycle1 = () => {
  const { currentSpace, partnerName } = useSpace();
  const { partnerNames } = useCouple();
  const [index, setIndex] = useState(0);
  
  // Create nicknames array with the actual name as first
  const nicknames = currentSpace === 'cookie' 
    ? [partnerNames[1], ...defaultNicknames1]
    : [partnerNames[0], ...defaultNicknames1];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % nicknames.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [nicknames.length]);

  return (
    <div className="inline-block h-[1.2em] align-middle overflow-hidden px-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={nicknames[index]}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-block text-foreground font-sans"
        >
          {nicknames[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export const NicknameCycle2 = () => {
  const { currentSpace } = useSpace();
  const { partnerNames } = useCouple();
  const [index, setIndex] = useState(0);
  
  // Create nicknames array with the actual name as first
  const nicknames = currentSpace === 'cookie' 
    ? [partnerNames[0], ...defaultNicknames2]
    : [partnerNames[1], ...defaultNicknames2];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % nicknames.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [nicknames.length]);

  return (
    <div className="inline-block h-[1.2em] align-middle overflow-hidden px-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={nicknames[index]}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-block text-foreground font-sans"
        >
          {nicknames[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};