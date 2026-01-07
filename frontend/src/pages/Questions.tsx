import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart, ArrowLeft, RefreshCw, Send, Sparkles, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";
import { useSpace } from "@/contexts/SpaceContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Question {
  id: string;
  question_text: string;
  category: string;
  date: string;
}

interface Answer {
  id: string;
  question_id: string;
  user_name: string;
  answer_text: string;
  created_at: string;
}

const Questions = () => {
  const navigate = useNavigate();
  const { currentSpace, displayName, partnerName } = useSpace();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [partnerAnswer, setPartnerAnswer] = useState<Answer | null>(null);
  const [myAnswer, setMyAnswer] = useState<Answer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentSpace) {
      navigate('/');
      return;
    }
    loadTodaysQuestion();
  }, [currentSpace]);

  const loadTodaysQuestion = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('date', today)
      .single();

    if (error) {
      // If no question for today, get any random question
      const { data: randomQuestion } = await supabase
        .from('questions')
        .select('*')
        .limit(1)
        .single();
      
      if (randomQuestion) {
        setCurrentQuestion(randomQuestion);
        loadAnswers(randomQuestion.id);
      }
      return;
    }

    if (data) {
      setCurrentQuestion(data);
      loadAnswers(data.id);
    }
  };

  const loadAnswers = async (questionId: string) => {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', questionId);

    if (error) {
      console.error('Error loading answers:', error);
      return;
    }

    const myAns = data?.find((a: Answer) => a.user_name === displayName);
    const partnerAns = data?.find((a: Answer) => a.user_name === partnerName);

    if (myAns) {
      setMyAnswer(myAns);
      setAnswer(myAns.answer_text);
    } else {
      setMyAnswer(null);
      setAnswer("");
    }

    if (partnerAns) {
      setPartnerAnswer(partnerAns);
    } else {
      setPartnerAnswer(null);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !currentSpace || !currentQuestion) return;

    setIsSubmitting(true);

    try {
      if (myAnswer) {
        // Update existing answer
        const { error } = await supabase
          .from('answers')
          .update({ answer_text: answer })
          .eq('id', myAnswer.id);

        if (error) throw error;
      } else {
        // Insert new answer
        const { error } = await supabase
          .from('answers')
          .insert({
            question_id: currentQuestion.id,
            user_name: displayName,
            answer_text: answer,
          });

        if (error) throw error;
      }

      toast({
        title: "Answer shared! 💕",
        description: "Your partner can now see your response",
      });

      loadAnswers(currentQuestion.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNewQuestion = async () => {
    // Get a random question
    const { count } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    if (count) {
      const randomOffset = Math.floor(Math.random() * count);
      const { data } = await supabase
        .from('questions')
        .select('*')
        .range(randomOffset, randomOffset)
        .single();

      if (data) {
        setCurrentQuestion(data);
        loadAnswers(data.id);
      }
    }
  };

  const goBack = () => {
    navigate(currentSpace === 'cookie' ? '/cookie' : '/senorita');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden p-4 md:p-8">
      <FloatingHearts />
      <div className="max-w-3xl mx-auto relative z-10">
        <Button 
          onClick={goBack}
          variant="ghost" 
          className="mb-6 gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/20 via-accent/30 to-transparent p-8 text-center border-b border-border/50">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                <MessageCircleHeart className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Daily Love Question</CardTitle>
              <p className="text-muted-foreground mt-2">Connecting one answer at a time</p>
            </CardHeader>
            <CardContent className="p-8 md:p-12 space-y-8">
              <div className="relative py-8">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-2xl md:text-3xl font-bold text-center leading-tight text-foreground"
                  >
                    "{currentQuestion.question_text}"
                  </motion.h2>
                </AnimatePresence>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Answer</label>
                  <Textarea
                    placeholder="Write your heart out..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="min-h-[200px] text-xl border-primary/20 focus:border-primary bg-accent/5 resize-none p-6 rounded-2xl"
                    data-testid="answer-input"
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={getNewQuestion} 
                    className="flex-1 py-6 text-lg gap-2 rounded-2xl"
                    data-testid="next-question-button"
                  >
                    <RefreshCw className="w-5 h-5" /> Next Question
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!answer.trim() || isSubmitting} 
                    className="flex-1 py-6 text-lg gap-2 rounded-2xl shadow-lg"
                    data-testid="submit-answer-button"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Share Answer
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {partnerAnswer && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-primary/10 pt-8 space-y-4"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="font-semibold">{partnerName}'s Answer</span>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                    <p className="text-lg italic font-serif leading-relaxed">"{partnerAnswer.answer_text}"</p>
                    <p className="text-sm text-muted-foreground mt-3">
                      — {partnerAnswer.user_name} • {format(new Date(partnerAnswer.created_at), 'PPp')}
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Questions;