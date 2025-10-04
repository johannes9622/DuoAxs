export function ProgressBar({ step, total=3 }: { step: number; total?: number }) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="w-1/3 h-1 bg-white/10 rounded-full">
          <div className={"h-full rounded-full " + (i < step ? "bg-primary w-full" : "w-0")} />
        </div>
      ))}
    </div>
  );
}
