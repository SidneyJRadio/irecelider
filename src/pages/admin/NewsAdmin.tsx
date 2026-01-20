import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  created_at: string;
  regions: { name: string } | null;
}

export default function NewsAdmin() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("id, title, slug, status, featured, created_at, regions(name)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar notícias",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Notícia excluída",
        description: "A notícia foi removida com sucesso.",
      });
      fetchNews();
    }
  };

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Notícias</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as notícias do portal
            </p>
          </div>
          <Link to="/admin/noticias/nova">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Notícia
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar notícias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              Nenhuma notícia encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Região</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {item.regions?.name || "Sem região"} •{" "}
                          {format(new Date(item.created_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.regions?.name || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={item.status === "published" ? "default" : "secondary"}
                      >
                        {item.status === "published" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {format(new Date(item.created_at), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/noticias/${item.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir notícia?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. A notícia será
                                permanentemente removida.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
