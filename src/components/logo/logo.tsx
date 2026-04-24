import Image from "next/image";

type Variant = "mark" | "mark+text" | "wordmark";

interface LogoProps {
  variant?: Variant;
  size?: number;
  className?: string;
  textClassName?: string;
}

export function Logo({
  variant = "mark+text",
  size = 28,
  className,
  textClassName,
}: LogoProps) {
  if (variant === "wordmark") {
    return (
      <Image
        src="/brand/muditek-logo-dark.svg"
        alt="Muditek"
        width={size * 5}
        height={size}
        priority={false}
        className={className}
      />
    );
  }

  const mark = (
    <Image
      src="/icon.svg"
      alt={variant === "mark" ? "Muditek" : ""}
      width={size}
      height={size}
      aria-hidden={variant !== "mark"}
      priority={false}
    />
  );

  if (variant === "mark") {
    return <span className={className}>{mark}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      {mark}
      <span
        className={
          textClassName ??
          "text-[13px] font-black tracking-[0.2em] uppercase text-white"
        }
      >
        MUDITEK
      </span>
    </span>
  );
}
