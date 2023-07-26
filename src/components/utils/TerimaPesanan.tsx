"use client";

import React, { useState } from "react";
import ModalsContainer from "../modal/ModalsContainer";
import Button from "../button/Button";
import { useSWRConfig } from "swr";

interface ComponentProps {
  permintaan: Permintaan | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  isOpen: boolean;
  onClose: () => void;
}

export default function TerimaPesanan({
  permintaan,
  setMessage,
  setSuccess,
  isOpen,
  onClose,
}: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();
  async function terimaPermintaan() {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_TERIMA_PERMINTAAN!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID_PERMINTAAN: permintaan?.ID_PERMINTAAN,
          ID_TRANSPORTASI: permintaan?.transportasi?.ID_TRANSPORTASI,
        }),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
      } else {
        setIsLoading(false);
        setSuccess(response.message);
        onClose();
        mutate("/api/permintaan-user/" + permintaan?.ID_USER);
      }
    } catch (err) {
      setIsLoading(false);
      setMessage("Terjadi kesalahan...");
      console.error(err);
    }
  }

  return isOpen ? (
    <ModalsContainer
      title="Terima Permintaan"
      description="Apakah anda telah menerima barang permintaan yang telah anda ajukan?"
      onClose={onClose}
    >
      <div className="w-full flex flex-col gap-2">
        <Button
          variants="ACCENT"
          onClick={() => terimaPermintaan()}
          fullWidth
          disabled={isLoading}
        >
          Ya
        </Button>
        <Button
          variants="SECONDARY"
          onClick={onClose}
          fullWidth
          disabled={isLoading}
        >
          Batal
        </Button>
      </div>
    </ModalsContainer>
  ) : null;
}
