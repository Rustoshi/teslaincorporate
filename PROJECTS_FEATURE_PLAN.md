# Musk Space — Project Investments Feature Plan
> SpaceX Space City Fund + The Boring Company Tunnel Project
> Execution tracker — update status as each step completes.

---

## Architectural Overview

Two new product lines running **parallel** to the existing AI Plans system.
No breaking changes to: `InvestmentPlan`, `UserPlan`, `Transaction`, `User`, auth flows.

### New Models
| Model | Purpose |
|---|---|
| `ProjectInvestment` | Master record for each investable project (Space City, Tunnel) |
| `ProjectStake` | User's ownership stake in a specific project + tranche |

### New Routes
| Route | Type | Description |
|---|---|---|
| `/projects` | Public | Cinematic listing of all open/upcoming projects |
| `/projects/[slug]` | Public | Immersive full-page project detail + invest CTA |
| `/dashboard/projects` | Protected | User's project portfolio overview |
| `/dashboard/projects/[slug]` | Protected | Individual stake detail page |
| `/admin/(panel)/projects` | Admin | Projects list + status management |
| `/admin/(panel)/projects/[id]` | Admin | Full project editor (multi-tab) |

### New Server Actions
| File | Actions |
|---|---|
| `app/admin/actions/projects.ts` | createProject, updateProject, deleteProject, updateProjectStatus, postProjectYield, getProjectWithStakes |
| `app/dashboard/actions/project.ts` | investInProject |

---

## Phase 1 — Data Layer (Foundation)
> Must be completed before anything else. All UI depends on these models.

### Step 1.1 — `models/ProjectInvestment.ts` [ ]
Full schema for a project investment opportunity.

Key fields:
- `company`: enum — 'SpaceX' | 'BoringCompany' | 'Tesla' | 'Neuralink' | 'xAI'
- `slug`: unique URL identifier
- `status`: 'upcoming' | 'open' | 'funded' | 'closed'
- `tranches[]`: tiered investment levels (Explorer, Pioneer, Visionary)
  - each tranche has: name, badge, minimumAmount, maximumAmount, yieldLow, yieldHigh, spotsTotal, spotsFilled, isCustomTerms
- `milestones[]`: project timeline entries with completed flag
- `documents[]`: prospectus and disclosure links
- `totalRaiseTarget`, `currentRaised`, `investorCount`: fundraising progress
- `isFeatured`: controls appearance on /invest landing page

### Step 1.2 — `models/ProjectStake.ts` [ ]
Per-user ownership record.

Key fields:
- `userId`, `projectId`: references
- `trancheName`: which tier the user invested in
- `investedAmount`, `currentValue`, `currentPnL`: financial tracking
- `status`: 'active' | 'matured' | 'cancelled'
- `maturityDate`: optional projected exit date

---

## Phase 2 — Admin Infrastructure
> Admins need to create/manage projects before any user can see them.

### Step 2.1 — `app/admin/actions/projects.ts` [ ]
Server actions:
- `createProject(data)` — validates + creates ProjectInvestment document
- `updateProject(id, data)` — full update
- `deleteProject(id)` — removes project (only if no active stakes)
- `updateProjectStatus(id, status)` — upcoming → open → funded → closed
- `postProjectYield(id, yieldPercentage)` — calculates + credits all active stakes proportionally, creates Transaction records per user
- `getProjectWithStakes(id)` — project + all investor stakes for admin viewer

### Step 2.2 — `components/admin/ProjectsClient.tsx` [ ]
Client component for the admin projects list page.
- Table: name, company badge, status pill, raised/target progress, investor count, created date
- Inline status toggle (dropdown)
- "New Project" button → triggers editor modal or navigates to create page
- "Edit" → navigates to `/admin/projects/[id]`
- "Delete" with confirmation (blocked if active stakes exist)

