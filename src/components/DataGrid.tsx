import { utils } from "xlsx";
import React, { useRef, useEffect, useState, useMemo } from "react";
import canvasDatagrid from "canvas-datagrid";

interface DataGridProps {
  data: Record<string, any>;
  setSelectedCell: React.Dispatch<React.SetStateAction<any>>;
}

const DataGrid: React.FC<DataGridProps> = ({ data, setSelectedCell }) => {
  const sheetNames = data["SheetNames"];
  const sheets = data["Sheets"];

  const [sheetName, setSheetName] = useState<string>(sheetNames[0]);

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

      grid.style.height = "100%";
      grid.style.width = "100%";

      containerRef.current.style.width = "100%";
      containerRef.current.style.height = window.innerHeight - 200 + "px";

      //   grid.addEventListener("beforesortcolumn", (e: any) => {
      //     e.preventDefault();
      //   });

      grid.addEventListener("click", (e: any) => {
        if (!e.cell) return;
        if (e.cell.rowIndex == -1) return;
        console.log(e.cell);
        console.log(e.cell.rowIndex, e.cell.columnIndex);
        console.log(selectedData[e.cell.rowIndex][e.cell.columnIndex]);

        // e.cell.header.title
        // e.cell.rowIndex + 1
        // e.cell.columnIndex

        setSelectedCell(
          `${e.cell.header.title}${e.cell.rowIndex + 1}:${
            selectedData[e.cell.rowIndex][e.cell.columnIndex]
          }`
        );
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
