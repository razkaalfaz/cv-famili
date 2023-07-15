export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/barang/:path*", "/permintaan/:path*", "/dashboard"],
};
