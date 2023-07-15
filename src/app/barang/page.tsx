"use client";

import ListAlat from "@/components/alat/ListAlat";
import ListBahan from "@/components/bahan/ListBahan";
import Button from "@/components/button/Button";
import Snackbar from "@/components/snackbar/Snackbar";
import ShowModal from "@/components/utils/ShowModal";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Barang() {
  const [dataShown, setDataShown] = useState("alat");
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: session, status } = useSession();

  const basicStyle =
    "rounded-md px-2 py-2 border border-gray-300 shrink-0 cursor-pointer";
  const activeStyle = basicStyle + " bg-orange-700 text-white";

  const opsiData = [
    {
      id: "alat",
      name: "Alat",
    },
    {
      id: "bahan",
      name: "Bahan",
    },
  ];

  function showData(data: string) {
    switch (data) {
      case "alat":
        return <ListAlat setMessage={setMessage} setSuccess={setSuccess} />;
      case "bahan":
        return <ListBahan setMessage={setMessage} setSuccess={setSuccess} />;

      default:
        return <ListAlat setMessage={setMessage} setSuccess={setSuccess} />;
    }
  }

  return (
    <div className="w-full px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-semibold">Data Barang</p>
        <p className="text-lg">
          Berikut merupakan data barang yang tersedia di CV. Famili Sejahtera
          Utama
        </p>
        <div className="w-28 rounded-md bg-orange-700 h-1" />
      </div>

      <div className="w-full flex flex-row gap-8 justify-between">
        <div className="w-40 flex flex-col gap-4">
          {opsiData.map((data: { id: string; name: string }) => (
            <div
              key={data.id}
              className={data.id === dataShown ? activeStyle : basicStyle}
              onClick={() => setDataShown(data.id)}
            >
              {data.name}
            </div>
          ))}
        </div>
        {showData(dataShown)}
      </div>
    </div>

    // <div className="w-full px-8 py-8 flex flex-col gap-8">
    //   {message && <Snackbar message={message} variant="ERROR" />}
    //   {success && <Snackbar message={success} variant="SUCCESS" />}
    //   <div className="w-full flex flex-col gap-4">
    //     <div className="w-full flex flex-row gap-4 justify-between items-center">
    //       <b className="text-2xl">Data Alat</b>
    //       {session?.user.ROLE === "ADMIN" && (
    //         <Button
    //           variants="PRIMARY"
    //           onClick={() => setModalShown("tambah-alat")}
    //         >
    //           Tambah Alat
    //         </Button>
    //       )}
    //     </div>
    //     <ListAlat setSuccess={setSuccess} setMessage={setMessage} />
    //   </div>
    //   <div className="w-full flex flex-col gap-4">
    //     <div className="w-full flex flex-row gap-4 justify-between items-center">
    //       <b className="text-2xl">Data Bahan</b>
    //       {session?.user.ROLE === "ADMIN" && (
    //         <Button
    //           variants="PRIMARY"
    //           onClick={() => setModalShown("tambah-bahan")}
    //         >
    //           Tambah Bahan
    //         </Button>
    //       )}
    //     </div>
    //     <ListBahan setMessage={setMessage} setSuccess={setSuccess} />
    //   </div>
    //   <ShowModal
    //     onClose={() => setModalShown(null)}
    //     options={modalShown}
    //     setSuccess={setSuccess}
    //     setMessage={setMessage}
    //   />
    // </div>
  );
}
