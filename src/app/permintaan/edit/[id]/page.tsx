"use client";
import Loading from "@/components/indikator/Loading";
import FormPermintaan from "@/components/utils/FormPermintaan";
import { fetcher } from "@/lib/helper";
import useSWR from "swr";

export default function EditPermintaan({ params }: { params: { id: string } }) {
  const {
    data: dataPermintaan,
    isLoading,
    error,
  } = useSWR("/api/get-permintaan/" + params.id, fetcher);
  const { data: alat } = useSWR("/api/list-alat", fetcher);
  const { data: bahan } = useSWR("/api/list_bahan", fetcher);

  if (isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full grid place-items-center text-gray-500">
        Gagal mendapatkan data permintaan...
      </div>
    );
  }

  if (dataPermintaan) {
    return (
      <div className="w-full flex flex-col px-8 py-8 gap-8">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl">Edit permintaan</p>
        </div>

        <FormPermintaan
          dataAlat={alat ? alat.result : []}
          dataBahan={bahan ? bahan.result : []}
          dataPermintaan={dataPermintaan.result}
        />
      </div>
    );
  }
}
