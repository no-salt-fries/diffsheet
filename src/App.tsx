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

  // 으 헷갈려

  // selectingTargetRef에 따라서 canvas-datagrid cell을 클릭했을 때 fix, comp 둘 중 하나의 state에 값이 저장됨
  // ref를 사용하는 이유는 canvas-datagrid 리랜더링 방지를 위해서
  const selectingTargetRef = useRef<null | {
    type: "fix" | "comp";
    field: "key_start" | "key_end" | number;
  }>(null);

  // selectingTargetRef에 따라서 canvas-datagrid cell을 클릭했을 때 fix, comp 둘 중 하나의 state에 값이 저장됨
  // 아래 코드는 menu에서 style을 위해 사용하는 state
  const [selectingTarget, setSelectingTarget] = useState<null | {
    type: "fix" | "comp";
    field: "key_start" | "key_end" | number;
  }>(null);

  // menu에서 클릭된 버튼에 따라 selectingTargetRef, selectingTarget에 값이 설정된다
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

  // ref, state initial 값 생성함수
  const createInitial = () => ({
    meta: { workbookId: null, sheetName: null },
    key: {
      type: {
        type: null,
        format: null,
      },
      start: {
        rowIndex: null,
        columnIndex: null,
        value: null,
        headerValue: null,
      },
      end: {
        rowIndex: null,
        columnIndex: null,
        value: null,
        headerValue: null,
      },
    },
    value: {
      1: {
        rowIndex: null,
        columnIndex: null,
        value: null,
        headerValue: null,
        type: null,
      },
      2: {
        rowIndex: null,
        columnIndex: null,
        value: null,
        headerValue: null,
        type: null,
      },
    },
  });

  // fixValue, compValue는 Menu에서만 사용
  // canvas-dataGrid 리랜더링 방지로 ref사용
  const dataRef = useRef<workbookDataType>({
    fix: createInitial(),
    comp: createInitial(),
  });

  // fixValue, compValue는 Menu에서만 사용, 나머지 component에서 리랜더링 방지처리하기
  const [fixValue, setFixValue] = useState<workbookDataType>(() => {
    return {
      fix: createInitial(),
      comp: createInitial(),
    };
  });

  const [compValue, setCompValue] = useState<workbookDataType>(() => {
    return {
      fix: createInitial(),
      comp: createInitial(),
    };
  });

  const runCompare = () => {
    // 적어도 id가 1인 value에는 값이 설정되어있어야 함
    //dataRef에 하나라도 null이 존재할 때는 이 함수가 실행되지 않게하기

    // 선택 된 부분만 가지고와서 새로운 grid에 보여주기
    // 바뀐 순서를 어떻게 설정할지를 고민해봐야할듯
    const getInfo = (objRef: Record<string, any>) => {
      const workBookId = objRef.meta.workbookId;
      const workBookSheetName = objRef.meta.sheetName;

      // 굳이 이렇게 split을 해야해? 그냥 저장할 때 row따로 column따로 저장하기
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
