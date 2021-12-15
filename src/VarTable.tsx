import React, { useRef, useState } from "react";
import { BUILTIN_VARS, IDENTIFIER_RE, VarPair } from "arithmetiny";
import "./tables.css";
import { TableProps } from "./App";

const VarTable: React.FC<TableProps<VarPair>> = ({ curr, update }) => {
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const valRef = useRef<HTMLInputElement>(null);
  const numBuiltin = BUILTIN_VARS.length;
  const handleDelete = (ownName: string) => {
    curr && update(curr.filter(({ name }) => name !== ownName));
  };
  const handleAdd = () => {
    const name = nameRef.current?.value;
    const value = valRef.current?.value;
    if (!curr || !name || !value) {
      setError("Some fields not filled in");
      return;
    }
    const names = curr.map(({ name }) => name);
    if (!IDENTIFIER_RE.test(name)) {
      setError(
        "Name is invalid. This might be because it starts with a number or contains spaces or dashes"
      );
    } else if (names.includes(name)) {
      setError("Name is already taken");
    } else if (isNaN(+value)) {
      setError("Invalid number");
    } else {
      setError("");
      update(curr.concat({ name, value: +value }));
    }
  };
  return (
    <>
      <table className={"value-table"}>
        <thead>
          <tr>
            <th>Identifier</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {curr &&
            curr.map(({ name, value }, i) => (
              <tr key={name}>
                <td className={"id-cells"}>
                  <span>{name}</span>
                  {i >= numBuiltin && (
                    <span
                      className={"del-cell"}
                      onClick={() => handleDelete(name)}
                    >
                      ❌
                    </span>
                  )}
                </td>
                <td className={"value-cell"}>{value}</td>
              </tr>
            ))}
          <tr>
            <td className={""}>
              <input type={"text"} ref={nameRef} />
            </td>
            <td className={""}>
              <input type={"text"} ref={valRef} />
              <span className={"add-new-btn"} onClick={handleAdd}>
                Add new
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <span className={"form-error"}>{error}</span>
    </>
  );
};

export default VarTable;
