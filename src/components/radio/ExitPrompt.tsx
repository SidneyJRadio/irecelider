import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Radio, ExternalLink } from "lucide-react";

interface ExitPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmPiP: () => void;
  onCancel: () => void;
  radioName: string;
}

export function ExitPrompt({
  open,
  onOpenChange,
  onConfirmPiP,
  onCancel,
  radioName,
}: ExitPromptProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Radio className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Ao Vivo
            </span>
          </div>
          <AlertDialogTitle className="text-lg">
            Continuar ouvindo {radioName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você está ouvindo a rádio ao vivo. Deseja abrir um player flutuante
            para continuar ouvindo enquanto navega em outros sites?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction
            onClick={onConfirmPiP}
            className="w-full flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir Player Flutuante
          </AlertDialogAction>
          <AlertDialogCancel onClick={onCancel} className="w-full">
            Parar Rádio
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
