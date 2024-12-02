// app/calculator/Calculator.tsx
"use client";
import React, { useState } from "react";
import "./calculator.css"; // 引入样式文件

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>("");

  const handleClick = (value: string) => {
    setInput(input + value);
  };

  const calculate = () => {
    try {
      setInput(eval(input).toString());
    } catch (error) {
      setInput("Error");
    }
  };

  const clear = () => {
    setInput("");
  };

  return (
    <div className="calculator">
      <input type="text" value={input} readOnly />
      <div className="buttons">
        {[
          "1",
          "2",
          "3",
          "+",
          "4",
          "5",
          "6",
          "-",
          "7",
          "8",
          "9",
          "*",
          "0",
          "=",
          "C",
          "/",
        ].map((button) => (
          <button
            key={button}
            className={
              button === "="
                ? "highlight" // 点缀色
                : button === "C"
                ? "highlight" // 点缀色
                : button === "+" ||
                  button === "-" ||
                  button === "*" ||
                  button === "/"
                ? "operator" // 操作符按钮
                : ""
            }
            onClick={() =>
              button === "="
                ? calculate()
                : button === "C"
                ? clear()
                : handleClick(button)
            }
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
