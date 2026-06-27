"use client";

import { useLocale } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1" aria-label={t("localeLabel")}>
      {(["en", "tr"] as const).map((item) => (
        <button
          key={item}
          onClick={() => setLocale(item)}
          className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
            locale === item ? "bg-paper text-ink" : "text-paper/60 hover:text-paper"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
