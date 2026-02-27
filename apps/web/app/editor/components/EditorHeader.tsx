"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface EditorHeaderProps {
  onDownload: () => void;
}

export function EditorHeader({ onDownload }: EditorHeaderProps) {
  return (
    <header className="flex items-center justify-between w-full shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-10 w-10 hover:bg-secondary/80"
        asChild
      >
        <Link href="/create">
          <ChevronLeft className="h-6 w-6 text-foreground/80" />
        </Link>
      </Button>
      <h1 className="text-lg font-semibold tracking-tight">编辑表情</h1>
      <Button
        variant="ghost"
        size="sm"
        className="text-primary font-medium"
        onClick={onDownload}
      >
        完成
      </Button>
    </header>
  );
}
