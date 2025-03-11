import * as React from "react";
import { Tailwind } from "@react-email/components";

interface VerificationEmailProps {
  url: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  url,
}) => (
  <Tailwind>
    <div className="font-sans leading-normal p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Verify your email address
      </h1>
      <p className="text-gray-600 mb-4">
        Thanks for signing up! Please click the button below to verify your
        email address.
      </p>
      <a
        href={url}
        className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg text-center hover:bg-blue-700 transition-colors"
      >
        Verify Email
      </a>
      <p className="text-gray-500 mt-6 text-sm">
        If you didn&apos;t request this email, you can safely ignore it.
      </p>
    </div>
  </Tailwind>
);
