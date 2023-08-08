"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../button/Button";
import ModalsContainer from "../modal/ModalsContainer";
import { ChangeEvent, useState } from "react";
import { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";
import { dateToString } from "@/lib/helper";

type Inputs = {
  alat: {
    namaAlat: string;
    jumlahAlat: number;
    unitAlat: string;
    jenisAlat: string;
    kodeUnit: string;
  };
  bahan: {
    namaBahan: string;
    stockBahan: number;
    unitBahan: string;
  };
  permintaan: {
    jumlahPermintaan: number;
    keterangan: string | null;
    tgl_pengembalian: string;
  };
  armada: {
    namaArmada: string;
  };
  pengembalian: {
    catatan: string;
    keteranganRusak: string;
    tingkatKerusakan: string;
  };
};

interface ComponentProps {
  onClose: () => void;
  options: string | null;
  idAlat?: string | null;
  idBahan?: string | null;
  dataBahan?: Bahan | null;
  dataAlat?: Alat | null;
  dataPermintaan?: Permintaan | null;
  statusPermintaan?: keyof typeof StatusPermintaan | null;
  idPermintaan?: string | null;
  idUser?: number | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ShowModal({
  options,
  onClose,
  idAlat,
  idBahan,
  dataBahan,
  dataAlat,
  statusPermintaan,
  idPermintaan,
  idUser,
  dataPermintaan,
  setMessage,
  setSuccess,
}: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [brokenAlat, setBrokenAlat] = useState<IDetailAlat[]>([]);

  const { handleSubmit, register, reset } = useForm<Inputs>({
    mode: "onChange",
  });

  const { mutate } = useSWRConfig();
  const { data: session } = useSession();

  const tambahAlat: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    const alat = data.alat;
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_TAMBAH_ALAT!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alat),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage("Gagal menambahkan data alat.");
      } else {
        mutate("/api/list-alat");
        setIsLoading(false);
        setSuccess("Berhasil menambahkan data alat.");
        hideModal();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const editAlat: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    const alat = data.alat;
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_EDIT_ALAT!, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idAlat: idAlat, ...alat }),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage("Gagal mengubah data alat.");
      } else {
        setIsLoading(false);
        setSuccess("Berhasil mengubah data alat.");
        mutate("/api/list-alat");
        mutate("/api/semua_permintaan");
        hideModal();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const tambahBahan: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    const bahan = data.bahan;
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_TAMBAH_BAHAN!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bahan),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage("Gagal menambahkan data bahan.");
      } else {
        setIsLoading(false);
        setSuccess("Berhasil menambahkan data bahan.");
        mutate("/api/list_bahan");
        hideModal();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const editBahan: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    const bahan = data.bahan;
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_EDIT_BAHAN!, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idBahan: idBahan, ...bahan }),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage("Gagal mengubah data bahan.");
      } else {
        setIsLoading(false);
        setSuccess("Berhasil mengubah data bahan.");
        mutate("/api/list_bahan");
        hideModal();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const pengajuanBarang: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    const permintaan = data.permintaan;

    const requestBody = () => {
      if (idAlat) {
        return {
          ID_USER: session?.user.ID_USER,
          ALAT: {
            ID_BARANG: idAlat,
            JUMLAH_BARANG: permintaan.jumlahPermintaan,
          },
        };
      } else if (idBahan) {
        return {
          ID_USER: session?.user.ID_USER,
          BAHAN: {
            ID_BARANG: idBahan,
            JUMLAH_BARANG: permintaan.jumlahPermintaan,
          },
        };
      } else {
        return null;
      }
    };

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_PERMINTAAN!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody()),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage("Gagal mengajukan barang.");
      } else {
        setIsLoading(false);
        setSuccess("Berhasil mengajukan barang.");
        mutate("/api/semua_permintaan");
        hideModal();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const berikanCatatanPermintaan: SubmitHandler<Inputs> = async (data) => {
    if (statusPermintaan && idPermintaan) {
      setIsLoading(true);
      setMessage(null);
      setSuccess(null);
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_VERIFIKASI_PERMINTAAN!,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ID_PERMINTAAN: idPermintaan,
              STATUS: statusPermintaan,
              KETERANGAN: data.permintaan.keterangan,
            }),
          }
        );

        const response = await res.json();

        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
          hideModal();
          mutate("/api/semua_permintaan");
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    }
  };
  const updateWaktuPengembalian: SubmitHandler<Inputs> = async (data) => {
    if (dataPermintaan) {
      try {
        setIsLoading(true);
        setMessage(null);
        setSuccess(null);
        const res = await fetch(process.env.NEXT_PUBLIC_API_TAMBAH_WAKTU!, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ID_PERMINTAAN: dataPermintaan.ID_PERMINTAAN,
            TGL_PENGEMBALIAN: data.permintaan.tgl_pengembalian,
          }),
        });

        const response = await res.json();

        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
          hideModal();
          mutate("/api/permintaan-user/" + dataPermintaan.ID_USER);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const tambahArmada: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      setMessage(null);
      setSuccess(null);

      const res = await fetch(process.env.NEXT_PUBLIC_API_TAMBAH_ARMADA!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NAMA_ARMADA: data.armada.namaArmada }),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
      } else {
        setIsLoading(false);
        setSuccess(response.message);
        mutate("/api/list_armada");
        hideModal();
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function hapusAlat() {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    if (idAlat) {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_HAPUS_ALAT!, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idAlat: idAlat }),
        });

        const response = await res.json();

        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
          hideModal();
          mutate("/api/list-alat");
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  async function hapusBahan() {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    if (idBahan) {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_HAPUS_BAHAN!, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idBahan: idBahan }),
        });

        const response = await res.json();

        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
          hideModal();
          mutate("/api/list_bahan");
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  async function hapusUser() {
    if (idUser) {
      setIsLoading(true);
      setMessage(null);
      setSuccess(null);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_HAPUS_USER!, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ID_USER: idUser }),
        });

        const response = await res.json();

        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
          mutate("/api/list-user");
          hideModal();
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  async function verifikasiPermintaan() {
    if (statusPermintaan && idPermintaan) {
      setIsLoading(true);
      setMessage(null);
      setSuccess(null);
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_VERIFIKASI_PERMINTAAN!,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ID_PERMINTAAN: idPermintaan,
              STATUS: statusPermintaan,
            }),
          }
        );

        const response = await res.json();

        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
          hideModal();
          mutate("/api/semua_permintaan");
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    }
  }
  const pengajuanPengembalian: SubmitHandler<Inputs> = async (data) => {
    if (dataPermintaan && session) {
      setIsLoading(true);
      setMessage(null);
      setSuccess(null);

      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_PENGAJUAN_PENGEMBALIAN!,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ID_PERMINTAAN: dataPermintaan.ID_PERMINTAAN,
              ID_USER: session.user.ID_USER,
              CATATAN: data.pengembalian.catatan,
            }),
          }
        );

        const response = await res.json();
        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
          mutate("/api/semua_permintaan");
          hideModal();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const verifikasiPengembalian: SubmitHandler<Inputs> = async (data) => {
    if (dataPermintaan) {
      setIsLoading(true);
      setMessage(null);
      setSuccess(null);

      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_VERIFIKASI_PENGEMBALIAN!,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              permintaan: dataPermintaan,
              ID_USER: dataPermintaan.ID_USER,
              IS_BROKEN: isBroken,
              BROKEN_ALAT: brokenAlat,
              KETERANGAN_RUSAK: data.pengembalian.keteranganRusak,
              TINGKAT_KERUSAKAN: data.pengembalian.tingkatKerusakan,
            }),
          }
        );

        const response = await res.json();
        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
          hideModal();
          mutate("/api/semua_permintaan");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  async function hapusPermintaan() {
    if (dataPermintaan) {
      setIsLoading(true);
      setMessage(null);
      setSuccess(null);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_HAPUS_PERMINTAAN!, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ID_PERMINTAAN: dataPermintaan.ID_PERMINTAAN }),
        });

        const response = await res.json();

        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
          hideModal();
          mutate("/api/permintaan-user/" + dataPermintaan.ID_USER);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  function onBrokenChanged(option: string) {
    if (option === "y") {
      setIsBroken(true);
    } else {
      setIsBroken(false);
    }
  }

  function registerBrokenAlat(event: ChangeEvent<HTMLInputElement>) {
    const { checked, value } = event.target;

    if (dataPermintaan) {
      const detailAlat = dataPermintaan.detail_permintaan.map(
        (detail) => detail.detail_alat
      );
      const brokenDetailAlat = detailAlat.find(
        (detail) => detail.KODE_ALAT === value
      );

      if (brokenDetailAlat) {
        if (checked) {
          setBrokenAlat((prev) => [...prev, brokenDetailAlat]);
        } else {
          const updatedBrokenAlat = brokenAlat.filter(
            (curr) => curr.KODE_ALAT !== value
          );
          setBrokenAlat(updatedBrokenAlat);
        }
      }
    }
  }

  function hideModal() {
    reset();
    onClose();
  }

  switch (options) {
    case "tambah-alat":
      return (
        <ModalsContainer
          title="Tambah Alat"
          description="Harap isi input dibawah dengan menggunakan data yang tepat."
          onClose={hideModal}
        >
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(tambahAlat)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="nama_alat">Nama Alat</label>
              <input
                id="nama_alat"
                type="text"
                required
                placeholder="Nama alat..."
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("alat.namaAlat")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="jumlah_alat">Jumlah Alat</label>
              <input
                id="jumlah_alat"
                type="number"
                required
                placeholder="1"
                min={1}
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("alat.jumlahAlat", {
                  setValueAs: (v) => parseInt(v),
                })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="unit_alat">Unit Alat</label>
              <input
                id="unit_alat"
                type="text"
                required
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                placeholder="KG"
                {...register("alat.unitAlat")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="kode_unit_alat">Kode Unit Alat</label>
              <input
                id="kode_unit_alat"
                type="text"
                required
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                placeholder="ST"
                maxLength={2}
                {...register("alat.kodeUnit")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="jenis_alat">Jenis Alat</label>
              <select
                required
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("alat.jenisAlat")}
              >
                <option value="">Pilih jenis alat...</option>
                <option value="AB">Alat Berat</option>
                <option value="AR">Alat Ringan</option>
              </select>
            </div>

            <Button
              variants="PRIMARY"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </ModalsContainer>
      );

    case "hapus-alat":
      return (
        <ModalsContainer
          title="Hapus Alat"
          description="Apakah anda yakin akan menghapus alat ini?"
          onClose={hideModal}
        >
          <Button
            variants="ERROR"
            onClick={hapusAlat}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </Button>
          <Button
            variants="SECONDARY"
            onClick={hideModal}
            fullWidth
            disabled={isLoading}
          >
            Batal
          </Button>
        </ModalsContainer>
      );

    case "edit-alat":
      if (dataAlat) {
        return (
          <ModalsContainer
            title="Ubah data alat"
            description="Harap isi data alat dengan data yang benar"
            onClose={hideModal}
          >
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit(editAlat)}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="nama_alat">Nama Alat</label>
                <input
                  id="nama_alat"
                  type="text"
                  required
                  defaultValue={dataAlat.NAMA_ALAT}
                  placeholder="Nama alat..."
                  className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                  {...register("alat.namaAlat")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="unit_alat">Unit Alat</label>
                <input
                  id="unit_alat"
                  type="text"
                  defaultValue={dataAlat.UNIT_ALAT}
                  required
                  className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                  placeholder="KG"
                  {...register("alat.unitAlat")}
                />
              </div>
              <Button
                variants="PRIMARY"
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </form>
          </ModalsContainer>
        );
      }

    case "tambah-bahan":
      return (
        <ModalsContainer
          title="Tambah Bahan"
          description="Harap isi input dibawah dengan menggunakan data yang tepat."
          onClose={hideModal}
        >
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(tambahBahan)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="nama_bahan">Nama Bahan</label>
              <input
                id="nama_bahan"
                type="text"
                required
                placeholder="Nama bahan..."
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("bahan.namaBahan")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="stock_bahan">Stock Bahan</label>
              <input
                id="stock_bahan"
                type="number"
                required
                placeholder="1"
                min={1}
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("bahan.stockBahan", {
                  setValueAs: (v) => parseInt(v),
                })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="unit_bahan">Unit Bahan</label>
              <input
                id="unit_bahan"
                type="text"
                required
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                placeholder="KG"
                {...register("bahan.unitBahan")}
              />
            </div>
            <Button
              variants="PRIMARY"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </ModalsContainer>
      );

    case "edit-bahan":
      return (
        <ModalsContainer
          title="Edit Bahan"
          description="Harap isi input dibawah dengan menggunakan data yang tepat."
          onClose={hideModal}
        >
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(editBahan)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="nama_bahan">Nama Bahan</label>
              <input
                id="nama_bahan"
                type="text"
                required
                defaultValue={dataBahan?.NAMA_BAHAN}
                placeholder="Nama bahan..."
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("bahan.namaBahan")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="stock_bahan">Stock Bahan</label>
              <input
                id="stock_bahan"
                type="number"
                required
                defaultValue={dataBahan?.STOCK_BAHAN}
                placeholder="1"
                min={1}
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("bahan.stockBahan", {
                  setValueAs: (v) => parseInt(v),
                })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="unit_bahan">Unit Bahan</label>
              <input
                id="unit_bahan"
                type="text"
                required
                defaultValue={dataBahan?.UNIT_BAHAN}
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                placeholder="KG"
                {...register("bahan.unitBahan")}
              />
            </div>
            <Button
              variants="PRIMARY"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </ModalsContainer>
      );

    case "hapus-bahan":
      return (
        <ModalsContainer
          title="Hapus Alat"
          description="Apakah anda yakin akan menghapus bahan ini?"
          onClose={hideModal}
        >
          <Button
            variants="ERROR"
            onClick={hapusBahan}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </Button>
          <Button
            variants="SECONDARY"
            onClick={hideModal}
            fullWidth
            disabled={isLoading}
          >
            Batal
          </Button>
        </ModalsContainer>
      );

    case "ajukan-permintaan":
      return (
        <ModalsContainer
          title="Pengajuan permintaan"
          description="Berapa banyak jumlah barang yang akan anda ajukan?"
          onClose={hideModal}
        >
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(pengajuanBarang)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="jumlah_permintaan">Jumlah barang</label>
              <input
                id="jumlah_permintaan"
                type="number"
                required
                placeholder="1"
                min={1}
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("permintaan.jumlahPermintaan", {
                  setValueAs: (v) => parseInt(v),
                })}
              />
            </div>
            <Button
              variants="PRIMARY"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Mengajukan..." : "Ajukan"}
            </Button>
          </form>
        </ModalsContainer>
      );

    case "verifikasi-permintaan":
      return (
        <ModalsContainer
          title={
            statusPermintaan && statusPermintaan === "DIVERIFIKASI"
              ? "Verifikasi Permintaan"
              : statusPermintaan === "DIKIRIM"
              ? "Kirim Barang"
              : statusPermintaan === "DITOLAK"
              ? "Tolak Permintaan"
              : statusPermintaan === "PENGEMBALIAN"
              ? "Kembalikan Barang"
              : statusPermintaan === "DITERIMA"
              ? "Barang Diterima"
              : "Barang Dikembalikan"
          }
          description={
            statusPermintaan && statusPermintaan === "DIVERIFIKASI"
              ? "Apakah anda akan mengirimkan permintaan ini kepada tugas peralatan?"
              : statusPermintaan === "DIKIRIM"
              ? "Apakah anda akan mengirim permintaan barang ini?"
              : statusPermintaan === "DITOLAK"
              ? "Apakah anda akan menolak permintaan barang ini?"
              : statusPermintaan === "PENGEMBALIAN"
              ? "Apakah anda akan mengembalikan barang ini?"
              : statusPermintaan === "DITERIMA"
              ? "Apakah barang yang anda ajukan telah diterima?"
              : "Apakah barang yang diajukan oleh kepala proyek sudah anda terima?"
          }
          onClose={hideModal}
        >
          {statusPermintaan === "DIKIRIM" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(berikanCatatanPermintaan)}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="keterangan" className="text-gray-500">
                  Keterangan Pengiriman
                </label>
                <textarea
                  id="keterangan"
                  rows={4}
                  placeholder="Kosongkan bila tidak ada catatan"
                  className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                  {...register("permintaan.keterangan")}
                />
              </div>

              <Button
                variants="ACCENT"
                fullWidth
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Simpan"}
              </Button>
              <Button
                variants="SECONDARY"
                fullWidth
                type="button"
                disabled={isLoading}
                onClick={() => hideModal()}
              >
                Batal
              </Button>
            </form>
          )}
          {statusPermintaan !== "DIKIRIM" && (
            <>
              <Button
                variants="PRIMARY"
                fullWidth
                disabled={isLoading}
                onClick={() => verifikasiPermintaan()}
              >
                {isLoading ? "Memproses..." : "Ya"}
              </Button>
              <Button
                type="button"
                variants="SECONDARY"
                onClick={hideModal}
                fullWidth
                disabled={isLoading}
              >
                Batal
              </Button>
            </>
          )}
        </ModalsContainer>
      );

    case "tolak-permintaan":
      return (
        <ModalsContainer
          title="Tolak permintaan"
          description="Berikan keterangan kepada kepala proyek, mengenai alasan penolakan permintaan barang tersebut."
          onClose={hideModal}
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(berikanCatatanPermintaan)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="keterangan" className="text-gray-500">
                Keterangan
              </label>
              <textarea
                id="keterangan"
                rows={4}
                required
                placeholder="Permintaan ini ditolak karena..."
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("permintaan.keterangan")}
              />
            </div>
            <Button
              type="submit"
              variants="PRIMARY"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Kirim Keterangan"}
            </Button>
            <Button
              type="button"
              variants="SECONDARY"
              fullWidth
              onClick={hideModal}
            >
              Batalkan
            </Button>
          </form>
        </ModalsContainer>
      );

    case "hapus-user":
      return (
        <ModalsContainer
          title="Hapus User"
          description="Apakah anda yakin akan menghapus user ini?"
          onClose={hideModal}
        >
          <Button
            variants="ERROR"
            onClick={hapusUser}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </Button>
          <Button
            variants="SECONDARY"
            onClick={hideModal}
            fullWidth
            disabled={isLoading}
          >
            Batal
          </Button>
        </ModalsContainer>
      );

    case "pengajuan-pengembalian":
      return (
        <ModalsContainer
          title="Pengembalian"
          description="Apakah anda yakin akan melakukan pengajuan pengembalian?"
          onClose={hideModal}
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(pengajuanPengembalian)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="catatan_pengembalian">Catatan Pengembalian</label>
              <textarea
                className="w-full p-2 rounded-md outline-none border border-gray-300"
                cols={4}
                id="catatan_pengembalian"
                placeholder="Catatan..."
                {...register("pengembalian.catatan")}
              />
            </div>

            <Button
              variants="ACCENT"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Kirim"}
            </Button>
            <Button
              variants="SECONDARY"
              type="button"
              onClick={hideModal}
              fullWidth
              disabled={isLoading}
            >
              Batal
            </Button>
          </form>
        </ModalsContainer>
      );

    case "verifikasi-pengembalian":
      return (
        <ModalsContainer
          title="Verifikasi Pengembalian"
          description="Silahkan verifikasi pengembalian yang diterima dari kepala proyek."
          onClose={hideModal}
        >
          <form
            className="w-full flex flex-col gap-2"
            onSubmit={handleSubmit(verifikasiPengembalian)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="isBroken">Apakah ada alat yang rusak?</label>
              <select
                id="isBroken"
                onChange={(event) => onBrokenChanged(event.target.value)}
                required
                className="w-full p-2 rounded-md outline-none border border-gray-300"
              >
                <option value="n">Tidak</option>
                <option value="y">Ya</option>
              </select>
            </div>

            {isBroken && dataPermintaan && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="alatRusak">
                    Silahkan pilih alat yang rusak
                  </label>
                  {dataPermintaan.detail_permintaan.map((detail) => (
                    <div
                      key={detail.ID_DETAIL_PERMINTAAN}
                      className="w-full grid grid-cols-3"
                    >
                      <div className="flex flex-row gap-2 items-center">
                        <input
                          type="checkbox"
                          value={detail.detail_alat.KODE_ALAT}
                          id={detail.detail_alat.KODE_ALAT}
                          onChange={registerBrokenAlat}
                        />
                        <label htmlFor={detail.detail_alat.KODE_ALAT}>
                          {detail.detail_alat.KODE_ALAT} -{" "}
                          {detail.detail_alat.alat.NAMA_ALAT}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {isBroken && (
              <div className="flex flex-col gap-2">
                <label htmlFor="keteranganRusak">
                  Berikan Keterangan Kerusakan
                </label>
                <textarea
                  className="w-full p-2 rounded-md outline-none border border-gray-300"
                  cols={4}
                  id="keteranganRusak"
                  placeholder="Alat ini mengalami kerusakan pada bagian..."
                  required
                  {...register("pengembalian.keteranganRusak")}
                />
              </div>
            )}

            {isBroken && (
              <div className="flex flex-col gap-2">
                <label htmlFor="tingkatKerusakan">Tingkat Kerusakan Alat</label>
                <select
                  id="tingkatKerusakan"
                  required
                  className="w-full p-2 rounded-md outline-none border border-gray-300"
                  {...register("pengembalian.tingkatKerusakan")}
                >
                  <option value="RINGAN">Ringan</option>
                  <option value="BERAT">Berat</option>
                </select>
              </div>
            )}

            <Button
              variants="ACCENT"
              fullWidth
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi"}
            </Button>
            <Button
              variants="SECONDARY"
              fullWidth
              disabled={isLoading}
              type="button"
              onClick={() => hideModal()}
            >
              Batal
            </Button>
          </form>
        </ModalsContainer>
      );

    case "hapus-permintaan":
      return (
        <ModalsContainer
          title="Hapus Permintaan"
          description="Apakah anda yakin akan menghapus permintaan ini?"
          onClose={hideModal}
        >
          <div className="flex flex-col gap-2 w-full">
            <Button
              variants="PRIMARY"
              fullWidth
              disabled={isLoading}
              onClick={() => hapusPermintaan()}
            >
              {isLoading ? "Memproses..." : "Ya"}
            </Button>
            <Button
              variants="SECONDARY"
              fullWidth
              disabled={isLoading}
              onClick={() => hideModal}
            >
              Batal
            </Button>
          </div>
        </ModalsContainer>
      );

    case "extend-pengembalian":
      return (
        <ModalsContainer
          title="Perpanjang Waktu Pengembalian"
          description="Harap isi input dibawah ini dengan tanggal pengembalian baru yang anda ajukan."
          onClose={hideModal}
        >
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(updateWaktuPengembalian)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="tgl_pengembalian">Tanggal Pengembalian</label>
              <input
                id="tgl_pengembalian"
                type="date"
                required
                defaultValue={dateToString(
                  dataPermintaan?.TGL_PENGEMBALIAN.toString() ?? ""
                )}
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("permintaan.tgl_pengembalian")}
              />
            </div>
            <Button
              variants="PRIMARY"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </ModalsContainer>
      );

    case "tambah-armada":
      return (
        <ModalsContainer
          title="Tambah Armada"
          description="Silahkan berikan nama untuk armada yang akan di tambahkan."
          onClose={hideModal}
        >
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(tambahArmada)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="nama_armada">Nama Armada</label>
              <input
                id="nama_armada"
                type="text"
                required
                placeholder="Nama armada..."
                className="w-full rounded-md outline-none border border-gray-300 px-2 py-2"
                {...register("armada.namaArmada")}
              />
            </div>

            <Button
              variants="ACCENT"
              type="submit"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? "Memproses..." : "Simpan"}
            </Button>
          </form>
        </ModalsContainer>
      );

    default:
      return null;
  }
}
