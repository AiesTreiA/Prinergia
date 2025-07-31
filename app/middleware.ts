import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: [
    // Add protected routes here if needed
    // "/dashboard/:path*",
    // "/profile/:path*",
  ],
}
