const MenuDiv = ({ width, children }) => {
  return (
    <div
      className={`${
        width === "input"
          ? "px-1 flex-1"
          : width === "select"
          ? "flex-1"
          : "px-1 w-[250px] mr-5"
      } border-1 text-base leading-[1rem] flex items-center`}
    >
      {children}
    </div>
  );
};

export default MenuDiv;
