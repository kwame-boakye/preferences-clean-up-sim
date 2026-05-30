import type { Options } from "../../registry/types.js";
import styles from "./MultiSelectControl.module.css";

interface MultiSelectControlProps {
  value: string[];
  onChange: (v: string[]) => void;
  options: Options;
  disabled?: boolean;
}

export function MultiSelectControl({ value, onChange, options, disabled }: MultiSelectControlProps) {
  if (options.kind === "dynamic") {
    return <span className={styles.dynamic}>Options resolved at runtime ({options.source})</span>;
  }

  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <ul className={styles.list}>
      {options.values.map((opt) => (
        <li key={opt.value} className={styles.item}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={value.includes(opt.value)}
              disabled={disabled}
              onChange={() => toggle(opt.value)}
            />
            {opt.label}
          </label>
        </li>
      ))}
    </ul>
  );
}
