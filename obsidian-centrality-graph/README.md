# Obsidian Graph Centrality Plugin (Prototype)

**Current Status: EXPERIMENTAL PROTOTYPE**

This plugin aims to visually represent the centrality of nodes in the Obsidian graph view by adjusting their size. Nodes with higher centrality (e.g., more connections) would appear larger.

**IMPORTANT:** This version is a non-functional prototype for development planning. It currently uses:
*   Mocked graph data instead of your actual Obsidian notes.
*   Mocked centrality calculation (simulating degree centrality).
*   Mocked DOM manipulation (it does not yet interact with the live Obsidian graph).

The core logic for interacting with Obsidian's graph data and visual elements is **not yet implemented**.

## How it (Conceptually) Works

The plugin is designed to:
1.  Access the graph data (nodes and links) from your Obsidian vault.
2.  Calculate a centrality score for each node (initially, degree centrality).
3.  Modify the visual size of each node in the graph view based on its centrality score.

## Features

*   **Ribbon Icon:** Click the "Recalculate Graph Centrality" icon in the left ribbon to trigger the (currently mocked) process.
*   **Command Palette:** Search for "Recalculate graph centrality and resize nodes" to trigger the (currently mocked) process.
*   User notifications when actions are performed.

## Planned Next Steps (for a functional version)

1.  **Real Library Integration:** Integrate a graph theory library like `graphology` and `graphology-metrics` for robust centrality calculations. This will likely require setting up a build process (e.g., Rollup, Webpack) for the plugin.
2.  **Obsidian Graph Data Access:** Implement logic to read the actual graph data from the active Obsidian workspace. This is a challenging step due to the lack of an official API and will likely involve studying techniques used by other Obsidian graph plugins.
3.  **Live Graph Node Styling:** Develop methods to reliably identify and style nodes (e.g., change their size and/or color) in the live Obsidian graph view. This is also challenging and may be prone to breakage with Obsidian updates.
4.  **User Settings:** Add settings for users to choose the centrality metric (degree, betweenness, etc.), customize min/max node sizes, and other preferences.
5.  **Error Handling and Robustness:** Implement comprehensive error handling.

## How to "Install" (for Development Testing of this Prototype)

1.  Ensure you have Obsidian installed.
2.  Navigate to your Obsidian vault's configuration folder: `<YourVault>/.obsidian/`.
3.  Create a folder named `plugins` if it doesn't already exist.
4.  Copy the entire `obsidian-centrality-graph` folder (containing `main.js`, `manifest.json`, `styles.css`, and this `README.md`) into the `plugins` folder.
5.  Restart Obsidian.
6.  Go to Settings -> Community Plugins.
7.  Ensure "Safe mode" is OFF.
8.  You should see "Graph Centrality" in the list of installed community plugins. Enable it.

You will see console logs from the plugin if you open the Obsidian Developer Console (Ctrl+Shift+I or Cmd+Opt+I). The ribbon icon and command will also appear. **Remember, visual changes to the graph will not occur with this prototype version.**

## Contributing

This is currently a conceptual project. Once the foundational challenges with Obsidian API interaction are addressed, contributions would be welcome.
