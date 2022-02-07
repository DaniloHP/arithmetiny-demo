import React, { useRef, useState, FC } from "react";
import { TableProps } from "./App";
import { BUILTIN_FUNCTIONS, FnPair, IDENTIFIER_RE } from "arithmetiny";

const pluralize = (word: string, qty: number): string =>
  `${qty} ${word}${qty === 1 ? "" : "s"}`;

const functionOpts: Map<string, (...args: number[]) => number> = new Map([
  ["max", Math.max],
  ["min", Math.min],
  ["rand", Math.random],
  ["floor", Math.floor],
  ["ceil", Math.ceil],
]);

const functionDescriptions: Map<string, string> = new Map<string, string>([
  ["ln", "Natural log"],
  ["log", "Log base 10"],
  ["sin", "Trigonometric sine"],
  ["cos", "Trigonometric cosine"],
  ["tan", "Trigonometric tangent"],
  ["sqrt", "Square root"],
  ["abs", "Absolute value"],
  ["max", "Yields the larger of the arguments"],
  ["min", "Yields the smaller of the arguments"],
  ["floor", "Yields the largest integer ≤ the argument"],
  ["ceil", "Yields the largest integer ≥ the argument"],
  ["rand", "Yields a random number float in the range [0,1)"],
]);

const FunctionTable: FC<TableProps<FnPair>> = ({ curr, update }) => {
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLSelectElement>(null);
  const numBuiltin = BUILTIN_FUNCTIONS.length;
  const handleDelete = (ownName: string) => {
    if (curr) {
      update(curr.filter(({ name }) => name !== ownName));
      functionDescriptions.delete(ownName);
    }
  };
  const defaultSelect = "default";
  const handleAdd = () => {
    const name = nameRef.current?.innerText;
    const value = valRef.current?.value;
    if (
      !curr ||
      !nameRef.current ||
      !valRef.current ||
      !name ||
      !value ||
      value === defaultSelect
      //to appease TS
    ) {
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
    } else {
      setError("");
      const fn = functionOpts.get(value);
      if (fn) {
        update(curr.concat({ name, fn }));
        functionDescriptions.set(name, functionDescriptions.get(value) || name);
        nameRef.current.innerText = "";
        valRef.current.value = defaultSelect;
      }
    }
  };
  return (
    <div className={"table-container"}>
      <table className={"value-table"}>
        <thead>
          <tr>
            <th>Identifier</th>
            <th>Function</th>
            <th className={"args-header"}># args</th>
          </tr>
        </thead>
        <tbody>
          {curr &&
            curr.map(({ name, fn: { name: fnName, length } }, i) => {
              const isBuiltin = i < numBuiltin;
              return (
                <tr key={name}>
                  <td className={"id-cells"}>
                    <span>{name}</span>
                    {!isBuiltin && (
                      <span
                        className={"del-cell"}
                        onClick={() => handleDelete(name)}
                      >
                        ❌
                      </span>
                    )}
                  </td>
                  <td className={"value-cell"}>
                    {functionDescriptions.get(name) || name}
                  </td>
                  <td className={"args-cell"}>{length}</td>
                </tr>
              );
            })}
          <tr className={"last-row"}>
            <td>
              <div ref={nameRef} contentEditable className={"editable"} />
            </td>
            <td className={"submit-cell"} colSpan={2}>
              <select ref={valRef}>
                <option value={defaultSelect}>Select a function...</option>
                <option value={"max"}>Max</option>
                <option value={"min"}>Min</option>
                <option value={"floor"}>Floor</option>
                <option value={"ceil"}>Ceil</option>
                <option value={"rand"}>Random float</option>
              </select>
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

export default FunctionTable;
