import { Plugin, Notice } from 'obsidian';

// Simple Graph implementation for degree centrality calculation
class SimpleGraph {
    nodes: Record<string, { id: string; attributes: Record<string, unknown> }> = {};
    edges: Array<{ source: string; target: string; attributes: Record<string, unknown> }> = [];

    addNode(id: string, attributes?: Record<string, unknown>): void {
        this.nodes[id] = { id, attributes: attributes || {} };
    }

    addEdge(source: string, target: string, attributes?: Record<string, unknown>): void {
        this.edges.push({ source, target, attributes: attributes || {} });
    }

    forEachNode(callback: (nodeId: string, attributes: Record<string, unknown>) => void): void {
        Object.values(this.nodes).forEach(node => callback(node.id, node.attributes));
    }

    getNodeAttribute(id: string, attrName: string): unknown {
        return this.nodes[id] ? this.nodes[id].attributes[attrName] : undefined;
    }

    setNodeAttribute(id: string, attrName: string, value: unknown): void {
        if (this.nodes[id]) {
            this.nodes[id].attributes[attrName] = value;
        }
    }
}

// Degree centrality calculation
function calculateDegreeCentrality(graph: SimpleGraph): void {
    const degrees: Record<string, number> = {};

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

interface MockNodeElement {
    id: string;
    style: {
        width: string;
        height: string;
        backgroundColor: string;
    };
}

export default class GraphCentralityPlugin extends Plugin {
    graph: SimpleGraph | null = null;

    async onload(): Promise<void> {
        console.log('Loading Graph Centrality plugin');

        // Initialize graph
        this.graph = this.getSampleGraph();
        await this.refreshGraphNodeSizes();

        // Add a ribbon icon
        this.addRibbonIcon('dice', 'Recalculate Graph Centrality', () => {
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
    }

    onunload(): void {
        console.log('Unloading Graph Centrality plugin');
    }

    async refreshGraphNodeSizes(): Promise<void> {
        console.log('Refreshing graph node sizes...');

        if (!this.graph) {
            this.graph = this.getSampleGraph();
        }

        calculateDegreeCentrality(this.graph);

        const obsidianNodes = this.getObsidianGraphNodes();
        this.updateNodeSizes(obsidianNodes);

        new Notice('Graph node sizes updated based on centrality!');
    }

    getObsidianGraphNodes(): Record<string, MockNodeElement> {
        // Mock implementation - returns simulated DOM elements
        const mockNodes: Record<string, MockNodeElement> = {};

        if (this.graph) {
            this.graph.forEachNode(nodeId => {
                mockNodes[nodeId] = {
                    id: nodeId,
                    style: {
                        width: '',
                        height: '',
                        backgroundColor: ''
                    }
                };
            });
        }

        return mockNodes;
    }

    getSampleGraph(): SimpleGraph {
        const graph = new SimpleGraph();

        // Add sample nodes
        graph.addNode('node1', { label: 'Node 1' });
        graph.addNode('node2', { label: 'Node 2' });
        graph.addNode('node3', { label: 'Node 3' });
        graph.addNode('node4', { label: 'Node 4' });

        // Add sample edges
        graph.addEdge('node1', 'node2');
        graph.addEdge('node1', 'node3');
        graph.addEdge('node3', 'node2');
        graph.addEdge('node4', 'node1');

        return graph;
    }

    updateNodeSizes(obsidianNodes: Record<string, MockNodeElement>): void {
        console.log("Attempting to update node sizes...");

        if (!this.graph) return;

        const baseSize = 20;
        const maxSize = 100;
        let minCentrality = Infinity;
        let maxCentrality = -Infinity;

        this.graph.forEachNode(nodeId => {
            const centrality = this.graph!.getNodeAttribute(nodeId, 'degreeCentrality') as number;
            if (centrality === undefined) return;
            if (centrality < minCentrality) minCentrality = centrality;
            if (centrality > maxCentrality) maxCentrality = centrality;
        });

        this.graph.forEachNode(nodeId => {
            const centrality = this.graph!.getNodeAttribute(nodeId, 'degreeCentrality') as number;
            if (centrality === undefined) return;

            const nodeElement = obsidianNodes[nodeId];

            if (nodeElement && nodeElement.style) {
                let newSize: number;

                if (maxCentrality > minCentrality) {
                    const normalizedCentrality = (centrality - minCentrality) / (maxCentrality - minCentrality);
                    newSize = baseSize + (normalizedCentrality * (maxSize - baseSize));
                } else {
                    newSize = baseSize + (maxSize - baseSize) / 2;
                }

                nodeElement.style.width = `${newSize}px`;
                nodeElement.style.height = `${newSize}px`;
                nodeElement.style.backgroundColor = 'lightblue';
                console.log(`Node ${nodeId} (centrality ${centrality}): applied size ${newSize.toFixed(2)}px`);
            } else {
                console.log(`Node ${nodeId}: corresponding DOM element not found.`);
            }
        });
    }
}
