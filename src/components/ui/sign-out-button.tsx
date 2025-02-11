"use client";

import React from "react";
import { Button } from "./button";
import { signOut } from "next-auth/react";

export default function SignoutButton() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}
