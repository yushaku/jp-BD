import Image from "next/image";
import { contactInfo } from "@/lib/contact";

const iconClass =
  "size-12 shrink-0 cursor-pointer shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-indigo";

export function SupportChannels() {
  return (
    <div
      className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-2.5 lg:right-6 lg:bottom-6"
      role="group"
      aria-label="Hỗ trợ trực tuyến"
    >
      <a
        href={contactInfo.contact.zaloHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hỗ trợ qua Zalo"
      >
        <Image
          src="/icons/zalo.svg"
          alt=""
          width={48}
          height={48}
          className={iconClass}
        />
      </a>

      <a
        href={contactInfo.contact.messengerHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hỗ trợ qua Messenger"
      >
        <Image
          src="/icons/messenger.webp"
          alt=""
          width={48}
          height={48}
          className={iconClass}
        />
      </a>
    </div>
  );
}
