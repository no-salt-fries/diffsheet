import React, { useRef, useEffect } from "react";
import canvasDatagrid from "canvas-datagrid";

interface DataGridProps {
  data: Record<string, any>;
}

const DataGrid: React.FC<DataGridProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      // 이미 생성되어 있다면 제거
      if (gridRef.current) {
        containerRef.current.innerHTML = "";
      }

      const grid = canvasDatagrid({
        parentNode: containerRef.current,
      });

      grid.style.height = "100%";
      grid.style.width = "100%";

      grid.data = data["Sheet1"]["!data"];
      gridRef.current = grid;
    }
  }, [data]);

  return <div ref={containerRef} />;
};

export default DataGrid;
