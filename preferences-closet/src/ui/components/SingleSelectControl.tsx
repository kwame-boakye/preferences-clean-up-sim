import type { Options, PreferenceOption } from "../../registry/types.js";
import styles from "./SingleSelectControl.module.css";

interface SingleSelectControlProps {
  value: string;
  onChange: (v: string) => void;
  options: Options;
  disabled?: boolean;
}

export function SingleSelectControl({ value, onChange, options, disabled }: SingleSelectControlProps) {
  if (options.kind === "dynamic") {
    return (
      <select className={styles.select} disabled>
        <option>Resolved at runtime ({options.source})</option>
      </select>
    );
  }

  return (
    <select
      className={styles.select}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      {renderOptions(options.values)}
    </select>
  );
}

function renderOptions(values: PreferenceOption[]) {
  const hasGroups = values.some((o) => o.group);
  if (!hasGroups) {
    return values.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ));
  }

  const groups = new Map<string, PreferenceOption[]>();
  const ungrouped: PreferenceOption[] = [];
  for (const o of values) {
    if (o.group) {
      if (!groups.has(o.group)) groups.set(o.group, []);
      groups.get(o.group)!.push(o);
    } else {
      ungrouped.push(o);
    }
  }

  return [
    ...ungrouped.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    )),
    ...[...groups.entries()].map(([group, opts]) => (
      <optgroup key={group} label={group}>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </optgroup>
    )),
  ];
}
