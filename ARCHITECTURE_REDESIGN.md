# Existing website architecture

- TanStack Start file routes provide public pages, server-rendered metadata, and the protected admin console. The root retains tracking scripts, dealership schema, native-app handling, alerts, and shared shell.
- Public inventory comes from `listPublicCars` through the existing React Query cache. Car detail routes retain enquiries, test drives, sharing, and inspection information.
- Existing seller and contact routes submit through validated server functions; email and LMS integrations remain unchanged. No database or authentication changes are required.
- The Android interface remains locally bundled with hosted API transport; this website redesign does not build or release an Android update.
- Marketplace presentation remains separate from the reusable design-system library and the existing non-homepage shell. Locality pages reuse public inventory and explicitly distinguish listing location from the reader's locality.