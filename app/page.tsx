"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { authClient } from "@/lib/auth-client";
import { UserMenuWithSession } from "@/features/auth/components/user-menu";

const Home = () => {
  const { data } = authClient.useSession();
  console.log(data?.user);

  return (
    <div>
      Hi I am shreyash
      <Button>Hello</Button>
      <ModeToggle />
      <UserMenuWithSession />
    </div>
  );
};

export default Home;
