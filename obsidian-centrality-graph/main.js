// main.js - Top of the file
// const Graph = require('graphology'); // Or import Graph from 'graphology'; if using ES6 modules
// const { degreeCentrality } = require('graphology-metrics/centrality/degree'); // Or import { degreeCentrality } from 'graphology-metrics/centrality/degree';

// Placeholder for actual library import, will be addressed in packaging/build step
// For now, we'll define dummy objects to allow code structure development.
const Graph = function() {
    this.nodes = {};
    this.edges = [];
    this.addNode = (id, attributes) => { this.nodes[id] = { id, attributes: attributes || {} }; };
    this.addEdge = (source, target, attributes) => { this.edges.push({ source, target, attributes: attributes || {} }); };
    this.forEachNode = (callback) => { Object.values(this.nodes).forEach(node => callback(node.id, node.attributes)); };
    this.getNodeAttribute = (id, attrName) => this.nodes[id] ? this.nodes[id].attributes[attrName] : undefined;
    this.setNodeAttribute = (id, attrName, value) => { if (this.nodes[id]) this.nodes[id].attributes[attrName] = value; };
    // Add other methods if needed by degreeCentrality or other functions
};
const degreeCentrality = {
    assign: (graph) => {
        // Dummy implementation for degree centrality
        // Real implementation would use graphology library
        const degrees = {};
        graph.forEachNode(node => {
            degrees[node] = 0;
        });
        graph.edges.forEach(edge => {
            degrees[edge.source]++;
            degrees[edge.target]++;
        });
        graph.forEachNode(node => {
            graph.setNodeAttribute(node, 'degreeCentrality', degrees[node]);
        });
    }
};

// At the top of main.js, update the obsidian import
const { Plugin, Notice, PluginSettingTab, Setting } = require('obsidian');

