"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ParsedRow {
  name: string;
  email: string;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentField += '"';
        index++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index++;
      }
      currentRow.push(currentField.trim());
      currentField = "";
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentField += character;
  }

  currentRow.push(currentField.trim());
  if (currentRow.some((value) => value.length > 0)) {
    rows.push(currentRow);
  }

  return rows.map((row) => row.map((value) => value.replace(/^"|"$/g, "").trim()));
}

export default function ImportPage() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number; total: number } | null>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || "").replace(/^\uFEFF/, "");
      const parsedRows = parseCsv(text);
      if (parsedRows.length < 2) return;

      const header = parsedRows[0].map((heading) => heading.toLowerCase());
      const emailIdx = header.findIndex((h) => h.includes("email"));
      const nameIdx = header.findIndex((h) => h.includes("name") || h.includes("first"));

      if (emailIdx === -1) {
        alert("CSV must have an 'email' column");
        return;
      }

      const parsed: ParsedRow[] = [];
      for (let i = 1; i < parsedRows.length; i++) {
        const cols = parsedRows[i];
        const email = cols[emailIdx];
        const name = nameIdx >= 0 ? cols[nameIdx] : "";
        if (email && email.includes("@")) {
          parsed.push({ name, email });
        }
      }

      setRows(parsed);
      setResult(null);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    setImporting(true);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ imported: 0, skipped: rows.length, total: rows.length });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import Email List</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a CSV (e.g. a beehiiv export). Needs an <code className="font-mono text-foreground">email</code> column;{" "}
          <code className="font-mono text-foreground">name</code> optional. Imported addresses auto-enroll in the nurture sequence.
        </p>
      </div>

      {/* Upload */}
      <Card className="p-6">
        <Label htmlFor="csv" className="mb-2 block">CSV file</Label>
        <input
          id="csv"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-border file:bg-background file:text-sm file:font-medium file:text-foreground file:cursor-pointer hover:file:bg-accent"
        />
      </Card>

      {/* Preview */}
      {rows.length > 0 && !result && (
        <Card className="p-0 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-mono font-medium">{rows.length}</span> emails ready to import
            </p>
            <Button onClick={handleImport} disabled={importing}>
              {importing ? "Importing..." : `Import ${rows.length} emails`}
            </Button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 100).map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">{r.name || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{r.email}</TableCell>
                  </TableRow>
                ))}
                {rows.length > 100 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-xs text-muted-foreground">
                      … and {rows.length - 100} more
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className="p-5">
          <h3 className="text-sm font-medium mb-2">Import complete</h3>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted-foreground">
              <span className="font-mono text-foreground font-medium">{result.imported}</span> imported
            </span>
            <span className="text-muted-foreground">
              <span className="font-mono text-foreground font-medium">{result.skipped}</span> skipped
            </span>
            <span className="text-muted-foreground">
              <span className="font-mono text-foreground font-medium">{result.total}</span> total
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Imported emails start receiving nurture emails on the next cron run (daily at 10 AM UTC).
          </p>
        </Card>
      )}
    </div>
  );
}
