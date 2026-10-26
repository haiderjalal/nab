"use client";

// Phosphor calls React.createContext when it loads, which the server component graph cannot evaluate.
// Routing every icon through this client module lets server components render them as client islands.
export {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  FileText,
  Gavel,
  Globe,
  Handshake,
  LinkedinLogo,
  List,
  Pause,
  Play,
  Plus,
  Scales,
  Sparkle,
  Waveform,
  X,
} from "@phosphor-icons/react";
export type { Icon } from "@phosphor-icons/react";
