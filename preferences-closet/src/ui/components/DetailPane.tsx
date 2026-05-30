import type { Category } from "../../registry/types.js";
import type { Registry } from "../../registry/registry.js";
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

  return (
    <div className={styles.pane}>
      <h2 className={styles.heading}>{formatCategory(category)}</h2>
      {prefs.length === 0 ? (
        <p className={styles.empty}>No preferences in this category.</p>
      ) : (
        <ul className={styles.list}>
          {prefs.map((pref) => (
            <li key={pref.id} className={styles.item}>
              <div className={styles.label}>{pref.label}</div>
              <div className={styles.description}>{pref.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
