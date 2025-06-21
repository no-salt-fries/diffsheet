import { useRef, useState } from "react";
import WorkBook from "./components/WorkBook";
import Menu from "./components/Menu";

import "./App.css";

import { selectedRefInitial } from "./components/types/selectedRef";
import { workbookInitial } from "./components/types/workbook";

const App = () => {
  const [loading, setLoading] = useState(false);

  const [leftWbData, setLeftWbData] = useState(null);
  const [rightWbData, setRightWbData] = useState(null);

  const [sheetChangeButtonDisable, setButtonDisable] = useState(false);

  // 버튼 클릭 > type: fix | comp, keyField: key_start | key_end, valueField: 1 | 2
  // 해당 값들이 selectedTarget, selectedTargetRef 에 설정 됨
  // ref는 canvas-dataGrid에서 리랜더링을 방지하기 위해서 사용
  const initialselectedRef = selectedRefInitial();
  const selectedTargetRef = useRef(initialselectedRef);

  const [selectedTarget, setSelectedTarget] = useState(selectedRefInitial);

  const [inValidType, setInvalidType] = useState([]);

  // selectingTargetRef, selectedTarget 값을 설정하는 함수
  // handleTargetClick({ type: "fix", keyField: "key_start" })
  // handleTargetClick({ type: "fix", valueField: "1" })
  // handleTargetClick({ type: null })

  // key_끝 선택버튼을 눌렀을 때 key_시작에 값이 설정되어있지 않으면 해당 부분에 빨간색 테두리 설정하기
  // 열_1 선택버튼을 눌렀을 때 key부분(시작, 끝, 타입, 포맷)에서 값이 설정되어있지 않은 부분에 빨간색 테두리 설정하기
  // 열_2 선택버튼을 눌렀을 때 열_1에서 값이 설정되어있지 않은 부분에 빨간색 테두리 설정하기
  // 엄청복잡하네..
  const handleTargetClick = (_selectedTargetRef) => {
    const isSame =
      selectedTarget.type === _selectedTargetRef.type &&
      (("keyField" in selectedTarget &&
        "keyField" in _selectedTargetRef &&
        selectedTarget.keyField === _selectedTargetRef.keyField) ||
        ("valueField" in selectedTarget &&
          "valueField" in _selectedTargetRef &&
          selectedTarget.valueField === _selectedTargetRef.valueField));

    if (isSame) {
      setSelectedTarget(initialselectedRef);
      selectedTargetRef.current = initialselectedRef;
    } else {
      // 여기서 빨간색 테두리를 설정하는 걸 따져봐야할듯
      // 근데 빨간색 테두리는 어떻게 설정하지 ㅋㅋ
      setSelectedTarget(_selectedTargetRef);
      selectedTargetRef.current = _selectedTargetRef;
    }
  };

  // fixValue, compValue는 Menu에서만 사용
  // canvas-dataGrid 리랜더링 방지로 ref사용
  const dataRef = useRef({
    fix: workbookInitial(),
    comp: workbookInitial(),
  });

  // fixValue, compValue는 Menu에서만 사용, 나머지 component에서 리랜더링 방지처리하기
  // type, value를 굳이 여기 저장해야할 필요가있나
  const [fixValue, setFixValue] = useState(workbookInitial);
  const [compValue, setCompValue] = useState(workbookInitial);

  const runCompare = () => {
    // 적어도 id가 1인 value에는 값이 설정되어있어야 함
    //dataRef에 하나라도 null이 존재할 때는 이 함수가 실행되지 않게하기

    const checkInvalid = () => {
      const invalids = [];

      const setInvalids = (state, target) => {
        if (state.key.type.type !== null) {
          if (state.key.type.type === "date") {
            if (
              state.key.type.format === "" ||
              state.key.type.format === null
            ) {
              invalids.push(`${target}.key.type.format`);
            }
          }
        } else {
          invalids.push(`${target}.key.type.type`);
        }

        if (state.value[1].type === null) {
          invalids.push(`${target}.value.1.type`);
        }

        if (state.value[2].type === null) {
          invalids.push(`${target}.value.2.type`);
        }
      };

      setInvalids(fixValue, "fix");
      setInvalids(compValue, "comp");
      setInvalidType(invalids);

      return invalids.length > 0 ? false : true;
    };

    // 선택 된 부분만 가지고와서 새로운 grid에 보여주기
    // 바뀐 순서를 어떻게 설정할지를 고민해봐야할듯
    const getInfo = (wbState) => {
      const workBookId = wbState.meta.workbookId;
      const workBookSheetName = wbState.meta.sheetName;

      const startIndex = parseInt(wbState.key.start.rowIndex);
      const endIndex = parseInt(wbState.key.end.rowIndex);

      const rowStartIndex = startIndex <= endIndex ? startIndex : endIndex;

      const rowEndIndex = startIndex > endIndex ? startIndex : endIndex;

      const fixColumnIndex = {
        columnIndex: wbState.key.start.columnIndex,
        type: wbState.key.type.type,
        format: wbState.key.type.format,
      };

      const valueColumnIndexes = Object.entries(wbState.value).map(
        ([_valueField, value], i) => {
          return {
            valueField: _valueField,
            columnIndex: value.columnIndex,
            type: value.type,
          };
        }
      );

      return [
        workBookId,
        workBookSheetName,
        rowStartIndex,
        rowEndIndex,
        fixColumnIndex,
        valueColumnIndexes,
      ];
    };

    const getSheet = (id, sheetName) => {
      if (id && sheetName && leftWbData && rightWbData) {
        return leftWbData.Custprops.id === id
          ? leftWbData["Sheets"][sheetName]
          : rightWbData["Sheets"][sheetName];
      } else {
        return undefined;
      }
    };

    let isValid = checkInvalid();
    if (!isValid) return;

    const [
      f_workBookId,
      f_workBookSheetName,
      f_rowStartIndex,
      f_rowEndIndex,
      f_columnIndex,
      f_valueColumnIndexes,
    ] = getInfo(fixValue);

    const [
      c_workBookId,
      c_workBookSheetName,
      c_rowStartIndex,
      c_rowEndIndex,
      c_columnIndex,
      c_valueColumnIndexes,
    ] = getInfo(compValue);

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

    console.log(f_columnIndex, f_valueColumnIndexes, f_data);
    console.log(c_columnIndex, c_valueColumnIndexes, c_data);

    // const selected_f_data = selectedData(
    //   f_data,
    //   f_rowStartIndex,
    //   f_fixColumnIndex,
    //   f_valueColumnIndexes
    // );

    // const selected_c_data = selectedData(
    //   c_data,
    //   c_rowStartIndex,
    //   c_fixColumnIndex,
    //   c_valueColumnIndexes
    // );

    // console.log(selected_f_data);
    // console.log(selected_c_data);
  };

  return (
    <div className="flex flex-col">
      <Menu
        inValidType={inValidType}
        setInvalidType={setInvalidType}
        fixValue={fixValue}
        compValue={compValue}
        selectedTarget={selectedTarget}
        handleTargetClick={handleTargetClick}
        runCompare={runCompare}
        setFixValue={setFixValue}
        setCompValue={setCompValue}
      />
      <div className="flex flex-1 w-full">
        <div className="w-1/2">
          <WorkBook
            data={leftWbData}
            setData={setLeftWbData}
            setLoading={setLoading}
            dataRef={dataRef}
            selectedTargetRef={selectedTargetRef}
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
            selectedTargetRef={selectedTargetRef}
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
