import { useState } from "react";
import type { Preference } from "../../registry/types.js";
import type { Registry } from "../../registry/registry.js";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  registry: Registry;
  onSelect: (pref: Preference) => void;
}

export function SearchBox({ registry, onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = query.trim() ? registry.search(query).slice(0, 8) : [];

  const handleSelect = (pref: Preference) => {
    onSelect(pref);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <input
        type="search"
        className={styles.input}
        value={query}
        placeholder="Search preferences…"
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && query.trim() && (
        <ul className={styles.dropdown}>
          {results.length > 0 ? (
            results.map((pref) => (
              <li key={pref.id}>
                <button className={styles.result} onMouseDown={() => handleSelect(pref)}>
                  <span className={styles.resultLabel}>{pref.label}</span>
                  <span className={styles.resultCategory}>{pref.category}</span>
                </button>
              </li>
            ))
          ) : (
            <li className={styles.noResults}>No results for &ldquo;{query}&rdquo;</li>
          )}
        </ul>
      )}
    </div>
  );
}
