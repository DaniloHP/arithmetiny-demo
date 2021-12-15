import React from "react";
import { Arithmetiny } from "arithmetiny";
import "./app.css";
import ExprInput from "./ExprInput";

function App() {
  const parser = new Arithmetiny();
  return (
    <main className="app">
      <div className={"row"}>
        <ExprInput parser={parser} />
      </div>
    </main>
  );
}

export default App;
