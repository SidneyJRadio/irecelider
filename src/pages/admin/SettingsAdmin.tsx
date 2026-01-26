import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Youtube, ExternalLink } from "lucide-react";

interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
}

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    youtube_video_id: "",
    youtube_channel_url: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");

    if (!error && data) {
      const settingsMap: Record<string, string> = {};
      data.forEach((setting: SiteSetting) => {
        settingsMap[setting.key] = setting.value || "";
      });
      setSettings({
        youtube_video_id: settingsMap.youtube_video_id || "",
        youtube_channel_url: settingsMap.youtube_channel_url || "",
      });
    }
    setLoading(false);
  };

  const extractVideoId = (input: string): string => {
    // Se já é um ID simples (sem URL)
    if (!input.includes("/") && !input.includes(".")) {
      return input;
    }

    // Tentar extrair de URLs do YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return input;
  };

  const handleSave = async () => {
    setSaving(true);

    const updates = [
      { key: "youtube_video_id", value: extractVideoId(settings.youtube_video_id) },
      { key: "youtube_channel_url", value: settings.youtube_channel_url },
    ];

    let hasError = false;

    for (const update of updates) {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: update.value })
        .eq("key", update.key);

      if (error) {
        hasError = true;
        toast({
          title: "Erro ao salvar",
          description: error.message,
          variant: "destructive",
        });
        break;
      }
    }

    if (!hasError) {
      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso.",
      });
      fetchSettings();
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  const videoId = extractVideoId(settings.youtube_video_id);

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações globais do site
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-accent" />
              <CardTitle>YouTube</CardTitle>
            </div>
            <CardDescription>
              Configure o vídeo e canal exibidos na página inicial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="youtube_video_id">ID ou URL do Vídeo</Label>
              <Input
                id="youtube_video_id"
                value={settings.youtube_video_id}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, youtube_video_id: e.target.value }))
                }
                placeholder="CyKl-0Y1ZDg ou https://youtube.com/watch?v=CyKl-0Y1ZDg"
              />
              <p className="text-xs text-muted-foreground">
                Cole o link completo do YouTube ou apenas o ID do vídeo
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube_channel_url">URL do Canal</Label>
              <Input
                id="youtube_channel_url"
                value={settings.youtube_channel_url}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, youtube_channel_url: e.target.value }))
                }
                placeholder="https://youtube.com/@seucanal"
              />
            </div>

            {videoId && (
              <div className="space-y-2">
                <Label>Preview do Vídeo</Label>
                <div className="aspect-video rounded-lg overflow-hidden bg-black border border-border">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Preview do vídeo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Abrir no YouTube
                  </a>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">ID: {videoId}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
