import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Instagram, Youtube, Facebook, Link as LinkIcon, MapPin, Menu, GripVertical } from "lucide-react";

interface FooterLink {
  id: string;
  type: "social" | "navigation" | "region";
  label: string;
  url: string;
  icon: string | null;
  display_order: number;
  active: boolean;
}

const iconOptions = [
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "facebook", label: "Facebook", icon: Facebook },
];

const typeLabels: Record<string, string> = {
  social: "Rede Social",
  navigation: "Navegação",
  region: "Região",
};

export default function FooterAdmin() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [activeTab, setActiveTab] = useState<"social" | "navigation" | "region">("social");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    type: "social" as "social" | "navigation" | "region",
    label: "",
    url: "",
    icon: "",
    active: true,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("footer_links")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setLinks(data as FooterLink[]);
    }
    setLoading(false);
  };

  const filteredLinks = links.filter((link) => link.type === activeTab);

  const handleOpenDialog = (link?: FooterLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        type: link.type,
        label: link.label,
        url: link.url,
        icon: link.icon || "",
        active: link.active,
      });
    } else {
      setEditingLink(null);
      setFormData({
        type: activeTab,
        label: "",
        url: "",
        icon: "",
        active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label || !formData.url) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    if (editingLink) {
      const { error } = await supabase
        .from("footer_links")
        .update({
          label: formData.label,
          url: formData.url,
          icon: formData.icon || null,
          active: formData.active,
        })
        .eq("id", editingLink.id);

      if (error) {
        toast({
          title: "Erro ao atualizar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Link atualizado com sucesso!" });
        setDialogOpen(false);
        fetchLinks();
        queryClient.invalidateQueries({ queryKey: ["footer-links"] });
      }
    } else {
      const maxOrder = links.filter(l => l.type === formData.type).length;
      
      const { error } = await supabase
        .from("footer_links")
        .insert({
          type: formData.type,
          label: formData.label,
          url: formData.url,
          icon: formData.icon || null,
          display_order: maxOrder + 1,
          active: formData.active,
        });

      if (error) {
        toast({
          title: "Erro ao criar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Link criado com sucesso!" });
        setDialogOpen(false);
        fetchLinks();
        queryClient.invalidateQueries({ queryKey: ["footer-links"] });
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este link?")) return;

    const { error } = await supabase
      .from("footer_links")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Link excluído com sucesso!" });
      fetchLinks();
      queryClient.invalidateQueries({ queryKey: ["footer-links"] });
    }
  };

  const handleToggleActive = async (link: FooterLink) => {
    const { error } = await supabase
      .from("footer_links")
      .update({ active: !link.active })
      .eq("id", link.id);

    if (!error) {
      fetchLinks();
      queryClient.invalidateQueries({ queryKey: ["footer-links"] });
    }
  };

  const getIconComponent = (iconName: string | null) => {
    switch (iconName) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      default:
        return <LinkIcon className="w-4 h-4" />;
    }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Footer</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os links e redes sociais do rodapé
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("social")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "social"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              Redes Sociais
            </div>
          </button>
          <button
            onClick={() => setActiveTab("navigation")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "navigation"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Menu className="w-4 h-4" />
              Links de Navegação
            </div>
          </button>
          <button
            onClick={() => setActiveTab("region")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "region"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Regiões
            </div>
          </button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {activeTab === "social" && "Redes Sociais"}
                {activeTab === "navigation" && "Links de Navegação"}
                {activeTab === "region" && "Links de Regiões"}
              </CardTitle>
              <CardDescription>
                {activeTab === "social" && "Configure os links das redes sociais exibidos no footer"}
                {activeTab === "navigation" && "Configure os links de navegação do footer"}
                {activeTab === "region" && "Configure os links das regiões exibidos no footer"}
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingLink ? "Editar Link" : "Novo Link"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Nome / Label *</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Ex: Instagram, Início, Irecê"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://... ou /pagina"
                    />
                  </div>
                  {activeTab === "social" && (
                    <div className="space-y-2">
                      <Label htmlFor="icon">Ícone</Label>
                      <Select
                        value={formData.icon}
                        onValueChange={(value) => setFormData({ ...formData, icon: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um ícone" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <option.icon className="w-4 h-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                    <Label htmlFor="active">Ativo</Label>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {filteredLinks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum link cadastrado nesta categoria
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    {activeTab === "social" && <TableHead className="w-12">Ícone</TableHead>}
                    <TableHead>Nome</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="w-20">Status</TableHead>
                    <TableHead className="w-24 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link, index) => (
                    <TableRow key={link.id}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      {activeTab === "social" && (
                        <TableCell>{getIconComponent(link.icon)}</TableCell>
                      )}
                      <TableCell className="font-medium">{link.label}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {link.url}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={link.active}
                          onCheckedChange={() => handleToggleActive(link)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(link)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(link.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
