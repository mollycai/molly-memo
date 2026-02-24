"use client";

import { Button } from "@/components/ui/button";
import { Type, Sticker, Download, RotateCcw } from "lucide-react";

interface EditorToolbarProps {
  onAddText: () => void;
  onAddSticker: () => void;
  onDownload: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function EditorToolbar({
  onAddText,
  onAddSticker,
  onDownload,
  onUndo,
  canUndo,
}: EditorToolbarProps) {
  return (
    <div className="shrink-0 grid grid-cols-4 gap-2 p-2 bg-secondary/30 backdrop-blur-xl rounded-2xl mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Button
        variant="ghost"
        className="flex flex-col gap-1 h-16 rounded-xl hover:bg-background/50"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <RotateCcw className="h-6 w-6" />
        <span className="text-[10px]">撤销</span>
      </Button>
      <Button
        variant="ghost"
        className="flex flex-col gap-1 h-16 rounded-xl hover:bg-background/50"
        onClick={onAddText}
      >
        <Type className="h-6 w-6" />
        <span className="text-[10px]">文字</span>
      </Button>
      <Button
        variant="ghost"
        className="flex flex-col gap-1 h-16 rounded-xl hover:bg-background/50"
        onClick={onAddSticker}
      >
        <Sticker className="h-6 w-6" />
        <span className="text-[10px]">贴纸</span>
      </Button>
      <Button
        variant="ghost"
        className="flex flex-col gap-1 h-16 rounded-xl hover:bg-background/50 text-primary"
        onClick={onDownload}
      >
        <Download className="h-6 w-6" />
        <span className="text-[10px]">保存</span>
      </Button>
    </div>
  );
}
