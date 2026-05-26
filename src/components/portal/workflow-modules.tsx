import { ArrowDown } from "lucide-react";
import type { ParsedWorkflow } from "@/lib/workflow-parse";

type WorkflowModulesProps = {
  parsed: Extract<ParsedWorkflow, { format: "make" }>;
  className?: string;
};

function moduleIcon(app: string): string {
  return app.charAt(0).toUpperCase();
}

function prettyApp(app: string): string {
  return app
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function prettyAction(action: string): string {
  if (!action) return "";
  return action
    .replace(/([A-Z])/g, " $1")
    .replace(/[._-]/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function WorkflowModules({ parsed, className }: WorkflowModulesProps) {
  const flat = parsed.modules;

  return (
    <div className={"rounded-lg border border-white/[0.08] bg-[#0c0c0c] p-5 " + (className ?? "")}>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">
          Make.com flow · {flat.length} modules
        </div>
      </div>
      <ol className="space-y-2">
        {flat.map((m, idx) => (
          <li key={m.id} className="relative">
            <div className="flex items-start gap-3 rounded-md border border-white/[0.08] bg-[#141414] px-3 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-[14px] font-semibold text-white">
                {moduleIcon(m.appSlug)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-white">{prettyApp(m.appSlug)}</span>
                  <span className="text-[10px] text-white/35">#{m.id}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-white/55 truncate">
                  {prettyAction(m.actionLabel) || m.moduleType}
                </div>
                {m.designerName && (
                  <div className="mt-0.5 text-[11px] text-white/35 truncate italic">
                    {m.designerName}
                  </div>
                )}
                {m.nested && m.nested.length > 0 && (
                  <div className="mt-1 text-[11px] text-white/45">
                    {m.nested.length} branch{m.nested.length === 1 ? "" : "es"} ·{" "}
                    {m.nested.reduce((acc, n) => acc + n.modules.length, 0)} downstream modules
                  </div>
                )}
              </div>
            </div>
            {idx < flat.length - 1 && (
              <div className="ml-[26px] flex h-3 items-center text-white/25">
                <ArrowDown className="size-3" />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
