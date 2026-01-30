import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Communicator {
  id: string;
  name: string;
  role: string;
  program: string | null;
  photo_url: string | null;
  instagram: string | null;
  radio_id: string | null;
  active: boolean;
  radios: { name: string } | null;
}

interface RadioOption {
  id: string;
  name: string;
}

export default function CommunicatorsAdmin() {
  const queryClient = useQueryClient();
  const [communicators, setCommunicators] = useState<Communicator[]>([]);
  const [radios, setRadios] = useState<RadioOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    role: "Locutor",
    program: "",
    photo_url: "",
    instagram: "",
    radio_id: "",
    active: true,
  });

  const fetchData = async () => {
    setLoading(true);
    const [commRes, radiosRes] = await Promise.all([
      supabase
        .from("communicators")
        .select("id, name, role, program, photo_url, instagram, radio_id, active, radios(name)")
        .order("display_order"),
      supabase.from("radios").select("id, name"),
    ]);

    setCommunicators(commRes.data || []);
    setRadios(radiosRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      role: "Locutor",
      program: "",
      photo_url: "",
      instagram: "",
      radio_id: "",
      active: true,
    });
    setEditId(null);
  };

  const handleEdit = (comm: Communicator) => {
    setFormData({
      name: comm.name,
      role: comm.role || "Locutor",
      program: comm.program || "",
      photo_url: comm.photo_url || "",
      instagram: comm.instagram || "",
      radio_id: comm.radio_id || "",
      active: comm.active ?? true,
    });
    setEditId(comm.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...formData,
      radio_id: formData.radio_id || null,
    };

    let error;

    if (editId) {
      const { error: updateError } = await supabase
        .from("communicators")
        .update(data)
        .eq("id", editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("communicators").insert(data);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["communicators"] });
      toast({
        title: editId ? "Comunicador atualizado" : "Comunicador criado",
        description: "As alterações foram salvas com sucesso.",
      });
      setDialogOpen(false);
      resetForm();
      fetchData();
    }

    setSaving(false);
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase
      .from("communicators")
      .update({ active })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["communicators"] });
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("communicators").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["communicators"] });
      toast({
        title: "Comunicador excluído",
        description: "O comunicador foi removido com sucesso.",
      });
      fetchData();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Comunicadores</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os comunicadores das rádios
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Comunicador
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editId ? "Editar Comunicador" : "Novo Comunicador"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                    placeholder="Locutor, Repórter, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Programa</Label>
                  <Input
                    id="program"
                    value={formData.program}
                    onChange={(e) => setFormData((p) => ({ ...p, program: e.target.value }))}
                    placeholder="Nome do programa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radio">Rádio</Label>
                  <Select
                    value={formData.radio_id}
                    onValueChange={(value) => setFormData((p) => ({ ...p, radio_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a rádio" />
                    </SelectTrigger>
                    <SelectContent>
                      {radios.map((radio) => (
                        <SelectItem key={radio.id} value={radio.id}>
                          {radio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData((p) => ({ ...p, instagram: e.target.value }))}
                    placeholder="@usuario"
                  />
                </div>
                <ImageUpload
                  value={formData.photo_url}
                  onChange={(url) => setFormData((p) => ({ ...p, photo_url: url }))}
                  label="Foto do Comunicador"
                  folder="communicators"
                />
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Comunicador Ativo</p>
                    <p className="text-sm text-muted-foreground">
                      Exibir no site
                    </p>
                  </div>
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, active: checked }))
                    }
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
          ) : communicators.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              Nenhum comunicador cadastrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comunicador</TableHead>
                  <TableHead className="hidden md:table-cell">Programa</TableHead>
                  <TableHead className="hidden md:table-cell">Rádio</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communicators.map((comm) => (
                  <TableRow key={comm.id} className={!comm.active ? "opacity-60" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={comm.photo_url || ""} />
                          <AvatarFallback>
                            {comm.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{comm.name}</p>
                          <p className="text-xs text-muted-foreground">{comm.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {comm.program || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {comm.radios?.name || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={comm.active}
                          onCheckedChange={(checked) => handleToggleActive(comm.id, checked)}
                        />
                        <Badge variant={comm.active ? "default" : "secondary"}>
                          {comm.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(comm)}>
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
                              <AlertDialogTitle>Excluir comunicador?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(comm.id)}
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
