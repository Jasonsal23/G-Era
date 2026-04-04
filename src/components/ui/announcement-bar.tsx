// ─── Edit this message to update the announcement ───────────────────────────
const ANNOUNCEMENT = 'Free shipping on all orders — No code needed.';
// ────────────────────────────────────────────────────────────────────────────

export const AnnouncementBar = () => {
  return (
    <div className="flex items-center justify-center bg-foreground px-4 py-2 text-background">
      <p className="font-mono text-[11px] uppercase tracking-widest text-center">
        {ANNOUNCEMENT}
      </p>
    </div>
  );
};
