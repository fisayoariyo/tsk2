import React, { useEffect, useRef } from 'react';
import { Filter, X } from 'lucide-react';
import SearchFiltersSidebar from './SearchFiltersSidebar';

export default function MobileFilters({
  open,
  onToggle,
  count = 0,
  raised = false,
  ...sidebarProps
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onToggle();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    buttonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onToggle]);

  const bottom = raised ? 'bottom-28' : 'bottom-5';

  return (
    <div className="md:hidden">
      {open && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={onToggle}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter flights"
            className="absolute inset-y-0 left-0 right-[4.5rem] overflow-y-auto bg-white shadow-2xl"
          >
            <SearchFiltersSidebar {...sidebarProps} embedded />
            <div className="h-28" aria-hidden="true" />
          </div>
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? 'Close filters' : 'Open filters'}
        className={`fixed ${bottom} right-4 z-[70] w-14 h-14 rounded-full bg-[#FDB813] text-gray-950 shadow-lg flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5722]`}
      >
        {open ? <X className="w-6 h-6" strokeWidth={2.5} /> : <Filter className="w-6 h-6" />}
        {!open && count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#FF5722] text-white text-[11px] font-bold flex items-center justify-center">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
