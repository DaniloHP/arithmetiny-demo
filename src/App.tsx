import React, { useState, FC } from "react";
import {
  Arithmetiny,
  BUILTIN_FUNCTIONS,
  BUILTIN_VARS,
  FnPair,
  VarPair,
} from "arithmetiny";
import "./app.css";
import ExprInput from "./ExprInput";
import VarTable from "./VarTable";
import FunctionTable from "./FunctionTable";

export interface TableProps<T> {
  curr: T[];
  update: (vars: T[]) => void;
}

const parser = new Arithmetiny();

const App: FC = () => {
  const [vars, setVars] = useState<VarPair[]>(BUILTIN_VARS);
  const [functions, setFunctions] = useState<FnPair[]>(BUILTIN_FUNCTIONS);
  parser.setContext({ vars, functions });
  return (
    <main className="app">
      <div className={"row"}>
        <ExprInput parser={parser} />
        <div className={"tables"}>
          <VarTable update={setVars} curr={vars} />
          <FunctionTable update={setFunctions} curr={functions} />
        </div>
      </div>
    </main>
  );
};

export default App;