### Step 2.3 — `components/admin/ProjectEditorTabs.tsx` [ ]
Multi-tab editor for creating/updating a project.
Tabs:
1. **Core** — name, slug, company, tagline, heroImage, heroBgColor, description, highlights[], status, isFeatured, isActive
2. **Financials** — totalRaiseTarget, launchDate, closeDate, expectedYieldLow, expectedYieldHigh, yieldType, yieldCycle, riskLevel
3. **Tranches** — add/edit/remove tranche tiers (live preview of tranche card)
4. **Milestones** — add/edit/remove timeline entries, toggle completed
5. **Yield Posting** — admin posts a yield event (percentage) which credits all active stakes
6. **Investors** — read-only table of all ProjectStakes for this project with user info + amounts

### Step 2.4 — `app/admin/(panel)/projects/page.tsx` [ ]
Server component that fetches all projects and passes to ProjectsClient.

### Step 2.5 — `app/admin/(panel)/projects/[id]/page.tsx` [ ]
Server component that fetches single project + stakes, renders ProjectEditorTabs.
Also handles `new` as an ID for the creation flow.

### Step 2.6 — Update `components/admin/Sidebar.tsx` [ ]
Add "Projects" nav item with rocket icon between existing items.

---

## Phase 3 — User Investment Flow

### Step 3.1 — `app/dashboard/actions/project.ts` [ ]
`investInProject(formData)` server action:
1. Verify session
2. Validate: project is 'open', tranche exists, spots available, amount within tranche min/max
3. Verify user balance >= investedAmount
4. Debit: `user.totalBalance -= amount`, `user.totalInvested += amount`
5. Create: `ProjectStake` record
6. Create: `Transaction { type: 'investment', status: 'approved' }`
7. Increment: `project.currentRaised += amount`, `project.investorCount += 1`
8. Increment: `tranche.spotsFilled += 1`
9. Revalidate: dashboard + project pages

---

## Phase 4 — Public Project Pages

### Step 4.1 — `components/projects/ProjectFundingBar.tsx` [ ]
Animated horizontal progress bar.
- Props: currentRaised, totalRaiseTarget, closeDate
- Shows: amount raised, percentage, days remaining
- Smooth fill animation on mount (Framer Motion)
- Urgency color shift: green → amber → red as deadline approaches

### Step 4.2 — `components/projects/ProjectTranchePicker.tsx` [ ]
Three-column tranche selection cards.
- Selected state: border highlight + glow effect per brand color
- "SOLD OUT" state: greyed out, strikethrough spots
- "CUSTOM TERMS" state for Visionary with "Contact Us" CTA
- Spots remaining counter (live from DB)
- Yield range displayed prominently

### Step 4.3 — `components/projects/ProjectMilestones.tsx` [ ]
Horizontal scrollable timeline.
- Completed: filled circle + solid line + white text
- Upcoming: outlined circle + dashed line + muted text
- "Current" marker: pulsing ring animation
- Mobile: vertical stack layout

### Step 4.4 — `components/projects/ProjectCalculator.tsx` [ ]
Interactive investment calculator.
- Range slider: min to max of selected tranche
- Live output: projected return range (low and high)
- Input field also works for manual entry
- "Projected return: $X,XXX – $X,XXX" displayed in large type
- Disclaimer text below

### Step 4.5 — `components/projects/ProjectListingCard.tsx` [ ]
Card for the /projects listing page.
- Full-bleed background image with gradient overlay
- Company badge (top-left)
- Status pill (top-right): OPEN / UPCOMING / FUNDED
- Project name + tagline
- Funding progress bar
- Key stats: yield range, minimum, days left
- Hover: slight scale + shadow lift

### Step 4.6 — `components/projects/ProjectHero.tsx` [ ]
100vh immersive hero section.
- Full-bleed image with brand-color gradient overlay
- Left: project name (huge), tagline, company badge
- Right panel (floating): funding stats + countdown + CTA
- Parallax scroll effect on image
- "Scroll to explore" indicator

