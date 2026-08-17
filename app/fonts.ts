// app/fonts.ts
import { Oswald, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";

export const display = Oswald({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-oswald",
});

export const body = Source_Serif_4({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-source-serif",
});

export const mono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-plex-mono",
});
