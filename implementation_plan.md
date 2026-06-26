# Global Image Optimization with `next/image`

To ensure all uploaded images (products, banners, categories) are highly compressed into modern formats (WebP/AVIF) and correctly sized for the user's device, we will migrate all native `<img>` tags across the application to the Next.js `<Image>` component.

## User Review Required

- **Vercel Blob Hostname**: To allow Next.js to optimize images hosted on Vercel Blob, we must add Vercel Blob's hostname to the `remotePatterns` configuration in `next.config.mjs`.

## Open Questions

- Should we also optimize the images in the Admin Panel? Doing so will improve admin load times, but if you prefer we can strictly optimize the frontend customer-facing pages first. (Assuming **Yes** for this plan).

## Proposed Changes

---

### Configuration

#### [MODIFY] [next.config.mjs](file:///c:/Users/Pb/.gemini/antigravity-ide/scratch/holybuds/next.config.mjs)
- Add Vercel Blob (`*.public.blob.vercel-storage.com`) to the `images.remotePatterns` array.
- Add placehold.co or other dummy domains if used for seeding.

---

### Frontend Components

#### [MODIFY] [ProductCard.jsx](file:///c:/Users/Pb/.gemini/antigravity-ide/scratch/holybuds/src/components/ProductCard.jsx)
- Replace `<img src={product.image}>` with `<Image fill className="object-cover">`.

#### [MODIFY] [Navbar.jsx](file:///c:/Users/Pb/.gemini/antigravity-ide/scratch/holybuds/src/components/Navbar.jsx)
- Replace search dropdown thumbnail `<img>` with `<Image width={40} height={40}>`.

#### [MODIFY] [CartDrawer.jsx](file:///c:/Users/Pb/.gemini/antigravity-ide/scratch/holybuds/src/components/CartDrawer.jsx)
- Replace cart item thumbnail `<img>` with `<Image width={80} height={80}>`.

#### [MODIFY] [HomeClient.jsx](file:///c:/Users/Pb/.gemini/antigravity-ide/scratch/holybuds/src/app/HomeClient.jsx)
- Update Banner carousel `<img>` to `<Image fill>`.
- Update category thumbnails `<img>` to `<Image fill>`.

#### [MODIFY] [ProductClient.jsx](file:///c:/Users/Pb/.gemini/antigravity-ide/scratch/holybuds/src/app/product/[id]/ProductClient.jsx)
- Update main product gallery `<img>` tags to use `<Image fill>`.

---

### Admin Panel (Optional but Recommended)

#### [MODIFY] Admin Sidebar, Products List, Orders List, Banners List, Categories List
- Convert all preview `<img>` tags to use `<Image>` with appropriate width/height or `fill` to improve performance on the admin dashboard.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
- Deploy to Vercel and verify that images load correctly without broken image icons.
- Check Network tab to confirm images are being served as `webp` or `avif` and are loaded from Vercel's `_next/image?url=...` endpoint.
