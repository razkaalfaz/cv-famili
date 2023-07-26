export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/barang/:path*",
    "/permintaan/:path*",
    "/dashboard",
    "/form_permintaan",
    "/laporan-perbaikan/:path*",
    "/pengajuan_perbaikan",
    "/permintaan/:path*",
    "/tambah_user",
    "/users",
    "/pengajuan_alat_baru",
    "/laporan_pengajuan_alat/:path*",
  ],
};
