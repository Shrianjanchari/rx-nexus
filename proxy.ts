import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user) {
    const protectedPaths = [
      "/dashboard",
      "/refills",
      "/providers",
      "/pharmacy",
      "/patients",
      "/analytics",
      "/settings",
      "/patient",
    ];

    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (isProtectedPath) {
      const loginUrl = request.nextUrl.clone();

      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);

      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;

  if (pathname === "/login") {
    if (role === "Provider") {
      return NextResponse.redirect(
        new URL("/providers", request.url)
      );
    }

    if (role === "Pharmacy") {
      return NextResponse.redirect(
        new URL("/pharmacy", request.url)
      );
    }

    if (role === "Patient") {
      return NextResponse.redirect(
        new URL("/patient/RX-10482", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  if (role === "Practice Manager") {
    if (
      pathname.startsWith("/providers") ||
      pathname.startsWith("/pharmacy") ||
      pathname.startsWith("/patient/")
    ) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }

  if (role === "Provider") {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/pharmacy") ||
      pathname.startsWith("/patient/")
    ) {
      return NextResponse.redirect(
        new URL("/providers", request.url)
      );
    }
  }

  if (role === "Pharmacy") {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/providers") ||
      pathname.startsWith("/patient/")
    ) {
      return NextResponse.redirect(
        new URL("/pharmacy", request.url)
      );
    }
  }

  if (role === "Patient") {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/providers") ||
      pathname.startsWith("/pharmacy") ||
      pathname.startsWith("/patients") ||
      pathname.startsWith("/analytics") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/refills")
    ) {
      return NextResponse.redirect(
        new URL("/patient/RX-10482", request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/refills/:path*",
    "/providers/:path*",
    "/pharmacy/:path*",
    "/patients/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/patient/:path*",
    "/login",
  ],
};