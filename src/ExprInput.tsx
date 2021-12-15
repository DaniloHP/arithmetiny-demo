import React, { useState } from "react";
import { Arithmetiny } from "arithmetiny";

interface ExprInputProps {
  parser: Arithmetiny;
}

const ExprInput: React.FC<ExprInputProps> = ({ parser }) => {
  const [result, setResult] = useState<number>(NaN);
  const [error, setError] = useState<string>("");
  const strRes = isNaN(result) ? "Invalid input" : result;
  return (
    <div className={"expr-input"}>
      <h2>Enter an expression below</h2>
      <input
        type={"text"}
        onInput={(event) => {
          parser
            .evaluate(event.currentTarget.value)
            .then((res) => {
              setResult(res);
              setError("");
            })
            .catch((err) => {
              setError(err.message);
            });
        }}
      />
      <h3>Result: {error ? error : strRes}</h3>
    </div>
  );
};

export default ExprInput;
