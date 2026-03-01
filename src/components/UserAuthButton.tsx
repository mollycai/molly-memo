"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AuthModal } from "@/components/AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, History, User } from "lucide-react";
import { useUserStore } from "@/lib/user-store";
import { authApi } from "@/lib/auth-api";
import { useState } from "react";
import { toast } from "sonner";

export function UserAuthButton() {
  const { isLoggedIn, logout, user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("退出登录失败:", error);
      toast.error("退出登录失败，请稍后重试");
    } finally {
      logout();
      toast.success("已退出登录");
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border border-border shadow-sm">
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "ME"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "用户"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <History className="mr-2 h-4 w-4" />
              <span>编辑历史</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>个人中心</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>退出登录</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="rounded-full shadow-lg bg-white/80 backdrop-blur-md text-foreground hover:bg-white border border-black/5 dark:bg-black/80 dark:text-white dark:hover:bg-black dark:border-white/10 transition-all gap-2"
              variant="outline"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">登录 / 注册</span>
            </Button>
          </DialogTrigger>
          <AuthModal onOpenChange={setIsOpen} />
        </Dialog>
      )}
    </div>
  );
}
