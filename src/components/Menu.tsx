import MenuDiv from "./UI/MenuDiv";

interface MenuDivProps {
  fixValue: Record<string, any>;
  compValue: Record<string, any>;
  selectingTarget: {
    type: "fix" | "comp";
    field: "key" | number;
  } | null;
  handleTargetClick: (type: "fix" | "comp", field: "key" | number) => void;
  runCompare: () => void;
}

const Menu = ({
  fixValue,
  compValue,
  selectingTarget,
  handleTargetClick,
  runCompare,
}: MenuDivProps) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-1">
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
        <div className="flex flex-col justify-end">
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
