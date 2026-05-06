"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject, postProjectYield, toggleMilestoneCompleted } from "@/app/admin/actions/projects";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tranche {
    name: string;
    badge: string;
    minimumAmount: number;
    maximumAmount: number | null;
    yieldLow: number;
    yieldHigh: number | null;
    spotsTotal: number;
    spotsFilled: number;
    isCustomTerms: boolean;
}

interface Milestone {
    title: string;
    description: string;
    targetDate: string;
    completed: boolean;
}

interface ProjectDoc {
    label: string;
    url: string;
}

interface StakeRow {
    _id: string;
    trancheName: string;
    investedAmount: number;
    currentPnL: number;
    status: string;
    investedAt: string;
    userId: { firstName: string; lastName: string; email: string; country: string } | null;
}

interface ProjectEditorTabsProps {
    mode: "create" | "edit";
    projectId?: string;
    initialData?: any;
    stakes?: StakeRow[];
}

// ─── Shared Styles ────────────────────────────────────────────────────────────

const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/25 transition-colors duration-200";
const labelClass = "block text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-1.5";
const selectClass = "w-full bg-[#111] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25 transition-colors duration-200 cursor-pointer";

const TABS = ["Core", "Financials", "Tranches", "Milestones", "Yield Posting", "Investors"] as const;
type Tab = typeof TABS[number];

