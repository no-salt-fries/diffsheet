import { utils } from "xlsx";
import React, { useRef, useEffect, useState, useMemo } from "react";
import canvasDatagrid from "canvas-datagrid";
import { workbookInitial } from "./types/workbook";

const DataGrid = ({
  data,
  dataRef,
  selectedTargetRef,
  sheetChangeButtonDisable,
  setButtonDisable,
  setFixValue,
  setCompValue,
}) => {
  const sheetNames = data["SheetNames"];
  const sheets = data["Sheets"];

  const [sheetName, setSheetName] = useState(sheetNames[0]);

  // sheetName, sheets변화를 제외한 부모 Component의 state변화 무시
  const currentSheetData = useMemo(() => {
    return utils.sheet_to_json(sheets[sheetName], {
      header: 1,
      raw: false,
      defval: "",
    });
  }, [sheetName, sheets]);

  const containerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    // currentSheetData가 바뀔 때 마다 아래의 코드가 실행
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

      grid.addEventListener("beforesortcolumn", (e) => {
        e.preventDefault();
      });

      const columnColorPreset = [
        "rgb(255 0 80 / 20%)",
        "rgb(0 25 255 / 20%)",
        "rgb(255 246 0 / 20%)",
      ];

      //   grid.addEventListener("rendercell", (e) => {
      //     // type: fix | comp
      //     // field: key
      //     // 값이 존재하는 경우에는 해당 cell에 색을 설정

      //     const workbookId = data["Custprops"]["id"];

      //     const target = Object.entries(dataRef.current).find(
      //       ([, entry]) => entry["meta"]["workbookId"] === workbookId
      //     );

      //     if (target) {
      //       let startIndex = null;
      //       let endIndex = null;

      //       const startCellInfo = target[1]["key"]["start"]["cell"];
      //       const endCellInfo = target[1]["key"]["end"]["cell"];

      //       const valueCellInfo = target[1]["value"];

      //       if (valueCellInfo) {
      //         valueCellInfo.map((d: any, i: number) => {
      //           const columnIndex = d["cell"]
      //             ? parseInt(d["cell"]?.split(":")[1])
      //             : -1;

      //           if (columnIndex === -1) return;

      //           if (e.cell.columnIndex === columnIndex) {
      //             if (e.cell.rowIndex > -1) {
      //               e.ctx.fillStyle = columnColorPreset[i];
      //             }
      //           }
      //         });
      //       }

      //       if (startCellInfo) {
      //         const startRowIndex = parseInt(startCellInfo.split(":")[0]);

      //         if (endCellInfo) {
      //           const endRowIndex = parseInt(endCellInfo.split(":")[0]);

      //           if (startRowIndex - endRowIndex === 0) {
      //             startIndex = startRowIndex;
      //             endIndex = startRowIndex;
      //           } else if (startRowIndex - endRowIndex !== 0) {
      //             if (startRowIndex > endRowIndex) {
      //               startIndex = endRowIndex;
      //               endIndex = startRowIndex;
      //             } else {
      //               startIndex = startRowIndex;
      //               endIndex = endRowIndex;
      //             }
      //           }

      //           if (
      //             startIndex &&
      //             e.cell.rowIndex >= startIndex &&
      //             endIndex &&
      //             e.cell.rowIndex <= endIndex
      //           ) {
      //             e.ctx.fillStyle = "#AEEDCF";
      //           }
      //         } else {
      //           startIndex = startRowIndex;

      //           if (e.cell.rowIndex === startIndex) {
      //             e.ctx.fillStyle = "#AEEDCF";
      //           }
      //         }
      //       }
      //     }
      //   });

      grid.addEventListener("click", (e) => {
        // 클릭하는 경우 > key_start, key_end, value
        // key_start, key_end는 rowIndex -1을 무시
        // value는 rowIndex -1을 무시 X
        console.log("click");
        console.log(e);
        if (!e.cell) return;
        // if (e.cell.rowIndex == -1) return;

        const workbookId = data["Custprops"]["id"];
        // sheetName은 위쪽에 선언할당

        const rowIndex = e.cell.rowIndex;
        const columnIndex = e.cell.columnIndex;
        const headerTitle = e.cell["header"]["title"];
        const cellValue = currentSheetData[e.cell.rowIndex][e.cell.columnIndex];

        // 눌려진 버튼에 따라서 fixValue, compValue에 값을 설정하는 함수
        const handleValueUpdate = (selectedRef) => {
          console.log(selectedRef);
          if (selectedRef.type !== null) {
            const selectedType = selectedRef.type;
            const setValue =
              selectedType === "fix" ? setFixValue : setCompValue;
            const sheetIdOfKeyStart =
              dataRef.current[selectedType]["meta"].workbookId;

            if ("keyField" in selectedRef) {
              if (e.cell.rowIndex == -1) return;
              const { keyField } = selectedRef;

              if (keyField === "key_start") {
                const workbookInitialstate = workbookInitial();
                workbookInitialstate["meta"] = { workbookId, sheetName };
                workbookInitialstate["key"]["start"] = {
                  rowIndex,
                  columnIndex,
                  headerTitle,
                  value: cellValue,
                };

                setValue(workbookInitialstate);
                dataRef.current = {
                  ...dataRef.current,
                  [selectedType]: workbookInitialstate,
                };

                setButtonDisable(true);
              } else {
                const keyStartCellColumn =
                  dataRef.current[selectedType]["key"]["start"][
                    "columnIndex"
                  ] ?? "";

                if (sheetIdOfKeyStart && sheetIdOfKeyStart !== workbookId) {
                  window.alert("같은 workbook에서 데이터를 선택하세요");
                  return;
                }

                if (parseInt(keyStartCellColumn) !== parseInt(columnIndex)) {
                  window.alert("같은 열에서 데이터를 선택하세요");
                  return;
                }

                const selectCellObj = {
                  rowIndex,
                  columnIndex,
                  headerTitle,
                  value: cellValue,
                };

                setValue((prev) => ({
                  ...prev,
                  key: {
                    ...prev["key"],
                    end: selectCellObj,
                  },
                }));

                dataRef.current = {
                  ...dataRef.current,
                  [selectedType]: {
                    ...dataRef.current[selectedType],
                    key: {
                      ...dataRef.current[selectedType]["key"],
                      end: selectCellObj,
                    },
                  },
                };
              }
            } else {
              const { valueField } = selectedRef;

              if (sheetIdOfKeyStart && sheetIdOfKeyStart !== workbookId) {
                window.alert("같은 workbook에서 데이터를 선택하세요");
                return;
              }

              setValue((prev) => {
                const newValueObj = { ...prev.value };

                newValueObj[valueField] = {
                  rowIndex,
                  columnIndex,
                  headerTitle,
                  value: cellValue,
                  type: null,
                };

                return {
                  ...prev,
                  value: newValueObj,
                };
              });

              const refObj = { ...dataRef.current[selectedType]["value"] };

              refObj[valueField] = {
                rowIndex,
                columnIndex,
                value: cellValue,
                headerTitle,
                type: null,
              };

              dataRef.current = {
                ...dataRef.current,
                [selectedType]: {
                  ...dataRef.current[selectedType],
                  value: refObj,
                },
              };
            }
          }
        };

        const target = selectedTargetRef.current;

        if (target) {
          handleValueUpdate(target);
        }
      });

      grid.data = currentSheetData;
      gridRef.current = grid;
    }
  }, [currentSheetData]);

  return (
    <div>
      {data["SheetNames"].map((d, i) => (
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
