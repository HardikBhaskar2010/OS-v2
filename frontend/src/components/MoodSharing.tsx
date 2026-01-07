import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smile, Heart, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpace } from "@/contexts/SpaceContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface Mood {
  id: string;
  user_name: string;
  mood_emoji: string;
  mood_label: string;
  mood_color: string;
  note: string | null;
  created_at: string;
}

const MoodSharing = () => {
  const { currentSpace, displayName, partnerName } = useSpace();
  const navigate = useNavigate();
  const [myMood, setMyMood] = useState<Mood | null>(null);
  const [partnerMood, setPartnerMood] = useState<Mood | null>(null);

  useEffect(() => {
    if (currentSpace) {
      loadLatestMoods();
      subscribeToMoodUpdates();
    }
  }, [currentSpace]);

  const loadLatestMoods = async () => {
    if (!currentSpace) return;

    // Get my latest mood
    const { data: myLatest } = await supabase
      .from('moods')
      .select('*')
      .eq('user_name', displayName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (myLatest) {
      setMyMood(myLatest);
    }

    // Get partner's latest mood
    const { data: partnerLatest } = await supabase
      .from('moods')
      .select('*')
      .eq('user_name', partnerName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (partnerLatest) {
      setPartnerMood(partnerLatest);
    }
  };

  const subscribeToMoodUpdates = () => {
    const channel = supabase
      .channel('mood-updates-widget')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'moods'
        },
        () => {
          loadLatestMoods();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      data-testid="mood-sharing-widget"
    >
      <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <Smile className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <span>Our Moods Today</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                Real-time emotional connection
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {/* Both Moods Display */}
          <div className="grid grid-cols-2 gap-3">
            {/* My Mood */}
            <div className="relative">
              <div 
                className="p-4 rounded-xl border-2 text-center space-y-2 min-h-[140px] flex flex-col items-center justify-center"
                style={{
                  backgroundColor: myMood ? `${myMood.mood_color}20` : 'transparent',
                  borderColor: myMood ? myMood.mood_color : 'var(--border)'
                }}
              >
                {myMood ? (
                  <>
                    <motion.span 
                      className="text-5xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {myMood.mood_emoji}
                    </motion.span>
                    <div>
                      <p className="font-semibold text-sm">{myMood.mood_label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(myMood.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">Share your mood</p>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-background border border-border rounded-full text-xs font-medium">
                You
              </div>
            </div>

            {/* Partner's Mood */}
            <div className="relative">
              <div 
                className="p-4 rounded-xl border-2 text-center space-y-2 min-h-[140px] flex flex-col items-center justify-center"
                style={{
                  backgroundColor: partnerMood ? `${partnerMood.mood_color}20` : 'transparent',
                  borderColor: partnerMood ? partnerMood.mood_color : 'var(--border)'
                }}
              >
                {partnerMood ? (
                  <>
                    <motion.span 
                      className="text-5xl"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {partnerMood.mood_emoji}
                    </motion.span>
                    <div>
                      <p className="font-semibold text-sm">{partnerMood.mood_label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(partnerMood.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <Heart className="w-8 h-8 mx-auto text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">Waiting...</p>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-background border border-border rounded-full text-xs font-medium">
                Partner
              </div>
            </div>
          </div>

          {/* Connection Animation */}
          {myMood && partnerMood && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 py-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 text-primary fill-current" />
              </motion.div>
              <span className="text-xs font-medium text-primary">Connected</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
              >
                <Heart className="w-5 h-5 text-primary fill-current" />
              </motion.div>
            </motion.div>
          )}

          {/* View Details Button */}
          <Button
            variant="outline"
            className="w-full gap-2 border-primary/20 hover:bg-primary/10"
            onClick={() => navigate('/mood')}
            data-testid="view-moods-button"
          >
            <Sparkles className="w-4 h-4" />
            Share & View Details
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MoodSharing;
