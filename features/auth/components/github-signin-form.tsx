"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { GithubLogoIcon } from "@phosphor-icons/react";
import { useFormStatus } from "react-dom";
import { signInWithGithub } from "../actions";

type GithubSignInFormProps = {
  callbackUrl?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  let buttonLabel = "Continue with Github";
  let buttonIcon = <GithubLogoIcon />;
  if (pending) {
    buttonLabel = "Redirecting to Github...";
    buttonIcon = <Spinner className="size-4" />;
  }

  return (
    <Button type="submit" className="w-full" size={"lg"} disabled={pending}>
      {buttonIcon}
      {buttonLabel}
    </Button>
  );
}

export function GithubSigninForm({ callbackUrl }: GithubSignInFormProps) {
  return (
    <form action={signInWithGithub} className="w-full">
      {callbackUrl ? (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      ) : null}
      <SubmitButton />
    </form>
  );
}
