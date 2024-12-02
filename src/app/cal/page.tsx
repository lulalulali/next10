// src/app/cal/page.tsx
"use client";
import React, { useState } from "react";
import { create, all } from "mathjs"; // 导入 mathjs
import styles from "./cal.module.css";

const math = create(all); // 创建 mathjs 实例

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>("0");
  const [result, setResult] = useState<string>("");

  const handleButtonClick = (value: string) => {
    if (value === "AC") {
      setInput("0");
      setResult("");
    } else if (value === "±") {
      setInput((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
    } else if (value === "%") {
      setInput((prev) => (parseFloat(prev) / 100).toString());
    } else if (value === "=") {
      try {
        // 使用 mathjs 计算表达式
        const evaluatedResult = math.evaluate(
          input.replace("x", "*").replace("÷", "/")
        ); // 替换运算符
        setResult(evaluatedResult.toString());
        setInput("0"); // 计算后重置输入
      } catch {
        setResult("Error");
      }
    } else {
      setInput((prev) => (prev === "0" ? value : prev + value));
    }
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.display}>
        <div className={styles.input}>{input}</div>
        <div className={styles.result}>{result}</div>
      </div>
      <div className={styles.buttonGrid}>
        {[
          "7",
          "8",
          "9",
          "÷",
          "4",
          "5",
          "6",
          "x",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          "=",
          "+",
          "AC",
          "±",
          "%",
        ].map((value) => {
          const isOperator = ["÷", "x", "-", "+", "="].includes(value);
          const isFunction = ["AC", "±", "%"].includes(value);
          const buttonClass = isOperator
            ? styles.operator
            : isFunction
            ? styles.function
            : styles.number;
          return (
            <button
              key={value}
              onClick={() => handleButtonClick(value)}
              className={`${styles.button} ${buttonClass} ${
                value === "0" ? styles.zero : ""
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calculator;
