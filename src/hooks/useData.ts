import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Radio {
  id: string;
  name: string;
  tagline: string | null;
  frequency: string;
  stream_url: string | null;
  whatsapp_station: string | null;
  whatsapp_commercial: string | null;
  region_id: string | null;
  logo_url: string | null;
  color: string | null;
}

export interface Communicator {
  id: string;
  name: string;
  role: string | null;
  program: string | null;
  photo_url: string | null;
  instagram: string | null;
  radio_id: string | null;
  radios: { name: string; color: string | null } | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  status: string;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  regions: { name: string; slug: string; color: string | null } | null;
}

export function useRadios() {
  return useQuery({
    queryKey: ["radios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radios")
        .select("*")
        .eq("active", true)
        .order("name");
      
      if (error) throw error;
      return data as Radio[];
    },
  });
}

export function useCommunicators() {
  return useQuery({
    queryKey: ["communicators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communicators")
        .select("*, radios(name, color)")
        .eq("active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as Communicator[];
    },
  });
}

export function usePublishedNews(limit?: number) {
  return useQuery({
    queryKey: ["news", "published", limit],
    queryFn: async () => {
      let query = supabase
        .from("news")
        .select("*, regions(name, slug, color)")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as NewsArticle[];
    },
  });
}

export function useFeaturedNews() {
  return useQuery({
    queryKey: ["news", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*, regions(name, slug, color)")
        .eq("status", "published")
        .eq("featured", true)
        .order("published_at", { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data as NewsArticle[];
    },
  });
}

export function useNewsByRegion(regionSlug: string) {
  return useQuery({
    queryKey: ["news", "region", regionSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*, regions!inner(name, slug, color)")
        .eq("status", "published")
        .eq("regions.slug", regionSlug)
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data as NewsArticle[];
    },
    enabled: !!regionSlug,
  });
}