const DEFAULT_TRANCHE: Tranche = { name: "", badge: "", minimumAmount: 1000, maximumAmount: null, yieldLow: 10, yieldHigh: null, spotsTotal: 100, spotsFilled: 0, isCustomTerms: false };
const DEFAULT_MILESTONE: Milestone = { title: "", description: "", targetDate: "", completed: false };
const DEFAULT_DOC: ProjectDoc = { label: "", url: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProjectEditorTabs({ mode, projectId, initialData, stakes = [] }: ProjectEditorTabsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<Tab>("Core");
    const [feedback, setFeedback] = useState<{ message: string; ok: boolean } | null>(null);

    // ── Core Fields ──
    const [name, setName]               = useState(initialData?.name ?? "");
    const [company, setCompany]         = useState(initialData?.company ?? "SpaceX");
    const [slug, setSlug]               = useState(initialData?.slug ?? "");
    const [tagline, setTagline]         = useState(initialData?.tagline ?? "");
    const [heroImage, setHeroImage]     = useState(initialData?.heroImage ?? "");
    const [heroBgColor, setHeroBgColor] = useState(initialData?.heroBgColor ?? "#000000");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [highlights, setHighlights]   = useState<string[]>(initialData?.highlights ?? ["", "", ""]);
    const [status, setStatus]           = useState(initialData?.status ?? "upcoming");
    const [isActive, setIsActive]       = useState(initialData?.isActive ?? true);
    const [isFeatured, setIsFeatured]   = useState(initialData?.isFeatured ?? false);

    // ── Financial Fields ──
    const [totalRaiseTarget, setTotalRaiseTarget] = useState(initialData?.totalRaiseTarget ?? 0);
    const [currentRaised, setCurrentRaised]       = useState(initialData?.currentRaised ?? 0);
    const [investorCount, setInvestorCount]       = useState(initialData?.investorCount ?? 0);
    const [launchDate, setLaunchDate]             = useState(initialData?.launchDate ? initialData.launchDate.slice(0, 10) : "");
    const [closeDate, setCloseDate]               = useState(initialData?.closeDate ? initialData.closeDate.slice(0, 10) : "");
    const [expectedYieldLow, setExpectedYieldLow] = useState(initialData?.expectedYieldLow ?? 0);
    const [expectedYieldHigh, setExpectedYieldHigh] = useState(initialData?.expectedYieldHigh ?? "");
    const [yieldType, setYieldType]               = useState(initialData?.yieldType ?? "annual_percent");
    const [yieldCycle, setYieldCycle]             = useState(initialData?.yieldCycle ?? "");
    const [riskLevel, setRiskLevel]               = useState(initialData?.riskLevel ?? "high");

    // ── Tranches ──
    const [tranches, setTranches] = useState<Tranche[]>(
        initialData?.tranches?.length > 0
            ? initialData.tranches
            : [
                { name: "Explorer", badge: "Entry", minimumAmount: 1000, maximumAmount: 9999, yieldLow: 15, yieldHigh: 25, spotsTotal: 500, spotsFilled: 0, isCustomTerms: false },
                { name: "Pioneer",  badge: "Popular", minimumAmount: 10000, maximumAmount: 99999, yieldLow: 25, yieldHigh: 45, spotsTotal: 200, spotsFilled: 0, isCustomTerms: false },
                { name: "Visionary",badge: "Exclusive", minimumAmount: 100000, maximumAmount: null, yieldLow: 45, yieldHigh: null, spotsTotal: 50, spotsFilled: 0, isCustomTerms: true },
              ]
    );

    // ── Milestones ──
    const [milestones, setMilestones] = useState<Milestone[]>(
        initialData?.milestones?.length > 0
            ? initialData.milestones.map((m: any) => ({
                ...m,
                targetDate: m.targetDate ? m.targetDate.slice(0, 10) : "",
              }))
            : [{ ...DEFAULT_MILESTONE }]
    );

    // ── Documents ──
    const [documents, setDocuments] = useState<ProjectDoc[]>(
        initialData?.documents?.length > 0 ? initialData.documents : []
    );

    // ── Yield Posting ──
    const [yieldPercent, setYieldPercent] = useState("");
    const [yieldSummary, setYieldSummary] = useState<any>(null);

    // ─── Helpers ─────────────────────────────────────────────────────────────

    function showFeedback(message: string, ok: boolean) {
        setFeedback({ message, ok });
        setTimeout(() => setFeedback(null), 4000);
    }

    function buildPayload() {
        return {
            name, company, slug, tagline, heroImage, heroBgColor, description,
            highlights: highlights.filter(h => h.trim()),
            status: status as any, isActive, isFeatured,
            totalRaiseTarget: Number(totalRaiseTarget),
            currentRaised: Number(currentRaised),
            investorCount: Number(investorCount),
            launchDate, closeDate,
            expectedYieldLow: Number(expectedYieldLow),
            expectedYieldHigh: expectedYieldHigh !== "" ? Number(expectedYieldHigh) : null,
            yieldType: yieldType as any, yieldCycle, riskLevel: riskLevel as any,
            tranches, milestones, documents,
        };
    }

    async function handleSave() {
        startTransition(async () => {
            const payload = buildPayload();
            const result = mode === "create"
                ? await createProject(payload)
                : await updateProject(projectId!, payload);

            if (result.success) {
                showFeedback(mode === "create" ? "Project created successfully." : "Project updated.", true);
                if (mode === "create") router.push("/admin/projects");
            } else {
                showFeedback(result.error || "An error occurred.", false);
            }
        });
    }

    async function handlePostYield() {
        const pct = parseFloat(yieldPercent);
        if (isNaN(pct) || pct <= 0) { showFeedback("Enter a valid yield percentage.", false); return; }
        startTransition(async () => {
            const result = await postProjectYield(projectId!, pct);
            if (result.success) {
                setYieldSummary(result.summary);
                setYieldPercent("");
                showFeedback(`Yield posted — ${result.summary?.stakesProcessed} stakes credited $${result.summary?.totalCredited}`, true);
            } else {
                showFeedback(result.error || "Failed to post yield.", false);
            }
        });
    }

    async function handleMilestoneToggle(index: number, completed: boolean) {
        if (!projectId) return;
        startTransition(async () => {
            await toggleMilestoneCompleted(projectId, index, completed);
            setMilestones(prev => prev.map((m, i) => i === index ? { ...m, completed } : m));
        });
    }

    // ─── Tranche helpers ─────────────────────────────────────────────────────

    function updateTranche(index: number, field: keyof Tranche, value: any) {
        setTranches(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t));
    }
    function addTranche() { setTranches(prev => [...prev, { ...DEFAULT_TRANCHE }]); }
    function removeTranche(index: number) { setTranches(prev => prev.filter((_, i) => i !== index)); }

    // ─── Milestone helpers ────────────────────────────────────────────────────

    function updateMilestone(index: number, field: keyof Milestone, value: any) {
        setMilestones(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
    }
    function addMilestone() { setMilestones(prev => [...prev, { ...DEFAULT_MILESTONE }]); }
    function removeMilestone(index: number) { setMilestones(prev => prev.filter((_, i) => i !== index)); }

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => router.push("/admin/projects")}
                        className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-xs mb-3"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Projects
                    </button>
                    <h1
                        className="text-xl font-bold text-white tracking-tight"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {mode === "create" ? "New Project Investment" : name || "Edit Project"}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="px-6 py-2.5 bg-white text-black text-xs font-bold tracking-[0.12em] uppercase rounded-full hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    {isPending ? "Saving…" : mode === "create" ? "Create Project" : "Save Changes"}
                </button>
            </div>

            {/* Feedback Banner */}
            {feedback && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${feedback.ok ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                    {feedback.message}
                </div>
            )}

            {/* Tab Bar */}
            <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto">
                {TABS.map(tab => (
                    // Hide Yield Posting + Investors tabs in create mode
                    (mode === "create" && (tab === "Yield Posting" || tab === "Investors")) ? null : (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === tab ? "border-white text-white" : "border-transparent text-white/35 hover:text-white/60"}`}
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {tab}
                        </button>
                    )
                ))}
            </div>

            {/* ── TAB: CORE ──────────────────────────────────────────────────────── */}
            {activeTab === "Core" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="space-y-5">
                        <div>
                            <label className={labelClass}>Project Name</label>
                            <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Space City Infrastructure Fund" />
                        </div>
                        <div>
                            <label className={labelClass}>Company</label>
                            <select className={selectClass} value={company} onChange={e => setCompany(e.target.value)}>
                                {["SpaceX", "BoringCompany", "Tesla", "Neuralink", "xAI", "DOGE"].map(c => (
                                    <option key={c} value={c}>{c === "BoringCompany" ? "The Boring Company" : c === "DOGE" ? "Dogecoin" : c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>URL Slug</label>
                            <input className={inputClass} value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="spacex-space-city" />
                            <p className="text-[10px] text-white/25 mt-1">→ tesla-inc.pro/projects/{slug || "…"}</p>
                        </div>
                        <div>
                            <label className={labelClass}>Tagline</label>
                            <input className={inputClass} value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Own a stake in humanity's first interplanetary city" />
                        </div>
                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea className={`${inputClass} min-h-[120px] resize-y`} value={description} onChange={e => setDescription(e.target.value)} placeholder="Full project description…" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className={labelClass}>Hero Image URL (Cloudinary)</label>
                            <input className={inputClass} value={heroImage} onChange={e => setHeroImage(e.target.value)} placeholder="https://res.cloudinary.com/…" />
                            {heroImage && (
                                <div className="mt-2 h-28 rounded-xl overflow-hidden border border-white/[0.06]">
                                    <img src={heroImage} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Brand Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={heroBgColor} onChange={e => setHeroBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                                    <input className={`${inputClass} flex-1`} value={heroBgColor} onChange={e => setHeroBgColor(e.target.value)} placeholder="#0047AB" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Status</label>
                                <select className={selectClass} value={status} onChange={e => setStatus(e.target.value)}>
                                    {["upcoming", "open", "funded", "closed"].map(s => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Key Highlights (3–5 bullet points)</label>
                            <div className="space-y-2">
                                {highlights.map((h, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="text-white/20 text-xs w-4 shrink-0">{i + 1}.</span>
                                        <input className={inputClass} value={h} onChange={e => setHighlights(prev => prev.map((x, j) => j === i ? e.target.value : x))} placeholder={`Highlight ${i + 1}`} />
                                        {i > 0 && <button onClick={() => setHighlights(prev => prev.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400 text-xs transition-colors">✕</button>}
                                    </div>
                                ))}
                                {highlights.length < 6 && (
                                    <button onClick={() => setHighlights(prev => [...prev, ""])} className="text-[11px] text-white/30 hover:text-white/60 transition-colors mt-1">+ Add highlight</button>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-white" />
                                <span className="text-xs text-white/60">Active (visible to users)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-white" />
                                <span className="text-xs text-white/60">Featured on /invest page</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TAB: FINANCIALS ─────────────────────────────────────────────────── */}
            {activeTab === "Financials" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="space-y-5">
                        <div>
                            <label className={labelClass}>Total Raise Target ($)</label>
                            <input type="number" className={inputClass} value={totalRaiseTarget} onChange={e => setTotalRaiseTarget(e.target.value)} placeholder="500000000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Amount Raised So Far ($)</label>
                                <input type="number" className={inputClass} value={currentRaised} onChange={e => setCurrentRaised(e.target.value)} placeholder="0" min="0" />
                                <p className="text-[10px] text-white/25 mt-1">Displayed on funding progress bar</p>
                            </div>
                            <div>
                                <label className={labelClass}>Number of Investors</label>
                                <input type="number" className={inputClass} value={investorCount} onChange={e => setInvestorCount(e.target.value)} placeholder="0" min="0" />
                                <p className="text-[10px] text-white/25 mt-1">Displayed on project card</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Launch Date</label>
                                <input type="date" className={inputClass} value={launchDate} onChange={e => setLaunchDate(e.target.value)} style={{ colorScheme: "dark" }} />
                            </div>
                            <div>
                                <label className={labelClass}>Close Date</label>
                                <input type="date" className={inputClass} value={closeDate} onChange={e => setCloseDate(e.target.value)} style={{ colorScheme: "dark" }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Yield Low (%)</label>
                                <input type="number" className={inputClass} value={expectedYieldLow} onChange={e => setExpectedYieldLow(e.target.value)} placeholder="15" />
                            </div>
                            <div>
                                <label className={labelClass}>Yield High (%) — optional</label>
                                <input type="number" className={inputClass} value={expectedYieldHigh} onChange={e => setExpectedYieldHigh(e.target.value)} placeholder="120" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label className={labelClass}>Yield Type</label>
                            <select className={selectClass} value={yieldType} onChange={e => setYieldType(e.target.value)}>
                                <option value="annual_percent">Annual Percent</option>
                                <option value="on_exit">On Exit / Maturity</option>
                                <option value="per_cycle">Per Cycle</option>
                            </select>
                        </div>
                        {yieldType === "per_cycle" && (
                            <div>
                                <label className={labelClass}>Cycle Duration</label>
                                <input className={inputClass} value={yieldCycle} onChange={e => setYieldCycle(e.target.value)} placeholder="e.g. 6 months, 90 days" />
                            </div>
                        )}
                        <div>
                            <label className={labelClass}>Risk Level</label>
                            <select className={selectClass} value={riskLevel} onChange={e => setRiskLevel(e.target.value)}>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="very_high">Very High</option>
                            </select>
                        </div>
                        <div className="border border-white/[0.06] rounded-xl p-4 space-y-3">
                            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/40">Supporting Documents</p>
                            {documents.map((doc, i) => (
                                <div key={i} className="grid grid-cols-2 gap-3 items-center">
                                    <input className={inputClass} value={doc.label} onChange={e => setDocuments(prev => prev.map((d, j) => j === i ? { ...d, label: e.target.value } : d))} placeholder="Document label" />
                                    <div className="flex gap-2">
                                        <input className={inputClass} value={doc.url} onChange={e => setDocuments(prev => prev.map((d, j) => j === i ? { ...d, url: e.target.value } : d))} placeholder="URL" />
                                        <button onClick={() => setDocuments(prev => prev.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400 text-xs transition-colors px-1">✕</button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setDocuments(prev => [...prev, { ...DEFAULT_DOC }])} className="text-[11px] text-white/30 hover:text-white/60 transition-colors">+ Add document</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TAB: TRANCHES ───────────────────────────────────────────────────── */}
            {activeTab === "Tranches" && (
                <div className="space-y-4">
                    <p className="text-xs text-white/40">Define investment tiers. Each tranche has its own minimum, maximum, yield range, and spot limit.</p>
                    {tranches.map((tranche, i) => (
                        <div key={i} className="border border-white/[0.08] rounded-2xl p-5 space-y-4 bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                                <div
                                    className="w-2 h-5 rounded-full mr-3 inline-block"
                                    style={{ backgroundColor: i === 0 ? '#6b7280' : i === 1 ? '#3b82f6' : '#f59e0b' }}
                                />
                                <span className="text-sm font-bold text-white flex-1">{tranche.name || `Tranche ${i + 1}`}</span>
                                {i > 0 && (
                                    <button onClick={() => removeTranche(i)} className="text-[11px] text-white/20 hover:text-red-400 transition-colors">Remove</button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input className={inputClass} value={tranche.name} onChange={e => updateTranche(i, 'name', e.target.value)} placeholder="Pioneer" />
                                </div>
                                <div>
                                    <label className={labelClass}>Badge Label</label>
                                    <input className={inputClass} value={tranche.badge} onChange={e => updateTranche(i, 'badge', e.target.value)} placeholder="Popular" />
                                </div>
                                <div>
                                    <label className={labelClass}>Total Spots</label>
                                    <input type="number" className={inputClass} value={tranche.spotsTotal} onChange={e => updateTranche(i, 'spotsTotal', Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className={labelClass}>Min Investment ($)</label>
                                    <input type="number" className={inputClass} value={tranche.minimumAmount} onChange={e => updateTranche(i, 'minimumAmount', Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className={labelClass}>Max Investment ($) — blank = no cap</label>
                                    <input type="number" className={inputClass} value={tranche.maximumAmount ?? ""} onChange={e => updateTranche(i, 'maximumAmount', e.target.value ? Number(e.target.value) : null)} placeholder="No cap" />
                                </div>
                                <div>
                                    <label className={labelClass}>Spots Filled (read-only)</label>
                                    <input type="number" className={`${inputClass} opacity-50`} value={tranche.spotsFilled} readOnly />
                                </div>
                                <div>
                                    <label className={labelClass}>Yield Low (%)</label>
                                    <input type="number" className={inputClass} value={tranche.yieldLow} onChange={e => updateTranche(i, 'yieldLow', Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className={labelClass}>Yield High (%) — blank = custom</label>
                                    <input type="number" className={inputClass} value={tranche.yieldHigh ?? ""} onChange={e => updateTranche(i, 'yieldHigh', e.target.value ? Number(e.target.value) : null)} placeholder="Custom terms" />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={tranche.isCustomTerms} onChange={e => updateTranche(i, 'isCustomTerms', e.target.checked)} className="w-4 h-4 accent-white" />
                                        <span className="text-xs text-white/60">Custom Terms (hides yield, shows "Contact")</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={addTranche} className="w-full py-3 border border-dashed border-white/[0.12] rounded-2xl text-xs text-white/30 hover:text-white/60 hover:border-white/25 transition-all duration-200">
                        + Add Tranche
                    </button>
                </div>
            )}

            {/* ── TAB: MILESTONES ─────────────────────────────────────────────────── */}
            {activeTab === "Milestones" && (
                <div className="space-y-4">
                    <p className="text-xs text-white/40">Project timeline milestones. Shown as a horizontal timeline on the public project page.</p>
                    {milestones.map((m, i) => (
                        <div key={i} className="border border-white/[0.08] rounded-2xl p-5 space-y-4 bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                                <div className={`w-3 h-3 rounded-full border-2 ${m.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 bg-transparent'}`} />
                                <span className="text-xs text-white/40 flex-1 ml-3">Milestone {i + 1}</span>
                                <div className="flex items-center gap-3">
                                    {mode === "edit" && (
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input type="checkbox" checked={m.completed} onChange={e => handleMilestoneToggle(i, e.target.checked)} className="w-3.5 h-3.5 accent-emerald-500" />
                                            <span className="text-[11px] text-white/40">Completed</span>
                                        </label>
                                    )}
                                    {mode === "create" && (
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input type="checkbox" checked={m.completed} onChange={e => updateMilestone(i, 'completed', e.target.checked)} className="w-3.5 h-3.5 accent-emerald-500" />
                                            <span className="text-[11px] text-white/40">Completed</span>
                                        </label>
                                    )}
                                    <button onClick={() => removeMilestone(i)} className="text-[11px] text-white/20 hover:text-red-400 transition-colors">Remove</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <label className={labelClass}>Title</label>
                                    <input className={inputClass} value={m.title} onChange={e => updateMilestone(i, 'title', e.target.value)} placeholder="Site Acquisition Complete" />
                                </div>
                                <div>
                                    <label className={labelClass}>Target Date</label>
                                    <input type="date" className={inputClass} value={m.targetDate} onChange={e => updateMilestone(i, 'targetDate', e.target.value)} style={{ colorScheme: "dark" }} />
                                </div>
                                <div className="lg:col-span-3">
                                    <label className={labelClass}>Description (optional)</label>
                                    <input className={inputClass} value={m.description} onChange={e => updateMilestone(i, 'description', e.target.value)} placeholder="Additional context about this milestone…" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={addMilestone} className="w-full py-3 border border-dashed border-white/[0.12] rounded-2xl text-xs text-white/30 hover:text-white/60 hover:border-white/25 transition-all duration-200">
                        + Add Milestone
                    </button>
                </div>
            )}

            {/* ── TAB: YIELD POSTING ──────────────────────────────────────────────── */}
            {activeTab === "Yield Posting" && mode === "edit" && (
                <div className="max-w-lg space-y-6">
                    <div className="border border-amber-500/20 rounded-2xl p-5 bg-amber-500/[0.04] space-y-2">
                        <p className="text-xs font-bold text-amber-400 tracking-wider uppercase">Yield Event</p>
                        <p className="text-xs text-white/50">Posting a yield credits all active stakes proportionally and creates Transaction records for each investor's ledger. This action cannot be undone.</p>
                    </div>
                    <div>
                        <label className={labelClass}>Yield Percentage (%)</label>
                        <input
                            type="number"
                            className={inputClass}
                            value={yieldPercent}
                            onChange={e => setYieldPercent(e.target.value)}
                            placeholder="e.g. 12.5"
                            min="0.01" step="0.01"
                        />
                        <p className="text-[11px] text-white/30 mt-1.5">
                            Each investor receives: (their invested amount × {yieldPercent || "0"}%) credited to their balance.
                        </p>
                    </div>
                    <button
                        onClick={handlePostYield}
                        disabled={isPending || !yieldPercent}
                        className="px-6 py-3 bg-amber-500 text-black text-xs font-bold tracking-[0.12em] uppercase rounded-full hover:bg-amber-400 transition-all duration-200 disabled:opacity-40"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {isPending ? "Processing…" : "Post Yield to All Investors"}
                    </button>
                    {yieldSummary && (
                        <div className="border border-emerald-500/20 rounded-xl p-4 bg-emerald-500/[0.04] space-y-1">
                            <p className="text-xs font-bold text-emerald-400">Last yield posted successfully</p>
                            <p className="text-[11px] text-white/50">{yieldSummary.stakesProcessed} stakes processed · ${yieldSummary.totalCredited} total credited · {yieldSummary.yieldPercent}% yield rate</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── TAB: INVESTORS ──────────────────────────────────────────────────── */}
            {activeTab === "Investors" && mode === "edit" && (
                <div className="space-y-4">
                    <p className="text-xs text-white/40">{stakes.length} investor{stakes.length !== 1 ? "s" : ""} — read-only view.</p>
                    {stakes.length === 0 && (
                        <div className="border border-white/[0.06] rounded-2xl p-12 text-center text-white/30 text-sm">No investor stakes yet.</div>
                    )}
                    {stakes.length > 0 && (
                        <div className="border border-white/[0.06] rounded-2xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/[0.06]">
                                        {["Investor", "Country", "Tranche", "Invested", "PnL", "Status", "Date"].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.15em] uppercase text-white/30">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {stakes.map(stake => (
                                        <tr key={stake._id} className="hover:bg-white/[0.02]">
                                            <td className="px-4 py-3">
                                                <div className="text-white text-xs font-medium">{stake.userId ? `${stake.userId.firstName} ${stake.userId.lastName}` : "Unknown"}</div>
                                                <div className="text-white/30 text-[10px]">{stake.userId?.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-white/50">{stake.userId?.country}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 bg-white/[0.06] rounded text-[10px] text-white/70">{stake.trancheName}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-white font-medium">${stake.investedAmount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-xs font-medium">
                                                <span className={stake.currentPnL >= 0 ? "text-emerald-400" : "text-red-400"}>
                                                    {stake.currentPnL >= 0 ? "+" : ""}${stake.currentPnL.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${stake.status === 'active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/40 bg-white/[0.04]'}`}>
                                                    {stake.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[11px] text-white/40">
                                                {new Date(stake.investedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
