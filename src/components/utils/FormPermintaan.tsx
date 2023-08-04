"use client";

import { dateToString } from "@/lib/helper";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import AccordionAlat from "./AccordionAlat";
import { useSession } from "next-auth/react";
import ListPilihanBahan from "./ListPilihanBahan";
import { TrashIcon } from "@heroicons/react/24/solid";
import Button from "../button/Button";
import Snackbar from "../snackbar/Snackbar";
import { useRouter } from "next/navigation";

interface Inputs {
  alat: {
    KODE_UNIT: string;
  };
  bahan: {
    ID_BAHAN: string;
    JUMLAH: number;
  };
  NAMA_PROYEK: string;
  LOKASI_PROYEK: string;
  TGL_PENGGUNAAN: Date;
  TGL_PENGEMBALIAN: Date;
}

interface BahanQuantities {
  [key: string]: string;
}

interface ComponentProps {
  dataAlat: Alat[];
  dataBahan: Bahan[];
  dataPermintaan: Permintaan | null;
}

export default function FormPermintaan({
  dataAlat,
  dataBahan,
  dataPermintaan,
}: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedAlat, setSelectedAlat] = useState<string[]>([]);
  const [selectedBahan, setSelectedBahan] = useState<string[]>([]);
  const [quantityBahan, setQuantityBahan] = useState<BahanQuantities>({});
  const [uncheckedItems, setUncheckedItems] = useState<string[]>([]);
  const [isInternal, setIsInternal] = useState(true);
  const threeDaysShipping = new Date(
    new Date().getTime() + 72 * 60 * 60 * 1000
  );
  const oneDayShipping = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  const inputStyles =
    "w-full rounded-md outline-none border border-gray-300 overflow-hidden px-2 py-2";
  const inputContainerStyles = "w-full flex flex-col gap-1";
  const labelStyles = "font-semibold";

  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();
  const { register, reset, handleSubmit } = useForm<Inputs>({
    mode: "onChange",
  });
  const ajukanPermintaan: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);

    if (session) {
      if (!dataPermintaan) {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_API_PERMINTAAN!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              NAMA_PROYEK: data.NAMA_PROYEK,
              LOKASI_PROYEK: data.LOKASI_PROYEK,
              TGL_PENGGUNAAN: data.TGL_PENGGUNAAN,
              TGL_PENGEMBALIAN: data.TGL_PENGEMBALIAN,
              SELECTED_ALAT: selectedAlat,
              SELECTED_BAHAN: selectedBahan,
              JUMLAH_BARANG: quantityBahan,
              ID_USER: session.user.ID_USER,
            }),
          });

          const response = await res.json();

          if (!response.ok) {
            setIsLoading(false);
            setMessage("Terjadi kesalahan ketika melakukan permintaan...");
          } else {
            setIsLoading(false);
            setSuccess("Berhasil mengajukan permintaan.");
            mutate("/api/semua_permintaan");
            mutate("/api/permintaan-user/" + session.user.ID_USER);
            reset();
            setSelectedAlat([]);
            setSelectedBahan([]);
            router.push("/permintaan");
          }
        } catch (err) {
          setMessage("Terjadi kesalahan...");
          setIsLoading(false);
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
                NAMA_PROYEK: data.NAMA_PROYEK ?? dataPermintaan.NAMA_PROYEK,
                LOKASI_PROYEK:
                  data.LOKASI_PROYEK ?? dataPermintaan.LOKASI_PROYEK,
                TGL_PENGGUNAAN:
                  data.TGL_PENGGUNAAN ?? dataPermintaan.TGL_PENGGUNAAN,
                TGL_PENGEMBALIAN:
                  data.TGL_PENGEMBALIAN ?? dataPermintaan.TGL_PENGEMBALIAN,
                SELECTED_ALAT: selectedAlat,
                SELECTED_BAHAN: selectedBahan,
                JUMLAH_BARANG: quantityBahan,
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
            setSelectedAlat([]);
            setSelectedBahan([]);
            setQuantityBahan({});
            mutate("/api/get-permintaan/" + dataPermintaan.ID_PERMINTAAN);
            reset();
            router.push("/permintaan");
          }
        } catch (err) {
          setIsLoading(false);
          setMessage("Terjadi kesalahan...");
          console.error(err);
        }
      }
    }
  };

  const handleItemChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: BarangPermintaan
  ) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedBahan((prev) => [...prev, item.ID_BARANG]);
    } else {
      const updatedBahan = selectedBahan.filter(
        (bahan) => bahan !== item.ID_BARANG
      );
      setSelectedBahan(updatedBahan);
    }
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const { value } = event.target;
    setQuantityBahan({ ...quantityBahan, [itemId]: value });
  };

  const hapusBarang = (ID_BARANG: string) => {
    const updatedItems = selectedBahan.filter((item) => item !== ID_BARANG);
    setSelectedBahan(updatedItems);
    var currentQuantities = quantityBahan;
    delete currentQuantities[ID_BARANG];

    setQuantityBahan(currentQuantities);
    if (!uncheckedItems.includes(ID_BARANG)) {
      setUncheckedItems((prev) => [...prev, ID_BARANG]);
    }
  };

  const renderItemInputs = () => {
    return selectedBahan.map((item) => {
      const itemData = dataBahan.find((bahan) => bahan.ID_BAHAN === item);
      const maxValue = itemData?.STOCK_BAHAN;
      return (
        <div key={item}>
          <label className="w-full flex flex-row gap-4 items-center">
            <div className="w-2/12">{itemData?.NAMA_BAHAN}:</div>
            <div className="w-5/6 rounded-md outline-none border border-gray-300 overflow-hidden px-2 py-2 flex flex-row items-center gap-4">
              <input
                disabled={isLoading}
                type="number"
                min="1"
                value={quantityBahan[item] || ""}
                max={maxValue ? maxValue : undefined}
                className="w-full h-full"
                onChange={(e) => handleQuantityChange(e, item)}
                required
              />
              <p className="text-gray-500">{itemData?.UNIT_BAHAN}</p>
            </div>
            <div
              className="px-2 py-2 rounded-md grid place-items-center text-white bg-red-950 overflow-hidden cursor-pointer"
              onClick={() => hapusBarang(item)}
            >
              <TrashIcon className="w-4 h-4" />
            </div>
          </label>
        </div>
      );
    });
  };

  useEffect(() => {
    if (dataPermintaan) {
      const currentAlat = dataPermintaan?.detail_permintaan?.map(
        (permintaan) => permintaan.detail_alat
      );

      const currentBahan = dataPermintaan?.detail_permintaan?.map(
        (permintaan) => permintaan.bahan
      );

      if (currentAlat) {
        currentAlat
          .filter((permintaan) => permintaan !== null)
          .forEach((alat) => {
            setSelectedAlat((prev) => [...prev, alat.KODE_ALAT]);
          });
      }

      if (currentBahan) {
        currentBahan
          .filter((permintaan) => permintaan !== null)
          .forEach((bahan) => {
            setSelectedBahan((prev) => [...prev, bahan.ID_BAHAN]);
          });

        dataPermintaan?.detail_permintaan
          ?.filter(
            (detailPermintaan) => detailPermintaan?.JUMLAH_BAHAN !== null
          )
          .forEach((detail) => {
            setQuantityBahan((prev) => ({
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
          {...register("NAMA_PROYEK")}
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
          {...register("LOKASI_PROYEK")}
          type="text"
          placeholder="Jl..."
          id="lokasi_proyek"
          className={inputStyles}
          defaultValue={dataPermintaan?.LOKASI_PROYEK ?? ""}
          required
        />
      </div>

      <div className={inputContainerStyles}>
        <label className={labelStyles} htmlFor="opsi_pengiriman">
          Opsi Pengiriman
        </label>
        <p className="text-sm text-gray-500">
          Apakah lokasi proyek berada di dalam kota Sukabumi?
        </p>
        <select
          id="opsi_pengiriman"
          name="opsi_pengiriman"
          required
          onChange={(event) => setIsInternal(event.target.value === "YA")}
          className={inputStyles}
        >
          <option value="YA">Dalam Kota Sukabumi</option>
          <option value="TIDAK">Luar Kota Sukabumi</option>
        </select>
        <p className="text-gray-500">
          Estimasi pengiriman: {isInternal ? "1 hari" : "3 hari"}.
        </p>
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
          {...register("TGL_PENGGUNAAN")}
          min={
            isInternal
              ? dateToString(oneDayShipping.toDateString())
              : dateToString(threeDaysShipping.toDateString())
          }
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
          {...register("TGL_PENGEMBALIAN")}
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

      <div className={inputContainerStyles}>
        <label className={labelStyles}>Alat</label>
        <p className="text-sm text-gray-500">
          Silahkan pilih alat yang akan di pinjam
        </p>
        {dataPermintaan ? (
          <div className="w-full flex flex-col gap-4">
            {dataAlat.map((alat) => (
              <AccordionAlat
                isEdit={true}
                uncheckedAlat={uncheckedItems}
                setUncheckedAlat={setUncheckedItems}
                dataAlat={alat}
                selectedAlat={selectedAlat}
                setSelectedAlat={setSelectedAlat}
                key={alat.ID_ALAT}
                dataPermintaan={dataPermintaan}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {dataAlat.map((alat) => (
              <AccordionAlat
                isEdit={false}
                uncheckedAlat={uncheckedItems}
                setUncheckedAlat={setUncheckedItems}
                dataAlat={alat}
                selectedAlat={selectedAlat}
                setSelectedAlat={setSelectedAlat}
                key={alat.ID_ALAT}
                dataPermintaan={null}
              />
            ))}
          </div>
        )}
      </div>

      <div className={inputContainerStyles}>
        <label className={labelStyles}>Bahan</label>
        <p className="text-sm text-gray-500">
          Silahkan pilih bahan yang tersedia
        </p>
        <div className="w-full flex flex-col gap-4">
          <ListPilihanBahan
            bahan={dataBahan}
            onCheckboxClicked={handleItemChange}
            selectedBahan={selectedBahan}
          />
        </div>
      </div>

      {selectedBahan.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className={labelStyles}>Jumlah bahan yang dibutuhkan:</p>
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
