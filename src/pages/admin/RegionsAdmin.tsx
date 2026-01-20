import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Region {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export default function RegionsAdmin() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "hsl(220, 70%, 45%)",
  });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("regions").select("*").order("name");
    setRegions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      color: "hsl(220, 70%, 45%)",
    });
    setEditId(null);
  };

  const handleEdit = (region: Region) => {
    setFormData({
      name: region.name,
      slug: region.slug,
      color: region.color || "hsl(220, 70%, 45%)",
    });
    setEditId(region.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let error;

    if (editId) {
      const { error: updateError } = await supabase
        .from("regions")
        .update(formData)
        .eq("id", editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("regions").insert(formData);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: editId ? "Região atualizada" : "Região criada",
        description: "As alterações foram salvas com sucesso.",
      });
      setDialogOpen(false);
      resetForm();
      fetchData();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("regions").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Região excluída",
        description: "A região foi removida com sucesso.",
      });
      fetchData();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Regiões</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as regiões de cobertura
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Região
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editId ? "Editar Região" : "Nova Região"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((p) => ({
                        ...p,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      }));
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Cor (HSL)</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                    placeholder="hsl(220, 70%, 45%)"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : regions.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              Nenhuma região cadastrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Região</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regions.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: region.color || "hsl(220, 70%, 45%)" }}
                        />
                        <span className="font-medium">{region.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      /{region.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(region)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir região?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. As notícias e rádios
                                vinculadas a esta região perderão a associação.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(region.id)}
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
