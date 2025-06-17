import React, { useState } from "react";
import MenuDiv from "./UI/MenuDiv";

const SelectBox = ({ category }) => {
  const [optionType, setOptionType] = useState("default");
  const [format, setFormat] = useState(null);

  const showInput = category === "key";

  const handleSelect = (e) => {
    const selectedOption = e.target.value;
    setOptionType(selectedOption);
  };

  return (
    <>
      <div className="flex mt-1">
        {!showInput && <div className="w-[50px]"></div>}
        <div className="w-[50px]">타입</div>
        <MenuDiv width={"select"}>
          <select className="flex-1 outline-0" onChange={handleSelect}>
            <option className="w-full" value="default">
              선택한 데이터의 타입을 선택해주세요
            </option>
            {showInput && <option value="date">날짜</option>}
            <option value="number">숫자</option>
            <option value="string">문자</option>
          </select>
        </MenuDiv>
      </div>
      {showInput && (
        <div className="flex mt-1">
          <div className="w-[50px]">포맷</div>
          <MenuDiv width={"input"}>
            <input
              className="flex-1 outline-0"
              disabled={optionType !== "date"}
              placeholder={`${
                optionType === "date"
                  ? "YYYY/MM/DD HH:MM:SS(공백도 확실하게)"
                  : optionType === "default"
                  ? "타입을 먼저 선택하세요"
                  : "입력할 필요가 없습니다"
              } `}
              onChange={() => {
                console.log("onChange");
              }}
            />
          </MenuDiv>
        </div>
      )}
    </>
  );
};

export default SelectBox;
