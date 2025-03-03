import { validateApiKey } from "@lib/apikey";
import { z } from "zod";

const validateApiKeySchema = z.object({
  apiKey: z.string(),
});

const validateApiKeyResponseSchema = z.object({
  isValid: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = validateApiKeySchema.parse(body);
    const isValid = await validateApiKey(parsedBody.apiKey);
    return new Response(JSON.stringify(validateApiKeyResponseSchema.parse({ isValid })), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
      });
    }
    return new Response("Unknown error", { status: 401 });
  }
}
