"use client";

import Button from "@/components/button/Button";
import Loading from "@/components/indikator/Loading";
import TextField from "@/components/inputs/TextField";
import ListPermintaan from "@/components/permintaan/ListPermintaan";
import { fetcher } from "@/lib/helper";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import useSWR from "swr";

export default function Laporan() {
  const [hasilQuery, setHasilQuery] = useState<Permintaan[] | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: semuaPermintaan, isLoading: loadingPermintaan } = useSWR(
    "/api/semua_permintaan",
    fetcher
  );

  async function cariPermintaan(
    event: FormEvent<HTMLFormElement>,
    query: string | null
  ) {
    event.preventDefault();
    if (query) {
      setIsLoading(true);
      const res = await fetch(process.env.NEXT_PUBLIC_API_CARI_PERMINTAAN!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query }),
      });

      const response = await res.json();
      if (!response.ok) {
        setHasilQuery([]);
        setIsLoading(false);
      } else {
        setHasilQuery(response.result);
        setIsLoading(false);
      }
    } else {
      setHasilQuery(null);
    }
  }

  async function cariPerTanggal(
    event: FormEvent<HTMLFormElement>,
    query: string | null
  ) {
    event.preventDefault();
    if (query) {
      setIsLoading(true);
      const res = await fetch(process.env.NEXT_PUBLIC_API_CARI_PERMINTAAN!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateFilter: query }),
      });

      const response = await res.json();
      if (!response.ok) {
        setHasilQuery([]);
        setIsLoading(false);
      } else {
        setHasilQuery(response.result);
        setIsLoading(false);
      }
    } else {
      setHasilQuery(null);
    }
  }

  const checkDataPermintaan = () => {
    if (semuaPermintaan && hasilQuery === null) {
      return semuaPermintaan.result as Permintaan[];
    } else {
      return hasilQuery;
    }
  };

  if (loadingPermintaan) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-8 flex flex-col gap-8">
      <p className="text-2xl">Laporan Permintaan</p>

      <form
        className="w-full border border-gray-300 flex flex-row items-center justify-between rounded-md overflow-hidden"
        onSubmit={(event) => cariPermintaan(event, query)}
      >
        <TextField
          className="border-none"
          type="text"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari permintaan..."
        />

        <button
          type="submit"
          className="h-full px-2 py-2 grid place-items-center disabled:bg-white disabled:text-gray-300 bg-orange-500 text-white"
          disabled={query === null || isLoading}
        >
          {isLoading ? (
            "Mencari..."
          ) : (
            <div className="flex flex-row gap-2 items-center">
              <MagnifyingGlassIcon className="w-4 h-4" />
              <p>Cari</p>
            </div>
          )}
        </button>
      </form>

      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => cariPerTanggal(event, query)}
      >
        <label htmlFor="tgl_penggunaan" className="text-gray-500 text-sm">
          Cari berdasar tanggal penggunaan
        </label>
        <div className="w-full border border-gray-300 flex flex-row items-center justify-between rounded-md overflow-hidden">
          <TextField
            type="date"
            id="tgl_penggunaan"
            className="border-none"
            onChange={(event) => setQuery(event.target.value.toString())}
          />
          <button
            type="submit"
            className="h-full px-2 py-2 grid place-items-center disabled:bg-white disabled:text-gray-300 bg-orange-500 text-white"
            disabled={query === null || isLoading}
          >
            {isLoading ? (
              "Mencari..."
            ) : (
              <div className="flex flex-row gap-2 items-center">
                <MagnifyingGlassIcon className="w-4 h-4" />
                <p>Cari</p>
              </div>
            )}
          </button>
        </div>
      </form>

      {hasilQuery && (
        <div className="w-full flex items-center justify-end">
          <Button variants="ERROR" onClick={() => setHasilQuery(null)}>
            <div className="flex flex-row gap-2 items-center">
              <XMarkIcon className="w-4 h-4" />
              <p>Hilangkan filter</p>
            </div>
          </Button>
        </div>
      )}

      <div className="w-full px-2 py-2 flex flex-col gap-8 rounded-md border border-gray-300 overflow-hidden">
        {isLoading ? (
          <div className="w-full flex flex-col gap-2 items-center justify-center">
            <Loading />
            <p className="text-gray-500">Mencari...</p>
          </div>
        ) : (
          <ListPermintaan dataPermintaan={checkDataPermintaan()} />
        )}
      </div>
    </div>
  );
}
