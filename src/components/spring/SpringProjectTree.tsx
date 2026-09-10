// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: src/components/spring/SpringProjectTree.tsx
// DATE: 2026-08-31
// =====================================================

export interface SpringProjectNode {
    name: string;
    type: "file" | "folder";
    children?: SpringProjectNode[];
  }
  
  interface Props {
    nodes: SpringProjectNode[];
    onSelect?: (
      node: SpringProjectNode,
    ) => void;
  }
  
  export default function SpringProjectTree({
    nodes,
    onSelect,
  }: Props) {
    return (
      <div className="wt-spring-project-tree">
        {nodes.map((node) => (
          <TreeNode
            key={node.name}
            node={node}
            level={0}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }
  
  function TreeNode({
    node,
    level,
    onSelect,
  }: {
    node: SpringProjectNode;
    level: number;
    onSelect?: (
      node: SpringProjectNode,
    ) => void;
  }) {
    return (
      <div>
        <button
          type="button"
          className="wt-spring-node"
          style={{
            paddingLeft:
              `${12 + level * 18}px`,
          }}
          onClick={() =>
            onSelect?.(node)
          }
        >
          {node.type === "folder"
            ? "▸"
            : "•"}{" "}
          {node.name}
        </button>
  
        {node.children?.map(
          (child) => (
            <TreeNode
              key={`${node.name}/${child.name}`}
              node={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ),
        )}
      </div>
    );
  }