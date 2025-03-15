import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface PasswordResetEmailProps {
  url: string;
}

export function PasswordResetEmail({ url }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for Scrap Platform</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4">
            <Section className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <Text className="text-2xl font-bold text-center text-gray-900 mb-4">
                Reset Your Password
              </Text>
              <Text className="text-gray-600 mb-6">
                We received a request to reset your password. Click the button
                below to create a new password:
              </Text>
              <Button
                href={url}
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium w-full text-center"
              >
                Reset Password
              </Button>
              <Text className="text-sm text-gray-500 mt-6">
                If you didn&apos;t request this password reset, you can safely
                ignore this email.
              </Text>
              <Hr className="border-gray-200 my-6" />
              <Text className="text-xs text-gray-400 text-center">
                This is an automated email, please do not reply.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
