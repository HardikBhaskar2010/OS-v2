import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Heart, ArrowLeft, Sparkles, Check, Camera, Upload, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FloatingHearts from "@/components/FloatingHearts";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonCard from "@/components/SkeletonCard";
import { useSpace } from "@/contexts/SpaceContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const romanticMoods = [
  { emoji: "😍", label: "In Love", color: "#ec4899" },
  { emoji: "🥰", label: "Blissful", color: "#f472b6" },
  { emoji: "😘", label: "Missing You", color: "#fb923c" },
  { emoji: "💕", label: "Grateful", color: "#c084fc" },
  { emoji: "😊", label: "Happy", color: "#fbbf24" },
  { emoji: "🌙", label: "Dreamy", color: "#6366f1" },
  { emoji: "✨", label: "Excited", color: "#22d3ee" },
  { emoji: "🤗", label: "Cozy", color: "#a78bfa" },
];

const reactionEmojis = ["❤️", "🥰", "🤗", "💋", "🔥", "😍"];

interface Mood {
  id: string;
  user_name: string;
  mood_emoji: string;
  mood_label: string;
  mood_color: string;
  note: string | null;
  photo_url: string | null;
  created_at: string;
}

const MoodEnhanced = () => {
  const navigate = useNavigate();
  const { currentSpace, displayName, partnerName } = useSpace();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#ec4899");
  const [note, setNote] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [partnerLatestMood, setPartnerLatestMood] = useState<Mood | null>(null);
  const [myLatestMood, setMyLatestMood] = useState<Mood | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentSpace) {
      navigate('/');
      return;
    }
    const init = async () => {
      await loadMoods();
      await loadLatestMoods();
      setIsLoading(false);
    };
    init();
    subscribeToMoodUpdates();
  }, [currentSpace]);

  const loadMoods = async () => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setMoods(data || []);
    } catch (error: any) {
      console.error('Error loading moods:', error);
      toast({
        title: "Error loading moods",
        description: "Please check your connection",
        variant: "destructive",
      });
    }
  };

  const loadLatestMoods = async () => {
    // Get my latest mood
    const { data: myMood } = await supabase
      .from('moods')
      .select('*')
      .eq('user_name', displayName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (myMood) {
      setMyLatestMood(myMood);
    }

    // Get partner's latest mood
    const { data: partnerMood } = await supabase
      .from('moods')
      .select('*')
      .eq('user_name', partnerName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (partnerMood) {
      setPartnerLatestMood(partnerMood);
    }
  };

  const subscribeToMoodUpdates = () => {
    const channel = supabase
      .channel('mood-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'moods'
        },
        (payload) => {
          console.log('Mood update received:', payload);
          loadMoods();
          loadLatestMoods();

          // Show notification for partner's new mood
          if (payload.eventType === 'INSERT' && payload.new.user_name !== displayName) {
            toast({
              title: "New mood update! 💕",
              description: "Your partner just shared their mood",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitMood = async () => {
    if (selectedMood === null || !currentSpace) return;

    // Validate note length
    if (note && note.length > 500) {
      toast({
        title: "Note too long",
        description: "Please keep your note under 500 characters",
        variant: "destructive",
      });
      return;
    }

    // Validate photo size (5MB max)
    if (photoFile && photoFile.size > 5 * 1024 * 1024) {
      toast({
        title: "Photo too large",
        description: "Please choose a photo under 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl = null;

      // Upload photo if selected
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${displayName}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('mood-photos')
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('mood-photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      // Insert mood
      const { error } = await supabase.from('moods').insert({
        user_name: displayName,
        mood_emoji: romanticMoods[selectedMood].emoji,
        mood_label: romanticMoods[selectedMood].label,
        mood_color: selectedColor,
        note: note || null,
        photo_url: photoUrl,
      });

      if (error) throw error;

      toast({
        title: "Mood shared! 💕",
        description: "Your partner has been notified",
      });

      // Reset form
      setSelectedMood(null);
      setNote("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setSelectedColor("#ec4899");

      loadMoods();
      loadLatestMoods();
    } catch (error: any) {
      toast({
        title: "Error sharing mood",
        description: error.message || "Please try again",
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
      <div className="max-w-6xl mx-auto relative z-10">
        <Button 
          onClick={goBack}
          variant="ghost" 
          className="mb-6 gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Share Mood Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2">
                  <Smile className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl">How are you feeling?</CardTitle>
                <p className="text-muted-foreground">Share your mood with your loved one</p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Mood Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Choose your mood</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {romanticMoods.map((mood, index) => (
                      <motion.button
                        key={mood.label}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all relative ${
                          selectedMood === index
                            ? "border-primary shadow-lg"
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{
                          backgroundColor: selectedMood === index ? `${mood.color}20` : 'transparent'
                        }}
                        onClick={() => {
                          setSelectedMood(index);
                          setSelectedColor(mood.color);
                        }}
                        data-testid={`mood-option-${mood.label.toLowerCase().replace(' ', '-')}`}
                      >
                        <span className="text-4xl mb-1">{mood.emoji}</span>
                        <span className="text-xs font-medium">{mood.label}</span>
                        {selectedMood === index && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full"
                          >
                            <Check className="w-3 h-3" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                {selectedMood !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Label className="text-sm font-medium mb-2 block">Mood color</Label>
                    <div className="flex gap-2">
                      {["#ec4899", "#f472b6", "#fb923c", "#c084fc", "#fbbf24", "#6366f1", "#22d3ee", "#a78bfa"].map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full border-2 ${
                            selectedColor === color ? "border-foreground scale-110" : "border-border"
                          } transition-all`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Note */}
                {selectedMood !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Label className="text-sm font-medium mb-2 block">Add a note (optional)</Label>
                    <Textarea
                      placeholder="Tell your partner what's on your mind..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="resize-none border-primary/20"
                      rows={3}
                      data-testid="mood-note-input"
                    />
                  </motion.div>
                )}

                {/* Photo Upload */}
                {selectedMood !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Label className="text-sm font-medium mb-2 block">Add a photo (optional)</Label>
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPreview(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="mood-photo"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload photo</span>
                        <Input
                          id="mood-photo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    )}
                  </motion.div>
                )}

                {/* Submit Button */}
                {selectedMood !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Button
                      onClick={handleSubmitMood}
                      disabled={isSubmitting}
                      className="w-full gap-2"
                      size="lg"
                      data-testid="share-mood-button"
                    >
                      {isSubmitting ? (
                        <>
                          <Sparkles className="w-5 h-5 animate-spin" />
                          Sharing...
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 fill-current" />
                          Share Mood
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Partner's Latest Mood */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary fill-current" />
                  {partnerName}'s Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                {partnerLatestMood ? (
                  <motion.div
                    className="p-6 rounded-xl border-2"
                    style={{
                      backgroundColor: `${partnerLatestMood.mood_color}20`,
                      borderColor: partnerLatestMood.mood_color
                    }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-6xl">{partnerLatestMood.mood_emoji}</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">{partnerLatestMood.mood_label}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {format(new Date(partnerLatestMood.created_at), 'PPp')}
                        </p>
                        {partnerLatestMood.note && (
                          <p className="text-sm italic mb-3 p-3 bg-background/50 rounded-lg">
                            "{partnerLatestMood.note}"
                          </p>
                        )}
                        {partnerLatestMood.photo_url && (
                          <img
                            src={partnerLatestMood.photo_url}
                            alt="Mood"
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Waiting for {partnerName}'s first mood...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Mood History Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Mood History
              </CardTitle>
              <p className="text-muted-foreground">A timeline of your shared feelings</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {moods.map((mood, index) => (
                  <motion.div
                    key={mood.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: `${mood.mood_color}10`,
                      borderColor: `${mood.mood_color}40`
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{mood.mood_emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-lg">
                            {mood.user_name} - {mood.mood_label}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(mood.created_at), 'PPp')}
                          </span>
                        </div>
                        {mood.note && (
                          <p className="text-sm mb-2 italic">"{mood.note}"</p>
                        )}
                        {mood.photo_url && (
                          <img
                            src={mood.photo_url}
                            alt="Mood"
                            className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodEnhanced;