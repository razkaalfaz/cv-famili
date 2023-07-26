interface ComponentProps {
  dataTransportasi: Transportasi[];
}

export default function TabelTransportasi({
  dataTransportasi,
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
