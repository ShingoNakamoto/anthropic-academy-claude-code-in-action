"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "signin" | "signup";
}

export function AuthDialog({
  open,
  onOpenChange,
  defaultMode = "signin",
}: AuthDialogProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin" ? "おかえりなさい" : "アカウント作成"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "アカウントにサインインして続行"
              : "AIでReactコンポーネントを作成しましょう"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {mode === "signin" ? (
            <SignInForm onSuccess={handleSuccess} />
          ) : (
            <SignUpForm onSuccess={handleSuccess} />
          )}
        </div>

        <div className="mt-4 text-center text-sm">
          {mode === "signin" ? (
            <>
              アカウントをお持ちでないですか？{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setMode("signup")}
              >
                新規登録
              </Button>
            </>
          ) : (
            <>
              すでにアカウントをお持ちですか？{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setMode("signin")}
              >
                サインイン
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
