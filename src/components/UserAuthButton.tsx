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

export function UserAuthButton() {
  const { isLoggedIn, logout } = useUserStore();

  return (
    <div className="fixed top-4 right-4 z-50">
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border border-border shadow-sm">
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">用户</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
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
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>退出登录</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="rounded-full shadow-lg bg-white/80 backdrop-blur-md text-foreground hover:bg-white border border-black/5 dark:bg-black/80 dark:text-white dark:hover:bg-black dark:border-white/10 transition-all gap-2"
              variant="outline"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">登录 / 注册</span>
            </Button>
          </DialogTrigger>
          <AuthModal />
        </Dialog>
      )}
    </div>
  );
}
