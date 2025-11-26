# Technical Design: "Ultimate Speed Pack" for Floor Plan Creator

## Objective
Enable users to design floor plans in under 2 minutes by adding high-efficiency utility tools to the Room Properties sidebar.

## 1. Room Type Presets (Smart Types)
**Current:** Dropdown changes `type` string only.
**New:** Dropdown/Grid selection that applies:
*   `type`: The room category (e.g., 'bedroom')
*   `w`/`h`: Default dimensions for that type (e.g., Bedroom = 12x12, Hall = 6x10)
*   **Color:** Automatically applied via `RoomItem.tsx` logic (already exists).

**Data Structure:**
```typescript
const ROOM_PRESETS = {
  master_bedroom: { label: 'Master Bed', w: 15, h: 15 },
  bedroom: { label: 'Bedroom', w: 12, h: 12 },
  kitchen: { label: 'Kitchen', w: 12, h: 10 },
  bathroom: { label: 'Bath', w: 8, h: 6 },
  living: { label: 'Living', w: 18, h: 15 },
  // ... others
}
```

## 2. Quick Sizing Tools
Add "Quick Size" buttons:
*   `Small (8x8)`
*   `Medium (12x12)`
*   `Large (16x16)`
*   `X-Large (20x20)`

**Implementation:**
Simple buttons calling `onUpdateRoom` for both 'w' and 'h'.

## 3. Orientation Flip (Rotate 90°)
**Logic:**
Swap `w` and `h` values.
```typescript
const handleFlip = () => {
  const newW = room.h;
  const newH = room.w;
  updateRoom(id, 'w', newW);
  updateRoom(id, 'h', newH);
}
```

## 4. Clone to Direction (Smart Duplicate)
**Feature:** Buttons [←] [↑] [↓] [→] to duplicate room adjacent to current one.

**Logic:**
*   **Right:** `x = current.x + current.w`, `y = current.y`
*   **Left:** `x = current.x - current.w`, `y = current.y`
*   **Top:** `x = current.x`, `y = current.y - current.h`
*   **Bottom:** `x = current.x`, `y = current.y + current.h`

*Requires new prop `onCloneRoom(id, direction)` in `Sidebar`.*

## 5. Wall Preset Modes
**Feature:** Toggle buttons for wall visibility.
*   **Enclosed:** All walls `true`.
*   **Open:** All walls `false` (or specific pattern).

**Logic:**
Iterate `borders` object and set all keys.

## UI Changes (Sidebar.tsx)
Refactor `Sidebar` to organize these tools cleanly:
1.  **Top:** "Smart Actions" Row (Clone buttons, Flip, Delete)
2.  **Middle:** Room Type Selector (Grid)
3.  **Middle:** Dimensions & Quick Sizes
4.  **Bottom:** Wall Controls

## Component Updates Required
*   `src/components/floor-plan/Sidebar.tsx`: Major UI additions.
*   `src/components/FloorPlanApp.tsx`: Add handler for directional cloning.
*   `src/types/index.ts`: May need minor updates if we pass strict direction types.
