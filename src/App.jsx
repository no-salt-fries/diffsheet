import { useRef, useState } from "react";
import WorkBook from "./components/WorkBook";
import Menu from "./components/Menu";

import "./App.css";

import { selectedRefInitial } from "./components/types/selectedRef";
import { workbookInitial } from "./components/types/workbook";
import { compare } from "./utils/compare";

const App = () => {
  const [loading, setLoading] = useState(false);

  const [leftWbData, setLeftWbData] = useState(null);
  const [rightWbData, setRightWbData] = useState(null);

  const [sheetChangeButtonDisable, setButtonDisable] = useState(false);

  const initialselectedRef = selectedRefInitial();
  const selectedTargetRef = useRef(initialselectedRef);

  const [selectedTarget, setSelectedTarget] = useState(selectedRefInitial);

  const [inValidType, setInvalidType] = useState([]);

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
      setSelectedTarget(_selectedTargetRef);
      selectedTargetRef.current = _selectedTargetRef;
    }
  };

  const dataRef = useRef({
    fix: workbookInitial(),
    comp: workbookInitial(),
  });

  const [fixValue, setFixValue] = useState(workbookInitial);
  const [compValue, setCompValue] = useState(workbookInitial);

  const runCompare = () => {
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

    compare(
      f_columnIndex,
      f_valueColumnIndexes,
      f_data,
      c_columnIndex,
      c_valueColumnIndexes,
      c_data
    );
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
