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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface RadioItem {
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
  active: boolean;
  regions: { name: string } | null;
}

interface Region {
  id: string;
  name: string;
}

export default function RadiosAdmin() {
  const queryClient = useQueryClient();
  const [radios, setRadios] = useState<RadioItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    frequency: "",
    stream_url: "",
    whatsapp_station: "",
    whatsapp_commercial: "",
    region_id: "",
    logo_url: "",
    color: "hsl(220, 70%, 45%)",
    active: true,
  });

  const fetchData = async () => {
    setLoading(true);
    const [radiosRes, regionsRes] = await Promise.all([
      supabase
        .from("radios")
        .select("*, regions(name)")
        .order("name"),
      supabase.from("regions").select("id, name"),
    ]);

    setRadios(radiosRes.data || []);
    setRegions(regionsRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      tagline: "",
      frequency: "",
      stream_url: "",
      whatsapp_station: "",
      whatsapp_commercial: "",
      region_id: "",
      logo_url: "",
      color: "hsl(220, 70%, 45%)",
      active: true,
    });
    setEditId(null);
  };

  const handleEdit = (radio: RadioItem) => {
    setFormData({
      name: radio.name,
      tagline: radio.tagline || "",
      frequency: radio.frequency,
      stream_url: radio.stream_url || "",
      whatsapp_station: radio.whatsapp_station || "",
      whatsapp_commercial: radio.whatsapp_commercial || "",
      region_id: radio.region_id || "",
      logo_url: radio.logo_url || "",
      color: radio.color || "hsl(220, 70%, 45%)",
      active: radio.active ?? true,
    });
    setEditId(radio.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...formData,
      region_id: formData.region_id || null,
    };

    let error;

    if (editId) {
      const { error: updateError } = await supabase
        .from("radios")
        .update(data)
        .eq("id", editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("radios").insert(data);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["radios"] });
      toast({
        title: editId ? "Rádio atualizada" : "Rádio criada",
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
      .from("radios")
      .update({ active })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["radios"] });
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("radios").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Rádio excluída",
        description: "A rádio foi removida com sucesso.",
      });
      fetchData();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Rádios</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as rádios do grupo
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Rádio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editId ? "Editar Rádio" : "Nova Rádio"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequência *</Label>
                    <Input
                      id="frequency"
                      value={formData.frequency}
                      onChange={(e) => setFormData((p) => ({ ...p, frequency: e.target.value }))}
                      placeholder="103,7 FM"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Região</Label>
                    <Select
                      value={formData.region_id}
                      onValueChange={(value) => setFormData((p) => ({ ...p, region_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Slogan</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
                    placeholder="A voz de Irecê"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream_url">URL do Streaming</Label>
                  <Input
                    id="stream_url"
                    value={formData.stream_url}
                    onChange={(e) => setFormData((p) => ({ ...p, stream_url: e.target.value }))}
                    placeholder="https://stream.zeno.fm/..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_station">WhatsApp Rádio</Label>
                    <Input
                      id="whatsapp_station"
                      value={formData.whatsapp_station}
                      onChange={(e) => setFormData((p) => ({ ...p, whatsapp_station: e.target.value }))}
                      placeholder="5574999999999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_commercial">WhatsApp Comercial</Label>
                    <Input
                      id="whatsapp_commercial"
                      value={formData.whatsapp_commercial}
                      onChange={(e) => setFormData((p) => ({ ...p, whatsapp_commercial: e.target.value }))}
                      placeholder="5574999999998"
                    />
                  </div>
                </div>
                <ImageUpload
                  value={formData.logo_url}
                  onChange={(url) => setFormData((p) => ({ ...p, logo_url: url }))}
                  label="Logo da Rádio"
                  folder="radios"
                />
                <div className="space-y-2">
                  <Label htmlFor="color">Cor (HSL)</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                    placeholder="hsl(220, 70%, 45%)"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Rádio Ativa</p>
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
          ) : radios.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              Nenhuma rádio cadastrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rádio</TableHead>
                  <TableHead className="hidden md:table-cell">Frequência</TableHead>
                  <TableHead className="hidden md:table-cell">Região</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {radios.map((radio) => (
                  <TableRow key={radio.id} className={!radio.active ? "opacity-60" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {radio.logo_url ? (
                          <img
                            src={radio.logo_url}
                            alt={radio.name}
                            className="w-10 h-10 rounded object-contain bg-muted"
                          />
                        ) : (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: radio.color || "hsl(220, 70%, 45%)" }}
                          />
                        )}
                        <div>
                          <p className="font-medium">{radio.name}</p>
                          <p className="text-xs text-muted-foreground">{radio.tagline}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {radio.frequency}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {radio.regions?.name || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={radio.active}
                          onCheckedChange={(checked) => handleToggleActive(radio.id, checked)}
                        />
                        <Badge variant={radio.active ? "default" : "secondary"}>
                          {radio.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(radio)}>
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
                              <AlertDialogTitle>Excluir rádio?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(radio.id)}
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
