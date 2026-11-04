import React from 'react';

/** Rectangular national flag from country-flag-icons */
export default function FlagIcon({ Flag, title, className = 'w-5 h-3.5' }) {
  if (!Flag) return null;
  return (
    <Flag
      title={title}
      className={`${className} rounded-[2px] object-cover shrink-0 shadow-sm ring-1 ring-black/10`}
    />
  );
}
