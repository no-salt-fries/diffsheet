import React, { useEffect, useRef, useState } from "react";
import MenuDiv from "./UI/MenuDiv";

const SelectBox = ({
  id,
  wbState,
  inValidType,
  inValidFormat,
  category,
  setInvalidType,
  setValue,
}) => {
  const [optionType, setOptionType] = useState("default");

  const inputRef = useRef(null);

  // key에 속한 select인 경우 옵션이 "날짜", "숫자", "문자"
  // key에 속하지 않은 경우 옵션이 "숫자", "문자"
  // 스타일링에도 차이가 있음 >> 모두 똑같은 레이아웃을 같도록 추후에 수정하기
  const keyFieldSelect = category === "key";

  useEffect(() => {
    if (keyFieldSelect && optionType === "date" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [optionType]);

  const handleFormat = (e) => {
    if (!keyFieldSelect) return;
    setValue((prev) => ({
      ...prev,
      key: {
        ...prev["key"],
        type: { ...prev["key"]["type"], format: e.target.value },
      },
    }));

    setInvalidType((prev) => {
      return prev.filter((d) => d !== `${id}.type.format`);
    });
  };

  const handleSelect = (e) => {
    let selectedOption = e.target.value;
    if (selectedOption === "default") {
      selectedOption = null;
    }

    setOptionType(selectedOption);
    if (keyFieldSelect) {
      setValue((prev) => ({
        ...prev,
        key: {
          ...prev["key"],
          type: { ...prev["key"]["type"], type: selectedOption },
        },
      }));
      setInvalidType((prev) => {
        return prev.filter((d) => d !== `${id}.type.type`);
      });
    } else {
      setValue((prev) => ({
        ...prev,
        value: {
          ...prev["value"],
          [category]: { ...prev["value"][category], type: selectedOption },
        },
      }));

      setInvalidType((prev) => {
        return prev.filter((d) => d !== `${id}.${category}.type`);
      });
    }
  };

  return (
    <>
      <div className="flex mt-1">
        {!keyFieldSelect && <div className="w-[50px]"></div>}
        <div className="w-[50px]">타입</div>
        <MenuDiv borderRed={inValidType} width={"select"}>
          <select className="flex-1 outline-0" onChange={handleSelect}>
            <option className="w-full" value="default">
              선택한 데이터의 타입을 선택해주세요
            </option>
            {keyFieldSelect && <option value="date">날짜</option>}
            <option value="number">숫자</option>
            <option value="string">문자</option>
          </select>
        </MenuDiv>
      </div>
      {keyFieldSelect && (
        <div className="flex mt-1">
          <div className="w-[50px]">포맷</div>
          <MenuDiv borderRed={inValidFormat} width={"input"}>
            <input
              ref={inputRef}
              className="flex-1 outline-0 focus:bg-yellow-100"
              disabled={optionType !== "date"}
              placeholder={`${
                optionType === "date"
                  ? "예) YYYY/MM/DD HH:MM:SS(공백도 확실하게)"
                  : optionType === "default"
                  ? "타입을 먼저 선택하세요"
                  : "입력할 필요가 없습니다"
              } `}
              onChange={handleFormat}
            />
          </MenuDiv>
        </div>
      )}
    </>
  );
};

export default SelectBox;
