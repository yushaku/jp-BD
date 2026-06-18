"use client";

import type { SosMeta } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { value: "ingredients", label: "Thành phần", key: "ingredients" as const },
  { value: "how_to_use", label: "Cách dùng", key: "how_to_use" as const },
  {
    value: "supplement_note",
    label: "Lưu ý TPCN",
    key: "supplement_note" as const,
  },
];

const DEFAULTS: Record<keyof SosMeta, string> = {
  ingredients:
    "Sản phẩm chính hãng, thành phần an toàn cho da. Liên hệ shop để biết chi tiết INCI.",
  how_to_use:
    "Làm sạch da trước khi dùng. Thoa lớp mỏng, massage nhẹ. Dùng sáng và/hoặc tối tùy loại sản phẩm.",
  supplement_note:
    "Thực phẩm chức năng không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh. Không dùng quá liều khuyến cáo. Bảo quản nơi khô ráo, thoáng mát.",
};

export function ProductTabs({
  meta,
  showSupplement,
}: {
  meta?: SosMeta;
  showSupplement: boolean;
}) {
  const visibleTabs = TABS.filter(
    (tab) => tab.value !== "supplement_note" || showSupplement,
  );
  const defaultTab = visibleTabs[0]?.value ?? "ingredients";

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList
        variant="line"
        className="h-auto w-full justify-start rounded-none border-b border-jp-border bg-transparent p-0"
      >
        {visibleTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="cursor-pointer rounded-none px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 data-active:text-jp-indigo"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {visibleTabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="py-4 text-[0.95rem] leading-relaxed text-jp-muted"
        >
          {meta?.[tab.key] || DEFAULTS[tab.key]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
