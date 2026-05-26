"use client";

import { useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  Handle,
  MiniMap,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { n8nAppFromType, type ParsedWorkflow } from "@/lib/workflow-parse";

type WorkflowCanvasProps = {
  parsed: Extract<ParsedWorkflow, { format: "n8n" }>;
  className?: string;
};

type N8nNodeData = {
  label: string;
  app: string;
  type: string;
  disabled?: boolean;
};

function shortType(type: string): string {
  return n8nAppFromType(type)
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function N8nFlowNode({ data }: NodeProps<Node<N8nNodeData>>) {
  return (
    <div
      className={
        "rounded-md border border-white/[0.12] bg-[#1a1a1a] px-3 py-2 shadow-sm min-w-[170px] max-w-[210px]" +
        (data.disabled ? " opacity-50" : "")
      }
    >
      <Handle type="target" position={Position.Left} className="!bg-white/40 !w-2 !h-2" />
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/45 truncate">
        {shortType(data.type)}
      </div>
      <div className="mt-0.5 text-[13px] font-medium text-white truncate">{data.label}</div>
      <Handle type="source" position={Position.Right} className="!bg-white/40 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { n8n: N8nFlowNode };

function isStickyNote(type: string): boolean {
  return /stickyNote/i.test(type);
}

function buildGraph(parsed: Extract<ParsedWorkflow, { format: "n8n" }>): {
  nodes: Node<N8nNodeData>[];
  edges: Edge[];
} {
  const visibleNodes = parsed.nodes.filter((n) => !isStickyNote(n.type));
  const visibleIds = new Set(visibleNodes.map((n) => n.id || n.name));

  const nodes: Node<N8nNodeData>[] = visibleNodes.map((n) => ({
    id: n.id || n.name,
    type: "n8n",
    position: { x: n.position?.[0] ?? 0, y: n.position?.[1] ?? 0 },
    data: { label: n.name, app: n8nAppFromType(n.type), type: n.type, disabled: n.disabled },
    draggable: false,
    selectable: false,
  }));

  const edges: Edge[] = parsed.edges
    .filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target))
    .map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: "smoothstep",
      style: { stroke: "rgba(255,255,255,0.35)", strokeWidth: 1.2 },
      labelStyle: { fill: "rgba(255,255,255,0.55)", fontSize: 10 },
    }));

  return { nodes, edges };
}

export function WorkflowCanvas({ parsed, className }: WorkflowCanvasProps) {
  const { nodes, edges } = useMemo(() => buildGraph(parsed), [parsed]);

  return (
    <div className={"h-[560px] w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] " + (className ?? "")}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={1.6}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgba(255,255,255,0.06)" />
          <Controls showInteractive={false} className="!bg-[#1a1a1a] !border-white/[0.08]" />
          <MiniMap
            pannable
            zoomable
            nodeColor="#222"
            maskColor="rgba(0,0,0,0.7)"
            className="!bg-[#0c0c0c] !border !border-white/[0.08]"
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
