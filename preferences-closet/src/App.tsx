import { useEffect, useMemo, useState } from "react";
import type { Preference, PreferenceValue } from "./registry/types.js";
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

  const colorModeDefault = useMemo(() => {
    const pref = registry.getById("appearance-color-mode");
    return typeof pref?.default === "string" ? pref.default : "system";
  }, [registry]);

  const [colorMode, setColorMode] = useState<string>(colorModeDefault);

  useEffect(() => {
    document.documentElement.dataset.theme = colorMode;
  }, [colorMode]);

  const handleCategorySelect = (cat: Category) => {
    setSelected(cat);
    setHighlightId(undefined);
  };

  const handleSearchSelect = (pref: Preference) => {
    setSelected(pref.category);
    setHighlightId(pref.id);
  };

  const handlePreferenceChange = (id: string, value: PreferenceValue) => {
    if (id === "appearance-color-mode" && typeof value === "string") {
      setColorMode(value);
    }
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
          onPreferenceChange={handlePreferenceChange}
        />
      </div>
    </div>
  );
}
