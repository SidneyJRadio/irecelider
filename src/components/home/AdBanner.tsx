import { cn } from "@/lib/utils";

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Banner 1 */}
          <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-dashed border-border overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="aspect-[4/1] md:aspect-[5/1] flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Publicidade</p>
                <p className="text-sm font-medium text-muted-foreground/70">728 x 90</p>
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-dashed border-border overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="aspect-[4/1] md:aspect-[5/1] flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Publicidade</p>
                <p className="text-sm font-medium text-muted-foreground/70">728 x 90</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}