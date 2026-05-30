import { useMemo, useState } from "react";
import type { Category } from "./registry/types.js";
import { buildRegistry } from "./registry/registry.js";
import { CategoryRail } from "./ui/components/CategoryRail.js";
import { DetailPane } from "./ui/components/DetailPane.js";
import styles from "./ui/styles/App.module.css";

export function App() {
  const registry = useMemo(() => buildRegistry(), []);
  const [selected, setSelected] = useState<Category>("availability");

  return (
    <main className={styles.app}>
      <CategoryRail registry={registry} selected={selected} onSelect={setSelected} />
      <DetailPane key={selected} registry={registry} category={selected} />
    </main>
  );
}
