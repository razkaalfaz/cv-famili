import Link from "next/link";

interface ComponentProps {
  dataTransportasi: Transportasi[];
  showAksi?: boolean;
  showPermintaan?: boolean;
}

export default function TabelTransportasi({
  dataTransportasi,
  showAksi = false,
  showPermintaan = false,
}: ComponentProps) {
  const tableDataStyles = "px-2 py-2 border border-gray-300";
  const tableDataCenteredStyles = tableDataStyles + " text-center";

  const statusChecker = (status: StatusTransportasi) => {
    if (status === "TERSEDIA") {
      return "Tersedia";
    } else {
      return "Sedang digunakan";
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <td className="px-2 py-2 border border-gray-300 bg-orange-500 text-white font-bold text-center">
            No.
          </td>
          <td className="px-2 py-2 border border-gray-300 bg-orange-500 text-white font-bold text-center">
            ID Transportasi
          </td>
          <td className="px-2 py-2 border border-gray-300 bg-orange-500 text-white font-bold text-center">
            ID Armada
          </td>
          <td className="px-2 py-2 border border-gray-300 bg-orange-500 text-white font-bold text-center">
            Nama Transportasi
          </td>
          <td className="px-2 py-2 border border-gray-300 bg-orange-500 text-white font-bold text-center">
            Status Ketersediaan
          </td>

          {showAksi && (
            <td className="px-2 py-2 border border-gray-300 bg-orange-500 text-white font-bold text-center">
              Aksi
            </td>
          )}

          {showPermintaan && (
            <td className="px-2 py-2 border border-gray-300 bg-orange-500 text-white font-bold text-center">
              Dipakai untuk
            </td>
          )}
        </tr>
      </thead>

      <tbody>
        {dataTransportasi.length > 0 ? (
          <>
            {dataTransportasi.map(
              (transportasi: Transportasi, index: number) => (
                <tr key={transportasi.ID_TRANSPORTASI}>
                  <td className={tableDataCenteredStyles}>{index + 1}.</td>
                  <td className={tableDataCenteredStyles}>
                    {transportasi.ID_TRANSPORTASI}
                  </td>
                  <td className={tableDataCenteredStyles}>
                    {transportasi.ID_ARMADA}
                  </td>
                  <td className={tableDataCenteredStyles}>
                    {transportasi.NAMA_TRANSPORTASI}
                  </td>
                  <td className={tableDataCenteredStyles}>
                    {statusChecker(transportasi.STATUS)}
                  </td>
                  {showAksi && (
                    <td className={tableDataCenteredStyles}>
                      <Link
                        href={
                          "/transportasi/detail/" + transportasi.ID_TRANSPORTASI
                        }
                        className="px-2 py-2 bg-orange-500 text-white rounded-md grid place-items-center"
                      >
                        Detail
                      </Link>
                    </td>
                  )}

                  {showPermintaan && (
                    <td className={tableDataCenteredStyles}>
                      Pengiriman permintaan {transportasi.ID_PERMINTAAN}
                    </td>
                  )}
                </tr>
              )
            )}
          </>
        ) : (
          <tr className="w-full grid place-items-center text-gray-500">
            Tidak ada data transportasi...
          </tr>
        )}
      </tbody>
    </table>
  );
}
