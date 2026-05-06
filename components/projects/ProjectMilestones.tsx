"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Milestone {
    title: string;
    description?: string;
    targetDate: string;
    completed: boolean;
    completedAt?: string;
}

interface ProjectMilestonesProps {
    milestones: Milestone[];
    accentColor?: string;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ProjectMilestones({ milestones, accentColor = "#ffffff" }: ProjectMilestonesProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    if (!milestones || milestones.length === 0) return null;

    // Determine "current" milestone — first incomplete after last completed
    const lastCompletedIdx = milestones.reduce((last, m, i) => m.completed ? i : last, -1);
    const currentIdx = lastCompletedIdx < milestones.length - 1 ? lastCompletedIdx + 1 : -1;

    return (
        <div ref={ref}>
            {/* Desktop: horizontal timeline */}
            <div className="hidden md:block overflow-x-auto pb-4">
                <div className="flex items-start min-w-max px-2">
                    {milestones.map((milestone, i) => {
                        const isCompleted = milestone.completed;
                        const isCurrent   = i === currentIdx;
                        const isUpcoming  = !isCompleted && !isCurrent;
                        const isLast      = i === milestones.length - 1;

                        return (
                            <div key={i} className="flex items-start">
                                {/* Milestone node + label */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.45, delay: i * 0.09 }}
                                    className="flex flex-col items-center w-44"
                                >
                                    {/* Circle node */}
                                    <div className="relative mb-3">
                                        {isCurrent && (
                                            <span
                                                className="absolute inset-0 rounded-full animate-ping opacity-30"
                                                style={{ backgroundColor: accentColor }}
                                            />
                                        )}
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                                                isCompleted ? "border-0" : isCurrent ? "border-2" : "border-white/20"
                                            }`}
                                            style={{
                                                backgroundColor: isCompleted ? accentColor : "transparent",
                                                borderColor: isCurrent ? accentColor : undefined,
                                            }}
                                        >
                                            {isCompleted && (
                                                <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <p
                                        className="text-[10px] font-bold tracking-wider uppercase mb-1 text-center"
                                        style={{ color: isCompleted ? accentColor : isCurrent ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }}
                                    >
                                        {formatDate(milestone.targetDate)}
                                    </p>

                                    {/* Title */}
                                    <p
                                        className="text-xs text-center leading-snug px-2"
                                        style={{ color: isCompleted ? "rgba(255,255,255,0.9)" : isCurrent ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}
                                    >
                                        {milestone.title}
                                    </p>

                                    {/* Status label */}
                                    {isCurrent && (
                                        <span
                                            className="mt-2 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] uppercase rounded-full"
                                            style={{ backgroundColor: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
                                        >
                                            In Progress
                                        </span>
                                    )}
                                    {isCompleted && (
                                        <span className="mt-2 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                                            Complete
                                        </span>
                                    )}
                                </motion.div>

                                {/* Connector line between nodes */}
                                {!isLast && (
                                    <div className="flex items-start pt-2 w-8 shrink-0">
                                        <div
                                            className="w-full h-[2px] mt-[7px] transition-all duration-700"
                                            style={{
                                                backgroundColor: isCompleted ? accentColor : "rgba(255,255,255,0.08)",
                                                backgroundImage: isUpcoming ? "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 4px, transparent 4px, transparent 8px)" : undefined,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile: vertical timeline */}
            <div className="md:hidden space-y-0">
                {milestones.map((milestone, i) => {
                    const isCompleted = milestone.completed;
                    const isCurrent   = i === currentIdx;
                    const isLast      = i === milestones.length - 1;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="flex gap-4"
                        >
                            {/* Left: dot + vertical line */}
                            <div className="flex flex-col items-center">
                                <div className="relative mt-0.5">
                                    {isCurrent && (
                                        <span
                                            className="absolute inset-0 rounded-full animate-ping opacity-30"
                                            style={{ backgroundColor: accentColor }}
                                        />
                                    )}
                                    <div
                                        className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                                        style={{
                                            backgroundColor: isCompleted ? accentColor : "transparent",
                                            borderColor: isCompleted ? accentColor : isCurrent ? accentColor : "rgba(255,255,255,0.15)",
                                        }}
                                    >
                                        {isCompleted && (
                                            <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                {!isLast && (
                                    <div
                                        className="w-[2px] flex-1 mt-1 mb-1"
                                        style={{
                                            backgroundColor: isCompleted ? `${accentColor}60` : "rgba(255,255,255,0.06)",
                                            minHeight: "32px",
                                        }}
                                    />
                                )}
                            </div>

                            {/* Right: content */}
                            <div className="pb-6 flex-1">
                                <p
                                    className="text-[10px] font-bold tracking-wider uppercase mb-0.5"
                                    style={{ color: isCompleted ? accentColor : isCurrent ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}
                                >
                                    {formatDate(milestone.targetDate)}
                                </p>
                                <p
                                    className="text-sm leading-snug"
                                    style={{ color: isCompleted ? "rgba(255,255,255,0.9)" : isCurrent ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.28)" }}
                                >
                                    {milestone.title}
                                </p>
                                {milestone.description && (
                                    <p className="text-xs text-white/30 mt-1 leading-relaxed">{milestone.description}</p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
