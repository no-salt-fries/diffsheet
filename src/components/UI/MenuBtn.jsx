import React from "react";

const MenuBtn = ({ selectedTarget, handleTargetClick, selected }) => {
  if (selected.type === null) return;

  let selection = null;
  const _type = selected.type;

  if ("keyField" in selected) {
    selection = {
      type: _type,
      keyField: selected.keyField,
    };
  } else {
    selection = {
      type: _type,
      valueField: selected.valueField,
    };
  }

  return (
    <button
      className={`px-4 ${
        selected.type &&
        selectedTarget.type === selected.type &&
        (selectedTarget.keyField === selected.keyField ||
          selectedTarget.keyField === selected.keyField)
          ? "bg-stone-600 text-white"
          : ""
      }`}
      onClick={() => handleTargetClick(selection)}
    >
      선택
    </button>
  );
};

export default MenuBtn;
