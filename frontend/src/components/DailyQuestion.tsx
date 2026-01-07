import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart, RefreshCw, Check, Sparkles, Heart, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const questions = [
  "What's one thing about me that always makes you smile?",
  "If we could go anywhere in the world together, where would you want to go?",
  "What's your favorite memory of us?",
  "What song reminds you of our relationship?",
  "What do you love most about our relationship?",
  "If you could relive any day we spent together, which one would it be?",
  "What's something new you'd like us to try together?",
  "What made you fall in love with me?",
  "What's the sweetest thing I've ever done for you?",
  "What are you most looking forward to in our future together?",
];

const DailyQuestion = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getNewQuestion = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
      setAnswer("");
      setSubmitted(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = () => {
    if (answer.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/20 to-transparent border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageCircleHeart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span>Daily Love Question</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                Deepen your connection 💕
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          {/* Question Display */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 text-primary/20 text-6xl font-serif">"</div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -10 : 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg md:text-xl font-medium text-foreground text-center py-4 px-6 relative z-10"
              >
                {questions[currentQuestion]}
              </motion.p>
            </AnimatePresence>
            <div className="absolute -bottom-2 -right-2 text-primary/20 text-6xl font-serif rotate-180">"</div>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Textarea
                    placeholder="Share your thoughts from the heart..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="min-h-28 border-primary/20 focus:border-primary bg-accent/20 resize-none pr-12"
                  />
                  <Heart className="absolute right-3 bottom-3 w-5 h-5 text-primary/30" />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={getNewQuestion}
                    className="flex-1 gap-2 border-primary/20 hover:border-primary hover:bg-primary/5"
                    disabled={isAnimating}
                  >
                    <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
                    New Question
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 gap-2"
                    disabled={!answer.trim()}
                  >
                    <Send className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 px-4 rounded-2xl bg-gradient-to-br from-accent/50 to-primary/10 border border-primary/20"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-3"
                >
                  💕
                </motion.div>
                <p className="text-foreground font-semibold text-lg mb-1">Answer Shared!</p>
                <p className="text-sm text-muted-foreground mb-4">Your partner will love reading this</p>
                
                <div className="bg-card/50 rounded-xl p-3 mb-4 text-left">
                  <p className="text-sm text-muted-foreground italic">"{answer}"</p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={getNewQuestion}
                  className="gap-2 border-primary/20 hover:border-primary"
                >
                  <Sparkles className="w-4 h-4" />
                  Answer Another Question
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Counter */}
          <div className="flex justify-center gap-1.5">
            {questions.slice(0, 5).map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentQuestion % 5 ? 'bg-primary w-4' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyQuestion;
