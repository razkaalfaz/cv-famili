"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ListPilihanAlat from "./ListPilihanAlat";
import ListPilihanBahan from "./ListPilihanBahan";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../button/Button";
import Snackbar from "../snackbar/Snackbar";
import { dateToString } from "@/lib/helper";
import { useSWRConfig } from "swr";
import { TrashIcon } from "@heroicons/react/24/solid";

type Input = {
  alat: {
    idAlat: string;
    jumlah: number;
  };
  bahan: {
    idBahan: string;
    jumlah: number;
  };
  namaProyek: string;
  lokasiProyek: string;
  tanggalPenggunaan: Date;
  tanggalPengembalian: Date;
};

interface ItemQuantities {
  [key: string]: string;
}

interface ComponentProps {
  dataAlat: Alat[];
  dataBahan: Bahan[];
  dataPermintaan?: Permintaan | null;
}

export default function FormPermintaan({
  dataAlat,
  dataBahan,
  dataPermintaan,
}: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<BarangPermintaan[]>([]);
  const [itemQuantities, setItemQuantities] = useState<ItemQuantities>({});
  const [jenisAlat, setJenisAlat] = useState<string>("all");
  const [uncheckedItems, setUncheckedItems] = useState<string[]>([]);

  console.log(uncheckedItems);

  const inputStyles =
    "w-full rounded-md outline-none border border-gray-300 overflow-hidden px-2 py-2";
  const inputContainerStyles = "w-full flex flex-col gap-1";
  const labelStyles = "font-semibold";
  const baseButtonStyles =
    "px-2 py-2 rounded-full grid place-items overflow-hidden border border-gray-300";
  const activeButtonStyles = baseButtonStyles + " bg-orange-500 text-white";

  const router = useRouter();

  const { mutate } = useSWRConfig();

  const handleItemChange = (
    event: ChangeEvent<HTMLInputElement>,
    item: BarangPermintaan
  ) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedItems((prev) => [
        ...prev,
        {
          ID_BARANG: item.ID_BARANG,
          NAMA_BARANG: item.NAMA_BARANG,
          UNIT_BARANG: item.UNIT_BARANG,
        },
      ]);
      const updatedItems = uncheckedItems.filter(
        (currentItem) => currentItem !== item.ID_BARANG
      );
      setUncheckedItems(updatedItems);
    } else {
      const updatedItems = selectedItems.filter(
        (selectedItem) => selectedItem.ID_BARANG !== item.ID_BARANG
      );
      setSelectedItems(updatedItems);
    }
  };

  const handleQuantityChange = (
    event: ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const { value } = event.target;
    setItemQuantities({ ...itemQuantities, [itemId]: value });
  };

  const hapusBarang = (ID_BARANG: string) => {
    const updatedItems = selectedItems.filter(
      (item) => item.ID_BARANG !== ID_BARANG
    );
    setSelectedItems(updatedItems);
    var currentQuantities = itemQuantities;
    delete currentQuantities[ID_BARANG];

    setItemQuantities(currentQuantities);
    if (!uncheckedItems.includes(ID_BARANG)) {
      setUncheckedItems((prev) => [...prev, ID_BARANG]);
    }
  };

  const renderItemInputs = () => {
    return selectedItems.map((item) => (
      <div key={item.ID_BARANG}>
        <label className="w-full flex flex-row gap-4 items-center">
          <div className="w-2/12">{item.NAMA_BARANG}:</div>
          <div className="w-5/6 rounded-md outline-none border border-gray-300 overflow-hidden px-2 py-2 flex flex-row items-center gap-4">
            <input
              disabled={isLoading}
              type="number"
              min="1"
              value={itemQuantities[item.ID_BARANG] || ""}
              className="w-full h-full"
              onChange={(e) => handleQuantityChange(e, item.ID_BARANG)}
              required
            />
            <p className="text-gray-500">{item.UNIT_BARANG}</p>
          </div>
          {dataPermintaan && (
            <div
              className="px-2 py-2 rounded-md grid place-items-center text-white bg-red-950 overflow-hidden cursor-pointer"
              onClick={() => hapusBarang(item.ID_BARANG)}
            >
              <TrashIcon className="w-4 h-4" />
            </div>
          )}
        </label>
      </div>
    ));
  };

  const renderAlat = (alat: Alat[], jenis: string) => {
    const alatBerat = alat?.filter(
      (alat: Alat) => alat?.ID_ALAT.substring(0, 2) === "AB"
    );

    const alatRingan = alat?.filter(
      (alat: Alat) => alat?.ID_ALAT.substring(0, 2) === "AR"
    );

    switch (jenis) {
      case "AB":
        return (
          <ListPilihanAlat
            selectedAlat={selectedItems}
            alat={alatBerat}
            onCheckboxClicked={handleItemChange}
          />
        );

      case "AR":
        return (
          <ListPilihanAlat
            selectedAlat={selectedItems}
            alat={alatRingan}
            onCheckboxClicked={handleItemChange}
          />
        );

      case "all":
        return (
          <ListPilihanAlat
            selectedAlat={selectedItems}
            alat={dataAlat}
            onCheckboxClicked={handleItemChange}
          />
        );
      default:
        return <p className="text-gray-500">Silahkan pilih jenis alat...</p>;
    }
  };

  const { handleSubmit, register, reset } = useForm<Input>({
    mode: "onChange",
  });
  const { data: session } = useSession();

  const ajukanPermintaan: SubmitHandler<Input> = async (data) => {
    const { namaProyek, lokasiProyek, tanggalPengembalian, tanggalPenggunaan } =
      data;

    setMessage(null);
    setSuccess(null);

    if (session) {
      setIsLoading(true);
      if (dataPermintaan === null || dataPermintaan === undefined) {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_API_PERMINTAAN!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ID_USER: session.user.ID_USER,
              NAMA_PROYEK: namaProyek,
              LOKASI_PROYEK: lokasiProyek,
              TGL_PENGGUNAAN: tanggalPenggunaan,
              TGL_PENGEMBALIAN: tanggalPengembalian,
              BARANG: selectedItems,
              JUMLAH_BARANG: itemQuantities,
            }),
          });

          const response = await res.json();
          if (!response.ok) {
            setIsLoading(false);
            if (!response.result) {
              setMessage(
                "Tidak ada barang yang di pilih, harap pilih salah satu untuk lanjut."
              );
            } else {
              setMessage("Terjadi kesalahan ketika melakukan permintaan...");
            }
          } else {
            setIsLoading(false);
            setSuccess("Berhasil mengajukan permintaan.");
            setSelectedItems([]);
            setItemQuantities({});
            reset();
            setTimeout(() => {
              router.push("/permintaan");
            }, 3000);
          }
        } catch (err) {
          setIsLoading(false);
          setMessage("Terjadi kesalahan...");
          console.error(err);
        }
      } else {
        try {
          const res = await fetch(
            process.env.NEXT_PUBLIC_API_EDIT_PERMINTAAN!,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                PERMINTAAN: dataPermintaan,
                NAMA_PROYEK: namaProyek ?? dataPermintaan.NAMA_PROYEK,
                LOKASI_PROYEK: lokasiProyek ?? dataPermintaan.LOKASI_PROYEK,
                TGL_PENGGUNAAN:
                  tanggalPenggunaan ?? dataPermintaan.TGL_PENGGUNAAN,
                TGL_PENGEMBALIAN:
                  tanggalPengembalian ?? dataPermintaan.TGL_PENGEMBALIAN,
                BARANG: selectedItems,
                JUMLAH_BARANG: itemQuantities,
                DELETED_BARANG: uncheckedItems ?? [],
              }),
            }
          );

          const response = await res.json();
          if (!response.ok) {
            setIsLoading(false);
            if (!response.result) {
              setMessage(
                "Tidak ada barang yang di pilih, harap pilih salah satu untuk lanjut."
              );
            } else {
              setMessage("Terjadi kesalahan ketika melakukan permintaan...");
            }
          } else {
            setIsLoading(false);
            setSuccess("Berhasil megubah data permintaan.");
            setSelectedItems([]);
            setItemQuantities({});
            mutate("/api/get-permintaan/" + dataPermintaan.ID_PERMINTAAN);
            reset();
            setTimeout(() => {
              router.push("/permintaan");
            }, 3000);
          }
        } catch (err) {
          setIsLoading(false);
          setMessage("Terjadi kesalahan...");
          console.error(err);
        }
      }
    }
  };

  useEffect(() => {
    if (dataPermintaan) {
      const currentAlat = dataPermintaan?.detail_permintaan?.map(
        (permintaan) => permintaan.alat
      );

      const currentBahan = dataPermintaan?.detail_permintaan?.map(
        (permintaan) => permintaan.bahan
      );

      if (currentAlat) {
        currentAlat
          .filter((permintaan) => permintaan !== null)
          .forEach((alat) => {
            setSelectedItems((prev) => [
              ...prev,
              {
                ID_BARANG: alat.ID_ALAT,
                NAMA_BARANG: alat.NAMA_ALAT,
                UNIT_BARANG: alat.UNIT_ALAT,
              },
            ]);
          });

        dataPermintaan?.detail_permintaan
          ?.filter((detailPermintaan) => detailPermintaan?.JUMLAH_ALAT !== null)
          .forEach((detail) => {
            setItemQuantities((prev) => ({
              ...prev,
              [detail?.alat?.ID_ALAT]: detail.JUMLAH_ALAT.toString(),
            }));
          });
      }

      if (currentBahan) {
        currentBahan
          .filter((permintaan) => permintaan !== null)
          .forEach((bahan) => {
            setSelectedItems((prev) => [
              ...prev,
              {
                ID_BARANG: bahan.ID_BAHAN,
                NAMA_BARANG: bahan.NAMA_BAHAN,
                UNIT_BARANG: bahan.UNIT_BAHAN,
              },
            ]);
          });

        dataPermintaan?.detail_permintaan
          ?.filter(
            (detailPermintaan) => detailPermintaan?.JUMLAH_BAHAN !== null
          )
          .forEach((detail) => {
            setItemQuantities((prev) => ({
              ...prev,
              [detail?.bahan?.ID_BAHAN]: detail.JUMLAH_BAHAN.toString(),
            }));
          });
      }
    }
  }, [dataPermintaan]);

  return (
    <form
      className="w-full flex flex-col gap-4 px-8 py-8"
      onSubmit={handleSubmit(ajukanPermintaan)}
    >
      <div className={inputContainerStyles}>
        <label className={labelStyles} htmlFor="nama_proyek">
          Nama Proyek
        </label>
        <input
          disabled={isLoading}
          {...register("namaProyek")}
          type="text"
          placeholder="Nama proyek..."
          id="nama_proyek"
          className={inputStyles}
          defaultValue={dataPermintaan?.NAMA_PROYEK ?? ""}
          required
        />
      </div>

      <div className={inputContainerStyles}>
        <label className={labelStyles} htmlFor="lokasi_proyek">
          Lokasi Proyek
        </label>
        <input
          disabled={isLoading}
          {...register("lokasiProyek")}
          type="text"
          placeholder="Jl..."
          id="lokasi_proyek"
          className={inputStyles}
          defaultValue={dataPermintaan?.LOKASI_PROYEK ?? ""}
          required
        />
      </div>

      <div className={inputContainerStyles}>
        <label className={labelStyles} htmlFor="tgl_penggunaan">
          Tanggal Penggunaan
        </label>
        <p className="text-sm text-gray-500">
          Pada tanggal berapa alat/bahan yang anda ajukan akan di gunakan?
        </p>
        <input
          disabled={isLoading}
          {...register("tanggalPenggunaan")}
          type="date"
          id="tgl_penggunaan"
          className={inputStyles}
          defaultValue={
            dateToString(dataPermintaan?.TGL_PENGGUNAAN?.toString() ?? "") ?? ""
          }
          required
        />
      </div>

      <div className={inputContainerStyles}>
        <label className={labelStyles} htmlFor="tgl_pengembalian">
          Tanggal Pengembalian
        </label>
        <p className="text-sm text-gray-500">
          Pada tanggal berapa alat/bahan yang anda ajukan akan di kembalikan?
        </p>
        <input
          disabled={isLoading}
          {...register("tanggalPengembalian")}
          type="date"
          id="tgl_pengembalian"
          className={inputStyles}
          defaultValue={
            dateToString(dataPermintaan?.TGL_PENGEMBALIAN?.toString() ?? "") ??
            ""
          }
          required
        />
      </div>

      <div className="w-full flex flex-col gap-4">
        <p className={labelStyles}>Pilihan Barang</p>

        <div className="w-full flex flex-col gap-2">
          <p>Data alat</p>

          <div className="flex flex-row items-center gap-4">
            <button
              type="button"
              className={
                jenisAlat === "all" ? activeButtonStyles : baseButtonStyles
              }
              onClick={() => setJenisAlat("all")}
            >
              Semua Alat
            </button>
            <button
              type="button"
              className={
                jenisAlat === "AB" ? activeButtonStyles : baseButtonStyles
              }
              onClick={() => setJenisAlat("AB")}
            >
              Alat Berat
            </button>
            <button
              type="button"
              className={
                jenisAlat === "AR" ? activeButtonStyles : baseButtonStyles
              }
              onClick={() => setJenisAlat("AR")}
            >
              Alat Ringan
            </button>
          </div>

          {jenisAlat && jenisAlat !== "" && renderAlat(dataAlat, jenisAlat)}
        </div>

        <div className="w-full flex flex-col gap-2">
          <p>Data bahan</p>
          <ListPilihanBahan
            bahan={dataBahan}
            onCheckboxClicked={handleItemChange}
            selectedBahan={selectedItems}
          />
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className={labelStyles}>Jumlah Alat/Bahan yang Dibutuhkan:</p>
          {renderItemInputs()}
        </div>
      )}

      <Button type="submit" variants="PRIMARY" fullWidth disabled={isLoading}>
        {isLoading ? "Memproses..." : "Kirim"}
      </Button>

      {message && (
        <Snackbar variant="ERROR" message={message} autoHide duration={5000} />
      )}
      {success && (
        <Snackbar
          variant="SUCCESS"
          message={success}
          autoHide
          duration={5000}
        />
      )}
    </form>
  );
}
