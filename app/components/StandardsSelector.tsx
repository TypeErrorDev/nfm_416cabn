"use client";

import { useState } from "react";

const standardsByAge = [
  { age: "18–20", women: "5:25", men: "4:35" },
  { age: "21–34", women: "5:15", men: "4:30" },
  { age: "35–42", women: "5:25", men: "4:35" },
  { age: "43–49", women: "5:30", men: "4:40" },
  { age: "50–54", women: "5:40", men: "4:50" },
  { age: "55–59", women: "5:50", men: "5:00" },
  { age: "60+", women: "6:00", men: "5:15" },
];

const standardCategories = [
  { value: "women", label: "Women's standard" },
  { value: "men", label: "Men's standard" },
];

export default function StandardsSelector() {
  const [ageGroup, setAgeGroup] = useState("");
  const [category, setCategory] = useState("");

  const selectedStandard = standardsByAge.find((item) => item.age === ageGroup);
  const completionTime = selectedStandard && category
    ? selectedStandard[category as "women" | "men"]
    : null;

  return (
    <section className="standards-selector" aria-labelledby="standards-selector-title">
      <div className="standards-selector-heading">
        <div>
          <span className="detail-number">PARTICIPANT LOOKUP</span>
          <h4 id="standards-selector-title">Find your age-group standard</h4>
        </div>
        <span className="placeholder-tag">Provided standards</span>
      </div>

      <div className="standards-select-grid">
        <div className="standards-field">
          <label htmlFor="age-group">Age group</label>
          <select id="age-group" value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}>
            <option value="">Select your age group</option>
            {standardsByAge.map((item) => <option value={item.age} key={item.age}>{item.age}</option>)}
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
          <p>Choose your age group and standard category to view your required completion time.</p>
        ) : (
          <>
            <span className="detail-number">COMPLETION TIME</span>
            <h5>{ageGroup} · {standardCategories.find((item) => item.value === category)?.label}</h5>
            <p className="standards-time">{completionTime}</p>
            <p>Time requirement shown in hours:minutes (H:MM).</p>
          </>
        )}
      </div>
      <p className="standards-disclaimer">These times are transcribed from the standards provided for this event. Confirm any additional distance, rucksack-weight, and inspection requirements in the official participant instructions.</p>
    </section>
  );
}
