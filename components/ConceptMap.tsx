import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface NodeData {
  id: string;
  group: number;
  val: number; // Importance (Pareto)
  description?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkData {
  source: string | NodeData;
  target: string | NodeData;
}

const ConceptMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  // Data derived from the PDF (Pareto: Focus on the 5 main groups)
  const nodesRaw: NodeData[] = [
    { id: "Insuficiencia Cardíaca (IC)", group: 1, val: 25, description: "Síndrome clínico central. El corazón no bombea sangre adecuadamente." },
    { id: "Diuréticos", group: 2, val: 10, description: "Reducen precarga y volemia. (Tema 10)" },
    { id: "Inotrópicos +", group: 3, val: 15, description: "Aumentan fuerza de contracción. Útiles si el bombeo es inadecuado." },
    { id: "Vasodilatadores", group: 4, val: 10, description: "Reducen precarga (venosos) o poscarga (arteriales)." },
    { id: "Antiarrítmicos", group: 5, val: 8, description: "Controlan el ritmo cardíaco." },
    { id: "Antitrombóticos", group: 6, val: 8, description: "Previenen trombos." },
    { id: "IECA / ARA-II", group: 4, val: 12, description: "Bloquean eje Renina-Angiotensina. Vasodilatación mixta. Previenen remodelado." },
    { id: "Digoxina", group: 3, val: 8, description: "Glucósido cardíaco. Inotrópico +. Cronotrópico -. Estrecho margen terapéutico." },
    { id: "Beta-bloqueantes", group: 5, val: 10, description: "Inotrópicos y cronotrópicos negativos. Disminuyen demanda de O2." },
    { id: "Nitratos", group: 4, val: 8, description: "Venodilatadores potentes. Transforman en Óxido Nítrico." },
  ];

  const linksRaw: LinkData[] = [
    { source: "Insuficiencia Cardíaca (IC)", target: "Diuréticos" },
    { source: "Insuficiencia Cardíaca (IC)", target: "Inotrópicos +" },
    { source: "Insuficiencia Cardíaca (IC)", target: "Vasodilatadores" },
    { source: "Insuficiencia Cardíaca (IC)", target: "Antiarrítmicos" },
    { source: "Insuficiencia Cardíaca (IC)", target: "Antitrombóticos" },
    { source: "Inotrópicos +", target: "Digoxina" },
    { source: "Vasodilatadores", target: "IECA / ARA-II" },
    { source: "Vasodilatadores", target: "Nitratos" },
    { source: "Insuficiencia Cardíaca (IC)", target: "Beta-bloqueantes" },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    // Clone data to avoid mutation issues on re-renders
    const nodes = JSON.parse(JSON.stringify(nodesRaw));
    const links = JSON.parse(JSON.stringify(linksRaw));

    // Dimensions expanded for better visibility
    const width = 1400; // Increased width
    const height = 900; // Increased height

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "width: 100%; height: 100%; font-family: 'Montserrat', sans-serif;");

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(200)) 
      .force("charge", d3.forceManyBody().strength(-400)) 
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05)) // Weak center pull
      .force("collide", d3.forceCollide().radius((d: any) => d.val * 3 + 25).iterations(3));

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .style("cursor", "grab")
      .call(drag(simulation) as any);

    // Node circles
    node.append("circle")
      .attr("r", (d: any) => d.val * 2.8)
      .attr("fill", (d: any) => {
         const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
         return colors[d.group % colors.length];
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("class", "transition-all hover:opacity-90")
      .on("click", (event, d) => {
        // Prevent click when dragging
        if (event.defaultPrevented) return;
        setSelectedNode(d as NodeData);
      });

    // Shadow/Outline Text (Background)
    node.append("text")
      .text((d: any) => d.id)
      .attr("x", 0)
      .attr("y", (d: any) => -d.val * 2.8 - 12) 
      .attr("text-anchor", "middle")
      .style("font-family", "'Montserrat', sans-serif")
      .style("font-size", "14px")
      .style("font-weight", "900")
      .attr("stroke", "black")
      .attr("stroke-width", 5) 
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("fill", "none")
      .style("pointer-events", "none");

    // Main Text (Foreground)
    node.append("text")
      .text((d: any) => d.id)
      .attr("x", 0)
      .attr("y", (d: any) => -d.val * 2.8 - 12)
      .attr("text-anchor", "middle")
      .style("font-family", "'Montserrat', sans-serif")
      .style("font-size", "14px")
      .style("font-weight", "700")
      .attr("fill", "white")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      // Bounding box to ensure everything stays visible within the expanded view
      // Only apply to nodes that aren't currently being dragged (though drag handles fx)
      nodes.forEach((d: any) => {
        const r = d.val * 2.8;
        const padding = 20; 
        
        // If the node is not fixed (dragging sets fx), we clamp x. 
        // If it IS fixed, the drag handler clamps fx, so the simulation respects it.
        // We update x/y just in case for bounds check if forces push it out.
        if (d.x < r + padding) d.x = r + padding;
        if (d.x > width - r - padding) d.x = width - r - padding;
        if (d.y < r + padding) d.y = r + padding;
        if (d.y > height - r - padding) d.y = height - r - padding;
      });

      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
        d3.select(event.sourceEvent.target).style("cursor", "grabbing");
      }

      function dragged(event: any) {
        // Strict containment
        const r = event.subject.val * 2.8;
        const padding = 20;
        
        event.subject.fx = Math.max(r + padding, Math.min(width - r - padding, event.x));
        event.subject.fy = Math.max(r + padding, Math.min(height - r - padding, event.y));
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        // KEY CHANGE: Do not set fx/fy to null. This keeps the node "anchored" to where the user dropped it.
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
        d3.select(event.sourceEvent.target).style("cursor", "grab");
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e2e] relative">
      {/* Floating Controls / Info - Minimized */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <span className="text-[10px] text-white/30 uppercase tracking-widest bg-black/20 px-2 py-1 rounded">
          Lienzo Libre
        </span>
      </div>

      <div className="flex-1 w-full h-full overflow-hidden">
        <svg ref={svgRef} className="w-full h-full block touch-none"></svg>
        
        {/* Info Panel Overlay */}
        {selectedNode && (
          <div className="absolute bottom-6 left-6 max-w-sm bg-white p-5 rounded-2xl shadow-2xl border-l-8 border-purple-500 animate-fade-in-up z-20">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-black text-purple-900 mb-1 leading-tight">{selectedNode.id}</h3>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-800 font-bold ml-4"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700 text-sm mt-1">{selectedNode.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptMap;