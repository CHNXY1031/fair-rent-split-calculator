# Fair Roommate Rent Split Calculator

A production-ready Next.js 14 calculator for splitting rent by bedroom size, private amenities, and occupancy. It includes pre-rendered long-tail rent guides, structured data, a generated sitemap, and a shareable English breakdown for roommate group chats.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

## Calculation model

- 75% of rent is the private-room pool, allocated by estimated square footage.
- A private bathroom adds 15% to room value.
- A balcony or walk-in closet adds 8% to room value.
- 25% of rent is the common-area pool, allocated by occupant count.
- Final shares are allocated in whole cents with a largest-remainder adjustment so they always sum exactly to total rent.

The production origin is fixed to `https://fair-rent-split-calculator.vercel.app` so sitemap, canonical metadata, Open Graph metadata, robots, and structured data always use the same domain.
