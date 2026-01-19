export interface Radio {
  id: string;
  name: string;
  tagline: string;
  frequency: string;
  streamUrl: string;
  whatsappStation: string;
  whatsappCommercial: string;
  region: string;
  logo?: string;
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
    color: "hsl(220, 70%, 45%)",
  },
  {
    id: "lider-fm",
    name: "Rádio Líder FM",
    tagline: "A Líder da Chapada",
    frequency: "FM",
    streamUrl: "https://stream.zeno.fm/example2",
    whatsappStation: "5574988888888",
    whatsappCommercial: "5574988888887",
    region: "Chapada Diamantina",
    color: "hsl(4, 70%, 50%)",
  },
  {
    id: "clube",
    name: "Clube",
    tagline: "Sua companhia diária",
    frequency: "96,5 FM",
    streamUrl: "https://stream.zeno.fm/example3",
    whatsappStation: "5574977777777",
    whatsappCommercial: "5574977777776",
    region: "Regional",
    color: "hsl(160, 60%, 40%)",
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
    color: "hsl(35, 80%, 50%)",
  },
];

export const regions = [
  { id: "irece", name: "Irecê", color: "hsl(220, 70%, 45%)" },
  { id: "chapada", name: "Chapada Diamantina", color: "hsl(160, 60%, 40%)" },
  { id: "regional", name: "Regional", color: "hsl(35, 80%, 50%)" },
  { id: "bahia", name: "Bahia", color: "hsl(4, 70%, 50%)" },
];
