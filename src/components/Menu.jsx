import MenuBtn from "./UI/MenuBtn";
import MenuDiv from "./UI/MenuDiv";

// 메뉴 컴포넌트 잘게 쪼개기

const Menu = ({
  fixValue,
  compValue,
  selectedTarget,
  handleTargetClick,
  runCompare,
}) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-1 space-x-2">
        <div>
          <p>고정</p>
          <div className="flex border-1 rounded-lg p-1">
            <div className="w-[50px]">key</div>
            <div>
              <div className="flex">
                <div className="w-[50px]">시작</div>
                <MenuDiv>{fixValue["key"]["start"]["value"]}</MenuDiv>
                <MenuBtn
                  selectedTarget={selectedTarget}
                  handleTargetClick={handleTargetClick}
                  selected={{ type: "fix", keyField: "key_start" }}
                />
              </div>
              <div className="flex mt-1">
                <div className="w-[50px]">끝</div>
                <MenuDiv>{fixValue["key"]["end"]["value"]}</MenuDiv>
                <button
                  disabled={!fixValue["key"]["start"]["value"]}
                  className={`px-4 ${
                    selectedTarget.type === "fix" &&
                    selectedTarget.keyField === "key_end"
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
              <div className="flex mt-1">
                <div className="w-[50px]">타입</div>
                <MenuDiv width={"select"}>
                  <select className="flex-1 outline-0">
                    <option className="w-full" value="">
                      선택한 데이터의 타입을 선택해주세요
                    </option>
                    <option>1</option>
                  </select>
                </MenuDiv>
              </div>
              <div className="flex mt-1">
                <div className="w-[50px]">포맷</div>
                <MenuDiv width={"input"}>
                  <input
                    className="flex-1 outline-0"
                    placeholder="YYYY/MM/DD HH:MM:SS(공백도 확실하게)"
                  />
                </MenuDiv>
              </div>
            </div>
          </div>
          {Object.entries(fixValue["value"]).map(([_valueField, cell], i) => {
            return (
              <div className="flex mt-1 border-1 rounded-lg p-1" key={i}>
                <div>
                  <div className="flex">
                    <div className="w-[50px]"></div>
                    <div className="w-[50px]">{`열_${_valueField}`}</div>
                    <MenuDiv>{cell["headerTitle"]}</MenuDiv>
                    <button
                      disabled={
                        i === 0
                          ? !fixValue["key"]["end"]["value"]
                          : !fixValue["value"][i]["value"]
                      }
                      className={`px-4 ${
                        selectedTarget.type === "fix" &&
                        selectedTarget.valueField &&
                        selectedTarget.valueField === _valueField
                          ? "bg-stone-600 text-white"
                          : ""
                      }`}
                      onClick={() =>
                        handleTargetClick({
                          type: "fix",
                          valueField: _valueField,
                        })
                      }
                    >
                      선택
                    </button>
                  </div>
                  <div className="flex mt-1">
                    <div className="w-[50px]"></div>
                    <div className="w-[50px]">타입</div>
                    <MenuDiv width={"select"}>
                      <select className="flex-1 outline-0">
                        <option className="w-full" value="">
                          선택한 데이터의 타입을 선택해주세요
                        </option>
                        <option>1</option>
                      </select>
                    </MenuDiv>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-end">
          <div className="flex border-1 rounded-lg p-1">
            <div className="w-[50px]">key</div>
            <div>
              <div className="flex">
                <div className="w-[50px]">시작</div>
                <MenuDiv>{compValue["key"]["start"]["value"]}</MenuDiv>
                <button
                  className={`px-4 ${
                    selectedTarget.type === "comp" &&
                    selectedTarget.keyField === "key_start"
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
                    selectedTarget.type === "comp" &&
                    selectedTarget.keyField === "key_end"
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
              <div className="flex mt-1">
                <div className="w-[50px]">타입</div>
                <MenuDiv width={"select"}>
                  <select className="flex-1 outline-0">
                    <option className="w-full" value="">
                      선택한 데이터의 타입을 선택해주세요
                    </option>
                    <option>1</option>
                  </select>
                </MenuDiv>
              </div>
              <div className="flex mt-1">
                <div className="w-[50px]">포맷</div>
                <MenuDiv width={"input"}>
                  <input
                    className="flex-1 outline-0"
                    placeholder="YYYY/MM/DD HH:MM:SS(공백도 확실하게)"
                  />
                </MenuDiv>
              </div>
            </div>
          </div>
          {Object.entries(compValue["value"]).map(([_valueField, cell], i) => {
            return (
              <div className="flex mt-1 border-1 rounded-lg p-1" key={i}>
                <div>
                  <div className="flex">
                    <div className="w-[50px]"></div>
                    <div className="w-[50px]">{`열_${_valueField}`}</div>
                    <MenuDiv>{cell["headerTitle"]}</MenuDiv>
                    <button
                      disabled={
                        i === 0
                          ? !compValue["key"]["end"]["value"]
                          : !compValue["value"][i]["value"]
                      }
                      className={`px-4 ${
                        selectedTarget.type === "comp" &&
                        selectedTarget.valueField &&
                        selectedTarget.valueField === _valueField
                          ? "bg-stone-600 text-white"
                          : ""
                      }`}
                      onClick={() =>
                        handleTargetClick({
                          type: "comp",
                          valueField: _valueField,
                        })
                      }
                    >
                      선택
                    </button>
                  </div>
                  <div className="flex mt-1">
                    <div className="w-[50px]"></div>
                    <div className="w-[50px]">타입</div>
                    <MenuDiv width={"select"}>
                      <select className="flex-1 outline-0">
                        <option className="w-full" value="">
                          선택한 데이터의 타입을 선택해주세요
                        </option>
                        <option>1</option>
                      </select>
                    </MenuDiv>
                  </div>
                </div>
              </div>
            );
          })}
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
