"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: EventTarget & { saveData?: boolean };
};

export function shouldLoadPlanetVideo(reducedMotion: boolean, saveData: boolean) {
  return !reducedMotion && !saveData;
}

export function PlanetHeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisibleRef = useRef(true);
  const [videoAllowed, setVideoAllowed] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NavigatorWithConnection).connection;
    const updatePreference = () => {
      setVideoAllowed(shouldLoadPlanetVideo(motionQuery.matches, Boolean(connection?.saveData)));
    };

    updatePreference();
    motionQuery.addEventListener?.("change", updatePreference);
    connection?.addEventListener?.("change", updatePreference);

    return () => {
      motionQuery.removeEventListener?.("change", updatePreference);
      connection?.removeEventListener?.("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoAllowed) return;

    const syncPlayback = () => {
      if (document.hidden || !isVisibleRef.current) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        // The poster remains visible if the browser blocks autoplay.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry?.isIntersecting ?? false;
        syncPlayback();
      },
      { threshold: 0.15 },
    );

    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [videoAllowed]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image
        src="/media/planet-hero-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_50%] sm:object-center"
      />
      {videoAllowed ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-[62%_50%] sm:object-center"
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/planet-hero-poster.jpg"
          tabIndex={-1}
        >
          <source src="/media/planet-hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/media/planet-hero-desktop.mp4" type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
