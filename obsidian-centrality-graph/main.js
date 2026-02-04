var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => GraphCentralityPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var SimpleGraph = class {
  constructor() {
    this.nodes = {};
    this.edges = [];
  }
  addNode(id, attributes) {
    this.nodes[id] = { id, attributes: attributes || {} };
  }
  addEdge(source, target, attributes) {
    this.edges.push({ source, target, attributes: attributes || {} });
  }
  forEachNode(callback) {
    Object.values(this.nodes).forEach((node) => callback(node.id, node.attributes));
  }
  getNodeAttribute(id, attrName) {
    return this.nodes[id] ? this.nodes[id].attributes[attrName] : void 0;
  }
  setNodeAttribute(id, attrName, value) {
    if (this.nodes[id]) {
      this.nodes[id].attributes[attrName] = value;
    }
  }
};
function calculateDegreeCentrality(graph) {
  const degrees = {};
  graph.forEachNode((node) => {
    degrees[node] = 0;
  });
  graph.edges.forEach((edge) => {
    degrees[edge.source]++;
    degrees[edge.target]++;
  });
  graph.forEachNode((node) => {
    graph.setNodeAttribute(node, "degreeCentrality", degrees[node]);
  });
}
var GraphCentralityPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.graph = null;
  }
  async onload() {
    console.log("Loading Graph Centrality plugin");
    this.graph = this.getSampleGraph();
    await this.refreshGraphNodeSizes();
    this.addRibbonIcon("dice", "Recalculate Graph Centrality", () => {
      new import_obsidian.Notice("Recalculating graph centrality...");
      this.refreshGraphNodeSizes();
    });
    this.addCommand({
      id: "recalculate-graph-centrality",
      name: "Recalculate graph centrality and resize nodes",
      callback: () => {
        new import_obsidian.Notice("Recalculating graph centrality via command...");
        this.refreshGraphNodeSizes();
      }
    });
  }
  onunload() {
    console.log("Unloading Graph Centrality plugin");
  }
  async refreshGraphNodeSizes() {
    console.log("Refreshing graph node sizes...");
    if (!this.graph) {
      this.graph = this.getSampleGraph();
    }
    calculateDegreeCentrality(this.graph);
    const obsidianNodes = this.getObsidianGraphNodes();
    this.updateNodeSizes(obsidianNodes);
    new import_obsidian.Notice("Graph node sizes updated based on centrality!");
  }
  getObsidianGraphNodes() {
    const mockNodes = {};
    if (this.graph) {
      this.graph.forEachNode((nodeId) => {
        mockNodes[nodeId] = {
          id: nodeId,
          style: {
            width: "",
            height: "",
            backgroundColor: ""
          }
        };
      });
    }
    return mockNodes;
  }
  getSampleGraph() {
    const graph = new SimpleGraph();
    graph.addNode("node1", { label: "Node 1" });
    graph.addNode("node2", { label: "Node 2" });
    graph.addNode("node3", { label: "Node 3" });
    graph.addNode("node4", { label: "Node 4" });
    graph.addEdge("node1", "node2");
    graph.addEdge("node1", "node3");
    graph.addEdge("node3", "node2");
    graph.addEdge("node4", "node1");
    return graph;
  }
  updateNodeSizes(obsidianNodes) {
    console.log("Attempting to update node sizes...");
    if (!this.graph)
      return;
    const baseSize = 20;
    const maxSize = 100;
    let minCentrality = Infinity;
    let maxCentrality = -Infinity;
    this.graph.forEachNode((nodeId) => {
      const centrality = this.graph.getNodeAttribute(nodeId, "degreeCentrality");
      if (centrality === void 0)
        return;
      if (centrality < minCentrality)
        minCentrality = centrality;
      if (centrality > maxCentrality)
        maxCentrality = centrality;
    });
    this.graph.forEachNode((nodeId) => {
      const centrality = this.graph.getNodeAttribute(nodeId, "degreeCentrality");
      if (centrality === void 0)
        return;
      const nodeElement = obsidianNodes[nodeId];
      if (nodeElement && nodeElement.style) {
        let newSize;
        if (maxCentrality > minCentrality) {
          const normalizedCentrality = (centrality - minCentrality) / (maxCentrality - minCentrality);
          newSize = baseSize + normalizedCentrality * (maxSize - baseSize);
        } else {
          newSize = baseSize + (maxSize - baseSize) / 2;
        }
        nodeElement.style.width = `${newSize}px`;
        nodeElement.style.height = `${newSize}px`;
        nodeElement.style.backgroundColor = "lightblue";
        console.log(`Node ${nodeId} (centrality ${centrality}): applied size ${newSize.toFixed(2)}px`);
      } else {
        console.log(`Node ${nodeId}: corresponding DOM element not found.`);
      }
    });
  }
};
