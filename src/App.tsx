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
    //dataRef에 하나라도 null이 존재할 때는 이 함수가 실행되지 않게하기

    const getInfo = (objRef: Record<string, any>) => {
      const workBookId = objRef.meta.workbookId;
      const workBookSheetName = objRef.meta.sheetName;
      const [keyRowIndex, keyColumnIndex] = objRef.key.cell?.split(":") ?? [
        "",
        "",
      ];

      const valueCell = objRef.value.map((d: any) => d.cell);
      const valueColumnIndex = valueCell.map((d: string) =>
        Number(d.split(":")[1])
      );

      return [
        workBookId,
        workBookSheetName,
        keyRowIndex,
        keyColumnIndex,
        valueColumnIndex,
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
      _keyColumnIndex: any,
      _valueColumnIndex: any
    ) => {
      return _data.map((r: any) => {
        const newRow: Record<string, any> = { key: r[_keyColumnIndex]["v"] };
        // columnIndex + 1 해줘야함
        // key = r[keyRowIndex]

        console.log(r[_valueColumnIndex[0]]);

        for (let i = 0; i < _valueColumnIndex.length; i++) {
          newRow[`value_${i}`] = r[_valueColumnIndex[i]]["v"];
        }

        return newRow;
      });
    };

    const [
      f_workBookId,
      f_workBookSheetName,
      f_keyRowIndex,
      f_keyColumnIndex,
      f_valueColumnIndex,
    ] = getInfo(dataRef.current.fix);

    const [
      c_workBookId,
      c_workBookSheetName,
      c_keyRowIndex,
      c_keyColumnIndex,
      c_valueColumnIndex,
    ] = getInfo(dataRef.current.comp);

    const f_sheet = getSheet(f_workBookId, f_workBookSheetName);
    const c_sheet = getSheet(c_workBookId, c_workBookSheetName);

    const dataStartRow =
      parseInt(f_keyRowIndex) >= parseInt(c_keyRowIndex)
        ? parseInt(f_keyRowIndex)
        : parseInt(c_keyRowIndex);

    const f_data = f_sheet["!data"].slice(parseInt(f_keyRowIndex));
    const c_data = c_sheet["!data"].slice(parseInt(c_keyRowIndex));

    // console.log(f_keyRowIndex, f_keyColumnIndex, f_valueColumnIndex, f_data);
    // console.log(c_keyRowIndex, c_keyColumnIndex, c_valueColumnIndex, c_data);

    const selected_f_data = selectedData(
      f_data,
      f_keyColumnIndex,
      f_valueColumnIndex
    );

    const selected_c_data = selectedData(
      c_data,
      c_keyColumnIndex,
      c_valueColumnIndex
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
