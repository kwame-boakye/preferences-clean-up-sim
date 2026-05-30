import type { Options, PreferenceOption } from "../../registry/types.js";
import styles from "./OrderedMultiSelectControl.module.css";

interface OrderedMultiSelectControlProps {
  value: string[];
  onChange: (v: string[]) => void;
  options: Options;
  disabled?: boolean;
}

export function OrderedMultiSelectControl({
  value,
  onChange,
  options,
  disabled,
}: OrderedMultiSelectControlProps) {
  if (options.kind === "dynamic") {
    return <span className={styles.dynamic}>Options resolved at runtime ({options.source})</span>;
  }

  const optionMap = new Map(options.values.map((o) => [o.value, o]));

  const selectedItems = value
    .map((v) => optionMap.get(v))
    .filter((o): o is PreferenceOption => o !== undefined);

  const available = options.values.filter((o) => !value.includes(o.value) && !o.locked);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    const a = next[index - 1]!;
    const b = next[index]!;
    next[index - 1] = b;
    next[index] = a;
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === value.length - 1) return;
    const next = [...value];
    const a = next[index]!;
    const b = next[index + 1]!;
    next[index] = b;
    next[index + 1] = a;
    onChange(next);
  };

  const remove = (v: string) => onChange(value.filter((x) => x !== v));
  const add = (v: string) => onChange([...value, v]);

  return (
    <div className={styles.container}>
      <ul className={styles.selected}>
        {selectedItems.map((opt, i) => (
          <li key={opt.value} className={styles.item}>
            <span className={styles.arrows}>
              <button
                className={styles.arrowBtn}
                onClick={() => moveUp(i)}
                disabled={disabled || i === 0}
                aria-label={`Move ${opt.label} up`}
              >
                ↑
              </button>
              <button
                className={styles.arrowBtn}
                onClick={() => moveDown(i)}
                disabled={disabled || i === value.length - 1}
                aria-label={`Move ${opt.label} down`}
              >
                ↓
              </button>
            </span>
            <span className={opt.locked ? styles.locked : styles.itemLabel}>
              {opt.label}
              {opt.locked && <span className={styles.lockNote}> — always on</span>}
            </span>
            {!opt.locked && (
              <button
                className={styles.removeBtn}
                onClick={() => remove(opt.value)}
                disabled={disabled}
                aria-label={`Remove ${opt.label}`}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>

      {available.length > 0 && (
        <div className={styles.available}>
          <span className={styles.availableLabel}>Add:</span>
          {available.map((opt) => (
            <button
              key={opt.value}
              className={styles.addBtn}
              onClick={() => add(opt.value)}
              disabled={disabled}
            >
              + {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
