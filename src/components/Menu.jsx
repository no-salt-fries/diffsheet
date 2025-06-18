import SelectBox from "./SelectBox";
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
                  wbState={fixValue}
                  selectedTarget={selectedTarget}
                  handleTargetClick={handleTargetClick}
                  selected={{ type: "fix", keyField: "key_start" }}
                />
              </div>
              <div className="flex mt-1">
                <div className="w-[50px]">끝</div>
                <MenuDiv>{fixValue["key"]["end"]["value"]}</MenuDiv>
                <MenuBtn
                  wbState={fixValue}
                  selectedTarget={selectedTarget}
                  handleTargetClick={handleTargetClick}
                  selected={{ type: "fix", keyField: "key_end" }}
                />
              </div>
              <SelectBox category={"key"} />
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
                    <MenuBtn
                      wbState={fixValue}
                      selectedTarget={selectedTarget}
                      handleTargetClick={handleTargetClick}
                      selected={{
                        type: "fix",
                        valueField: _valueField,
                      }}
                    />
                  </div>
                  <SelectBox category={"value"} />
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
                <MenuBtn
                  wbState={fixValue}
                  selectedTarget={selectedTarget}
                  handleTargetClick={handleTargetClick}
                  selected={{ type: "comp", keyField: "key_start" }}
                />
              </div>
              <div className="flex mt-1">
                <div className="w-[50px]">끝</div>
                <MenuDiv>{compValue["key"]["end"]["value"]}</MenuDiv>
                <MenuBtn
                  wbState={fixValue}
                  selectedTarget={selectedTarget}
                  handleTargetClick={handleTargetClick}
                  selected={{ type: "comp", keyField: "key_end" }}
                />
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
                    <MenuBtn
                      wbState={fixValue}
                      selectedTarget={selectedTarget}
                      handleTargetClick={handleTargetClick}
                      selected={{
                        type: "comp",
                        valueField: _valueField,
                      }}
                    />
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
