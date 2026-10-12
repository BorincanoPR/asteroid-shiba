import type { ReactNode } from "react";

export function OutLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={(event) => {
        event.preventDefault();
        const opened = window.open(href, "_blank", "noopener,noreferrer");
        if (!opened) window.location.assign(href);
      }}
    >
      {children}
    </a>
  );
}
