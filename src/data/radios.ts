import ireceLiderLogo from "@/assets/logos/irece-lider.png";
import liderFmLogo from "@/assets/logos/lider-fm.png";
import clubeFmLogo from "@/assets/logos/clube-fm.png";
import serranaFmLogo from "@/assets/logos/serrana-fm.png";

export interface Radio {
  id: string;
  name: string;
  tagline: string;
  frequency: string;
  streamUrl: string;
  whatsappStation: string;
  whatsappCommercial: string;
  region: string;
  logo: string;
  color: string;
}

export const radios: Radio[] = [
  {
    id: "irece-lider",
    name: "Irecê Líder FM",
    tagline: "A voz de Irecê",
    frequency: "103,7 FM",
    streamUrl: "https://stream.zeno.fm/example1",
    whatsappStation: "5574999999999",
    whatsappCommercial: "5574999999998",
    region: "Irecê",
    logo: ireceLiderLogo,
    color: "hsl(220, 70%, 45%)",
  },
  {
    id: "lider-itaberaba",
    name: "Líder FM Itaberaba",
    tagline: "A Líder de Itaberaba",
    frequency: "103,7 FM",
    streamUrl: "https://stream.zeno.fm/example2",
    whatsappStation: "5575988888888",
    whatsappCommercial: "5575988888887",
    region: "Itaberaba",
    logo: liderFmLogo,
    color: "hsl(145, 60%, 40%)",
  },
  {
    id: "clube-irece",
    name: "Clube FM Irecê",
    tagline: "Sua companhia diária",
    frequency: "96,5 FM",
    streamUrl: "https://stream.zeno.fm/example3",
    whatsappStation: "5574977777777",
    whatsappCommercial: "5574977777776",
    region: "Irecê",
    logo: clubeFmLogo,
    color: "hsl(45, 90%, 50%)",
  },
  {
    id: "serrana",
    name: "Serrana FM",
    tagline: "O som da serra",
    frequency: "93,5 FM",
    streamUrl: "https://stream.zeno.fm/example4",
    whatsappStation: "5574966666666",
    whatsappCommercial: "5574966666665",
    region: "Jacobina",
    logo: serranaFmLogo,
    color: "hsl(4, 80%, 50%)",
  },
  {
    id: "clube-jacobina",
    name: "Clube FM Jacobina",
    tagline: "A rádio da família",
    frequency: "96,5 FM",
    streamUrl: "https://stream.zeno.fm/example5",
    whatsappStation: "5574955555555",
    whatsappCommercial: "5574955555554",
    region: "Jacobina",
    logo: clubeFmLogo,
    color: "hsl(45, 90%, 50%)",
  },
  {
    id: "lider-ruy-barbosa",
    name: "Líder FM Ruy Barbosa",
    tagline: "A Líder de Ruy Barbosa",
    frequency: "103,7 FM",
    streamUrl: "https://stream.zeno.fm/example6",
    whatsappStation: "5575944444444",
    whatsappCommercial: "5575944444443",
    region: "Ruy Barbosa",
    logo: liderFmLogo,
    color: "hsl(145, 60%, 40%)",
  },
];

export const regions = [
  { id: "irece", name: "Irecê", color: "hsl(220, 70%, 45%)" },
  { id: "jacobina", name: "Jacobina", color: "hsl(4, 80%, 50%)" },
  { id: "itaberaba", name: "Itaberaba", color: "hsl(145, 60%, 40%)" },
  { id: "ruy-barbosa", name: "Ruy Barbosa", color: "hsl(280, 60%, 50%)" },
];
