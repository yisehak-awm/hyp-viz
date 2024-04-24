import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import elk from "cytoscape-elk";
import tidytree from "cytoscape-tidytree";

cytoscape.use(tidytree);
cytoscape.use(elk);
cytoscape.use(dagre);

export default ({ elements }: any) => {
  const cyto = useRef();
  const graph = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState("dagre");
  const [edgeStyle, setEdgeStyle] = useState("bezier");

  useEffect(() => {
    if (!cyto.current) return;
    const l = (cyto.current as any).layout({
      name: layout,
      elk: {
        algorithm: "mrtree",
      },
    });

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
      layout: {
        name: "dagre",
        elk: {
          algorithm: "mrtree",
        },
      },
      style: [
        {
          selector: "edge",
          style: {
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "line-color": "#000",
            "target-arrow-color": "#000",
            "arrow-scale": 2,
            width: 2,
          },
        },
        {
          selector: "node",
          style: {
            shape: "round-rectangle",
            label: "data(label)",
            color: "#001929",
            width: "label",
            "text-valign": "center",
            "text-halign": "center",
            "padding-right": "30px",
            "padding-left": "30px",
            "background-color": "#bce3ff",
            "font-size": 20,
            "border-width": 1,
            "border-color": "#5CC0FF",
            "border-style": "solid",
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
          selector: 'node[label="and"]',
          style: {
            shape: "diamond",
            "background-color": "#ffcd2a",
            "border-color": "#ffcd2a",
            color: "#291F00",
          },
        },
        {
          selector: 'node[label="true"]',
          style: {
            shape: "ellipse",
            "background-color": "#9ce2b0",
            "border-color": "#3FCA6B",
            color: "#092010",
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
      <div style={{ position: "absolute", bottom: 0, left: 15 }}>
        <h4>Layouts</h4>
        <ul>
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
                checked={edgeStyle === "taxi"}
                name="edgestyle"
                onClick={() => setEdgeStyle("taxi")}
              />
              Taxi
            </label>
          </li>
        </ul>
      </div>
    </>
  );
};
