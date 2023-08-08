"use client";

import { useState } from "react";
import Button from "../button/Button";
import ModalsContainer from "../modal/ModalsContainer";
import { useSWRConfig } from "swr";

interface ComponentProps {
  dataPerbaikan: IDetailPerbaikan | null;
  isOpen: boolean;
  onClose: () => void;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function PerbaikiAlat({
  dataPerbaikan,
  isOpen,
  onClose,
  setMessage,
  setSuccess,
}: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  async function perbaikiAlat() {
    setIsLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_PERBAIKI_ALAT!, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ DETAIL_PERBAIKAN: dataPerbaikan }),
      });

      const response = await res.json();
      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
      } else {
        setIsLoading(false);
        setSuccess(response.message);
        mutate("/api/list-perbaikan");
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return isOpen ? (
    <ModalsContainer
      title="Verifikasi Perbaikan"
      description="Apakah alat ini telah diperbaiki?"
      onClose={onClose}
    >
      <div className="flex flex-col gap-2 w-full">
        <Button
          variants="PRIMARY"
          fullWidth
          disabled={isLoading}
          onClick={() => perbaikiAlat()}
        >
          {isLoading ? "Memproses..." : "Ya"}
        </Button>
        <Button
          variants="SECONDARY"
          fullWidth
          disabled={isLoading}
          onClick={onClose}
        >
          Batal
        </Button>
      </div>
    </ModalsContainer>
  ) : null;
}
