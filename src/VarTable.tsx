import React, { useRef, useState, FC } from "react";
import { BUILTIN_VARS, IDENTIFIER_RE, VarPair } from "arithmetiny";
import "./tables.css";
import { TableProps } from "./App";

const VarTable: FC<TableProps<VarPair>> = ({ curr, update }) => {
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLDivElement>(null);
  const numBuiltin = BUILTIN_VARS.length;
  const handleDelete = (ownName: string) => {
    curr && update(curr.filter(({ name }) => name !== ownName));
  };
  const handleAdd = () => {
    const name = nameRef.current?.innerText?.trim();
    const value = valRef.current?.innerText?.trim();
    if (!curr || !nameRef.current || !valRef.current || !name || !value) {
      setError("Some fields not filled in");
      return;
    }
    const names = curr.map(({ name }) => name);
    if (!IDENTIFIER_RE.test(name)) {
      setError(
        "Name is invalid. This might be because it starts with a number or contains spaces or dashes."
      );
    } else if (names.includes(name)) {
      setError("Name is already taken");
    } else if (isNaN(+value)) {
      setError("Invalid number");
    } else {
      setError("");
      update(curr.concat({ name, value: +value }));
      nameRef.current.innerText = valRef.current.innerText = "";
    }
  };
  return (
    <div className={"table-container"}>
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
          <tr className={"last-row"}>
            <td>
              <div contentEditable className={"editable"} ref={nameRef} />
            </td>
            <td className={"submit-cell"}>
              <div contentEditable ref={valRef} className={"editable"} />
              <span className={"add-new-btn"} onClick={handleAdd}>
                Add new
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <span className={"form-error"}>{error}</span>
    </div>
  );
};

export default VarTable;
