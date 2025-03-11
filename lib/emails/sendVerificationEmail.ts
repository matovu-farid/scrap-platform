import { Resend } from "resend";
import { env } from "@/env";
import { VerificationEmail } from "./VerificationEmail";

const resend = new Resend(env.AUTH_RESEND_KEY);

interface SendVerificationEmailParams {
  to: string;
  subject: string;
  text: string;
}

export async function sendVerificationEmail({
  to,
  subject,
  text,
}: SendVerificationEmailParams) {
  "use server";

  const url = text.split("Click the link to verify your email: ")[1];

  try {
    const { data, error } = await resend.emails.send({
      from: "Scrap Platform <no-reply@scrap-platform.com>",
      to: [to],
      subject: subject,
      react: VerificationEmail({ url }),
      text: text, // Fallback plain text version
    });

    if (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
