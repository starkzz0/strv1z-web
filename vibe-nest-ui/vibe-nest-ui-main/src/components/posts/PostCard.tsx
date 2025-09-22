import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface PostCardProps {
  id: string;
  author: string;
  isAnonymous?: boolean;
  timeAgo: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isVerified?: boolean;
}

export const PostCard = ({
  author,
  isAnonymous = false,
  timeAgo,
  title,
  content,
  tags,
  likes,
  comments,
  isLiked = false,
  isSaved = false,
  isVerified = false,
}: PostCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <article className="bg-card border border-border rounded-[var(--radius)] p-4 space-y-3 hover:shadow-[var(--shadow-card)] transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isAnonymous ? (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {author.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {isAnonymous ? "Anonymous" : author}
              </span>
              {isVerified && (
                <Badge variant="secondary" className="text-xs bg-[hsl(var(--accent-soft))] text-accent">
                  Counsellor
                </Badge>
              )}
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">{timeAgo}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground leading-snug">{title}</h3>
        <p className="text-foreground text-sm leading-relaxed">{content}</p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs bg-muted text-muted-foreground border-border hover:bg-[hsl(var(--primary-soft))] hover:text-primary hover:border-primary cursor-pointer transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-2 ${
              liked 
                ? "text-destructive hover:text-destructive" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span className="text-sm">{likeCount}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{comments}</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Share className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSaved(!saved)}
            className={`h-8 w-8 ${
              saved 
                ? "text-primary hover:text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </article>
  );
};