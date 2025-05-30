import React, { useState } from "react";
import DataGrid from "./DataGrid";

interface WorkBookProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCell: React.Dispatch<React.SetStateAction<any>>;
}

const WorkBook: React.FC<WorkBookProps> = ({ setLoading, setSelectedCell }) => {
  const [data, setData] = useState<Record<string, any> | null>(null);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 119MB 파일을 열었을 때 해당 브라우저가 1.5GB 메모리 사용
    // 4GB 메모리를 사용중인 PC에서도 동작하게 하기위해 일단 5MB로 설정
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`파일 크기는 ${maxSizeMB}MB 이하로 업로드 해주세요`);
      e.target.value = "";
      return;
    }

    setData(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result;
      if (!buffer) return;

      const xlsxWorker = new Worker(
        new URL("./../workers/xlsxWorker.ts", import.meta.url),
        {
          type: "module",
        }
      );

      xlsxWorker.postMessage(buffer);

      xlsxWorker.onmessage = (e) => {
        setLoading(false);

        if (e.data.success) {
          setData(e.data.workbook);
        } else {
          console.error("Worker error:", e.data.error);
        }

        xlsxWorker.terminate();
      };
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <div>
        <input type="file" onChange={fileChangeHandler} />
      </div>
      {data && <DataGrid data={data} setSelectedCell={setSelectedCell} />}
    </div>
  );
};

export default WorkBook;
