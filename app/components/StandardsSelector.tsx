"use client";

import { useState } from "react";

const ageGroups = [
  "18–20",
  "21–34",
  "35–42",
  "43–49",
  "50–54",
  "55–59",
  "60+",
];

const standardCategories = [
  { value: "women", label: "Women's standard" },
  { value: "men", label: "Men's standard" },
];

export default function StandardsSelector() {
  const [ageGroup, setAgeGroup] = useState("");
  const [category, setCategory] = useState("");

  return (
    <section className="standards-selector" aria-labelledby="standards-selector-title">
      <div className="standards-selector-heading">
        <div>
          <span className="detail-number">PARTICIPANT LOOKUP</span>
          <h4 id="standards-selector-title">Find your age-group standard</h4>
        </div>
        <span className="placeholder-tag">Preview · Not final</span>
      </div>

      <div className="standards-select-grid">
        <div className="standards-field">
          <label htmlFor="age-group">Age group</label>
          <select id="age-group" value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}>
            <option value="">Select your age group</option>
            {ageGroups.map((group) => <option value={group} key={group}>{group}</option>)}
          </select>
        </div>
        <div className="standards-field">
          <label htmlFor="standard-category">Standard</label>
          <select id="standard-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Select a standard</option>
            {standardCategories.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
          </select>
        </div>
      </div>

      <div className="standards-result" aria-live="polite">
        {!ageGroup || !category ? (
          <p>Choose both options to view the applicable standard. Confirmed event requirements will appear here once approved.</p>
        ) : (
          <>
            <span className="detail-number">YOUR SELECTION</span>
            <h5>{ageGroup} · {standardCategories.find((item) => item.value === category)?.label}</h5>
            <p>Completion time, march distance, and rucksack requirements are awaiting confirmation from the event organizers.</p>
            <span className="detail-status">Official standard forthcoming</span>
          </>
        )}
      </div>
      <p className="standards-disclaimer">Age brackets and selector categories are a draft interface only. Confirm the applicable age divisions and standard categories before publishing final requirements.</p>
    </section>
  );
}
