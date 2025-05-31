import { useState } from "react";
import "./App.css";
import WorkBook from "./components/WorkBook";

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div>메뉴</div>

      <div className="flex flex-1 w-full">
        <div className="w-1/2">
          <WorkBook setLoading={setLoading} />
        </div>
        <div className="w-1/2">
          <WorkBook setLoading={setLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;
