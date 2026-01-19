export interface Communicator {
  id: string;
  name: string;
  role: string;
  radio: string;
  radioId: string;
  photo: string;
  instagram: string;
  program?: string;
}

export const communicators: Communicator[] = [
  {
    id: "1",
    name: "Ricardo Almeida",
    role: "Apresentador",
    radio: "Irecê Líder 103,7",
    radioId: "irece-lider",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    instagram: "ricardoalmeida",
    program: "Bom Dia Irecê",
  },
  {
    id: "2",
    name: "Juliana Ferreira",
    role: "Locutora",
    radio: "Rádio Líder FM",
    radioId: "lider-fm",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    instagram: "julianaferreira",
    program: "Tarde Musical",
  },
  {
    id: "3",
    name: "Marcos Vinícius",
    role: "Jornalista",
    radio: "Clube 96,5 FM",
    radioId: "clube",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    instagram: "marcosvinicius",
    program: "Jornal da Clube",
  },
  {
    id: "4",
    name: "Patrícia Souza",
    role: "Apresentadora",
    radio: "Serrana FM 93,5",
    radioId: "serrana",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    instagram: "patriciasouza",
    program: "Manhã Serrana",
  },
  {
    id: "5",
    name: "Eduardo Costa",
    role: "Locutor Esportivo",
    radio: "Irecê Líder 103,7",
    radioId: "irece-lider",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    instagram: "eduardocosta",
    program: "Esporte Total",
  },
  {
    id: "6",
    name: "Amanda Rodrigues",
    role: "Repórter",
    radio: "Clube 96,5 FM",
    radioId: "clube",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    instagram: "amandarodrigues",
  },
];
