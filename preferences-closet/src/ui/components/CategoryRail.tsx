import type { Category } from "../../registry/types.js";
import type { Registry } from "../../registry/registry.js";
import { CATEGORIES } from "../../registry/types.js";
import styles from "./CategoryRail.module.css";

interface CategoryRailProps {
  registry: Registry;
  selected: Category;
  onSelect: (cat: Category) => void;
}

function formatCategory(cat: Category): string {
  return cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CategoryRail({ registry, selected, onSelect }: CategoryRailProps) {
  return (
    <nav className={styles.rail}>
      {CATEGORIES.map((cat) => {
        const count = registry.getByCategory(cat).length;
        return (
          <button
            key={cat}
            className={`${styles.item} ${cat === selected ? styles.active : ""}`}
            onClick={() => onSelect(cat)}
          >
            <span className={styles.label}>{formatCategory(cat)}</span>
            <span className={styles.count}>{count}</span>
          </button>
        );
      })}
    </nav>
  );
}
