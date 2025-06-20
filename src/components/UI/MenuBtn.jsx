import React from "react";

// props 이름들이 애매함, 수정 필요
const MenuBtn = ({ wbState, selectedTarget, selected, handleTargetClick }) => {
  if (wbState === undefined) return;
  if (selected.type === null) return;

  let disabled = false;

  if ("keyField" in selected) {
    if (selected.keyField === "key_end") {
      if (!wbState["key"]["start"]["rowIndex"]) {
        disabled = true;
      }
    }
  } else {
    if (selected.valueField === "1") {
      if (!wbState["key"]["end"]["rowIndex"]) {
        disabled = true;
      }
    } else {
      if (!wbState["value"]["1"]["columnIndex"]) {
        disabled = true;
      }
    }
  }

  return (
    <button
      disabled={disabled}
      className={`border-1  shadow-2xl rounded-md px-4 ${
        (selected.type &&
          selectedTarget.type === selected.type &&
          selectedTarget.keyField &&
          selectedTarget.keyField === selected.keyField) ||
        (selectedTarget.type === selected.type &&
          selectedTarget.valueField &&
          selectedTarget.valueField === selected.valueField)
          ? "bg-green-600 border-1 text-white"
          : disabled
          ? "border-gray-500 text-gray-500 bg-gray-300"
          : "hover:bg-green-200 border-green-600  text-green-600"
      } `}
      onClick={() => handleTargetClick(selected)}
    >
      선택
    </button>
  );
};

export default MenuBtn;
