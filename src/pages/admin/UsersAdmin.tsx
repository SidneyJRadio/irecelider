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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, UserCog } from "lucide-react";

interface UserWithRole {
  id: string;
  user_id: string;
  role: string;
}

interface Region {
  id: string;
  name: string;
}

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  supervisor: "Supervisor",
  editor: "Editor",
  reporter: "Repórter",
};

const roleBadgeVariants: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  supervisor: "default",
  editor: "secondary",
  reporter: "outline",
};

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isAdmin, isSupervisor } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "reporter" as "admin" | "supervisor" | "editor" | "reporter",
    region_id: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const [usersRes, regionsRes] = await Promise.all([
      supabase
        .from("user_roles")
        .select("id, user_id, role")
        .order("created_at", { ascending: false }),
      supabase.from("regions").select("id, name"),
    ]);

    setUsers((usersRes.data || []) as UserWithRole[]);
    setRegions(regionsRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      full_name: "",
      role: "reporter",
      region_id: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Create user with signup
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // 2. Update profile with region
        if (formData.region_id) {
          await supabase
            .from("profiles")
            .update({ region_id: formData.region_id })
            .eq("user_id", authData.user.id);
        }

        // 3. Add role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: formData.role,
        });

        if (roleError) throw roleError;

        toast({
          title: "Usuário criado",
          description: `${formData.full_name} foi adicionado como ${roleLabels[formData.role]}.`,
        });

        setDialogOpen(false);
        resetForm();
        fetchData();
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  const handleDelete = async (roleId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);

    if (error) {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Permissão removida",
        description: "O usuário não tem mais acesso ao painel.",
      });
      fetchData();
    }
  };

  const canManageUsers = isAdmin || isSupervisor;

  if (!canManageUsers) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <UserCog className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">Acesso Restrito</h2>
          <p className="text-muted-foreground mt-2">
            Apenas administradores e supervisores podem gerenciar usuários.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os usuários e permissões do sistema
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    minLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Função *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) => setFormData((p) => ({ ...p, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reporter">Repórter</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      {isAdmin && (
                        <>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Região</Label>
                  <Select
                    value={formData.region_id}
                    onValueChange={(value) => setFormData((p) => ({ ...p, region_id: value }))}
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
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Usuário"}
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
          ) : users.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              Nenhum usuário com permissões cadastrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead className="hidden md:table-cell">Função</TableHead>
                  <TableHead className="hidden md:table-cell">Região</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userRole) => (
                  <TableRow key={userRole.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {userRole.role.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-xs text-muted-foreground">
                            {userRole.user_id.slice(0, 8)}...
                          </p>
                          <Badge
                            variant={roleBadgeVariants[userRole.role] || "outline"}
                            className="md:hidden mt-1"
                          >
                            {roleLabels[userRole.role] || userRole.role}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={roleBadgeVariants[userRole.role] || "outline"}>
                        {roleLabels[userRole.role] || userRole.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">—</TableCell>
                    <TableCell className="text-right">
                      {userRole.user_id !== user?.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover permissão?</AlertDialogTitle>
                              <AlertDialogDescription>
                                O usuário perderá acesso ao painel administrativo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(userRole.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
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
