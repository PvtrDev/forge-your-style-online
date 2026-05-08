export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14">
      {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{eyebrow}</p>}
      <h2 className="font-display text-4xl md:text-5xl mb-4">{title}</h2>
      <div className="gold-divider mb-5" />
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
