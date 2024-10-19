import React, { Component } from "react";
import Node from "./Node/Node";
import { djikstra, getNodesInShortestPathOrder } from "../algorithms/djiskstra";
import "./PathTracer.css";
import "../Navigation/Nav.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathTracer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      pathLength: null, // Add pathLength to the state
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDjikstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
          const pathLength = nodesInShortestPathOrder.length - 1; // Calculate the path length
          this.setState({ pathLength }); // Update pathLength in state
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isFinish) { // Check to skip start and finish nodes
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isFinish) { // Check to skip start and finish nodes
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
      }, 50 * i);
    }
  }

  visualizeDjikstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = djikstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDjikstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  resetGrid = () => {
    window.location.reload();
  };

  render() {
    const { grid, mouseIsPressed, pathLength } = this.state;
    document.title = `WAY FINDER APP`;
    return (
      <>
        <div className="navbar">
          <div className="header">
            <a href="/" className="logo name">
              Path Tracer
            </a>
            <div className="header-right">
              <button onClick={() => this.visualizeDjikstra()} className="btn">
                Display Dijkstra
              </button>
              <div className="dropdown">
                <button className="dropbtn">
                  All About Dijkstra
                  <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <a
                    href="https://www.w3schools.com/dsa/dsa_algo_graphs_dijkstra.php"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Dijkstra
                  </a>
                  <a
                    href="https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Def. and Example
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=V6H1qAeB-l4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explanation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem 0",
          }}
        >
          <div
            style={{
              paddingRight: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="node node-start"></div>
            <div style={{ paddingLeft: "5px" }}> START</div>
          </div>

          <div
            style={{
              paddingRight: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="node node-finish"></div>
            <div style={{ paddingLeft: "5px" }}> END</div>
          </div>

          <div
            style={{
              paddingRight: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="node node-wall"></div>
            <div style={{ paddingLeft: "5px" }}> WALL</div>
          </div>

          <div
            style={{
              paddingRight: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button className="btn1" onClick={this.resetGrid}>RESET</button>
          </div>
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Display Path Length */}
        {pathLength !== null && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <h3>Least Cost required to move from Source to Destination: {pathLength}</h3>
          </div>
        )}
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 16; row++) {
    const currentRow = [];
    for (let col = 0; col < 45; col++) currentRow.push(createNode(col, row));
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
