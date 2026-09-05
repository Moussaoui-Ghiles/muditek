"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Issue cover with a typographic fallback. The fallback kicks in when there is
 * no image, when the image errors, or when it "loads" as a zero-size response
 * (CDN redirects and tracking pixels do that), including errors that fire
 * before hydration.
 */
export function IssueCover({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  const showImage = !!src && !failed;

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-[4px] border border-white/[0.08] bg-card">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
          onError={() => setFailed(true)}
          onLoad={(e) => { if (e.currentTarget.naturalWidth === 0) setFailed(true); }}
        />
      ) : (
        <div className="absolute inset-0 band-warm flex flex-col justify-between p-5">
          <span className="font-mono text-[11px] text-primary">issue</span>
          <p className="text-xl font-black leading-[1.05] tracking-[-0.02em] text-foreground line-clamp-3">{title}</p>
        </div>
      )}
    </div>
  );
}
