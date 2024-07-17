import { useEffect, useMemo, useRef, useState } from "react";
import cytoscape from "cytoscape";
import elk from "cytoscape-elk";
import nodeHtmlLabel from "cytoscape-node-html-label";

cytoscape.use(elk);
cytoscape.use(nodeHtmlLabel);

const LAYOUT = {
  name: "elk",
  elk: {
    algorithm: "layered",
    "elk.direction": "RIGHT",
    "elk.alignment": "RIGHT",
    "nodePlacement.strategy": "LINEAR_SEGMENTS",
    "spacing.nodeNode": 100,
    "spacing.nodeNodeBetweenLayers": 200,
    "wrapping.strategy": "SINGLE_EDGE",
  },
};

export default ({ data }: any) => {
  const cyto = useRef();
  const graph = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState("dagre");
  const [edgeStyle, setEdgeStyle] = useState("bezier");

  const elements = useMemo(() => {
    if (!data) return;

    const elements = {
      nodes: data.graph.nodes.map((n: any) => ({
        data: {
          ...n,
          type: n.type.toLowerCase(),
          longestText: n.type.length > n.id.length ? n.type : n.id,
        },
      })),
      edges: data.graph.edges.map((e: any) => ({
        data: {
          ...e,
        },
      })),
    };

    // add a parent node for coexpressed nodes
    elements.nodes.push({
      data: {
        id: "parent",
        type: "parent",
      },
    });

    const genes = elements.edges.reduce((acc, e) => {
      if (e.data.label === "coexpressed_with") {
        return [...acc, e.data.target];
      }
      return acc;
    }, []);

    elements.nodes = elements.nodes.map((n) => {
      return {
        ...n,
        data: {
          ...n.data,
          parent: genes.includes(n.data.id) ? "parent" : null,
        },
      };
    });

    elements.edges = elements.edges.map((e) => {
      if (e.data.label === "coexpressed_with") {
        return { ...e, data: { ...e.data, target: "parent" } };
      }
      if (e.data.label === "enriched_in") {
        return { ...e, data: { ...e.data, source: "parent" } };
      }
      return e;
    });

    elements.edges = elements.edges.map((e) => {
      if (e.data.label === "coexpressed_with") {
        return { ...e, data: { ...e.data, target: "parent" } };
      }
      if (e.data.label === "enriched_in") {
        return { ...e, data: { ...e.data, source: "parent" } };
      }
      return e;
    });

    elements.edges = elements.edges.reduce((acc, e) => {
      if (
        e.data.label === "coexpressed_with" &&
        acc.find((a) => a.data.label === "coexpressed_with")
      ) {
        return acc;
      }
      if (
        e.data.label === "enriched_in" &&
        acc.find((a) => a.data.label === "enriched_in")
      ) {
        return acc;
      }
      return [...acc, e];
    }, []);

    return elements;
  }, [data]);

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
            "font-size": "10px",
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
            "background-color": "#FCF5ED",
            "border-color": "#E6AA68",
            color: "#FCF5ED",
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
          selector: 'node[type="parent"]',
          label: "",
          style: {
            "background-color": "#fff",
            "border-color": "#ccc",
            "border-width": 1,
            "border-style": "dashed",
            color: "#dffae6",
            opacity: 1,
          },
        },
        {
          selector: 'node[type="phenotype"]',
          style: {
            "background-color": "#faedf4",
            "border-color": "#DC0073",
            color: "#faedf4",
          },
        },
        {
          selector: 'node[type="go"]',
          style: {
            "background-color": "#FDFBC4",
            "border-color": "#D7CF07",
            color: "#FDFBC4",
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
            if (data.type === "parent") return ``;
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
