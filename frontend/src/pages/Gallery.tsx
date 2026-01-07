import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowLeft, X, ChevronLeft, ChevronRight, Plus, Heart, Upload, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";
import { useSpace } from "@/contexts/SpaceContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Memory {
  id: string;
  image_url: string;
  caption: string | null;
  uploaded_by: string;
  created_at: string;
}

const Gallery = () => {
  const navigate = useNavigate();
  const { currentSpace, displayName } = useSpace();
  const { toast } = useToast();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    caption: "",
    preview: null as string | null
  });

  useEffect(() => {
    if (!currentSpace) {
      navigate('/');
      return;
    }
    loadPhotos();
    subscribeToPhotos();
  }, [currentSpace]);

  const loadPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading photos:', error);
      return;
    }

    setMemories(data || []);
  };

  const subscribeToPhotos = () => {
    const channel = supabase
      .channel('photos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photos'
        },
        () => {
          loadPhotos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData(prev => ({ ...prev, file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadData(prev => ({ ...prev, preview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadData.file || !currentSpace) return;

    setIsUploading(true);

    try {
      // Upload photo to Supabase Storage
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${displayName}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('mood-photos')
        .upload(fileName, uploadData.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('mood-photos')
        .getPublicUrl(fileName);

      // Save photo record to database
      const { error: dbError } = await supabase.from('photos').insert({
        image_url: publicUrl,
        caption: uploadData.caption || null,
        uploaded_by: displayName,
      });

      if (dbError) throw dbError;

      toast({
        title: "Photo uploaded! 📸",
        description: "Your memory has been added",
      });

      setUploadData({ file: null, caption: "", preview: null });
      setShowUploadForm(false);
      loadPhotos();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const nextPhoto = () => selectedIndex !== null && setSelectedIndex((selectedIndex + 1) % memories.length);
  const prevPhoto = () => selectedIndex !== null && setSelectedIndex((selectedIndex - 1 + memories.length) % memories.length);

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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50 p-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span>Our Memories</span>
                  <p className="text-sm font-normal text-muted-foreground mt-1">
                    {memories.length} captured moments
                  </p>
                </div>
              </CardTitle>
              <Button 
                className="gap-2 shadow-lg" 
                onClick={() => setShowUploadForm(!showUploadForm)}
                data-testid="add-memory-button"
              >
                {showUploadForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showUploadForm ? "Cancel" : "Add Memory"}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {showUploadForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-6 bg-accent/10 rounded-lg border border-primary/20"
                >
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div>
                      <Label htmlFor="photo-upload">Select Photo</Label>
                      {uploadData.preview ? (
                        <div className="relative mt-2">
                          <img
                            src={uploadData.preview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadData(prev => ({ ...prev, file: null, preview: null }))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="photo-upload"
                          className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Click to upload photo</span>
                          <Input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="caption">Caption (optional)</Label>
                      <Input
                        id="caption"
                        placeholder="Add a caption to your memory..."
                        value={uploadData.caption}
                        onChange={(e) => setUploadData(prev => ({ ...prev, caption: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={handleUpload}
                      disabled={!uploadData.file || isUploading}
                      className="w-full gap-2"
                      data-testid="upload-photo-button"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Memory
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {memories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group shadow-md"
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setSelectedIndex(index)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <img src={memory.image_url} alt={memory.caption || "Memory"} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col justify-end">
                      {memory.caption && <p className="text-white font-bold text-lg mb-1">{memory.caption}</p>}
                      <p className="text-white/70 text-sm">{format(new Date(memory.created_at), 'MMM d, yyyy')}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            <Button variant="ghost" size="icon" className="absolute top-6 right-6 text-white" onClick={() => setSelectedIndex(null)}><X className="w-8 h-8" /></Button>
            <Button variant="ghost" size="icon" className="absolute left-6 text-white hidden md:flex" onClick={(e) => { e.stopPropagation(); prevPhoto(); }}><ChevronLeft className="w-12 h-12" /></Button>
            
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={memories[selectedIndex].image_url} alt={memories[selectedIndex].caption || "Memory"} className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl" />
              <div className="mt-6 text-center text-white">
                <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                  {memories[selectedIndex].caption || "Our Memory"}
                  <Heart className="w-6 h-6 text-primary fill-current" />
                </h2>
                <p className="text-white/60 mt-2 text-lg">
                  By {memories[selectedIndex].uploaded_by} • {format(new Date(memories[selectedIndex].created_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </motion.div>

            <Button variant="ghost" size="icon" className="absolute right-6 text-white hidden md:flex" onClick={(e) => { e.stopPropagation(); nextPhoto(); }}><ChevronRight className="w-12 h-12" /></Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;