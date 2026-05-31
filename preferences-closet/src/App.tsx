import { useMemo, useState } from "react";
import type { Preference } from "./registry/types.js";
import type { Category } from "./registry/types.js";
import { buildRegistry } from "./registry/registry.js";
import { CategoryRail } from "./ui/components/CategoryRail.js";
import { DetailPane } from "./ui/components/DetailPane.js";
import { SearchBox } from "./ui/components/SearchBox.js";
import styles from "./ui/styles/App.module.css";

export function App() {
  const registry = useMemo(() => buildRegistry(), []);
  const [selected, setSelected] = useState<Category>("availability");
  const [highlightId, setHighlightId] = useState<string | undefined>(undefined);

  const handleCategorySelect = (cat: Category) => {
    setSelected(cat);
    setHighlightId(undefined);
  };

  const handleSearchSelect = (pref: Preference) => {
    setSelected(pref.category);
    setHighlightId(pref.id);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <SearchBox registry={registry} onSelect={handleSearchSelect} />
      </header>
      <div className={styles.panes}>
        <CategoryRail registry={registry} selected={selected} onSelect={handleCategorySelect} />
        <DetailPane
          key={selected}
          registry={registry}
          category={selected}
          highlightId={highlightId}
        />
      </div>
    </div>
  );
}
