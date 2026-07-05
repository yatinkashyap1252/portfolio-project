import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yatin Kashyap | Portfolio",
    short_name: "Yatin Portfolio",
    description: "Personal Resume and Portfolio Website of Yatin Kashyap. Full Stack Developer specializing in React, Next.js, Python, and scalable web solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
