import { utils } from "xlsx";
import React, { useRef, useEffect, useState } from "react";
import canvasDatagrid from "canvas-datagrid";

interface DataGridProps {
  data: Record<string, any>;
}

const DataGrid: React.FC<DataGridProps> = ({ data }) => {
  const sheetNames = data["SheetNames"];
  const sheets = data["Sheets"];

  const [sheetName, setSheetName] = useState<string>(sheetNames[0]);
  const selectedData = utils.sheet_to_json(sheets[sheetName], {
    header: 1,
    raw: false,
    defval: "",
  });

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

      grid.style.height = "100%";
      grid.style.width = "100%";

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
