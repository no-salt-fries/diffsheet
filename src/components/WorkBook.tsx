import { v4 as uuidv4 } from "uuid";

import React, { useState } from "react";
import DataGrid from "./DataGrid";
import type { workbookDataType } from "../types";

interface WorkBookProps {
  data: Record<string, any> | null;
  setData: React.Dispatch<React.SetStateAction<Record<string, any> | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFixValue: React.Dispatch<React.SetStateAction<workbookDataType>>;
  setCompValue: React.Dispatch<React.SetStateAction<workbookDataType>>;
  dataRef: React.RefObject<workbookDataType>;
  selectingTargetRef: React.RefObject<{
    type: "fix" | "comp";
    field: "key_start" | "key_end" | number;
  } | null>;
  sheetChangeButtonDisable: boolean;
  setButtonDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkBook: React.FC<WorkBookProps> = ({
  data,
  setData,
  setLoading,
  dataRef,
  selectingTargetRef,
  sheetChangeButtonDisable,
  setButtonDisable,
  setFixValue,
  setCompValue,
}) => {
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
          e.data.workbook.Custprops = { id: uuidv4() };
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
      {data && (
        <DataGrid
          data={data}
          dataRef={dataRef}
          selectingTargetRef={selectingTargetRef}
          sheetChangeButtonDisable={sheetChangeButtonDisable}
          setButtonDisable={setButtonDisable}
          setFixValue={setFixValue}
          setCompValue={setCompValue}
        />
      )}
    </div>
  );
};

// data가 바뀔 때를 제외하고는 WB 랜더링X
export default React.memo(
  WorkBook,
  (prev, next) =>
    prev.data === next.data &&
    prev.sheetChangeButtonDisable == next.sheetChangeButtonDisable
);
