export function FeatureCard({ iconPath, title, text }: { iconPath: string; title: string; text: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
      <div className="size-12 flex items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0">
        <svg fill="currentColor" width="28" height="28" viewBox="0 0 256 256"><path d={iconPath} /></svg>
      </div>
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/40">{text}</p>
      </div>
    </div>
  );
}
