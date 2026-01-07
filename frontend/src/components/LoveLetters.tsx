import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Heart, X, Plus, Feather, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface LoveLetter {
  id: string;
  title: string;
  content: string;
  from: string;
  date: Date;
}

const LoveLetters = () => {
  const [letters, setLetters] = useState<LoveLetter[]>([
    {
      id: "1",
      title: "My First Letter to You",
      content: "Every moment with you feels like a beautiful dream I never want to wake up from. You are my sunshine, my everything. The way you smile lights up my entire world, and I am so grateful to have you in my life. 💕",
      from: "Your Love",
      date: new Date(2024, 0, 14),
    },
    {
      id: "2",
      title: "To My Soulmate",
      content: "I fall in love with you more each day. Thank you for being my best friend, my partner, and my forever person. You make every ordinary day feel extraordinary. ✨",
      from: "Forever Yours",
      date: new Date(2024, 2, 20),
    },
    {
      id: "3",
      title: "Missing You",
      content: "Distance means nothing when someone means everything. I'm counting every second until I can hold you again. You're always in my heart. 🌙",
      from: "Always Thinking of You",
      date: new Date(2024, 4, 5),
    },
  ]);

  const [isWriting, setIsWriting] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [newLetter, setNewLetter] = useState({ title: "", content: "", from: "" });

  const handleSubmit = () => {
    if (newLetter.title && newLetter.content && newLetter.from) {
      setLetters([
        {
          id: Date.now().toString(),
          ...newLetter,
          date: new Date(),
        },
        ...letters,
      ]);
      setNewLetter({ title: "", content: "", from: "" });
      setIsWriting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span>Love Letters</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                {letters.length} heartfelt messages
              </p>
            </div>
          </CardTitle>
          <Button
            variant={isWriting ? "secondary" : "default"}
            size="sm"
            onClick={() => setIsWriting(!isWriting)}
            className="gap-2"
          >
            {isWriting ? <X className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
            {isWriting ? "Cancel" : "Write"}
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <AnimatePresence mode="wait">
            {isWriting ? (
              <motion.div
                key="write"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 rounded-xl bg-accent/20 border border-primary/10"
              >
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Write from your heart...</span>
                </div>
                <Input
                  placeholder="Letter title..."
                  value={newLetter.title}
                  onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
                  className="border-primary/20 focus:border-primary bg-card/50"
                />
                <Textarea
                  placeholder="Pour your heart out here..."
                  value={newLetter.content}
                  onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                  className="min-h-32 border-primary/20 focus:border-primary bg-card/50 resize-none"
                />
                <Input
                  placeholder="Signed with love by..."
                  value={newLetter.from}
                  onChange={(e) => setNewLetter({ ...newLetter, from: e.target.value })}
                  className="border-primary/20 focus:border-primary bg-card/50"
                />
                <Button 
                  onClick={handleSubmit} 
                  className="w-full gap-2"
                  disabled={!newLetter.title || !newLetter.content || !newLetter.from}
                >
                  <Send className="w-4 h-4" />
                  Send with Love
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {letters.map((letter, index) => (
                  <motion.div
                    key={letter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedLetter(letter)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {letter.title}
                        </h3>
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.2 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="w-4 h-4 text-primary fill-current" />
                        </motion.div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {letter.content}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-primary font-medium">— {letter.from}</span>
                        <span className="text-muted-foreground">{format(letter.date, "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Letter Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-medium">Love Letter</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{selectedLetter.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedLetter.date, "MMMM d, yyyy")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedLetter(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="bg-accent/20 rounded-xl p-4 mb-4 border border-primary/10">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedLetter.content}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-primary font-medium flex items-center gap-2">
                  — {selectedLetter.from}
                  <Heart className="w-4 h-4 fill-current animate-pulse-heart" />
                </p>
                <Sparkles className="w-5 h-5 text-primary/50" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LoveLetters;
