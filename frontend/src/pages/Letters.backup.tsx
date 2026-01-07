import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Heart, ArrowLeft, Feather, Sparkles, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";
import { useSpace } from "@/contexts/SpaceContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface LoveLetter {
  id: string;
  title: string;
  content: string;
  from_user: string;
  to_user: string;
  created_at: string;
}

const Letters = () => {
  const navigate = useNavigate();
  const { currentSpace, displayName, partnerName } = useSpace();
  const { toast } = useToast();
  const [letters, setLetters] = useState<LoveLetter[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [newLetter, setNewLetter] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentSpace) {
      navigate('/');
      return;
    }
    loadLetters();
    subscribeToLetters();
  }, [currentSpace]);

  const loadLetters = async () => {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading letters:', error);
      return;
    }

    setLetters(data || []);
  };

  const subscribeToLetters = () => {
    const channel = supabase
      .channel('letters-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'letters'
        },
        (payload) => {
          console.log('Letter update:', payload);
          loadLetters();
          
          // Show notification when partner sends a letter
          if (payload.eventType === 'INSERT' && payload.new.from_user !== displayName) {
            toast({
              title: "New Love Letter! 💌",
              description: `${partnerName} sent you a love letter`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async () => {
    if (!newLetter.title || !newLetter.content || !currentSpace) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('letters').insert({
        title: newLetter.title,
        content: newLetter.content,
        from_user: displayName,
        to_user: partnerName,
      });

      if (error) throw error;

      toast({
        title: "Letter sent! 💕",
        description: "Your love letter has been delivered",
      });

      setNewLetter({ title: "", content: "" });
      setIsWriting(false);
      loadLetters();
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

  const goBack = () => {
    navigate(currentSpace === 'cookie' ? '/cookie' : '/senorita');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden p-4 md:p-8">
      <FloatingHearts />
      <div className="max-w-4xl mx-auto relative z-10">
        <Button 
          onClick={goBack}
          variant="ghost" 
          className="mb-6 gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden min-h-[60vh]">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50 p-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span>Love Letters</span>
                  <p className="text-sm font-normal text-muted-foreground mt-1">
                    {letters.length} heartfelt messages exchanged
                  </p>
                </div>
              </CardTitle>
              <Button
                variant={isWriting ? "secondary" : "default"}
                onClick={() => setIsWriting(!isWriting)}
                className="gap-2"
                data-testid="write-letter-button"
              >
                {isWriting ? <X className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
                {isWriting ? "Cancel" : "Write a Letter"}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {isWriting ? (
                  <motion.div
                    key="write"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6 max-w-2xl mx-auto py-4"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-medium">Write from your heart...</span>
                    </div>
                    <Input
                      placeholder="Give your letter a title..."
                      value={newLetter.title}
                      onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
                      className="text-lg py-6 border-primary/20 focus:border-primary bg-card/50"
                      data-testid="letter-title-input"
                    />
                    <Textarea
                      placeholder="Pour your heart out here..."
                      value={newLetter.content}
                      onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                      className="min-h-[300px] text-lg border-primary/20 focus:border-primary bg-card/50 resize-none leading-relaxed"
                      data-testid="letter-content-input"
                    />
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full py-8 text-lg gap-3 shadow-lg"
                      disabled={!newLetter.title || !newLetter.content || isSubmitting}
                      data-testid="send-letter-button"
                    >
                      {isSubmitting ? (
                        <>
                          <Sparkles className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Letter
                          <Heart className="w-5 h-5 fill-current animate-pulse-heart" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="list" className="grid gap-4 md:grid-cols-2">
                    {letters.length === 0 ? (
                      <div className="col-span-2 text-center py-12 text-muted-foreground">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No letters yet. Write your first love letter!</p>
                      </div>
                    ) : (
                      letters.map((letter, index) => (
                        <motion.div
                          key={letter.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group cursor-pointer"
                          onClick={() => setSelectedLetter(letter)}
                        >
                          <Card className="h-full bg-accent/20 border-primary/10 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                  {letter.title}
                                </h3>
                                <Heart className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                                {letter.content}
                              </p>
                              <div className="flex justify-between items-center text-sm pt-4 border-t border-primary/5">
                                <span className="text-primary font-semibold">— {letter.from_user}</span>
                                <span className="text-muted-foreground">{format(new Date(letter.created_at), "MMM d, yyyy")}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-card rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-primary/20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLetter(null)}
                className="absolute top-4 right-4"
              >
                <X className="w-6 h-6" />
              </Button>
              
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 text-primary mb-2 bg-primary/10 px-4 py-1 rounded-full">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Love Letter</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">{selectedLetter.title}</h2>
                <p className="text-muted-foreground">
                  {format(new Date(selectedLetter.created_at), "MMMM d, yyyy")}
                </p>
              </div>
              
              <div className="bg-accent/10 rounded-2xl p-8 mb-8 border border-primary/5 shadow-inner">
                <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap font-serif italic text-center">
                  "{selectedLetter.content}"
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="h-px bg-primary/20 flex-1" />
                <p className="text-2xl font-bold text-primary flex items-center gap-3 italic">
                  — {selectedLetter.from_user}
                  <Heart className="w-6 h-6 fill-current animate-pulse-heart" />
                </p>
                <div className="h-px bg-primary/20 flex-1" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Letters;