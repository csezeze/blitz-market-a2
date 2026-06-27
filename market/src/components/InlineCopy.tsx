"use client";

import { useLocale } from "@/lib/i18n";

export function CategoryLabel() {
  const { t } = useLocale();
  return <>{t("category")}</>;
}

export function BackToCategory({ category }: { category: string }) {
  const { t } = useLocale();
  return <>{t("backTo", { category })}</>;
}

export function CoinLabel() {
  const { t } = useLocale();
  return <>{t("coin")}</>;
}

export function DropNoteLabel() {
  const { t } = useLocale();
  return <>{t("dropNote")}</>;
}
