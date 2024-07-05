import { Suspense, lazy, useEffect, useRef, useState } from "react";
import Graph from "./components/Graph";

export default function App() {
  const [data, setData] = useState<any>({
    nodes: [
      { id: "ensg00000140718", type: "gene" },
      { id: "ensg00000177508", type: "gene" },
      { id: "rs1421085", type: "sequence_variant" },
      { id: "chr16_53550000_55450000_grch38", type: "tad" },
    ],
    edges: [
      {
        source: "rs1421085",
        target: "ensg00000177508",
        label: "in_tad_with",
      },
      {
        source: "rs1421085",
        target: "ensg00000140718",
        label: "closest_gene",
      },
      {
        source: "ensg00000140718",
        target: "chr16_53550000_55450000_grch38",
        label: "in_tad_region",
      },
      {
        source: "ensg00000177508",
        target: "chr16_53550000_55450000_grch38",
        label: "in_tad_region",
      },
      {
        source: "rs1421085",
        target: "ensg00000177508",
        label: "eqtl",
      },
    ],
  });
  const [ele, setEle] = useState<any>(null);

  useEffect(() => {
    if (!data) return;

    var parser = new DOMParser();
    const elements = {
      nodes: data.nodes.map((n: any) => ({
        data: {
          ...n,
          longestText: n.type.length > n.id.length ? n.type : n.id,
        },
      })),
      edges: data.edges.map((e: any) => ({
        data: {
          ...e,
        },
      })),
    };

    setEle(elements);

    const pasteListener = (e: ClipboardEvent) => {
      e.preventDefault();
      const content = e.clipboardData?.getData("text");
      console.log(content);

      const d = JSON.parse(content || "{}") || "";
      console.log(d);
      setData(d);
    };
    addEventListener("paste", pasteListener);
    return () => removeEventListener("paste", pasteListener);
  }, [data]);

  return (
    <>
      <Suspense fallback="Loading modules ...">
        <input
          type="file"
          style={{ position: "absolute", zIndex: 10, top: 15, left: 15 }}
          onChange={function (this: any, e) {
            let fr = new FileReader();
            fr.onload = function () {
              setData(JSON.parse(fr.result?.toString() || "{}"));
            };
            fr.readAsText(e.target.files?.[0] as Blob);
          }}
        />
        <Graph elements={ele} />
      </Suspense>
    </>
  );
}

export { App };
