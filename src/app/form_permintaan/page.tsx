"use client";

import Loading from "@/components/indikator/Loading";
import FormPermintaan from "@/components/utils/FormPermintaan";
import { fetcher } from "@/lib/helper";
import useSWR from "swr";

export default function PengajuanPermintaan() {
  const {
    data: alat,
    isLoading: loadingAlat,
    isValidating: validatingAlat,
  } = useSWR("/api/list-alat", fetcher);
  const {
    data: bahan,
    isLoading: loadingBahan,
    isValidating: validatingBahan,
  } = useSWR("/api/list_bahan", fetcher);

  if (loadingAlat || loadingBahan) {
    return (
      <div className="w-full grid place-items-center">
        <Loading />
      </div>
    );
  }

  if (alat && bahan) {
    return (
      <FormPermintaan
        dataAlat={alat.result ?? []}
        dataBahan={bahan.result ?? []}
      />
    );
  }
}
