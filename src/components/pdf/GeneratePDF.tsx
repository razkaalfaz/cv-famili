"use client";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import Button from "../button/Button";
import { PrinterIcon } from "@heroicons/react/24/solid";

interface ComponentProps {
  html?: React.MutableRefObject<HTMLDivElement | null>;
  fileName: string;
}

export default function GeneratePDF({ html, fileName }: ComponentProps) {
  const generateImage = async () => {
    const image = await toPng(html!.current!, {
      quality: 1,
      skipAutoScale: true,
    });
    const doc = new jsPDF({
      compress: false,
      orientation: "landscape",
      format: [1280, 768],
      unit: "px",
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    doc.addImage(image, "PNG", 0, 0, width, height);
    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Button variants="PRIMARY" onClick={generateImage}>
        <div className="flex flex-row gap-2 items-center">
          <PrinterIcon className="w-4 h-4 text-white" />
          <b>Cetak</b>
        </div>
      </Button>
    </div>
  );
}
