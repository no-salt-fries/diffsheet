import type { selectRefType } from "./types/selectedRef";
import type { workbookDataType } from "./types/workbook";
import MenuDiv from "./UI/MenuDiv";

interface MenuDivProps {
  fixValue: workbookDataType;
  compValue: workbookDataType;
  selectedTarget: selectRefType;
  handleTargetClick: (selectedRef: selectRefType) => void;
  runCompare: () => void;
}

const Menu = ({
  fixValue,
  compValue,
  selectedTarget,
  handleTargetClick,
  runCompare,
}: MenuDivProps) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-1 space-x-2">
        <div>
          <p>고정</p>
          <div className="flex">
            <div className="flex border-1 rounded-lg p-1">
              <div className="w-[50px]">key</div>
              <div>
                <div className="flex">
                  <div className="w-[50px]">시작</div>
                  <MenuDiv>{fixValue["key"]["start"]["value"]}</MenuDiv>
                  <button
                    className={`px-4 ${
                      selectedTarget?.type === "fix" &&
                      selectedTarget?.keyField === "key_start"
                        ? "bg-stone-600 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      handleTargetClick({ type: "fix", keyField: "key_start" })
                    }
                  >
                    선택
                  </button>
                </div>
                <div className="flex mt-1">
                  <div className="w-[50px]">끝</div>
                  <MenuDiv>{fixValue["key"]["end"]["value"]}</MenuDiv>
                  <button
                    disabled={!fixValue["key"]["start"]["value"]}
                    className={`px-4 ${
                      selectedTarget?.type === "fix" &&
                      selectedTarget?.keyField === "key_end"
                        ? "bg-stone-600 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      handleTargetClick({ type: "fix", keyField: "key_end" })
                    }
                  >
                    선택
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* {fixValue["value"].map((d: any, i: 0 | 1) => (
            <div className="flex mt-1 border-1 rounded-lg p-1" key={i}>
              <div className="w-[50px]"></div>
              <div className="w-[50px]">{`열_${i + 1}`}</div>
              <MenuDiv>{d["value"]}</MenuDiv>
              <button
                disabled={
                  i === 0
                    ? !fixValue["key"]["end"]["value"]
                    : !fixValue["value"][i - 1]["value"]
                }
                className={`px-4 ${
                  selectingTarget?.type === "fix" &&
                  selectingTarget?.field !== "key_start" &&
                  selectingTarget?.field !== "key_end" &&
                  selectingTarget?.field === i
                    ? "bg-stone-600 text-white"
                    : ""
                }`}
                onClick={() =>
                  handleTargetClick({ type: "fix", field: (i + 1) as 1 | 2 })
                }
              >
                선택
              </button>
            </div>
          ))} */}
        </div>
        <div className="flex flex-col justify-end">
          <div className="flex">
            <div className="flex border-1 rounded-lg p-1">
              <div className="w-[50px]">key</div>
              <div>
                <div className="flex">
                  <div className="w-[50px]">시작</div>
                  <MenuDiv>{compValue["key"]["start"]["value"]}</MenuDiv>
                  <button
                    className={`px-4 ${
                      selectedTarget?.type === "comp" &&
                      selectedTarget?.keyField === "key_start"
                        ? "bg-stone-600 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      handleTargetClick({ type: "comp", keyField: "key_start" })
                    }
                  >
                    선택
                  </button>
                </div>
                <div className="flex mt-1">
                  <div className="w-[50px]">끝</div>
                  <MenuDiv>{compValue["key"]["end"]["value"]}</MenuDiv>
                  <button
                    disabled={!compValue["key"]["start"]["value"]}
                    className={`px-4 ${
                      selectedTarget?.type === "comp" &&
                      selectedTarget?.keyField === "key_end"
                        ? "bg-stone-600 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      handleTargetClick({ type: "comp", keyField: "key_end" })
                    }
                  >
                    선택
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* {compValue["value"].map((d: any, i: 0 | 1) => (
            <div className="flex mt-1 border-1 rounded-lg p-1" key={i}>
              <div className="w-[50px]"></div>
              <div className="w-[50px]">{`열_${i + 1}`}</div>
              <MenuDiv>{d["value"]}</MenuDiv>
              <button
                disabled={
                  i === 0
                    ? !compValue["key"]["end"]["value"]
                    : !compValue["value"][i - 1]["value"]
                }
                className={`px-4 ${
                  selectingTarget?.type === "comp" &&
                  selectingTarget?.keyField !== "key_start" &&
                  selectingTarget?.keyField !== "key_end" &&
                  selectingTarget?.keyField === i
                    ? "bg-stone-600 text-white"
                    : ""
                }`}
                onClick={() =>
                  handleTargetClick({ type: "comp", keyField: (i + 1) })
                }
              >
                선택
              </button>
            </div>
          ))} */}
        </div>
      </div>
      <div className="flex flex-col justify-end mr-20">
        <div
          className="w-[300px] h-[60px] flex flex-col justify-center text-center bg-red-400 rounded-2xl"
          onClick={runCompare}
        >
          비교
        </div>
      </div>
    </div>
  );
};

export default Menu;