### Step 4.7 — `components/projects/InvestModal.tsx` [ ]
Multi-step modal (3 steps + success):
- Step 1: Tranche selection (pre-populated from user's click)
- Step 2: Amount entry (validated, shows balance, projected return)
- Step 3: Review & confirm (full summary before submission)
- Step 4: Success screen (confetti? tick animation, "View in Dashboard" CTA)

### Step 4.8 — `app/projects/page.tsx` [ ]
Server component:
- Fetches all active (open + upcoming) projects
- Renders: page header, ProjectListingCard grid, empty state

### Step 4.9 — `app/projects/[slug]/page.tsx` [ ]
Server component:
- Fetches project by slug, 404 if not found/inactive
- Composes full page: ProjectHero, opportunity section, ProjectTranchePicker,
  ProjectCalculator, ProjectMilestones, documents section, InvestModal trigger
- Dynamic metadata (title, OG image)

---

## Phase 5 — Dashboard Integration

### Step 5.1 — `components/dashboard/projects/ProjectStakeCard.tsx` [ ]
Card for the dashboard portfolio grid.
- Brand color left border accent
- Project name + company
- Tranche badge
- Invested amount, current value, PnL (green/red)
- Status pill
- "View Details" link

### Step 5.2 — `app/dashboard/projects/page.tsx` [ ]
Server component:
- Fetches all ProjectStakes for current user with project data populated
- Portfolio summary: total invested in projects, total PnL
- Grid of ProjectStakeCards
- Empty state: "No project investments yet. Explore opportunities →"

### Step 5.3 — `app/dashboard/projects/[slug]/page.tsx` [ ]
Server component:
- Fetches project + user's specific stake
- Mini project hero (reduced height, not full 100vh)
- Stake summary: amount invested, current value, yield to date, tranche, maturity
- Project milestone progress (reuses ProjectMilestones component)
- Link to full public project page

### Step 5.4 — Update `components/dashboard/Sidebar.tsx` [ ]
Add "Projects" nav item (rocket icon) between Plans and Transactions.

---

## Phase 6 — Landing Page Integration

### Step 6.1 — `components/invest/ProjectsFeatured.tsx` [ ]
New section for the /invest marketing page.
- Dark cinematic full-bleed section
- Section heading: "Exclusive Project Investments"
- Two large side-by-side feature cards (driven by isFeatured=true projects from DB)
- Each card: project hero image, company brand mark, yield range, min investment, status
- "Explore All Projects" CTA

### Step 6.2 — Update `app/invest/page.tsx` [ ]
Insert ProjectsFeatured section between AIPlans and RiskArchitecture.
Section will be server-side rendered with live DB data.

---

## Phase 7 — Seed Data

### Step 7.1 — `scripts/seed-projects.ts` [ ]
Seed two flagship projects:

**Project 1: SpaceX Space City Infrastructure Fund**
- slug: `spacex-space-city`
- company: SpaceX
- heroBgColor: `#0047AB`
- status: open
- totalRaiseTarget: 500,000,000
- Tranches: Explorer ($1K-$9.9K, 15-25%), Pioneer ($10K-$99.9K, 25-45%), Visionary ($100K+, custom)
- 5 milestones

**Project 2: The Boring Company — Vegas Loop Expansion**
- slug: `boring-vegas-loop`
- company: BoringCompany
- heroBgColor: `#FF6600`
- status: open
- totalRaiseTarget: 250,000,000
- Tranches: same tier structure, different yields

---

## Completion Checklist
- [ ] Phase 1: Data Models (2 files)
- [ ] Phase 2: Admin Infrastructure (6 files)
- [ ] Phase 3: User Investment Flow (1 file)
- [ ] Phase 4: Public Project Pages (9 files)
- [ ] Phase 5: Dashboard Integration (4 files)
- [ ] Phase 6: Landing Page Integration (2 files)
- [ ] Phase 7: Seed Data (1 file)

**Total: ~25 new/modified files**

---

## Design Principles (Non-Negotiable)
1. Every component must feel premium — no placeholder UI, no rough edges
2. Framer Motion animations on all significant transitions and reveals
3. Mobile-first responsive — every layout works on 375px and up
4. Brand colors per company must be consistent throughout
5. All DB calls are server-side (server components / server actions) — no client-side fetching
6. No breaking changes to existing platform features
