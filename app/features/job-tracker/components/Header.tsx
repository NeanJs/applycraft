"use client";

import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";

export function Header() {
  const search = useJobTrackerStore((state) => state.search);
  const setSearch = useJobTrackerStore((state) => state.setSearch);
  const openDialog = useJobTrackerStore((state) => state.openDialog);

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
          <span className="text-sm font-semibold text-white">JT</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-none text-gray-900">Job Tracker</h1>
          <p className="mt-0.5 text-[11px] text-gray-400">Keep your applications moving</p>
        </div>
      </div>

      <div className="order-3 w-full sm:order-2 sm:ml-4 sm:max-w-sm sm:flex-1">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search companies or roles…"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      <div className="order-2 flex items-center gap-2 sm:order-3">
        <button className="hidden sm:flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter
        </button>
        <button
          onClick={() => openDialog()}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add job
        </button>
      </div>
    </header>
  );
}
