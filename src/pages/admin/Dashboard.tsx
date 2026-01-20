import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Users, Radio, MapPin, TrendingUp, Eye } from "lucide-react";

interface Stats {
  news: number;
  communicators: number;
  radios: number;
  regions: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    news: 0,
    communicators: 0,
    radios: 0,
    regions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [newsRes, commRes, radiosRes, regionsRes] = await Promise.all([
        supabase.from("news").select("id", { count: "exact", head: true }),
        supabase.from("communicators").select("id", { count: "exact", head: true }),
        supabase.from("radios").select("id", { count: "exact", head: true }),
        supabase.from("regions").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        news: newsRes.count || 0,
        communicators: commRes.count || 0,
        radios: radiosRes.count || 0,
        regions: regionsRes.count || 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Notícias",
      value: stats.news,
      icon: Newspaper,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Comunicadores",
      value: stats.communicators,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Rádios",
      value: stats.radios,
      icon: Radio,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Regiões",
      value: stats.regions,
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao painel administrativo do Grupo J.Sidney
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card key={card.title} className="border-border/50">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">
                      {loading ? "-" : card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="/admin/noticias/nova"
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Newspaper className="w-5 h-5 text-muted-foreground" />
                <span>Criar nova notícia</span>
              </a>
              <a
                href="/admin/comunicadores"
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Users className="w-5 h-5 text-muted-foreground" />
                <span>Gerenciar comunicadores</span>
              </a>
              <a
                href="/admin/radios"
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Radio className="w-5 h-5 text-muted-foreground" />
                <span>Configurar rádios</span>
              </a>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Resumo do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Regiões Ativas</span>
                  <span className="font-medium">{stats.regions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Rádios no Ar</span>
                  <span className="font-medium">{stats.radios}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
