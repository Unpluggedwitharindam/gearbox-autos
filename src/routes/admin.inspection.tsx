import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/inspection")({
  head: () => ({
    meta: [
      { title: "Car Inspection Tool — Admin | Gearbox Autos" },
      {
        name: "description",
        content:
          "Run the Gearbox Autos verified car inspection checklist and export the inspection report as a PDF.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "/admin/inspection" }],
  }),
  component: InspectionTool,
});

function InspectionTool() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold">Verified Car Inspection Tool</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete the inspection checklist and export the branded report.
          </p>
        </div>
        <a
          href="/inspection-tool.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 hover:bg-card"
        >
          <ExternalLink className="h-4 w-4" /> Open full screen
        </a>
      </div>
      <div className="surface overflow-hidden">
        <iframe
          src="/inspection-tool.html"
          title="Gearbox Autos car inspection tool"
          className="w-full h-[80vh] border-0 bg-background"
        />
      </div>
    </div>
  );
}
