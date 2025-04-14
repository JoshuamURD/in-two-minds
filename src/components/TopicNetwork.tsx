import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TopicNode {
  id: string;
  group: number;
}

interface TopicLink {
  source: string;
  target: string;
  value: number;
}

interface TopicNetworkProps {
  topics: string[];
  connections: { source: string; target: string }[];
}

const TopicNetwork = ({ topics, connections }: TopicNetworkProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Convert data to D3 format
    const nodes: TopicNode[] = topics.map((topic, i) => ({
      id: topic,
      group: Math.floor(i / 5) // Simple grouping, can be made more meaningful
    }));

    const links: TopicLink[] = connections.map(conn => ({
      source: conn.source,
      target: conn.target,
      value: 1
    }));

    // Set up the force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(30))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(400, 300))
      .force("collision", d3.forceCollide().radius(20));

    // Create SVG elements
    const svg = d3.select(svgRef.current);
    
    // Add zoom behavior
    const g = svg.append("g");
    svg.call(d3.zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any);

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#4B5563") // darker gray for better visibility
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 2);

    // Create nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles to nodes
    node.append("circle")
      .attr("r", 6)
      .attr("fill", d => `hsl(${d.group * 60}, 70%, 60%)`)
      .attr("stroke", "#1F2937")
      .attr("stroke-width", 2);

    // Add labels to nodes
    node.append("text")
      .text(d => d.id)
      .attr("x", 10)
      .attr("y", 4)
      .attr("class", "font-mono text-xs fill-current text-gray-700 dark:text-gray-300");

    // Add hover effects
    node
      .on("mouseover", function() {
        d3.select(this).select("circle").transition()
          .duration(200)
          .attr("r", 8)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function() {
        d3.select(this).select("circle").transition()
          .duration(200)
          .attr("r", 6)
          .attr("stroke-width", 2);
      })
      .on("click", (event, d) => {
        // Navigate to topic page
        window.location.href = `/topics/${d.id.toLowerCase()}`;
      });

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [topics, connections]);

  return (
    <div className="w-full h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default TopicNetwork; 