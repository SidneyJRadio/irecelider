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
    name: "Irecê Líder",
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
    id: "lider-fm",
    name: "Rádio Líder FM",
    tagline: "A Líder da Chapada",
    frequency: "103,7 FM",
    streamUrl: "https://stream.zeno.fm/example2",
    whatsappStation: "5574988888888",
    whatsappCommercial: "5574988888887",
    region: "Chapada Diamantina",
    logo: liderFmLogo,
    color: "hsl(145, 60%, 40%)",
  },
  {
    id: "clube",
    name: "Clube FM",
    tagline: "Sua companhia diária",
    frequency: "96,5 FM",
    streamUrl: "https://stream.zeno.fm/example3",
    whatsappStation: "5574977777777",
    whatsappCommercial: "5574977777776",
    region: "Regional",
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
    region: "Serra",
    logo: serranaFmLogo,
    color: "hsl(4, 80%, 50%)",
  },
];

export const regions = [
  { id: "irece", name: "Irecê", color: "hsl(220, 70%, 45%)" },
  { id: "chapada", name: "Chapada Diamantina", color: "hsl(145, 60%, 40%)" },
  { id: "regional", name: "Regional", color: "hsl(45, 90%, 50%)" },
  { id: "bahia", name: "Bahia", color: "hsl(4, 80%, 50%)" },
];
