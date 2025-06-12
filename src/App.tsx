import { useRef, useState } from "react";
import WorkBook from "./components/WorkBook";
import Menu from "./components/Menu";

import "./App.css";

import type { workbookDataType } from "./types";

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [leftWbData, setLeftWbData] = useState<Record<string, any> | null>(
    null
  );

  const [rightWbData, setRightWbData] = useState<Record<string, any> | null>(
    null
  );

  const [sheetChangeButtonDisable, setButtonDisable] = useState<boolean>(false);

  // canvas-datagrid용 ref
  const selectingTargetRef = useRef<null | {
    type: "fix" | "comp";
    field: "key_start" | "key_end" | number;
  }>(null);

  const [selectingTarget, setSelectingTarget] = useState<null | {
    type: "fix" | "comp";
    field: "key_start" | "key_end" | number;
  }>(null);

  // key: {start: {cell: null, value: null}, end: {cell: null, value: null}} 수정하기
  // value: [{cell: null}] 수정하기

  // 시작, 끝 key값을 받고 열 인덱스를 받기
  // 이게 직관적으로 어떤 데이터를 선택했는지 확인이 쉬울 것 같다고 판단
  const dataRef = useRef<workbookDataType>({
    fix: {
      meta: { workbookId: null, sheetName: null },
      key: {
        start: { cell: null, value: null },
        end: { cell: null, value: null },
      },
      value: [
        { id: 1, cell: null, value: null },
        { id: 2, cell: null, value: null },
        { id: 3, cell: null, value: null },
      ],
    },
    comp: {
      meta: { workbookId: null, sheetName: null },
      key: {
        start: { cell: null, value: null },
        end: { cell: null, value: null },
      },
      value: [
        { id: 1, cell: null, value: null },
        { id: 2, cell: null, value: null },
        { id: 3, cell: null, value: null },
      ],
    },
  });

  // fixValue, compValue는 Menu에서만 사용, 나머지 component에서 리랜더링 방지처리하기
  const [fixValue, setFixValue] = useState<Record<string, any>>({
    meta: { workbookId: null, sheetName: null },
    key: {
      start: { cell: null, value: null },
      end: { cell: null, value: null },
    },
    value: [
      { id: 1, cell: null, value: null },
      { id: 2, cell: null, value: null },
      { id: 3, cell: null, value: null },
    ],
  });

  const [compValue, setCompValue] = useState<Record<string, any>>({
    meta: { workbookId: null, sheetName: null },
    key: {
      start: { cell: null, value: null },
      end: { cell: null, value: null },
    },
    value: [
      { id: 1, cell: null, value: null },
      { id: 2, cell: null, value: null },
      { id: 3, cell: null, value: null },
    ],
  });

  const handleTargetClick = (
    type: "fix" | "comp",
    field: "key_start" | "key_end" | number
  ) => {
    if (selectingTarget?.type === type && selectingTarget?.field === field) {
      setSelectingTarget(null); // 다시 클릭하면 해제
      selectingTargetRef.current = null;
    } else {
      setSelectingTarget({ type, field });
      selectingTargetRef.current = { type, field };
    }
  };

  const runCompare = () => {
    // 적어도 id가 1인 value에는 값이 설정되어있어야 함
    //dataRef에 하나라도 null이 존재할 때는 이 함수가 실행되지 않게하기

    const getInfo = (objRef: Record<string, any>) => {
      const workBookId = objRef.meta.workbookId;
      const workBookSheetName = objRef.meta.sheetName;

      const rowStartIndex = objRef.key.start.cell?.split(":")[0] ?? "";
      const rowEndIndex = objRef.key.end.cell?.split(":")[0] ?? "";

      const fixColumnIndex = objRef.key.start.cell?.split(":")[1] ?? "";

      const valueColumnIndexes = objRef.value.map((d: any) => {
        console.log(d["cell"]);
        return {
          id: d["id"],
          columnIndex: d["cell"]?.split(":")[1] ?? null,
        };
      });

      return [
        workBookId,
        workBookSheetName,
        rowStartIndex,
        rowEndIndex,
        fixColumnIndex,
        valueColumnIndexes,
      ];
    };

    const getSheet = (id: string | null, sheetName: string | null) => {
      if (id && sheetName && leftWbData && rightWbData) {
        return leftWbData.Custprops.id === id
          ? leftWbData["Sheets"][sheetName]
          : rightWbData["Sheets"][sheetName];
      } else {
        return undefined;
      }
    };

    const selectedData = (
      _data: any,
      _rowStartIndex: any,
      _fixColumnIndex: any,
      _valueColumnIndexes: any
    ) => {
      return _data.map((r: any, i: number) => {
        const newRow: Record<string, any> = {
          originalRowIndex: parseInt(_rowStartIndex) + i,
          offset: 0,
          key: r[_fixColumnIndex]["v"],
        };
        // columnIndex + 1 해줘야함
        // key = r[keyRowIndex]

        console.log(r[_valueColumnIndexes[0]]);

        for (let i = 0; i < _valueColumnIndexes.length; i++) {
          const targetColumn =
            _valueColumnIndexes.find((d: any) => d.id === i + 1)?.columnIndex ??
            null;

          if (targetColumn) {
            newRow[`target_${i}`] = r[targetColumn]["v"];
          } else {
            newRow[`target_${i}`] = null;
          }
        }

        return newRow;
      });
    };

    const [
      f_workBookId,
      f_workBookSheetName,
      f_rowStartIndex,
      f_rowEndIndex,
      f_fixColumnIndex,
      f_valueColumnIndexes,
    ] = getInfo(dataRef.current.fix);

    const [
      c_workBookId,
      c_workBookSheetName,
      c_rowStartIndex,
      c_rowEndIndex,
      c_fixColumnIndex,
      c_valueColumnIndexes,
    ] = getInfo(dataRef.current.comp);

    const f_sheet = getSheet(f_workBookId, f_workBookSheetName);
    const c_sheet = getSheet(c_workBookId, c_workBookSheetName);

    const dataStartRow =
      parseInt(f_rowStartIndex) >= parseInt(c_rowStartIndex)
        ? parseInt(f_rowStartIndex)
        : parseInt(c_rowStartIndex);

    const f_data = f_sheet["!data"].slice(
      parseInt(f_rowStartIndex),
      parseInt(f_rowEndIndex) + 1
    );
    const c_data = c_sheet["!data"].slice(
      parseInt(c_rowStartIndex),
      parseInt(c_rowEndIndex) + 1
    );

    // console.log(f_keyRowIndex, f_keyColumnIndex, f_valueColumnIndexes, f_data);
    // console.log(c_keyRowIndex, c_keyColumnIndex, c_valueColumnIndexes, c_data);

    const selected_f_data = selectedData(
      f_data,
      f_rowStartIndex,
      f_fixColumnIndex,
      f_valueColumnIndexes
    );

    const selected_c_data = selectedData(
      c_data,
      c_rowStartIndex,
      c_fixColumnIndex,
      c_valueColumnIndexes
    );

    console.log(selected_f_data);
    console.log(selected_c_data);
  };

  return (
    <div className="flex flex-col">
      <Menu
        fixValue={fixValue}
        compValue={compValue}
        selectingTarget={selectingTarget}
        handleTargetClick={handleTargetClick}
        runCompare={runCompare}
      />
      <div className="flex flex-1 w-full">
        <div className="w-1/2">
          <WorkBook
            data={leftWbData}
            setData={setLeftWbData}
            setLoading={setLoading}
            dataRef={dataRef}
            selectingTargetRef={selectingTargetRef}
            sheetChangeButtonDisable={sheetChangeButtonDisable}
            setButtonDisable={setButtonDisable}
            setFixValue={setFixValue}
            setCompValue={setCompValue}
          />
        </div>
        <div className="w-1/2">
          <WorkBook
            data={rightWbData}
            setData={setRightWbData}
            setLoading={setLoading}
            dataRef={dataRef}
            selectingTargetRef={selectingTargetRef}
            sheetChangeButtonDisable={sheetChangeButtonDisable}
            setButtonDisable={setButtonDisable}
            setFixValue={setFixValue}
            setCompValue={setCompValue}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
