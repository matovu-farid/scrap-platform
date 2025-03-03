import { createMetreEvent } from "@lib/stripe";
import { z } from "zod";

const createMeterEventSchema = z.object({
  apiKey: z.string(),
  value: z.number(),
});



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = createMeterEventSchema.parse(body);
    const apiKey = parsedBody.apiKey;
    createMetreEvent(apiKey, parsedBody.value);
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }
    return new Response("Unknown error", { status: 400 });
  }
}
