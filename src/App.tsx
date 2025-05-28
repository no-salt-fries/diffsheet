import { useState } from "react";
import "./App.css";
import WorkBook from "./components/WorkBook";

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <div>
        <WorkBook setLoading={setLoading} />
      </div>
    </>
  );
};

export default App;
