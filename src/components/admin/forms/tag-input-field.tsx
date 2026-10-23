"use client";

import React, { useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";

interface TagInputFieldProps {
  label: string;
  helperText?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  required?: boolean;
}

export function TagInputField({
  label,
  helperText,
  tags,
  onChange,
  placeholder = "Type tag and press Enter...",
  required = false,
}: TagInputFieldProps) {
  const [inputVal, setInputVal] = useState("");

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 font-sans">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {helperText && (
          <span className="text-[11px] text-ink-500 font-mono">{helperText}</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 p-2.5 bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all min-h-[44px]">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-emerald-600 hover:text-red-600 dark:text-emerald-400 dark:hover:text-red-400 cursor-pointer rounded-xs"
              aria-label={`Remove tag ${tag}`}
            >
              <FiX size={12} />
            </button>
          </span>
        ))}

        <div className="flex-1 min-w-[140px] flex items-center gap-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputVal.trim()) addTag(inputVal);
            }}
            placeholder={tags.length === 0 ? placeholder : "Add another..."}
            className="w-full bg-transparent text-xs text-ink-900 dark:text-ink-100 placeholder:text-ink-400 outline-none font-mono py-1"
          />
          {inputVal.trim() && (
            <button
              type="button"
              onClick={() => addTag(inputVal)}
              className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded cursor-pointer"
              aria-label="Add tag"
            >
              <FiPlus size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
