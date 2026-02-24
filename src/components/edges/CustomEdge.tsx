import React, { useState } from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
    EdgeProps,
} from "reactflow";
import { X } from "lucide-react";

export function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    style = {},
}: EdgeProps) {
    const { setEdges } = useReactFlow();
    const [hovered, setHovered] = useState(false);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
    });

    const onDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEdges((eds) => eds.filter((edge) => edge.id !== id));
    };

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: "#6366f1",
                    strokeWidth: 2,
                }}
                interactionWidth={20}
            />

            {/* Midpoint Dot & Delete Button */}
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: "all",
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="nodrag nopan"
                >
                    <div
                        className="transition-all duration-200"
                        style={{
                            width: hovered ? 16 : 10,
                            height: hovered ? 16 : 10,
                            borderRadius: "50%",
                            background: hovered ? "#ef4444" : "#0ea5e9",
                            border: "2px solid #fff",
                            boxShadow: hovered
                                ? "0 0 10px rgba(239,68,68,0.5)"
                                : "0 0 0 2px rgba(14,165,233,0.35)",
                            cursor: "pointer",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {hovered && (
                            <button
                                onClick={onDelete}
                                className="flex items-center justify-center text-white transition-opacity duration-200"
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    padding: 0,
                                    cursor: "pointer",
                                }}
                                title="Delete Edge"
                            >
                                <X size={10} strokeWidth={3} />
                            </button>
                        )}
                    </div>
                </div>
            </EdgeLabelRenderer>

            {/* Invisible hover area for the path */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                className="react-flow__edge-interaction cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            />
        </>
    );
}
