import clsx from "clsx";
export function Button({ as: Comp = "button", className, intent="primary", size="md", ...props }: any) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-primary";
  const intents = {
    primary: "bg-primary text-background-dark hover:bg-primary/90",
    subtle: "bg-white/10 text-white hover:bg-white/20",
    outline: "border border-primary/50 text-primary hover:bg-primary/10"
  } as const;
  const sizes = { sm: "px-3 py-2 text-sm", md: "px-4 py-3", lg: "px-5 py-4 text-base" } as const;
  return <Comp className={clsx(base, intents[intent as keyof typeof intents], sizes[size as keyof typeof sizes], className)} {...props} />;
}
