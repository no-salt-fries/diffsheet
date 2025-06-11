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
    field: "key_start" | "key_end" | number;
  } | null>;
  sheetChangeButtonDisable: boolean;
  setButtonDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataGrid: React.FC<DataGridProps> = ({
  data,
  dataRef,
  selectingTargetRef,
  sheetChangeButtonDisable,
  setButtonDisable,
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
    // selectedData가 바뀔 때 마다 아래의 코드가 실행
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

      const columnColorPreset = [
        "rgb(255 0 80 / 20%)",
        "rgb(0 25 255 / 20%)",
        "rgb(255 246 0 / 20%)",
      ];

      grid.addEventListener("rendercell", (e: any) => {
        // type: fix | comp
        // field: key
        // 값이 존재하는 경우에는 해당 cell에 색을 설정

        const workbookId = data["Custprops"]["id"];

        const target = Object.entries(dataRef.current).find(
          ([, entry]) => entry["meta"]["workbookId"] === workbookId
        );

        if (target) {
          let startIndex = null;
          let endIndex = null;

          const startCellInfo = target[1]["key"]["start"]["cell"];
          const endCellInfo = target[1]["key"]["end"]["cell"];

          const valueCellInfo = target[1]["value"];

          if (valueCellInfo) {
            valueCellInfo.map((d: any, i: number) => {
              const columnIndex = d["cell"]
                ? parseInt(d["cell"]?.split(":")[1])
                : -1;

              if (columnIndex === -1) return;

              if (e.cell.columnIndex === columnIndex) {
                if (e.cell.rowIndex > -1) {
                  e.ctx.fillStyle = columnColorPreset[i];
                }
              }
            });
          }

          if (startCellInfo) {
            const startRowIndex = parseInt(startCellInfo.split(":")[0]);

            if (endCellInfo) {
              const endRowIndex = parseInt(endCellInfo.split(":")[0]);

              if (startRowIndex - endRowIndex === 0) {
                startIndex = startRowIndex;
                endIndex = startRowIndex;
              } else if (startRowIndex - endRowIndex !== 0) {
                if (startRowIndex > endRowIndex) {
                  startIndex = endRowIndex;
                  endIndex = startRowIndex;
                } else {
                  startIndex = startRowIndex;
                  endIndex = endRowIndex;
                }
              }

              if (
                startIndex &&
                e.cell.rowIndex >= startIndex &&
                endIndex &&
                e.cell.rowIndex <= endIndex
              ) {
                e.ctx.fillStyle = "#AEEDCF";
              }
            } else {
              startIndex = startRowIndex;

              if (e.cell.rowIndex === startIndex) {
                e.ctx.fillStyle = "#AEEDCF";
              }
            }
          }
        }
      });

      grid.addEventListener("click", (e: any) => {
        // 클릭하는 경우 > key_start, key_end, value
        // key_start, key_end는 rowIndex -1을 무시
        // value는 rowIndex -1을 무시 X
        console.log("click");
        console.log(e);
        if (!e.cell) return;
        // if (e.cell.rowIndex == -1) return;

        const workbookId = data["Custprops"]["id"];
        const rowIndex = e.cell.rowIndex;
        const columnIndex = e.cell.columnIndex;
        const cellIndex = `${rowIndex}:${columnIndex}`;
        // const cellValue = selectedData[e.cell.rowIndex][e.cell.columnIndex];

        const handleValueUpdate = (
          targetType: "fix" | "comp",
          field: "key_start" | "key_end" | number | undefined
        ) => {
          const setValue = targetType === "fix" ? setFixValue : setCompValue;

          if (field === "key_start") {
            if (e.cell.rowIndex == -1) return;
            const cellValue = selectedData[e.cell.rowIndex][e.cell.columnIndex];

            setValue({
              meta: { workbookId, sheetName },
              key: {
                start: { cell: cellIndex, value: cellValue },
                end: { cell: null, value: null },
              },
              value: [
                { id: 1, cell: null, value: null },
                { id: 2, cell: null, value: null },
                { id: 3, cell: null, value: null },
              ],
            });

            dataRef.current = {
              ...dataRef.current,
              [targetType]: {
                meta: { workbookId, sheetName },
                key: {
                  start: { cell: cellIndex, value: cellValue },
                  end: { cell: null, value: null },
                },
                value: [
                  { id: 1, cell: null, value: null },
                  { id: 2, cell: null, value: null },
                  { id: 3, cell: null, value: null },
                ],
              },
            };

            setButtonDisable(true);
          } else if (field === "key_end") {
            if (e.cell.rowIndex == -1) return;
            const cellValue = selectedData[e.cell.rowIndex][e.cell.columnIndex];

            const keySheetId = dataRef.current[targetType]["meta"].workbookId;
            const startCell =
              dataRef.current[targetType]["key"]["start"]["cell"];
            const startCellColumn = startCell?.split(":")[1] ?? "";

            if (keySheetId && keySheetId !== workbookId) {
              window.alert("같은 workbook에서 데이터를 선택하세요");
              return;
            }

            console.log(startCellColumn, columnIndex);

            if (parseInt(startCellColumn) !== parseInt(columnIndex)) {
              window.alert("같은 열에서 데이터를 선택하세요");
              return;
            }

            setValue((prev) => ({
              ...prev,
              key: {
                ...prev["key"],
                end: { cell: cellIndex, value: cellValue },
              },
            }));

            dataRef.current = {
              ...dataRef.current,
              [targetType]: {
                ...dataRef.current[targetType],
                key: {
                  ...dataRef.current[targetType]["key"],
                  end: { cell: cellIndex, value: cellValue },
                },
              },
            };
          } else if (field !== undefined) {
            //열을 선택했을 때
            const keySheetId = dataRef.current[targetType]["meta"].workbookId;
            const cellValue = e.cell["header"]["title"];

            if (keySheetId && keySheetId !== workbookId) {
              window.alert("같은 workbook에서 데이터를 선택하세요");
              return;
            }

            setValue((prev) => {
              const newArr = [...prev.value];

              newArr[field] = {
                ...newArr[field],
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
              ...refArr[field],
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
        <button
          className={`px-4 ${
            sheetChangeButtonDisable ? "" : "bg-stone-600 text-white"
          }`}
          disabled={sheetChangeButtonDisable}
          key={d[i]}
          onClick={() => setSheetName(d)}
        >
          {d}
        </button>
      ))}
      <div ref={containerRef} />
    </div>
  );
};

export default DataGrid;
