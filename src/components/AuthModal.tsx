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
import { Mail, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/lib/user-store";
import { authApi } from "@/lib/auth-api";
import { toast } from "sonner";

export function AuthModal({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useUserStore();

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Form State
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  
  // Countdown State
  const [countdown, setCountdown] = useState(0);

  // Password Visibility State
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendCode = async () => {
    if (!registerEmail) {
      toast.error("请输入邮箱地址");
      return;
    }
    
    try {
      setIsLoading(true);
      
      await authApi.sendCode({ email: registerEmail });

      toast.success("验证码已发送");
      
      // Start countdown
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
    } catch (error: any) {
      toast.error(error.response?.data?.error || "发送验证码失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("请填写完整信息");
      return;
    }

    try {
      setIsLoading(true);
      
      const data = await authApi.login({ email: loginEmail, password: loginPassword });

      setAuth(data.token, data.user);
      toast.success("登录成功");
      onOpenChange?.(false);
    } catch (error: any) {
      toast.error(error.message || "登录失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !code) {
      toast.error("请填写完整信息");
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }

    try {
      setIsLoading(true);
      
      const data = await authApi.register({ 
        email: registerEmail, 
        password: registerPassword, 
        code 
      });

      setAuth(data.token, data.user);
      toast.success("注册成功");
      onOpenChange?.(false);
    } catch (error: any) {
      toast.error(error.message || "注册失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">
      <div className="p-6 pt-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-b">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center tracking-tight">
            {activeTab === "login" ? "欢迎回来" : "加入 Molly Memo"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground/80">
            {activeTab === "login"
              ? "登录账号，继续你的表情包创作"
              : "注册账号，开启 AI 表情包创作之旅"}
          </DialogDescription>
        </DialogHeader>
      </div>
      
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 focus-visible:ring-0 focus-visible:outline-none mt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-9" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密码</Label>
                  <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary" type="button">
                    忘记密码?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showLoginPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-9 pr-9"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg" type="submit" disabled={isLoading}>
                {isLoading ? "登录中..." : "立即登录"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4 focus-visible:ring-0 focus-visible:outline-none mt-0">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-9"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">验证码</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="code" 
                      placeholder="6位验证码" 
                      className="pl-9"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-28 whitespace-nowrap"
                    disabled={countdown > 0 || isLoading}
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
                  <Input 
                    id="register-password" 
                    type={showRegisterPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-9 pr-9"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">确认密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-9 pr-9"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg" type="submit" disabled={isLoading}>
                {isLoading ? "注册中..." : "注册账号"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
}
