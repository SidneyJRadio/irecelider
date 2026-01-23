import { Link } from "react-router-dom";
import { useRadios } from "@/hooks/useData";
import { Radio } from "lucide-react";

export function RadioStrip() {
  const { data: radios, isLoading } = useRadios();

  if (isLoading || !radios?.length) {
    return null;
  }

  return (
    <section className="bg-muted/50 border-b border-border/50 py-4">
      <div className="container">
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
          {radios.map((radio) => (
            <Link
              key={radio.id}
              to="/radios"
              className="group flex flex-col items-center gap-2 transition-transform hover:scale-105"
            >
              {radio.logo_url ? (
                <img
                  src={radio.logo_url}
                  alt={radio.name}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-contain bg-background p-1.5 shadow-sm group-hover:shadow-md transition-shadow"
                />
              ) : (
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-background shadow-sm group-hover:shadow-md transition-shadow"
                  style={{ backgroundColor: `${radio.color}15` }}
                >
                  <Radio className="w-7 h-7" style={{ color: radio.color || undefined }} />
                </div>
              )}
              <span
                className="text-xs font-medium text-center leading-tight max-w-[80px]"
                style={{ color: radio.color || undefined }}
              >
                {radio.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}