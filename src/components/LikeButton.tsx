"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/app/actions";

export default function LikeButton({ 
  componentId, 
  initialLikes 
}: { 
  componentId: string, 
  initialLikes: number 
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    // Optimistic Update: Change the UI immediately
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);

    // Save to MongoDB
    await toggleLikeAction(componentId, isLiked);
  };

  return (
    <button 
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${
        isLiked 
        ? "bg-pink-50 border-pink-200 text-pink-600" 
        : "bg-white border-slate-200 text-slate-500 hover:border-pink-200 hover:text-pink-500"
      }`}
    >
      <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
      <span className="text-sm tracking-tight">{likes}</span>
    </button>
  );
}