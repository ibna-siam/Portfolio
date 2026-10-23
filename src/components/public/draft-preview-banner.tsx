import Link from "next/link";
import { FiEye, FiXCircle } from "react-icons/fi";

interface DraftPreviewBannerProps {
  currentPath?: string;
}

export function DraftPreviewBanner({ currentPath = "/" }: DraftPreviewBannerProps) {
  const exitUrl = `/api/draft/disable?path=${encodeURIComponent(currentPath)}`;

  return (
    <aside
      aria-label="Preview Mode Notice"
      className="bg-amber-500 text-ink-950 px-4 py-2 text-xs font-medium flex items-center justify-between sticky top-0 z-50 shadow-md"
    >
      <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <FiEye className="text-ink-950 shrink-0" size={16} aria-hidden="true" />
          <span>
            <strong>Administrator Preview Mode Active:</strong> You are viewing live
            database records including unpublished drafts.
          </span>
        </div>
        <Link
          href={exitUrl}
          prefetch={false}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink-950 hover:bg-ink-900 text-amber-300 hover:text-amber-200 rounded-lg font-mono text-[11px] transition-colors shadow-xs"
        >
          <FiXCircle size={13} aria-hidden="true" />
          <span>Exit Preview</span>
        </Link>
      </div>
    </aside>
  );
}
