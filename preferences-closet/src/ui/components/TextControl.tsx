import styles from "./TextControl.module.css";

interface TextControlProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function TextControl({ value, onChange, disabled }: TextControlProps) {
  return (
    <input
      type="text"
      className={styles.input}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
