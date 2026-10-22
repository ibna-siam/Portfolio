import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

/**
 * Next.js Draft Mode Disable Route Handler
 *
 * Disables preview mode cookies and redirects to the clean public path.
 */
export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const { searchParams } = new URL(request.url);
  const targetPath = searchParams.get("path") || "/";

  // Open-redirect protection
  const safePath =
    targetPath.startsWith("/") &&
    !targetPath.startsWith("//") &&
    !targetPath.startsWith("/\\") &&
    !targetPath.includes("://")
      ? targetPath
      : "/";

  const url = request.nextUrl.clone();
  url.pathname = safePath;
  url.search = "";

  return NextResponse.redirect(url);
}
