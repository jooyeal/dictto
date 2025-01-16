"use client";

import { Button } from "./button";
import { signIn } from "next-auth/react";
import React from "react";

export default function GoogleSigninButton() {
  return (
    <Button variant="outline" className="w-full" onClick={() => signIn()}>
      Login with Google
    </Button>
  );
}
