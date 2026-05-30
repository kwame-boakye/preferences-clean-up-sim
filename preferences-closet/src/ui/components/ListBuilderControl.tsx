import { useState } from "react";
import styles from "./ListBuilderControl.module.css";

interface ListBuilderControlProps {
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
}

export function ListBuilderControl({ value, onChange, disabled }: ListBuilderControlProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInput("");
  };

  const remove = (v: string) => onChange(value.filter((x) => x !== v));

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.input}
          value={input}
          placeholder="Add a person or app…"
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        <button className={styles.addBtn} onClick={add} disabled={disabled || !input.trim()}>
          Add
        </button>
      </div>
      {value.length === 0 ? (
        <p className={styles.empty}>No VIPs yet.</p>
      ) : (
        <ul className={styles.list}>
          {value.map((v) => (
            <li key={v} className={styles.item}>
              <span>{v}</span>
              <button
                className={styles.removeBtn}
                onClick={() => remove(v)}
                disabled={disabled}
                aria-label={`Remove ${v}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
