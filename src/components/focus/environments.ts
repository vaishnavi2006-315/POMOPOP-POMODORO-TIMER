import bgTokyo from "@/assets/bg-tokyo.jpg";
import bgBedroom from "@/assets/bg-bedroom.jpg";
import bgCafe from "@/assets/bg-cafe.jpg";
import bgForest from "@/assets/bg-forest.jpg";

export type ThemeId = "dark" | "light" | "midnight" | "sunset" | "forest" | "mono";

export type Environment = {
  id: string;
  name: string;
  mood: string;
  theme: ThemeId;
  image?: string;
  gradient: string;
  rain: boolean;
  particles: "motes" | "leaves" | "none";
  glow: string;
};

export const environments: Environment[] = [
  {
    id: "tokyo",
    name: "Rainy Tokyo apartment",
    mood: "🌙 Night",
    theme: "dark",
    image: bgTokyo,
    gradient: "linear-gradient(160deg, oklch(0.24 0.04 240), oklch(0.16 0.03 280))",
    rain: true,
    particles: "motes",
    glow: "oklch(0.7 0.1 250 / 0.35)",
  },
  {
    id: "bedroom",
    name: "Cozy bedroom at night",
    mood: "🌙 Night",
    theme: "midnight",
    image: bgBedroom,
    gradient: "linear-gradient(160deg, oklch(0.22 0.04 270), oklch(0.15 0.03 285))",
    rain: false,
    particles: "motes",
    glow: "oklch(0.8 0.1 70 / 0.32)",
  },
  {
    id: "cafe",
    name: "Café during sunset",
    mood: "🌆 Sunset",
    theme: "sunset",
    image: bgCafe,
    gradient: "linear-gradient(160deg, oklch(0.42 0.09 55), oklch(0.24 0.06 30))",
    rain: false,
    particles: "motes",
    glow: "oklch(0.84 0.12 60 / 0.4)",
  },
  {
    id: "cabin",
    name: "Forest cabin",
    mood: "☁ Cloudy",
    theme: "forest",
    image: bgForest,
    gradient: "linear-gradient(160deg, oklch(0.3 0.04 165), oklch(0.18 0.03 190))",
    rain: true,
    particles: "leaves",
    glow: "oklch(0.78 0.08 150 / 0.3)",
  },
  {
    id: "ocean",
    name: "Ocean at night",
    mood: "🌙 Night",
    theme: "midnight",
    gradient:
      "radial-gradient(120% 80% at 50% 110%, oklch(0.32 0.07 235), transparent), linear-gradient(180deg, oklch(0.14 0.04 268), oklch(0.19 0.05 245))",
    rain: false,
    particles: "motes",
    glow: "oklch(0.72 0.1 240 / 0.35)",
  },
  {
    id: "neon",
    name: "Neon cyberpunk room",
    mood: "🌙 Night",
    theme: "dark",
    gradient:
      "radial-gradient(80% 60% at 15% 20%, oklch(0.45 0.16 320 / 0.7), transparent), radial-gradient(70% 60% at 85% 75%, oklch(0.45 0.14 220 / 0.7), transparent), linear-gradient(180deg, oklch(0.16 0.04 300), oklch(0.13 0.03 270))",
    rain: true,
    particles: "motes",
    glow: "oklch(0.68 0.16 320 / 0.4)",
  },
  {
    id: "cloudy",
    name: "Cloudy afternoon",
    mood: "☁ Cloudy",
    theme: "light",
    gradient:
      "radial-gradient(100% 70% at 30% 0%, oklch(0.95 0.02 250), transparent), linear-gradient(180deg, oklch(0.9 0.02 240), oklch(0.84 0.03 70))",
    rain: false,
    particles: "none",
    glow: "oklch(0.9 0.05 80 / 0.5)",
  },
  {
    id: "desk",
    name: "Study desk with warm lamp",
    mood: "☀ Morning",
    theme: "sunset",
    gradient:
      "radial-gradient(70% 60% at 70% 25%, oklch(0.6 0.12 70 / 0.85), transparent), linear-gradient(180deg, oklch(0.24 0.05 55), oklch(0.16 0.03 40))",
    rain: false,
    particles: "motes",
    glow: "oklch(0.85 0.12 68 / 0.45)",
  },
];

export const themeNames: Record<ThemeId, string> = {
  dark: "Dark Lofi",
  light: "Light Lofi",
  midnight: "Midnight",
  sunset: "Sunset",
  forest: "Forest",
  mono: "Monochrome",
};

export const playlists = [
  { name: "Lofi Beats", tracks: 84, hue: 300 },
  { name: "Deep Focus", tracks: 120, hue: 250 },
  { name: "Rainy Night", tracks: 64, hue: 220 },
  { name: "Coffee Shop", tracks: 72, hue: 45 },
  { name: "Piano Study", tracks: 58, hue: 90 },
  { name: "Late Night Coding", tracks: 96, hue: 320 },
];
