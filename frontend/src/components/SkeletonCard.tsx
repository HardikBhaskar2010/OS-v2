import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SkeletonCardProps {
  variant?: 'default' | 'gallery' | 'list';
}

const SkeletonCard = ({ variant = 'default' }: SkeletonCardProps) => {
  if (variant === 'gallery') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="aspect-[4/5] rounded-2xl bg-muted/50 animate-pulse"
      />
    );
  }

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg border border-border bg-card"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-muted/50 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted/50 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6">
        <div className="space-y-3">
          <div className="h-6 bg-muted/50 rounded animate-pulse w-2/3" />
          <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-2">
          <div className="h-4 bg-muted/50 rounded animate-pulse" />
          <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-muted/50 rounded animate-pulse w-4/6" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;