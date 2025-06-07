import { useRef, useState } from "react";
import "./App.css";
import WorkBook from "./components/WorkBook";
import MenuDiv from "./components/UI/MenuDiv";

import type { workbookDataType } from "./types";
import Menu from "./components/Menu";

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [leftWbData, setLeftWbData] = useState<Record<string, any> | null>(
    null
  );

  const [rightWbData, setRightWbData] = useState<Record<string, any> | null>(
    null
  );

  // canvas-datagrid용 ref
  const selectingTargetRef = useRef<null | {
    type: "fix" | "comp";
    field: "key" | number;
  }>(null);

  const [selectingTarget, setSelectingTarget] = useState<null | {
    type: "fix" | "comp";
    field: "key" | number;
  }>(null);

  const dataRef = useRef<workbookDataType>({
    fix: {
      key: { workbookId: "", cell: "", value: "" },
      value: [{ workbookId: "", cell: "", value: "" }],
    },
    comp: {
      key: { workbookId: "", cell: "", value: "" },
      value: [{ workbookId: "", cell: "", value: "" }],
    },
  });

  // fixValue, compValue는 Menu에서만 사용, 나머지 component에서 리랜더링 방지처리하기
  const [fixValue, setFixValue] = useState<Record<string, any>>({
    key: { workbookId: null, cell: null, value: null },
    value: [{ workbookId: null, cell: null, value: null }],
  });

  const [compValue, setCompValue] = useState<Record<string, any>>({
    key: { workbookId: null, cell: null, value: null },
    value: [{ workbookId: null, cell: null, value: null }],
  });

  const handleTargetClick = (type: "fix" | "comp", field: "key" | number) => {
    if (selectingTarget?.type === type && selectingTarget?.field === field) {
      setSelectingTarget(null); // 다시 클릭하면 해제
      selectingTargetRef.current = null;
    } else {
      setSelectingTarget({ type, field });
      selectingTargetRef.current = { type, field };
    }
  };

  return (
    <div className="flex flex-col">
      <Menu
        fixValue={fixValue}
        compValue={compValue}
        selectingTarget={selectingTarget}
        handleTargetClick={handleTargetClick}
      />
      <div className="flex flex-1 w-full">
        <div className="w-1/2">
          <WorkBook
            data={leftWbData}
            setData={setLeftWbData}
            setLoading={setLoading}
            dataRef={dataRef}
            selectingTargetRef={selectingTargetRef}
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
            setFixValue={setFixValue}
            setCompValue={setCompValue}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
