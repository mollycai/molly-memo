"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, KeyRound } from "lucide-react";

export function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟发送验证码倒计时
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">
      <div className="p-6 pt-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-b">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center tracking-tight">
            {isLogin ? "欢迎回来" : "加入 Molly Memo"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground/80">
            {isLogin
              ? "登录账号，继续你的表情包创作"
              : "注册账号，开启 AI 表情包创作之旅"}
          </DialogDescription>
        </DialogHeader>
      </div>
      
      <div className="p-6">
        <Tabs defaultValue="login" className="w-full" onValueChange={(v) => setIsLogin(v === 'login')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 focus-visible:ring-0 focus-visible:outline-none mt-0">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="name@example.com" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
                <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary">
                  忘记密码?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-9" />
              </div>
            </div>
            <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg" type="submit" disabled={isLoading}>
              {isLoading ? "登录中..." : "立即登录"}
            </Button>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4 focus-visible:ring-0 focus-visible:outline-none mt-0">
            <div className="space-y-2">
              <Label htmlFor="register-email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="register-email" type="email" placeholder="name@example.com" className="pl-9" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">验证码</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="code" placeholder="6位验证码" className="pl-9" />
                </div>
                <Button 
                  variant="outline" 
                  className="w-28 whitespace-nowrap"
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                  type="button"
                >
                  {countdown > 0 ? `${countdown}s` : "获取验证码"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">设置密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="register-password" type="password" placeholder="••••••••" className="pl-9" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">确认密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-9" />
              </div>
            </div>
            
            <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg" type="submit" disabled={isLoading}>
              {isLoading ? "注册中..." : "注册账号"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
}
