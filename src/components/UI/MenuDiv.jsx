const MenuDiv = ({ borderRed, width, children }) => {
  return (
    <div
      className={`${
        width === "input"
          ? "px-1 flex-1"
          : width === "select"
          ? "flex-1"
          : "px-1 w-[260px] mr-5"
      } border-1 text-base leading-[1rem] flex items-center ${
        borderRed && "border-red-500 bg-red-50"
      }`}
    >
      {children}
    </div>
  );
};

export default MenuDiv;
