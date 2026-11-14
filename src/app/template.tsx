/** Runs on every route change: a quick white sweep and a soft fade-up, in pure CSS. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        aria-hidden
        className="anim-sweep pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-white/40 via-white to-white/40"
      />
      <div className="anim-fade-up" style={{ animationDuration: "0.5s" }}>
        {children}
      </div>
    </>
  );
}
