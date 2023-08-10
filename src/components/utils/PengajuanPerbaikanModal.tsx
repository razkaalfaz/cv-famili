"use client";

import { useState } from "react";
import Button from "../button/Button";
import ModalsContainer from "../modal/ModalsContainer";
import { useSWRConfig } from "swr";

interface ComponentProps {
  ALAT_RUSAK: AlatRusak;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  isOpen: boolean;
  onClose: () => void;
}

export default function PengajuanPerbaikanModal({
  ALAT_RUSAK,
  setMessage,
  setSuccess,
  isOpen,
  onClose,
}: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useSWRConfig();

  function hideModal() {
    setMessage(null);
    setSuccess(null);
    onClose();
  }

  async function ajukanPerbaikan() {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_PENGAJUAN_PERBAIKAN!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ALAT_RUSAK: ALAT_RUSAK }),
        }
      );

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
      } else {
        setIsLoading(false);
        setSuccess(response.message);
        mutate("/api/list-alat");
        hideModal();
      }
    } catch (err) {
      setIsLoading(false);
      setMessage("Terjadi kesalahan...");
      console.error(err);
    }
  }

  return (
    <ModalsContainer
      title="Ajukan Perbaikan"
      description="Apakah anda ingin mengajukan perbaikan untuk alat ini?"
      onClose={hideModal}
    >
      <div className="w-full flex flex-col gap-2">
        <Button
          variants="ACCENT"
          fullWidth
          disabled={isLoading}
          onClick={() => ajukanPerbaikan()}
        >
          {isLoading ? "Memproses..." : "Ya"}
        </Button>
        <Button
          variants="SECONDARY"
          fullWidth
          disabled={isLoading}
          onClick={hideModal}
        >
          Batal
        </Button>
      </div>
    </ModalsContainer>
  );
}
