export type WorkflowFormat = "n8n" | "make";

export type N8nNode = {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
  disabled?: boolean;
};

export type N8nConnections = Record<
  string,
  Record<string, Array<Array<{ node: string; type?: string; index?: number }>>>
>;

export type N8nWorkflow = {
  name?: string;
  nodes?: N8nNode[];
  connections?: N8nConnections;
  active?: boolean;
  settings?: Record<string, unknown>;
};

export type MakeModule = {
  id: number;
  module: string;
  version?: number;
  parameters?: Record<string, unknown>;
  mapper?: Record<string, unknown>;
  metadata?: {
    designer?: { x?: number; y?: number; name?: string };
    expect?: Array<Record<string, unknown>>;
  };
  routes?: Array<{ flow?: MakeModule[] }>;
};

export type MakeBlueprint = {
  name?: string;
  flow?: MakeModule[];
  metadata?: Record<string, unknown>;
};

export type ParsedWorkflow =
  | {
      format: "n8n";
      name: string;
      nodes: N8nNode[];
      edges: Array<{ id: string; source: string; target: string; label?: string }>;
      nodeCount: number;
      apps: string[];
      raw: N8nWorkflow;
    }
  | {
      format: "make";
      name: string;
      modules: Array<{
        id: number;
        moduleType: string;
        appSlug: string;
        actionLabel: string;
        x?: number;
        y?: number;
        designerName?: string;
        nested?: Array<{ routeIndex: number; modules: number[] }>;
      }>;
      nodeCount: number;
      apps: string[];
      raw: MakeBlueprint;
    };

export function detectFormat(json: unknown): WorkflowFormat | null {
  if (!json || typeof json !== "object") return null;
  const j = json as Record<string, unknown>;
  if (Array.isArray(j.nodes) && j.connections && typeof j.connections === "object") return "n8n";
  if (Array.isArray(j.flow)) return "make";
  return null;
}

export function n8nAppFromType(type: string): string {
  const t = type || "";
  if (t.startsWith("n8n-nodes-base.")) return t.slice("n8n-nodes-base.".length);
  if (t.startsWith("@n8n/n8n-nodes-langchain.")) return `langchain.${t.slice("@n8n/n8n-nodes-langchain.".length)}`;
  if (t.includes(".")) return t.split(".").slice(-1)[0];
  return t;
}

export function parseN8n(json: N8nWorkflow, fallbackName: string): Extract<ParsedWorkflow, { format: "n8n" }> {
  const nodes = Array.isArray(json.nodes) ? json.nodes : [];
  const connections = json.connections ?? {};
  const edges: Array<{ id: string; source: string; target: string; label?: string }> = [];
  const nameToId = new Map<string, string>();
  for (const n of nodes) nameToId.set(n.name, n.id || n.name);

  let eIdx = 0;
  for (const [srcName, ports] of Object.entries(connections)) {
    const srcId = nameToId.get(srcName) || srcName;
    for (const [portType, lanes] of Object.entries(ports || {})) {
      const lanesArr = Array.isArray(lanes) ? lanes : [];
      lanesArr.forEach((lane, laneIdx) => {
        (lane || []).forEach((conn) => {
          if (!conn?.node) return;
          const tgtId = nameToId.get(conn.node) || conn.node;
          edges.push({
            id: `e${eIdx++}`,
            source: srcId,
            target: tgtId,
            label: portType !== "main" ? portType : laneIdx > 0 ? `lane ${laneIdx}` : undefined,
          });
        });
      });
    }
  }

  const apps = Array.from(new Set(nodes.map((n) => n8nAppFromType(n.type)))).sort();
  return {
    format: "n8n",
    name: json.name?.trim() || fallbackName,
    nodes,
    edges,
    nodeCount: nodes.length,
    apps,
    raw: json,
  };
}

export function makeAppFromModule(modulePath: string): string {
  if (!modulePath) return "unknown";
  const head = modulePath.split(":")[0];
  return head || "unknown";
}

function makeActionFromModule(modulePath: string): string {
  if (!modulePath) return "";
  const parts = modulePath.split(":");
  if (parts.length < 2) return modulePath;
  return parts.slice(1).join(":");
}

export function parseMake(json: MakeBlueprint, fallbackName: string): Extract<ParsedWorkflow, { format: "make" }> {
  const flow = Array.isArray(json.flow) ? json.flow : [];
  const modules: Extract<ParsedWorkflow, { format: "make" }>["modules"] = [];

  const visit = (mods: MakeModule[]) => {
    for (const m of mods) {
      const nested = (m.routes ?? [])
        .map((r, idx) => ({ routeIndex: idx, modules: (r.flow ?? []).map((c) => c.id) }))
        .filter((r) => r.modules.length > 0);
      modules.push({
        id: m.id,
        moduleType: m.module,
        appSlug: makeAppFromModule(m.module),
        actionLabel: makeActionFromModule(m.module),
        x: m.metadata?.designer?.x,
        y: m.metadata?.designer?.y,
        designerName: m.metadata?.designer?.name,
        nested: nested.length ? nested : undefined,
      });
      for (const r of m.routes ?? []) {
        if (r?.flow) visit(r.flow);
      }
    }
  };
  visit(flow);

  const apps = Array.from(new Set(modules.map((m) => m.appSlug))).sort();
  return {
    format: "make",
    name: json.name?.trim() || fallbackName,
    modules,
    nodeCount: modules.length,
    apps,
    raw: json,
  };
}

export function parseWorkflow(json: unknown, fallbackName: string): ParsedWorkflow | null {
  const fmt = detectFormat(json);
  if (fmt === "n8n") return parseN8n(json as N8nWorkflow, fallbackName);
  if (fmt === "make") return parseMake(json as MakeBlueprint, fallbackName);
  return null;
}
