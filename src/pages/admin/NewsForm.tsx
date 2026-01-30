import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, Video, Image as ImageIcon } from "lucide-react";

interface Region {
  id: string;
  name: string;
}

export default function NewsForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    region_id: "",
    status: "draft",
    featured: false,
    video_url: "",
    image_position: "top",
    video_position: "",
  });

  useEffect(() => {
    // Fetch regions
    supabase.from("regions").select("id, name").then(({ data }) => {
      setRegions(data || []);
    });

    // Fetch news if editing
    if (isEdit && id) {
      setLoading(true);
      supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            toast({
              title: "Erro ao carregar",
              description: error.message,
              variant: "destructive",
            });
            navigate("/admin/noticias");
          } else if (data) {
            setFormData({
              title: data.title || "",
              slug: data.slug || "",
              excerpt: data.excerpt || "",
              content: data.content || "",
              image_url: data.image_url || "",
              region_id: data.region_id || "",
              status: data.status || "draft",
              featured: data.featured || false,
              video_url: data.video_url || "",
              image_position: data.image_position || "top",
              video_position: data.video_position || "",
            });
          }
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  };

  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    // Se não é URL, assume que já é um ID
    if (url.length === 11 && !url.includes("/")) {
      return url;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Se marcou como destaque e tem região, desmarcar outras notícias da mesma região
    if (formData.featured && formData.region_id) {
      const { error: unfeaturedError } = await supabase
        .from("news")
        .update({ featured: false })
        .eq("region_id", formData.region_id)
        .eq("featured", true)
        .neq("id", id || "");
      
      if (unfeaturedError) {
        console.error("Erro ao desmarcar destaques anteriores:", unfeaturedError);
      }
    }

    const newsData = {
      ...formData,
      author_id: user?.id,
      published_at: formData.status === "published" ? new Date().toISOString() : null,
      video_position: formData.video_position || null,
    };

    let error;

    if (isEdit && id) {
      const { error: updateError } = await supabase
        .from("news")
        .update(newsData)
        .eq("id", id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("news").insert(newsData);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Invalidate queries to update homepage automatically
      queryClient.invalidateQueries({ queryKey: ["published-news"] });
      queryClient.invalidateQueries({ queryKey: ["featured-news"] });
      queryClient.invalidateQueries({ queryKey: ["all-news"] });
      queryClient.invalidateQueries({ queryKey: ["news", "featured-by-region"] });
      
      toast({
        title: isEdit ? "Notícia atualizada" : "Notícia criada",
        description: "As alterações foram salvas com sucesso.",
      });
      navigate("/admin/noticias");
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

  const videoId = extractVideoId(formData.video_url);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">
              {isEdit ? "Editar Notícia" : "Nova Notícia"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit ? "Atualize os dados da notícia" : "Preencha os dados para criar uma notícia"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Digite o título da notícia"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="titulo-da-noticia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrição da notícia"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Escreva o conteúdo completo da notícia..."
                  rows={10}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Imagem de Capa</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                label="Imagem"
                folder="news"
              />

              <div className="space-y-2">
                <Label>Posição da Imagem na Notícia</Label>
                <Select
                  value={formData.image_position}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, image_position: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">No topo (antes do conteúdo)</SelectItem>
                    <SelectItem value="bottom">No final (após o conteúdo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Vídeo (Opcional)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video_url">URL do Vídeo (YouTube)</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=... ou ID do vídeo"
                />
                <p className="text-xs text-muted-foreground">
                  Cole o link completo do YouTube ou apenas o ID do vídeo
                </p>
              </div>

              {videoId && (
                <div className="space-y-2">
                  <Label>Preview do Vídeo</Label>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black border border-border max-w-md">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="Preview do vídeo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Posição do Vídeo na Notícia</Label>
                <Select
                  value={formData.video_position}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, video_position: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione onde exibir o vídeo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não exibir vídeo</SelectItem>
                    <SelectItem value="top">No topo (antes do conteúdo)</SelectItem>
                    <SelectItem value="bottom">No final (após o conteúdo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Região *</Label>
                  <Select
                    value={formData.region_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, region_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Notícia em Destaque</p>
                  <p className="text-sm text-muted-foreground">
                    Destaque da região na página inicial (apenas 1 por região)
                  </p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, featured: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? "Atualizar" : "Criar"} Notícia
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
