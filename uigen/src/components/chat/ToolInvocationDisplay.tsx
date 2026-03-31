"use client";

import { Loader2, FilePlus, FilePen, Eye, Undo2, FileInput, Trash2, ArrowRightLeft, Wrench } from "lucide-react";

interface ToolInvocationDisplayProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

function getFileName(path: unknown): string {
  if (typeof path !== "string") return "";
  return path.split("/").pop() || path;
}

function getDisplayInfo(toolName: string, args: Record<string, unknown>): { icon: React.ReactNode; label: string } {
  const fileName = getFileName(args.path);

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return { icon: <FilePlus className="w-3.5 h-3.5" />, label: `ファイルを作成: ${fileName}` };
      case "str_replace":
        return { icon: <FilePen className="w-3.5 h-3.5" />, label: `ファイルを編集: ${fileName}` };
      case "insert":
        return { icon: <FileInput className="w-3.5 h-3.5" />, label: `ファイルに挿入: ${fileName}` };
      case "view":
        return { icon: <Eye className="w-3.5 h-3.5" />, label: `ファイルを表示: ${fileName}` };
      case "undo_edit":
        return { icon: <Undo2 className="w-3.5 h-3.5" />, label: `編集を元に戻す: ${fileName}` };
      default:
        return { icon: <FilePen className="w-3.5 h-3.5" />, label: `ファイルを操作: ${fileName}` };
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename": {
        const newFileName = getFileName(args.new_path);
        return { icon: <ArrowRightLeft className="w-3.5 h-3.5" />, label: `ファイル名を変更: ${fileName} → ${newFileName}` };
      }
      case "delete":
        return { icon: <Trash2 className="w-3.5 h-3.5" />, label: `ファイルを削除: ${fileName}` };
      default:
        return { icon: <Wrench className="w-3.5 h-3.5" />, label: `ファイルを管理: ${fileName}` };
    }
  }

  return { icon: <Wrench className="w-3.5 h-3.5" />, label: toolName };
}

export function ToolInvocationDisplay({ toolName, args, state, result }: ToolInvocationDisplayProps) {
  const isComplete = state === "result" && result;
  const { icon, label } = getDisplayInfo(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
          <span className="text-neutral-600 shrink-0">{icon}</span>
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600 shrink-0" />
          <span className="text-neutral-600 shrink-0">{icon}</span>
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
