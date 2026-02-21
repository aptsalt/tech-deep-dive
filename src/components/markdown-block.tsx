"use client";

import React from "react";

export function formatInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-muted rounded px-1 py-0.5 text-xs font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/);
    return boldParts.map((bp, j) => {
      if (bp.startsWith("**") && bp.endsWith("**")) {
        return (
          <strong key={`${i}-${j}`} className="font-semibold">
            {bp.slice(2, -2)}
          </strong>
        );
      }
      return bp;
    });
  });
}

export function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${i}`} className="my-3">
            {codeLang && (
              <div className="bg-muted/80 text-muted-foreground rounded-t-md border border-b-0 px-3 py-1 text-xs font-mono">
                {codeLang}
              </div>
            )}
            <pre
              className={`bg-muted/50 overflow-x-auto rounded-b-md border p-3 text-xs font-mono leading-relaxed ${!codeLang ? "rounded-t-md" : ""}`}
            >
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>
        );
        codeLines = [];
        codeLang = "";
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="mt-6 mb-2 text-lg font-semibold tracking-tight"
        >
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="mt-6 mb-2 text-xl font-bold tracking-tight"
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("| ")) {
      const tableLines: string[] = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].startsWith("|")) {
        tableLines.push(lines[j]);
        j++;
      }
      i = j - 1;

      const headerCells = tableLines[0]
        .split("|")
        .filter(Boolean)
        .map((c) => c.trim());
      const dataRows = tableLines.slice(2).map((row) =>
        row
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim())
      );

      elements.push(
        <div key={`table-${i}`} className="my-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                {headerCells.map((cell, ci) => (
                  <th
                    key={ci}
                    className="text-left p-2 font-semibold bg-muted/50"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri} className="border-b last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
      if (match) {
        elements.push(
          <div key={`li-${i}`} className="flex gap-2 py-1 text-sm">
            <span className="text-muted-foreground mt-1.5 shrink-0">
              &#8226;
            </span>
            <span>
              <strong className="font-semibold">{match[1]}:</strong>{" "}
              {match[2]}
            </span>
          </div>
        );
      }
    } else if (line.startsWith("- ")) {
      elements.push(
        <div key={`li-${i}`} className="flex gap-2 py-0.5 text-sm">
          <span className="text-muted-foreground mt-1.5 shrink-0">
            &#8226;
          </span>
          <span>{formatInlineCode(line.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)/);
      if (match) {
        elements.push(
          <div key={`ol-${i}`} className="flex gap-2 py-0.5 text-sm">
            <span className="text-muted-foreground shrink-0 font-mono text-xs mt-0.5">
              {match[1]}.
            </span>
            <span>{formatInlineCode(match[2])}</span>
          </div>
        );
      }
    } else if (line.trim() === "") {
      elements.push(<div key={`br-${i}`} className="h-2" />);
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed">
          {formatInlineCode(line)}
        </p>
      );
    }
  }

  return <div>{elements}</div>;
}
