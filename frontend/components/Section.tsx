import type { ReactNode } from "react";

const accentColors = {
  default: "border-jp-border",
  food: "border-jp-matcha",
  beauty: "border-jp-sakura",
  supplement: "border-jp-indigo",
} as const;

export function SectionHeader({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description?: string;
  variant?: keyof typeof accentColors;
}) {
  return (
    <header
      className={`mb-6 border-b-2 pb-3 text-center ${accentColors[variant]}`}
    >
      <h2 className="text-[1.65rem]">{title}</h2>
      {description && (
        <p className="mt-2 text-[0.95rem] text-jp-muted">{description}</p>
      )}
    </header>
  );
}

export function Section({
  title,
  description,
  variant = "default",
  children,
}: {
  title: string;
  description?: string;
  variant?: keyof typeof accentColors;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto mb-12 max-w-6xl px-6">
      <SectionHeader
        title={title}
        description={description}
        variant={variant}
      />
      {children}
    </section>
  );
}
