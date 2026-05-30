import styles from "./ToggleControl.module.css";

interface ToggleControlProps {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function ToggleControl({ value, onChange, disabled }: ToggleControlProps) {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.track} />
    </label>
  );
}
