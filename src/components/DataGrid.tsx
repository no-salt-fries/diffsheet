import { utils } from "xlsx";
import React, { useRef, useEffect, useState, useMemo } from "react";
import canvasDatagrid from "canvas-datagrid";

interface DataGridProps {
  data: Record<string, any>;
  setSelectedCell: React.Dispatch<React.SetStateAction<any>>;
  setFixValue: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setCompValue: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  selectingTargetRef: React.RefObject<{
    type: "fix" | "comp";
    field: "key" | number;
  } | null>;
}

const DataGrid: React.FC<DataGridProps> = ({
  data,
  setSelectedCell,
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
    setSelectedCell(null);

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

      //   grid.addEventListener("beforesortcolumn", (e: any) => {
      //     e.preventDefault();
      //   });

      //   grid.addEventListener("rendercell", (e: any) => {
      //     console.log("rendercell");
      //   });

      grid.addEventListener("click", (e: any) => {
        console.log("click");
        if (!e.cell) return;
        if (e.cell.rowIndex == -1) return;

        console.log(e.cell);
        console.log(e.cell.rowIndex, e.cell.columnIndex);
        console.log(selectedData[e.cell.rowIndex][e.cell.columnIndex]);

        // e.cell.header.title
        // e.cell.rowIndex + 1
        // e.cell.columnIndex

        // setSelectedCell(
        //   `${e.cell.header.title}${e.cell.rowIndex + 1}:${
        //     selectedData[e.cell.rowIndex][e.cell.columnIndex]
        //   }`
        // );

        console.log(selectingTargetRef.current);

        if (selectingTargetRef.current?.type === "fix") {
          if (selectingTargetRef.current?.field === "key") {
            setFixValue((prev) => ({
              ...prev,
              key: selectedData[e.cell.rowIndex][e.cell.columnIndex],
            }));
          } else {
            const field = selectingTargetRef.current?.field;
            if (field !== undefined) {
              setFixValue((prev) => {
                const newArr = [...prev.value];
                newArr[field] =
                  selectedData[e.cell.rowIndex][e.cell.columnIndex];

                return {
                  ...prev,
                  value: newArr,
                };
              });
            }
          }
        } else {
          if (selectingTargetRef.current?.field === "key") {
            setCompValue((prev) => ({
              ...prev,
              key: selectedData[e.cell.rowIndex][e.cell.columnIndex],
            }));
          } else {
            const field = selectingTargetRef.current?.field;
            if (field !== undefined) {
              setCompValue((prev) => {
                const newArr = [...prev.value];
                newArr[field] =
                  selectedData[e.cell.rowIndex][e.cell.columnIndex];

                return {
                  ...prev,
                  value: newArr,
                };
              });
            }
          }
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
