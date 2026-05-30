import type { TimeRangeValue } from "../../registry/types.js";
import styles from "./TimeRangeControl.module.css";

interface TimeRangeControlProps {
  value: TimeRangeValue;
  onChange: (v: TimeRangeValue) => void;
  disabled?: boolean;
}

const DAYS_OPTIONS = [
  { value: "every_day", label: "Every day" },
  { value: "weekdays", label: "Weekdays (Mon–Fri)" },
  { value: "custom", label: "Custom days" },
];

const TIME_OPTIONS = buildTimeOptions();

function buildTimeOptions() {
  const opts: { value: string; label: string }[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      const value = `${hh}:${mm}`;
      const period = h < 12 ? "AM" : "PM";
      const hour = h % 12 === 0 ? 12 : h % 12;
      const label = `${hour}:${mm} ${period}`;
      opts.push({ value, label });
    }
  }
  opts.push({ value: "midnight", label: "Midnight" });
  return opts;
}

export function TimeRangeControl({ value, onChange, disabled }: TimeRangeControlProps) {
  const update = (patch: Partial<TimeRangeValue>) => onChange({ ...value, ...patch });

  return (
    <div className={styles.row}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Days</span>
        <select
          className={styles.select}
          value={value.days}
          disabled={disabled}
          onChange={(e) => update({ days: e.target.value })}
        >
          {DAYS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>From</span>
        <select
          className={styles.select}
          value={value.start}
          disabled={disabled}
          onChange={(e) => update({ start: e.target.value })}
        >
          {TIME_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>To</span>
        <select
          className={styles.select}
          value={value.end}
          disabled={disabled}
          onChange={(e) => update({ end: e.target.value })}
        >
          {TIME_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
