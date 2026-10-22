import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { auth } from "@/auth";

/**
 * Next.js Draft Mode Enable Route Handler
 *
 * Requirements:
 * 1. Strict Server Session Check: Requires an authenticated administrator session.
 * 2. Never accepts client-supplied roles or unverified tokens.
 * 3. Open-Redirect Neutralization: Only permits local relative routes.
 */
export async function GET(request: NextRequest) {
  const session = await auth();

  // Verify server-authenticated administrator role
  if (!session?.user || session.user.role !== "admin") {
    return new NextResponse(
      JSON.stringify({
        error: "Unauthorized",
        message: "You must be authenticated as an administrator to enable preview mode.",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const targetPath = searchParams.get("path") || "/";

  // Open-redirect protection: validate path
  // Must start with '/' and must NOT start with '//' or '/\'
  if (
    !targetPath.startsWith("/") ||
    targetPath.startsWith("//") ||
    targetPath.startsWith("/\\") ||
    targetPath.includes("://")
  ) {
    return new NextResponse(
      JSON.stringify({
        error: "Invalid Path",
        message: "The requested redirect destination is not a permitted local relative path.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Enable Next.js Draft Mode (sets bypass cookies)
  const draft = await draftMode();
  draft.enable();

  // Redirect to requested path
  const url = request.nextUrl.clone();
  url.pathname = targetPath;
  url.search = "";

  return NextResponse.redirect(url);
}
