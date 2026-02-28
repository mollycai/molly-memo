"use client";

import { X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface MobileSaveModalProps {
  imageUrl: string;
  onClose: () => void;
}

export function MobileSaveModal({ imageUrl, onClose }: MobileSaveModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    
    // Trigger animation in next frame
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      document.body.style.overflow = "auto";
      cancelAnimationFrame(timer);
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div 
        className={`relative w-[85%] max-w-sm flex flex-col gap-6 transition-all duration-500 ease-out ${mounted ? "translate-y-0 scale-100" : "translate-y-4 scale-95"}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the content
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          onClick={onClose}
        >
          <X size={24} />
        </Button>

        {/* Image Card */}
        <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl bg-white/5 border border-white/10 ring-1 ring-white/20">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-50" />
            
            {/* The Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt="Generated Meme" 
              className="relative w-full h-auto object-contain block touch-callout-default select-none pointer-events-auto"
              // Add inline style to ensure long-press works on all devices
              style={{ WebkitTouchCallout: 'default' }}
            />
            
            {/* Tip Overlay (Fades out after a few seconds could be nice, but keep it simple for now) */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center text-center gap-1">
               <div className="w-12 h-1 rounded-full bg-white/20 mb-2" />
               <p className="text-white font-medium text-sm flex items-center gap-2 animate-pulse">
                 <Share2 size={14} /> 长按图片保存
               </p>
               <p className="text-white/60 text-[10px]">
                 保存到相册后即可分享
               </p>
            </div>
        </div>

        {/* Action Button (Optional, maybe for sharing via Web Share API if supported, but image long-press is primary) */}
        {/* <Button className="w-full rounded-full bg-white text-black hover:bg-white/90 h-12 font-medium shadow-lg shadow-white/10">
          <Download className="mr-2 h-4 w-4" />
          保存图片
        </Button> */}
      </div>
    </div>
  );
}
