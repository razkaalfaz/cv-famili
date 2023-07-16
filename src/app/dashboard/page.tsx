"use client";

import CardAlat from "@/components/dashboard/CardAlat";
import CardBahan from "@/components/dashboard/CardBahan";
import CardUser from "@/components/dashboard/CardUser";
import CardProfile from "@/components/dashboard/CardProfile";
import Carousel from "@/components/dashboard/Carousel";
import Loading from "@/components/indikator/Loading";
import { fetcher, hitungJumlahAlat, hitungJumlahBahan } from "@/lib/helper";
import useSWR from "swr";

export default function Dashboard() {
  const { data: alat, isLoading } = useSWR("/api/list-alat", fetcher);
  const { data: bahan } = useSWR("/api/list_bahan", fetcher);
  const { data: users } = useSWR("/api/list-user", fetcher);

  return (
    <div className="w-full px-8 py-8 flex flex-col gap-8">
      <Carousel />

      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl font-medium">Dashboard</p>
        <div className="w-32 h-px bg-orange-500" />
      </div>

      {isLoading ? (
        <div className="w-full grid place-items-center">
          <Loading />
        </div>
      ) : (
        <>
          <CardProfile />

          <div className="w-full flex flex-col gap-2">
            <p className="text-xl font-medium">
              Berikut adalah data yang dimiliki oleh <br /> CV. Famili Sejahtera
              Utama
            </p>
            <div className="w-32 h-px bg-orange-500" />
          </div>

          <div className="w-full flex flex-row justify-between gap-8 items-start">
            <div className="w-full flex flex-col gap-8 items-center">
              <CardAlat dataAlat={alat?.result ?? []} />
              <p className="w-72 text-justify">
                CV. Famili Sejahtera Utama saat ini memiliki{" "}
                {alat?.result?.length} alat yang terbagi menjadi dua jenis,
                yaitu: alat besar dan alat ringan. Total alat besar yang
                dimiliki adalah{" "}
                {hitungJumlahAlat(alat?.result).alatBesar.length} alat.
                Sedangkan untuk total alat ringan adalah{" "}
                {hitungJumlahAlat(alat?.result).alatRingan.length} alat.
              </p>
            </div>

            <div className="w-full flex flex-col gap-8 items-center">
              <CardBahan dataBahan={bahan?.result ?? []} />
              <p className="w-72 text-justify">
                CV. Famili Sejahtera Utama saat ini memiliki{" "}
                {hitungJumlahBahan(bahan?.result).totalJenis} bahan dan dengan
                total {hitungJumlahBahan(bahan?.result).totalStock} stock
                persediaan barang.
              </p>
            </div>

            <div className="w-full flex flex-col gap-8 items-center">
              <CardUser />
              <p className="w-72 text-justify">
                CV. Famili Sejahtera Utama saat ini memiliki{" "}
                {users?.result?.length} pengguna aktif yang telah terdaftar dan
                dapat melakukan transaksi permintaan.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // const { data: session } = useSession();
  // const {
  //   data: alat,
  //   isLoading,
  //   isValidating,
  //   error: errorAlat,
  // } = useSWR("/api/list-alat", fetcher);
  // const { data: bahan, error: errorBahan } = useSWR("/api/list_bahan", fetcher);

  // if (isLoading || isValidating) {
  //   return (
  //     <div className="w-full h-screen grid place-items-center">
  //       <Loading />
  //     </div>
  //   );
  // }

  // if (errorAlat || errorBahan) {
  //   return "Error mendapatkan data.";
  // }

  // if (alat && bahan) {
  //   const dataAlat = hitungJumlahAlat(alat.result);
  //   const dataBahan = hitungJumlahBahan(bahan.result);
  //   return (
  //     <div className="w-full flex flex-col gap-8 px-8 py-8">
  //       <div className="flex flex-col gap-2">
  //         <p className="text-2xl font-semibold">Data Barang</p>
  //         <p className="text-lg">
  //           Berikut merupakan total data barang yang tersedia di CV. Famili
  //           Sejahtera Utama
  //         </p>
  //         <div className="w-28 rounded-md bg-orange-700 h-1" />
  //       </div>

  //       <div className="w-full flex flex-row gap-8 items-center">
  //         <div className="px-4 py-4 rounded-md overflow-hidden bg-orange-700 text-white flex flex-col gap-4">
  //           <p className="text-2xl font-bold">Alat</p>
  //           <div className="grid grid-cols-2">
  //             <p>Jumlah Jenis Alat: {alat.result.length} alat</p>
  //             <p>Total Alat Tersedia: {dataAlat.totalAlat} alat</p>
  //             <p>Alat Layak: {dataAlat.alatLayak} alat</p>
  //             <p>Alat Tidak Layak: {dataAlat.alatTidakLayak} alat</p>
  //             <p>Alat Berat: {dataAlat.alatBesar.length} alat</p>
  //             <p>Alat Ringan: {dataAlat.alatRingan.length} alat</p>
  //           </div>
  //         </div>

  //         <div className="px-4 py-4 rounded-md overflow-hidden bg-teal-300 text-slate-800 flex flex-col gap-4">
  //           <p className="text-2xl font-bold">Bahan</p>
  //           <div className="flex flex-col gap-2">
  //             <p>Jumlah Jenis Bahan: {dataBahan.totalJenis}</p>
  //             <p>Jumlah Stock Bahan: {dataBahan.totalStock}</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}