module.exports = class GraphCentralityPlugin extends Plugin {
    async onload() {
        console.log('Loading Graph Centrality plugin');

        // Initial graph processing on load (can be made optional later)
        this.graph = this.getSampleGraph(); // Initialize graph for the session
        await this.refreshGraphNodeSizes();

        // Add a ribbon icon
        this.addRibbonIcon('dice', 'Recalculate Graph Centrality', (evt) => {
            // Called when the user clicks the icon.
            new Notice('Recalculating graph centrality...');
            this.refreshGraphNodeSizes();
        });

        // Add a command to the command palette
        this.addCommand({
            id: 'recalculate-graph-centrality',
            name: 'Recalculate graph centrality and resize nodes',
            callback: () => {
                new Notice('Recalculating graph centrality via command...');
                this.refreshGraphNodeSizes();
            }
        });

        // We can add a settings tab later if needed
        // this.addSettingTab(new SampleSettingTab(this.app, this));
    }

    onunload() {
        console.log('Unloading Graph Centrality plugin');
    }

    async refreshGraphNodeSizes() {
        console.log('Refreshing graph node sizes...');
        // If using actual Obsidian API, get current graph here
        // For now, we continue using the sample graph if this.graph is not yet populated
        // or we could re-fetch/re-generate it.
        if (!this.graph) { // Ensure graph is initialized
            this.graph = this.getSampleGraph();
        }

        this.calculateAndStoreDegreeCentrality(this.graph);

        // In a real plugin, ensure the graph view is active and ready
        const obsidianNodes = this.getObsidianGraphNodes();
        this.updateNodeSizes(obsidianNodes);

        new Notice('Graph node sizes updated based on centrality!');
    }

    getObsidianGraphNodes() {
        // MOCK IMPLEMENTATION
        // In a real scenario, this would query the Obsidian workspace/DOM
        // to find graph nodes and their identifiers (e.g., note paths).
        // For now, let's assume it returns an object mapping node ID (from our sample graph)
        // to a dummy DOM element.
        const mockNodes = {};
        if (document && document.body) { // Check if DOM is available (won't be in this environment)
            this.graph.forEachNode(nodeId => {
                // Create a dummy div for each node to simulate a DOM element
                // In reality, we'd select existing elements.
                const dummyEl = document.createElement('div');
                dummyEl.innerText = nodeId; // Store ID for association
                document.body.appendChild(dummyEl); // Append to body for simulation
                mockNodes[nodeId] = dummyEl;
            });
        } else {
            // Fallback if document is not available (e.g. pure node/test environment)
             this.graph.forEachNode(nodeId => {
                mockNodes[nodeId] = {
                    id: nodeId,
                    style: { width: '', height: '', backgroundColor: '', setProperty: function(prop, val) { this[prop] = val; } },
                    dataset: {} // To store original size or other data
                }; // Mock element with a style object
            });
        }
        return mockNodes;
    }

    getSampleGraph() {
        const graph = new Graph();
        // Add some sample nodes
        graph.addNode('node1', { label: 'Node 1' });
        graph.addNode('node2', { label: 'Node 2' });
        graph.addNode('node3', { label: 'Node 3' });
        graph.addNode('node4', { label: 'Node 4' });

        // Add some sample edges
        graph.addEdge('node1', 'node2');
        graph.addEdge('node1', 'node3');
        graph.addEdge('node3', 'node2');
        graph.addEdge('node4', 'node1');

        return graph;
    }

    calculateAndStoreDegreeCentrality(graph) {
        // This will use the (currently mocked) degreeCentrality function
        // In a real scenario, this comes from graphology-metrics
        degreeCentrality.assign(graph); // Modifies the graph in-place

        // Log the results for now
        console.log("Calculated Degree Centrality:");
        graph.forEachNode((node, attributes) => {
            console.log(`Node ${node}: ${attributes.degreeCentrality}`);
        });
    }

    updateNodeSizes(obsidianNodes) {
        console.log("Attempting to update node sizes...");
        const baseSize = 20; // px
        const maxSize = 100; // px
        let minCentrality = Infinity;
        let maxCentrality = -Infinity;

        this.graph.forEachNode(nodeId => {
            const centrality = this.graph.getNodeAttribute(nodeId, 'degreeCentrality');
            if (centrality === undefined) return;
            if (centrality < minCentrality) minCentrality = centrality;
            if (centrality > maxCentrality) maxCentrality = centrality;
        });

        if (minCentrality === maxCentrality) { // Avoid division by zero if all centralities are same
            this.graph.forEachNode(nodeId => {
                const nodeElement = obsidianNodes[nodeId];
                if (nodeElement && nodeElement.style) {
                    const newSize = baseSize + (maxSize - baseSize) / 2; // Default to a medium size
                    // In a real scenario, we'd be more careful about direct style manipulation
                    // and might use CSS classes or Obsidian's rendering engine if possible.
                    nodeElement.style.width = `${newSize}px`;
                    nodeElement.style.height = `${newSize}px`;
                    // A visual cue for testing, remove in actual plugin
                    nodeElement.style.backgroundColor = 'lightblue';
                    console.log(`Node ${nodeId}: applied size ${newSize}px`);
                }
            });
            return;
        }

        this.graph.forEachNode(nodeId => {
            const centrality = this.graph.getNodeAttribute(nodeId, 'degreeCentrality');
            if (centrality === undefined) return;

            const nodeElement = obsidianNodes[nodeId]; // Get the mock DOM element

            if (nodeElement && nodeElement.style) {
                let newSize = baseSize;
                if (maxCentrality > minCentrality) {
                    // Normalize centrality to a 0-1 range
                    const normalizedCentrality = (centrality - minCentrality) / (maxCentrality - minCentrality);
                    newSize = baseSize + (normalizedCentrality * (maxSize - baseSize));
                } else { // Only one node or all have same centrality
                    newSize = baseSize + (maxSize - baseSize) / 2;
                }

                // Apply the new size
                // This is a simplified example. Real DOM manipulation might be more complex.
                nodeElement.style.width = `${newSize}px`;
                nodeElement.style.height = `${newSize}px`;
                // A visual cue for testing
                nodeElement.style.backgroundColor = 'lightblue';
                console.log(`Node ${nodeId} (centrality ${centrality}): applied size ${newSize.toFixed(2)}px`);
            } else {
                console.log(`Node ${nodeId}: corresponding DOM element not found or style property missing.`);
            }
        });
    }
}
