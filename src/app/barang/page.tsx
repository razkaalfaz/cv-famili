"use client";

import ListAlat from "@/components/alat/ListAlat";
import ListBahan from "@/components/bahan/ListBahan";
import Button from "@/components/button/Button";
import Snackbar from "@/components/snackbar/Snackbar";
import ShowModal from "@/components/utils/ShowModal";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

export default function Barang() {
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="w-full px-8 py-8 flex flex-col gap-8">
      {message && <Snackbar message={message} variant="ERROR" />}
      {success && <Snackbar message={success} variant="SUCCESS" />}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row gap-4 justify-between items-center">
          <b className="text-2xl">Data Alat</b>
          <Button
            variants="PRIMARY"
            onClick={() => setModalShown("tambah-alat")}
          >
            Tambah Alat
          </Button>
        </div>
        <ListAlat setSuccess={setSuccess} setMessage={setMessage} />
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row gap-4 justify-between items-center">
          <b className="text-2xl">Data Bahan</b>
          <Button
            variants="PRIMARY"
            onClick={() => setModalShown("tambah-bahan")}
          >
            Tambah Bahan
          </Button>
        </div>
        <ListBahan setMessage={setMessage} setSuccess={setSuccess} />
      </div>
      <ShowModal
        onClose={() => setModalShown(null)}
        options={modalShown}
        setSuccess={setSuccess}
        setMessage={setMessage}
      />
    </div>
  );
}
