import { useRef, useState } from "react";
import "./App.css";
import WorkBook from "./components/WorkBook";

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedCell, setSelectedCell] = useState<any>(null);
  const [selectedCellRight, setSelectedCellRight] = useState<any>(null);

  return (
    <div className="flex flex-col">
      <div>
        메뉴
        <div>{selectedCell && `Left: ${selectedCell}`}</div>
        <div>{selectedCellRight && `Right: ${selectedCellRight}`}</div>
      </div>

      <div className="flex flex-1 w-full">
        <div className="w-1/2">
          <WorkBook setLoading={setLoading} setSelectedCell={setSelectedCell} />
        </div>
        <div className="w-1/2">
          <WorkBook
            setLoading={setLoading}
            setSelectedCell={setSelectedCellRight}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
