import styles from "./ManagedListControl.module.css";

interface ManagedListControlProps {
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
}

export function ManagedListControl({ value, onChange, disabled }: ManagedListControlProps) {
  const remove = (v: string) => onChange(value.filter((x) => x !== v));

  if (value.length === 0) {
    return <p className={styles.empty}>Nothing here yet.</p>;
  }

  return (
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
  );
}
