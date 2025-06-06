import { useRef, useState } from "react";
import "./App.css";
import WorkBook from "./components/WorkBook";
import MenuDiv from "./components/UI/menuDiv";

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // canvas-datagrid용 ref
  const selectingTargetRef = useRef<null | {
    type: "fix" | "comp";
    field: "key" | number;
  }>(null);

  const [selectingTarget, setSelectingTarget] = useState<null | {
    type: "fix" | "comp";
    field: "key" | number;
  }>(null);

  const [leftWbData, setLeftWbData] = useState<Record<string, any> | null>(
    null
  );

  const [rightWbData, setRightWbData] = useState<Record<string, any> | null>(
    null
  );

  // key: {sheet: , cell: :, value: }
  // value: [{sheet: , cell: , value: }, ... ]
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
      <div>
        <div>
          <p>고정</p>
          <div className="flex">
            <div className="w-[50px]">key</div>
            <MenuDiv>{fixValue["key"]["value"]}</MenuDiv>
            <button
              className={`px-4 ${
                selectingTarget?.type === "fix" &&
                selectingTarget?.field === "key"
                  ? "bg-stone-600 text-white"
                  : ""
              }`}
              onClick={() => handleTargetClick("fix", "key")}
            >
              선택
            </button>
          </div>
          {fixValue["value"].map((d: any, i: number) => (
            <div className="flex mt-1" key={i}>
              <div className="w-[50px]">{`값_${i + 1}`}</div>
              <MenuDiv>{d["value"]}</MenuDiv>
              <button
                className={`px-4 ${
                  selectingTarget?.type === "fix" &&
                  selectingTarget?.field !== "key"
                    ? "bg-stone-600 text-white"
                    : ""
                }`}
                onClick={() => handleTargetClick("fix", i)}
              >
                선택
              </button>
            </div>
          ))}
        </div>

        <div className="mt-1">
          <div className="flex">
            <div className="w-[50px]">key</div>
            <MenuDiv>{compValue["key"]["value"]}</MenuDiv>
            <button
              className={`px-4 ${
                selectingTarget?.type === "comp" &&
                selectingTarget?.field === "key"
                  ? "bg-stone-600 text-white"
                  : ""
              }`}
              onClick={() => handleTargetClick("comp", "key")}
            >
              선택
            </button>
          </div>
          {compValue["value"].map((d: any, i: number) => (
            <div className="flex mt-1" key={i}>
              <div className="w-[50px]">{`값_${i + 1}`}</div>
              <MenuDiv>{d["value"]}</MenuDiv>
              <button
                className={`px-4 ${
                  selectingTarget?.type === "comp" &&
                  selectingTarget?.field !== "key"
                    ? "bg-stone-600 text-white"
                    : ""
                }`}
                onClick={() => handleTargetClick("comp", i)}
              >
                선택
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 w-full">
        <div className="w-1/2">
          <WorkBook
            data={leftWbData}
            setData={setLeftWbData}
            setLoading={setLoading}
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
