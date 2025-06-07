import { utils } from "xlsx";
import React, { useRef, useEffect, useState, useMemo } from "react";
import canvasDatagrid from "canvas-datagrid";

import type { workbookDataType } from "../types";

interface DataGridProps {
  data: Record<string, any>;
  setFixValue: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setCompValue: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  dataRef: React.RefObject<workbookDataType>;
  selectingTargetRef: React.RefObject<{
    type: "fix" | "comp";
    field: "key" | number;
  } | null>;
}

const DataGrid: React.FC<DataGridProps> = ({
  data,
  dataRef,
  selectingTargetRef,
  setFixValue,
  setCompValue,
}) => {
  const sheetNames = data["SheetNames"];
  const sheets = data["Sheets"];

  const [sheetName, setSheetName] = useState<string>(sheetNames[0]);

  // sheetName, sheets변화를 제외한 부모 Component의 state변화 무시
  const selectedData = useMemo(() => {
    return utils.sheet_to_json(sheets[sheetName], {
      header: 1,
      raw: false,
      defval: "",
    }) as any[][];
  }, [sheetName, sheets]);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      if (gridRef.current) {
        /*
        canvas-datagrid가 랜더링 될 때 마다 
        input.canvas-datagrid-control-input이 append 됨
        */
        const dataGridControlInput = document.querySelectorAll(
          ".canvas-datagrid-control-input"
        );

        dataGridControlInput.forEach((el) => {
          el.remove();
        });

        containerRef.current.innerHTML = "";
        gridRef.current = null;
      }

      const grid = canvasDatagrid({
        parentNode: containerRef.current,
      });

      // columnHeaderClickBehavior = 'sort' | 'select' | 'none'
      // columnHeader를 클릭했을 때 정렬되는 것을 막으려면 select 또는 none로 설정
      grid.setAttribute("columnHeaderClickBehavior", "none");

      // 비교하는 페이지이기 때문에 수정은 불필요
      grid.setAttribute("editable", false);

      // selection(ActiveCell)이 하나만 존재하도록 설정
      grid.setAttribute("selectionFollowsActiveCell", true);

      grid.style.height = "100%";
      grid.style.width = "100%";

      containerRef.current.style.width = "100%";
      containerRef.current.style.height = window.innerHeight - 200 + "px";

      grid.addEventListener("beforesortcolumn", (e: any) => {
        e.preventDefault();
      });

      grid.addEventListener("rendercell", (e: any) => {
        // type: fix | comp
        // field: key
        // 값이 존재하는 경우에는 해당 cell에 색을 설정

        const workbookId = data["Custprops"]["id"];

        const target = Object.entries(dataRef.current).find(
          ([, entry]) => entry["meta"]["workbookId"] === workbookId
        );
        if (target) {
          const cellInfo = target[1]["key"]["cell"];
          const rowIndex = parseInt(cellInfo.split(":")[0]);

          if (e.cell.rowIndex === rowIndex) {
            e.ctx.fillStyle = "#AEEDCF";
          }
        }

        // const target = selectingTargetRef.current;
        // const targetType = target?.type;
        // const targetField = target?.field;

        // if (targetType && targetField && targetField === "key") {
        //   if (dataRef.current[targetType]["key"]["workbookId"] === workbookId) {
        //     const selectedCellInfo =
        //       dataRef.current[targetType][targetField]["cell"];
        //     const rowIndex = selectedCellInfo.split(":")[0];

        //     if (e.cell.rowIndex === parseInt(rowIndex)) {
        //       e.ctx.fillStyle = "#AEEDCF";
        //     }
        //   }
        // }
      });

      grid.addEventListener("click", (e: any) => {
        console.log("click");
        if (!e.cell) return;
        if (e.cell.rowIndex == -1) return;

        const workbookId = data["Custprops"]["id"];
        const rowIndex = e.cell.rowIndex;
        const columnIndex = e.cell.columnIndex;
        const cellIndex = `${rowIndex}:${columnIndex}`;
        const cellValue = selectedData[e.cell.rowIndex][e.cell.columnIndex];

        const handleValueUpdate = (
          targetType: "fix" | "comp",
          field: "key" | number | undefined
        ) => {
          const setValue = targetType === "fix" ? setFixValue : setCompValue;

          if (field === "key") {
            setValue({
              meta: { workbookId, sheetName },
              key: { cell: cellIndex, value: cellValue },
              value: [{ cell: null, value: null }],
            });

            dataRef.current = {
              ...dataRef.current,
              [targetType]: {
                meta: { workbookId, sheetName },
                key: { cell: cellIndex, value: cellValue },
                value: [{ cell: null, value: null }],
              },
            };
          } else if (field !== undefined) {
            const keySheetId = dataRef.current[targetType]["meta"].workbookId;

            if (keySheetId && keySheetId !== workbookId) {
              window.alert("같은 workbook에서 데이터를 선택하세요");
              return;
            }

            setValue((prev) => {
              const newArr = [...prev.value];

              newArr[field] = {
                cell: cellIndex,
                value: cellValue,
              };

              return {
                ...prev,
                value: newArr,
              };
            });

            const refArr = [...dataRef.current[targetType]["value"]];
            refArr[field] = {
              cell: cellIndex,
              value: cellValue,
            };

            dataRef.current = {
              ...dataRef.current,
              [targetType]: { ...dataRef.current[targetType], value: refArr },
            };
          }
        };

        const target = selectingTargetRef.current;

        if (target) {
          handleValueUpdate(target.type, target.field);
        }
      });

      grid.data = selectedData;
      gridRef.current = grid;
    }
  }, [selectedData]);

  return (
    <div>
      {data["SheetNames"].map((d: string, i: number) => (
        <button key={d[i]} onClick={() => setSheetName(d)}>
          {d}
        </button>
      ))}
      <div ref={containerRef} />
    </div>
  );
};

export default DataGrid;
