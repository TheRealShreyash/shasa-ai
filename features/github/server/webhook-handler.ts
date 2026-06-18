import { NextRequest, NextResponse } from "next/server";
import { getGithubApp } from "./utils/github-app";
import { savePullRequest } from "@/features/reviews/server/save-pull-request";

const REVIEWABLE_ACTIONS = ["opened", "synchronize", "reopened"];

export type PullRequestWebhookPayload = {
  /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
  action: string;
  /** GitHub App installation that received the event */
  installation: { id: number };
  repository: { full_name: string };
  pull_request: {
    number: number;
    title: string;
    user: { login: string } | null;
    head: { sha: string };
    base: { ref: string };
  };
};

export async function handleGithubWebhook(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  const eventName = req.headers.get("x-github-event");

  const isValid = await isSignatureValid(payload, signature);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
  }

  if (eventName !== "pull_request") {
    return NextResponse.json({ recieved: true });
  }

  const event = JSON.parse(payload) as PullRequestWebhookPayload;

  console.log(event)

  if (!REVIEWABLE_ACTIONS.includes(event.action)) {
    return NextResponse.json({ recieved: true });
  }

  const pullRequest = await savePullRequest(event);

  // todo : map github's installation id
  // todo : trigger the review job

  return NextResponse.json({ recieved: true });
}

async function isSignatureValid(payload: string, signature: string | null) {
  if (!signature) {
    return false;
  }

  const app = getGithubApp();
  return app.webhooks.verify(payload, signature);
}
