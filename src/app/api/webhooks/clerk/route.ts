import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { supabase } from "@/lib/supabase";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

async function handler(request: Request) {
  const payload = await request.json();
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there is no webhook secret, throw an error
  if (!webhookSecret) {
    throw new Error("Missing webhook secret");
  }

  // If there are no headers, throw an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error("Missing svix headers");
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    // Verify the webhook payload
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, first_name, last_name } = evt.data;

    try {
      const { error } = await supabase.from("curated_list_users").insert({
        clerk_id: id,
        first_name: first_name || null,
        last_name: last_name || null,
      });

      if (error) throw error;

      return new Response("User created in Supabase", { status: 200 });
    } catch (error) {
      console.error("Error creating user in Supabase:", error);
      return new Response("Error creating user in Supabase", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}

export const POST = handler;
