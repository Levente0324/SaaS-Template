/**
 * app/api/ai/run/route.ts
 * Main AI execution endpoint.
 *
 * Validates inputs, checks permissions/limits, and executes the requested tool.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/helpers";
import { AIRunSchema } from "@/lib/validation";
import { runAITool } from "@/lib/ai/run-tool";
import { safeErrorResponse, Errors } from "@/lib/errors";
import { logError } from "@/lib/logging";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const user = await requireUser();

    // 2. Parse Body
    const body = await request.json().catch(() => ({}));
    const parsed = AIRunSchema.safeParse(body);

    if (!parsed.success) {
      throw Errors.invalidInput(parsed.error.errors[0].message);
    }

    const { toolName, input } = parsed.data;

    // 3. Execute Tool (handles all security/billing checks internally)
    const result = await runAITool({
      userId: user.id,
      toolName,
      input,
    });

    return NextResponse.json(result);
  } catch (error) {
    logError(error, { route: "/api/ai/run" });
    const { status, body } = safeErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
