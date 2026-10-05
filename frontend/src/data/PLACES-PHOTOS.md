# Adding trip photos

One folder per trip already exists under `public/fun/places/`, named
`<year>-<city>` to match the trip's id in `fun.ts`. Repeat destinations get
separate folders, so the 2024 New York trip and the 2026 one do not mix.

## 1. Drop the files in

Name them in display order:

```
public/fun/places/2025-yosemite/01.jpg
public/fun/places/2025-yosemite/02.jpg
```

Landscape crops look best — the modal stacks them in a single full-width
column. Resize to about 1600px wide before adding; anything larger is bytes
nobody downloads twice.

## 2. List them in `fun.ts`

Find the trip and fill its empty `photos` array:

```ts
{
  id: "p25-4",
  title: "Yosemite",
  by: "California",
  tag: "Nov",
  detail: {
    photos: [
      "/fun/places/2025-yosemite/01.jpg",
      "/fun/places/2025-yosemite/02.jpg",
    ],
  },
},
```

Paths are absolute from `public/`, so they start with `/fun/`, not `./`.

A trip with an empty array renders "Photos to come." instead, which is why the
arrays are there already rather than omitted.

## 3. The five featured cards

The `favourites` entries at the top of the Places row (`pf-1` … `pf-6`) are
separate objects with their own `photos` arrays. They point at the same trips,
so reuse the same paths — a featured New York card and the `p26-3` trip can
both list `/fun/places/2026-new-york/01.jpg`.

## Folder map

| Folder | Trip id |
| --- | --- |
| `2024-new-jersey` | `p24-4` |
| `2024-new-york` | `p24-3` |
| `2024-san-francisco` | `p24-1` |
| `2024-san-jose` | `p24-2` |
| `2025-dallas` | `p25-1` |
| `2025-seattle` | `p25-3` |
| `2025-yosemite` | `p25-4` |
| `2026-austin` | `p26-8` |
| `2026-dallas` | `p26-7` |
| `2026-lake-tahoe` | `p26-10` |
| `2026-los-angeles` | `p26-1` |
| `2026-new-jersey` | `p26-4` |
| `2026-new-york` | `p26-3` |
| `2026-philadelphia` | `p26-6` |
| `2026-san-antonio` | `p26-9` |
| `2026-san-diego` | `p26-2` |
| `2026-washington` | `p26-5` |
