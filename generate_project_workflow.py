#!/usr/bin/env python3
"""
Helper script to generate workflow diagrams from project_workflow.json
This is a modified version of workflow.py that uses project_workflow.json instead of workflow.json
"""

import json
import os
from graphviz import Digraph
from collections import defaultdict

# ---------- 0. Graphviz Path Handling (Removes need for batch file) ----------
# Check if 'dot' is likely missing from PATH and try to add it programmatically
if "Graphviz" not in os.environ["PATH"]:
    possible_paths = [
        r"C:\Program Files\Graphviz\bin",
        r"C:\Program Files (x86)\Graphviz\bin"
    ]
    for p in possible_paths:
        if os.path.exists(p):
            os.environ["PATH"] += ";" + p
            break

# ---------- 1. Load structured input ----------
input_file = "project_workflow.json"

if not os.path.exists(input_file):
    print(f"Error: {input_file} not found!")
    print("Please run main.py first to generate the workflow JSON.")
    exit(1)

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

meta = data["meta"]
node_types = data["node_types"]
nodes = data["nodes"]
edges = data["edges"]

# ---------- 2. Create graph ----------
# Calculate dynamic size based on number of nodes and layers
num_nodes = len(nodes)
num_layers = len(set(node["layer"] for node in nodes))

# Dynamic height calculation: base height + additional height per layer
base_height = 10  # Increased from 8
height_per_layer = 4  # Increased from 3
calculated_height = base_height + (num_layers * height_per_layer)

# Dynamic width calculation: base width + additional width based on nodes
base_width = 16  # Increased from 12
width_factor = max(1, num_nodes / 10)
calculated_width = base_width + (width_factor * 3)  # Increased multiplier

dot = Digraph(
    name="ProjectWorkflow",
    format="png"
)

# Set global graph attributes with enhanced quality and dynamic sizing
dot.attr(
    rankdir=meta.get("layout", "LR"),  # Left-to-right layout by default
    labelloc="t",
    fontsize="28",  # Larger title font
    fontname="Arial Bold",
    label=meta.get("title", "Project Workflow Diagram"),
    compound="true",
    # High-quality rendering settings
    dpi="300",  # High DPI for crisp, clear output
    size=f"{calculated_width},{calculated_height}!",  # Dynamic size with ! to force it
    ratio="auto",
    # Better spacing for cleaner appearance
    nodesep="2.5",  # Increased horizontal spacing between nodes
    ranksep="3.0",  # Increased vertical spacing between ranks/layers
    # Visual enhancements
    bgcolor="white",
    splines="curved",  # Curved edges for smoother, more professional look
    concentrate="false"  # Don't merge edges
)

# ---------- 3. Group nodes by layer ----------
layers = defaultdict(list)
for node in nodes:
    layers[node["layer"]].append(node)

# ---------- 4. Draw nodes layer by layer ----------
for layer in sorted(layers.keys()):
    with dot.subgraph(name=f"cluster_layer_{layer}") as c:
        # Crucial: Set label to empty string to prevent inheriting the main title
        # and ensure rank="same" keeps them aligned horizontally
        c.attr(rank="same", label="", style="invis") 

        for node in layers[layer]:
            node_style = node_types.get(node["type"], {})
            c.node(
                node["id"],
                node["label"],
                style="filled,rounded",
                shape=node_style.get("shape", "box"),
                fillcolor=node_style.get("color", "lightgray"),
                fontname="Arial Bold",  # Bold font for better visibility
                fontsize="20",  # Larger font for better readability (increased from 16)
                fontcolor="white" if node["type"] in ["external", "output"] else "black",
                penwidth="3.0",  # Thicker borders (increased from 2.5)
                margin="0.6,0.4",  # More padding inside nodes
                height="1.0",  # Taller nodes (increased from 0.8)
                width="3.2"  # Wider nodes (increased from 2.5)
            )

# ---------- 5. Draw edges ----------
node_ids = {n["id"] for n in nodes}

for edge in edges:
    src = edge["from"]
    dst = edge["to"]

    if src in node_ids and dst in node_ids:
        dot.edge(src, dst)

# ---------- 6. Render ----------
try:
    output_path = dot.render(filename="project_workflow_diagram", format="png", cleanup=True, outfile="project_workflow_diagram.png")
    print(f"Successfully generated: {output_path}")
except Exception as e:
    print(f"Error generating diagram: {e}")
    fallback_source = os.path.abspath("project_workflow_diagram")
    fallback_output = os.path.abspath("project_workflow_diagram.png")
    if os.path.exists(fallback_source) and not os.path.exists(fallback_output):
        try:
            import subprocess
            subprocess.run(["dot", "-Tpng", fallback_source, "-o", fallback_output], check=True)
            print(f"Fallback conversion succeeded: {fallback_output}")
        except Exception as fallback_error:
            print(f"Fallback conversion failed: {fallback_error}")
