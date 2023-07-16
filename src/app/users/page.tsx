import TabelUser from "@/components/tabel/TabelUser";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export default function Users() {
  return (
    <div className="w-full flex flex-col gap-8 px-8 py-8">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-semibold">Data User</p>
          <p className="text-lg">
            Berikut merupakan data user yang terdaftar di CV. Famili Sejahtera
            Utama
          </p>
          <div className="w-28 rounded-md bg-orange-700 h-1" />
        </div>

        <Link
          href={ROUTES.ADMIN.USERS.ADD}
          className="px-2 py-2 bg-orange-700 text-white rounded-md overflow-hidden grid place-items-center"
        >
          Tambah User
        </Link>
      </div>
      <TabelUser />
    </div>
  );
}
