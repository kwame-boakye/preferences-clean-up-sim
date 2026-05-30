import { useState } from "react";
import type { Category, PreferenceValue } from "../../registry/types.js";
import type { Registry } from "../../registry/registry.js";
import { PreferenceRenderer } from "./PreferenceRenderer.js";
import styles from "./DetailPane.module.css";

interface DetailPaneProps {
  registry: Registry;
  category: Category;
}

function formatCategory(cat: Category): string {
  return cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DetailPane({ registry, category }: DetailPaneProps) {
  const prefs = registry.getByCategory(category);

  const [values, setValues] = useState<Record<string, PreferenceValue>>(() =>
    Object.fromEntries(prefs.map((p) => [p.id, p.default])),
  );

  const handleChange = (id: string, v: PreferenceValue) =>
    setValues((prev) => ({ ...prev, [id]: v }));

  return (
    <div className={styles.pane}>
      <h2 className={styles.heading}>{formatCategory(category)}</h2>
      {prefs.length === 0 ? (
        <p className={styles.empty}>No preferences in this category.</p>
      ) : (
        prefs.map((pref) => (
          <PreferenceRenderer
            key={pref.id}
            pref={pref}
            value={values[pref.id] ?? pref.default}
            onChange={(v) => handleChange(pref.id, v)}
            allValues={values}
          />
        ))
      )}
    </div>
  );
}
