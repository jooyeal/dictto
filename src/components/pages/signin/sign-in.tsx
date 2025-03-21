"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Signin() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Dictto
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Button
            onClick={async () => {
              await signIn();
            }}
          >
            Login with Google
          </Button>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/logo.png"
          alt="logo image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
