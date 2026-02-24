"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus, Sparkles, Search, Wand2 } from "lucide-react";
import Link from "next/link";
// import { UserAuthButton } from "@/components/UserAuthButton";
import { useUserStore } from "@/lib/user-store";

export default function Home() {
  const { isLoggedIn } = useUserStore();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />

      {/* 右上角悬浮登录/用户信息按钮 */}
      {/* <UserAuthButton /> */}

      {/* 模拟移动端容器 */}
      <main className="w-full max-w-[480px] flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 z-10">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center gap-6 mt-8 mb-4">
          <div className="relative group">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
             <div className="relative w-28 h-28 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl flex items-center justify-center text-5xl border border-white/40 ring-1 ring-black/5 transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
               🤪
             </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              Molly Memo
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed px-4 font-light">
              AI 驱动的表情包生成器
            </p>
          </div>
        </header>

        {/* Primary Action - Upload & Create */}
        <Card className="group relative overflow-hidden p-1 rounded-[2.5rem] border-0 shadow-2xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl ring-1 ring-white/20 transition-all hover:shadow-3xl hover:ring-white/40">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex flex-col gap-6 p-6 items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-2 group-hover:scale-110 transition-transform duration-500">
              <Sparkles size={32} strokeWidth={2} />
            </div>
            
            <div className="space-y-2 max-w-[280px]">
              <h2 className="text-2xl font-semibold tracking-tight">开始创作</h2>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                上传图片，让 AI 为你注入灵魂文案
              </p>
            </div>

            <Button size="lg" className="w-full rounded-full h-14 text-base font-semibold shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98]" asChild>
              <Link href="/create">
                <ImagePlus className="mr-2 h-5 w-5" />
                上传图片
              </Link>
            </Button>
          </div>
        </Card>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto py-6 flex flex-col gap-3 rounded-[2rem] border-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ring-1 ring-white/20" asChild>
            <Link href="/text-search" className="cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Search size={20} />
              </div>
              <div className="text-center">
                <span className="block font-semibold text-foreground">文字搜图</span>
                <span className="text-xs text-muted-foreground mt-1">描述找表情</span>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto py-6 flex flex-col gap-3 rounded-[2rem] border-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ring-1 ring-white/20" asChild>
            <Link href="/ai-generate" className="cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                <Wand2 size={20} />
              </div>
              <div className="text-center">
                <span className="block font-semibold text-foreground">AI 生成</span>
                <span className="text-xs text-muted-foreground mt-1">描述生成表情</span>
              </div>
            </Link>
          </Button>
        </div>

        {/* Login Tip */}
        {!isLoggedIn && (
          <div className="flex flex-col items-center gap-2 animate-in fade-in duration-700 delay-300">
            <p className="text-xs text-muted-foreground/60 px-8 text-center bg-white/30 dark:bg-black/30 backdrop-blur-md py-2 rounded-full ring-1 ring-white/10">
              登录后可保存创作记录 · 游客可直接使用
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto py-8 text-center">
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
            Designed for fun
          </p>
        </footer>

      </main>
    </div>
  );
}
