# Development Journal — Hyvän Tuulen Sauna

## 2026-05-22: Timezone Hell & Bookla API Discovery

### The Bug: May 30 Slot Appeared on May 31

A sauna slot at 2026-05-30T18:00:00Z (21:00–23:00 Helsinki) was being grouped under **May 31** in the calendar. The same code worked fine locally but broke when deployed to Cloudflare Workers.

### Root Cause: `toLocaleString` + `new Date` Is Unreliable on Workers

**Broken pattern (DO NOT USE):**
```typescript
const slotDate = new Date("2026-05-30T18:00:00Z");
const helsinkiStr = slotDate.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' });
// helsinkiStr = "5/30/2026, 9:00:00 PM"
const helsinkiDate = new Date(helsinkiStr); // ← UNRELIABLE ON WORKERS
const dateKey = formatDateInHelsinki(helsinkiDate); // ← WRONG DATE
```

On local macOS, `new Date("5/30/2026, 9:00:00 PM")` correctly parses to May 30. On Cloudflare Workers, the same parse shifts the date by one day (interpreting the string in a different timezone context), causing the slot to land on May 31.

**Fix — use `Intl.DateTimeFormat` directly (ALWAYS USE):**
```typescript
const slotDate = new Date("2026-05-30T18:00:00Z");

// Date key — reliable on any runtime
const dateKey = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Helsinki',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(slotDate); // → "2026-05-30"

// Hour extraction — also reliable
const hour = parseInt(
  new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Helsinki',
    hour: 'numeric',
    hour12: false,
  }).format(slotDate),
  10
); // → 21
```

`Intl.DateTimeFormat` with an explicit `timeZone` option converts correctly on **all** JavaScript runtimes (Node, Deno, Cloudflare Workers, browser).

### Affected Files
- `app/api/bookla/availability/month/route.ts`
- `app/api/bookla/availability/route.ts`

### Bookla API Findings

#### 1. `tickets` Field Is Required
Querying without `tickets` returns:
```json
{"code":"tickets_required","message":"Internal server error"}
```

#### 2. Wide Date Ranges Can Return `"no_price_rule_found"`
When a range includes a date with no pricing rule configured, the **entire query fails** (not just that date). Example: May 30 had no price rule → any chunk including May 30 returned 409/"no_price_rule_found".

**Working pattern:**
```json
{
  "from": "2026-05-24T00:00:00.000Z",
  "to": "2026-05-25T00:00:00.000Z",
  "tickets": {"74ef0b6e-c3d2-4da2-aecc-cd8d0b1a09ee": 1}
}
```

#### 3. Month-Range Query Works Once Price Rules Are Fixed
After Bookla fixed the missing price rule for May 30, a clean full-month query works:
```json
{
  "from": "2026-05-01T00:00:00.000Z",
  "to": "2026-06-01T00:00:00.000Z",
  "tickets": {"74ef0b6e-c3d2-4da2-aecc-cd8d0b1a09ee": 1}
}
```

#### 4. Response Format
```json
{
  "times": {
    "b2105143-19c2-48a1-ab74-fead30b844ac": [
      {
        "startTime": "2026-05-30T18:00:00Z",
        "duration": "PT2H",
        "spotsAvailable": 17,
        "totalSpots": 17,
        "bookedSpots": 0
      }
    ]
  },
  "timeZone": "Europe/Helsinki"
}
```
- `times` is a map keyed by `resourceID`
- `startTime` is always UTC
- `duration` is ISO 8601 (e.g. `PT2H` = 2 hours)
- `spotsAvailable` tells actual remaining capacity

### Key Lesson

**Never use `new Date(localeString)` for timezone conversion.** Always use `Intl.DateTimeFormat` with explicit `timeZone`. This applies to:
- Date grouping (which calendar day a slot belongs to)
- Hour extraction (what time to display to the user)
- Any server-side date math involving non-UTC timezones

---

## 2026-05-22: Front Page Redesign — Tabs, Modals & Sizing

### ServiceTabs Restructure

Changed front page booking tabs from 4 separate tabs (Aalto / Virta / Miniristeily / Julkinen sauna) to **3 tabs**:
- **Risteilyt** — Aalto & Virta side-by-side in a 2-column grid
- **Miniristeily** — Mini cruise info card with booking button
- **Julkinen sauna** — Full PublicBookingWidget inline

**Rationale:** Users get more information at once; both boats are comparable directly.

### BoatCard Compact Mode

Added `compact?: boolean` prop to `BoatCard`. Compact mode preserves **all content sections** (description, itinerary, specs, features, idealFor, pricing) but with tighter spacing:
- CardContent padding: `p-2` (was `p-2.5`)
- All margins reduced by ~1 step
- Spec icons: tighter `gap-0.5`, `p-0.5`
- Feature/idealFor gaps: `gap-1` (was `gap-1.5`)
- Itinerary padding: `p-1.5` (was `p-2`)
- Description: `line-clamp-2` to prevent overflow in narrow columns

Text sizes remain unchanged (user requested text size is good).

### Booking Modals on Front Page

Both "Risteilyt" and "Miniristeily" now open **in-page modals** instead of linking away:

| Tab | Button Action | Before | After |
|-----|--------------|--------|-------|
| Risteilyt | "Varaa nyt" | Link to `/saunalauttaristeilyt-helsingissa#varaus` | Opens `SummerBookingShell` modal |
| Miniristeily | "Varaa miniristeily" | Link to `/saunalauttaristeilyt-helsingissa#varaus` | Opens `MiniCruiseBookingShell` modal |

**Changes to support this:**
- `SummerBookingShell`: added optional `onClose` prop + ✕ close button in header
- `ServiceTabs`: added `showSummerBooking` and `showMiniCruiseBooking` state + modal markup

Modal markup (consistent pattern):
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
  <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6">
    <SummerBookingShell showTitle={false} onClose={() => setShowSummerBooking(false)} />
  </div>
</div>
```

### MobileNav Slide Animation

Replaced instant show/hide with CSS slide transition:
- Drawer: `translate-x-full` → `translate-x-0` (300ms ease-out)
- Backdrop: opacity 0 → 1 (300ms)
- Uses `pointer-events-auto/none` instead of conditional render so transition plays

### Public Sauna Description

Added descriptive text block above `PublicBookingWidget` in the "Julkinen sauna" tab explaining the experience (boat pickup, saunas, grill, drinks, SUP boards, etc.).

### Removed Announcement Banner

Removed the 10.05 Sunday public sauna return announcement from the homepage.

### Affected Files
- `components/sections/ServiceTabs.tsx`
- `components/sections/BoatCard.tsx`
- `components/booking/SummerBookingShell.tsx`
- `components/layout/MobileNav.tsx`
- `app/page.tsx`
