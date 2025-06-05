import { useRef, useState } from "react";
import "./App.css";
import WorkBook from "./components/WorkBook";

const App = () => {
  // canvas-datagrid용 ref
  const selectingTargetRef = useRef<null | {
    type: "fix" | "comp";
    field: "key" | number;
  }>(null);

  const [selectingTarget, setSelectingTarget] = useState<null | {
    type: "fix" | "comp";
    field: "key" | number;
  }>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [fixValue, setFixValue] = useState<Record<string, any>>({
    key: null,
    value: [null],
  });

  const [compValue, setCompValue] = useState<Record<string, any>>({
    key: null,
    value: [null],
  });

  const [selectedCell, setSelectedCell] = useState<any>(null);
  const [selectedCellRight, setSelectedCellRight] = useState<any>(null);

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
            <div className="px-1 w-[300px] border-1 mr-5 text-base leading-[1rem] flex items-center">
              {fixValue["key"]}
            </div>
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
              <div className="w-[300px] border-1 mr-5">{d}</div>
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
            <div className="w-[300px] border-1 mr-5">{compValue["key"]}</div>
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
              <div className="w-[300px] border-1 mr-5">{d}</div>
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
        <div>{selectedCell && `Left: ${selectedCell}`}</div>
        <div>{selectedCellRight && `Right: ${selectedCellRight}`}</div>
      </div>

      <div className="flex flex-1 w-full">
        <div className="w-1/2">
          <WorkBook
            setLoading={setLoading}
            setSelectedCell={setSelectedCell}
            selectingTargetRef={selectingTargetRef}
            setFixValue={setFixValue}
            setCompValue={setCompValue}
          />
        </div>
        <div className="w-1/2">
          <WorkBook
            setLoading={setLoading}
            setSelectedCell={setSelectedCellRight}
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
