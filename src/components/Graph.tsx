import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import elk from "cytoscape-elk";
import tidytree from "cytoscape-tidytree";
import klay from "cytoscape-klay";
import nodeHtmlLabel from "cytoscape-node-html-label";

cytoscape.use(tidytree);
cytoscape.use(elk);
cytoscape.use(dagre);
cytoscape.use(klay);
cytoscape.use(nodeHtmlLabel);

const LAYOUT = {
  name: "klay",
  elk: {
    algorithm: "mrtree",
  },
  klay: {
    nodePlacement: "LINEAR_SEGMENTS",
    spacing: 200,
  },
};

export default ({ elements }: any) => {
  const cyto = useRef();
  const graph = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState("klay");
  const [edgeStyle, setEdgeStyle] = useState("bezier");

  useEffect(() => {
    if (!cyto.current) return;
    const l = (cyto.current as any).layout({ ...LAYOUT, name: layout });

    (cyto.current as any)
      .style()
      .selector("edge")
      .style("curve-style", edgeStyle)
      .update();

    l.run();
  }, [edgeStyle, layout]);

  useEffect(() => {
    if (!graph.current || !elements) return;
    cyto.current = cytoscape({
      elements,
      container: graph.current,
      layout: LAYOUT,
      style: [
        {
          selector: "edge",
          style: {
            "target-arrow-shape": "chevron",
            "target-arrow-width": "match-line",
            "arrow-scale": 2,
            "curve-style": "bezier",
            "line-color": "#DDD",
            "target-arrow-color": "#DDD",
            width: 2,
            label: "data(label)",
            "text-outline-color": "#fff",
            "text-outline-width": 10,
            "taxi-direction": "vertical",
            "font-family": "monospace",
          },
        },
        {
          selector: "node",
          style: {
            shape: "round-rectangle",
            label: "data(longestText)",
            color: "#D6EEFF",
            width: "label",

            "text-valign": "center",
            "text-halign": "center",
            "padding-right": "30px",
            "padding-left": "30px",
            "background-color": "#D6EEFF",
            "border-width": 1,
            "border-color": "#5CC0FF",
            "border-style": "solid",
            "font-family": "monospace",
            "font-size": "12px",
          },
        },

        {
          selector: 'node[label*="=>"]',
          style: {
            "background-color": "#e4ccff",
            "border-color": "#BC85FF",
            color: "#1C003D",
          },
        },
        {
          selector: 'node[type="tad"]',
          style: {
            "background-color": "#FFF5D6",
            "border-color": "#ffcd2a",
            color: "#FFF5D6",
          },
        },
        {
          selector: 'node[type="gene"]',
          style: {
            "background-color": "#dffae6",
            "border-color": "#3FCA6B",
            color: "#dffae6",
          },
        },
        {
          selector: 'node[label="false"]',
          style: {
            shape: "ellipse",
            "background-color": "#ffb8b3",
            "border-color": "#ff9790",
            color: "#3D0300",
          },
        },
      ],
    });

    if (cyto.current)
      cyto.current?.nodeHtmlLabel([
        {
          query: "node",
          halign: "center",
          valign: "center",
          halignBox: "center",
          valignBox: "center",
          cssClass: "",
          tpl(data) {
            return `<div class="node_wrapper ${data.type}">
              <p class="type">${data.type.toUpperCase()}</p>
              <p class="${data.type}" class="id">${data.id}</p>
            <div>`;
          },
        },
      ]);
  }, [elements]);

  return (
    <>
      <div
        ref={graph}
        style={{
          height: "100vh",
          width: "100vw",
        }}
      ></div>
      {/* <div style={{ position: "absolute", bottom: 0, left: 15 }}>
        <h4>Layouts</h4>
        <ul>
          <li>
            <label>
              <input
                type="radio"
                checked={layout === "klay"}
                name="layout"
                onClick={() => setLayout("klay")}
              />
              Klay
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                checked={layout === "dagre"}
                name="layout"
                onClick={() => setLayout("dagre")}
              />
              Dagre
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                checked={layout === "elk"}
                name="layout"
                onClick={() => setLayout("elk")}
              />
              Elk
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                checked={layout === "tidytree"}
                name="layout"
                onClick={() => setLayout("tidytree")}
              />
              Tidytree
            </label>
          </li>
        </ul>
        <h4>Edge styles</h4>
        <ul>
          <li>
            <label>
              <input
                type="radio"
                checked={edgeStyle === "bezier"}
                name="edgestyle"
                onClick={() => setEdgeStyle("bezier")}
              />
              Bezier
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                checked={edgeStyle === "round-taxi"}
                name="edgestyle"
                onClick={() => setEdgeStyle("round-taxi")}
              />
              round-taxi
            </label>
          </li>
        </ul>
      </div> */}
    </>
  );
};
