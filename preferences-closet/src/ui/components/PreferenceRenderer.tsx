import { useEffect, useRef } from "react";
import type { Preference, PreferenceValue, TimeRangeValue } from "../../registry/types.js";
import { ToggleControl } from "./ToggleControl.js";
import { TextControl } from "./TextControl.js";
import { SingleSelectControl } from "./SingleSelectControl.js";
import { MultiSelectControl } from "./MultiSelectControl.js";
import { OrderedMultiSelectControl } from "./OrderedMultiSelectControl.js";
import { EntityPickerControl } from "./EntityPickerControl.js";
import { ListBuilderControl } from "./ListBuilderControl.js";
import { ManagedListControl } from "./ManagedListControl.js";
import { TimeRangeControl } from "./TimeRangeControl.js";
import styles from "./PreferenceRenderer.module.css";

interface PreferenceRendererProps {
  pref: Preference;
  value: PreferenceValue;
  onChange: (v: PreferenceValue) => void;
  allValues: Record<string, PreferenceValue>;
  highlighted?: boolean;
}

export function PreferenceRenderer({
  pref,
  value,
  onChange,
  allValues,
  highlighted,
}: PreferenceRendererProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlighted && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlighted]);

  const isDisabled =
    pref.dependsOn !== undefined
      ? allValues[pref.dependsOn.id] !== pref.dependsOn.when
      : false;

  return (
    <div
      ref={rowRef}
      className={`${styles.row} ${isDisabled ? styles.dimmed : ""} ${highlighted ? styles.highlighted : ""}`}
    >
      <div className={styles.meta}>
        <div className={styles.label}>{pref.label}</div>
        <div className={styles.description}>{pref.description}</div>
        {isDisabled && pref.dependsOn && (
          <div className={styles.dependsNote}>
            Requires another setting to be enabled first.
          </div>
        )}
      </div>
      <div className={styles.control}>
        {renderControl(pref, value, onChange, isDisabled)}
      </div>
    </div>
  );
}

function renderControl(
  pref: Preference,
  value: PreferenceValue,
  onChange: (v: PreferenceValue) => void,
  disabled: boolean,
) {
  switch (pref.control) {
    case "toggle":
      return <ToggleControl value={value as boolean} onChange={onChange} disabled={disabled} />;
    case "text":
      return <TextControl value={value as string} onChange={onChange} disabled={disabled} />;
    case "single_select":
      return (
        <SingleSelectControl
          value={value as string}
          onChange={onChange}
          options={pref.options!}
          disabled={disabled}
        />
      );
    case "multi_select":
      return (
        <MultiSelectControl
          value={value as string[]}
          onChange={onChange}
          options={pref.options!}
          disabled={disabled}
        />
      );
    case "ordered_multi_select":
      return (
        <OrderedMultiSelectControl
          value={value as string[]}
          onChange={onChange}
          options={pref.options!}
          disabled={disabled}
        />
      );
    case "entity_picker":
      return (
        <EntityPickerControl value={value as string[]} onChange={onChange} disabled={disabled} />
      );
    case "list_builder":
      return (
        <ListBuilderControl value={value as string[]} onChange={onChange} disabled={disabled} />
      );
    case "managed_list":
      return (
        <ManagedListControl value={value as string[]} onChange={onChange} disabled={disabled} />
      );
    case "time_range":
      return (
        <TimeRangeControl
          value={value as TimeRangeValue}
          onChange={onChange}
          disabled={disabled}
        />
      );
  }
}
