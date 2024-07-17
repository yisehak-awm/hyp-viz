import { Suspense, useEffect, useState } from "react";
import Graph from "./components/Graph";

export default function App() {
  const [data, setData] = useState<any>({
    summary:
      "The graph hypothesizes a connection between the SNP rs1421085 and the phenotype 'obesity'. The SNP is in the gene FTO and is associated with the TAD region chr16_53550000_55450000_grch38. The FTO gene is coexpressed with genes PARP1, PLAAT3, and PPARG, which are all enriched in the GO term 'Regulation Of Adipose Tissue Development', suggesting a potential role in obesity. The SNP is also an eQTL for the FTO gene, further supporting its potential influence on obesity.",
    graph: {
      nodes: [
        {
          id: "ensg00000140718",
          type: "gene",
          name: "FTO",
        },
        {
          id: "chr16:53767042-53767042-T>C",
          type: "snp",
          name: "rs1421085",
        },
        {
          id: "chr16_53550000_55450000_grch38",
          type: "tad",
        },
        {
          id: "GO:1904177",
          type: "go",
          name: "Regulation Of Adipose Tissue Development",
        },
        {
          id: "efo_0001073",
          type: "phenotype",
          name: "obesity",
        },
        {
          id: "ensg00000143799",
          type: "gene",
          name: "PARP1",
        },
        {
          id: "ensg00000176485",
          type: "gene",
          name: "PLAAT3",
        },
        {
          id: "ensg00000132170",
          type: "gene",
          name: "PPARG",
        },
      ],
      edges: [
        {
          source: "chr16:53767042-53767042-T>C",
          target: "ensg00000140718",
          label: "in_tad_with",
        },
        {
          source: "chr16:53767042-53767042-T>C",
          target: "ensg00000140718",
          label: "closest_gene",
        },
        {
          source: "ensg00000140718",
          target: "chr16_53550000_55450000_grch38",
          label: "in_tad_region",
        },
        {
          source: "ensg00000140718",
          target: "chr16_53550000_55450000_grch38",
          label: "in_tad_region",
        },
        {
          source: "chr16:53767042-53767042-T>C",
          target: "ensg00000140718",
          label: "eqtl_association",
        },
        {
          source: "GO:1904177",
          target: "efo_0001073",
          label: "involved_in",
        },
        {
          source: "ensg00000143799",
          target: "GO:1904177",
          label: "enriched_in",
        },
        {
          source: "ensg00000140718",
          target: "ensg00000143799",
          label: "coexpressed_with",
        },
        {
          source: "ensg00000176485",
          target: "GO:1904177",
          label: "enriched_in",
        },
        {
          source: "ensg00000140718",
          target: "ensg00000176485",
          label: "coexpressed_with",
        },
        {
          source: "ensg00000132170",
          target: "GO:1904177",
          label: "enriched_in",
        },
        {
          source: "ensg00000140718",
          target: "ensg00000132170",
          label: "coexpressed_with",
        },
      ],
    },
  });

  useEffect(() => {
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
        <Graph data={data} />
      </Suspense>
    </>
  );
}

export { App };
