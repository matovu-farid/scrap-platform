import { Resend } from "resend";
import { env } from "@/env";
import { PasswordResetEmail } from "./PasswordResetEmail";

const resend = new Resend(env.AUTH_RESEND_KEY);

interface SendPasswordResetEmailProps {
  to: string;
  subject: string;
  text: string;
}

export async function sendPasswordResetEmail({
  to,
  subject,
  text,
}: SendPasswordResetEmailProps) {
  "use server";

  const url = text.split("Click the link to reset your password: ")[1];

  try {
    const { data, error } = await resend.emails.send({
      from: "Scrap Platform <no-reply@scrap-platform.com>",
      to: [to],
      subject: subject,
      react: PasswordResetEmail({ url }),
      text: text, // Fallback plain text version
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }

    return data;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}
