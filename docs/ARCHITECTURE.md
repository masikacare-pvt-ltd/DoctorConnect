# MedConnect — Production Architecture Redesign

> **Status:** Design phase only. No application code has been written.
> **Goal:** Transform the existing Firebase-frontend demo into a production-ready application while preserving the current visual/UX design.
> **Constraint:** Keep Firebase (Auth, Firestore, Storage, Rules, Hosting). Use Groq (server-side, model from env) for AI. Remove every fake/mock/dead element.

---

## 0. Analysis of the Current Repository (evidence-based)

This section is derived strictly from reading the existing source (`src/**`, config files, `firestore.rules`, `package.json`, `metadata.json`).

### 0.1 Current architecture
- **Thick-client SPA.** React 19 + Vite 6 + TypeScript, Tailwind v4 (CSS-first). No backend server.
- All data access is performed **directly from components** via the Firebase web SDK inside a single `firebase.ts` module (565 lines) that mixes config, auth, data-access, seeding, and error helpers.
- Global UI state lives in one `useState<AppState>` in `App.tsx` (385 lines) and is **mirrored to `localStorage`** as the source of truth.

### 0.2 Current folder structure
```
index.html, package.json, vite.config.ts, tsconfig.json,
.env.example, .gitignore, README.md, metadata.json,
firebase-applet-config.json, firebase-blueprint.json, firestore.rules,
assets/ (unused),
src/
  main.tsx, App.tsx, firebase.ts, types.ts, index.css
  components/ (LandingPage, LoginScreen, SignupScreen, Dashboard,
               Discussions, ProfileScreen, UpgradeModal,
               NotificationToast, DoctorIllustration)
  utils/ (rewards.ts, time.ts)
```

### 0.3 Current data flow
Component → `App.tsx` handler → `firebase.ts` function → Firestore SDK → snapshot → `App.setState` → re-render. No service/repository layer, no API boundary.

### 0.4 Current authentication flow
Firebase email/password + anonymous "Guest Bypass". `onAuthStateChanged` is **imported but never used**; session is not resumed on reload (screen forced back to `landing`). Social login buttons (Google/Apple/LinkedIn) are **disabled placeholders**.

### 0.5 Current storage strategy
Images are read via `FileReader`, compressed on a `<canvas>` to base64 JPEG (~65%), and stored **as base64 strings inside Firestore document fields** (`cases.image`, `cases.secondaryImage`). The configured Firebase Storage bucket is **never used**.

### 0.6 Current routing
String-enum screen switch (`currentScreen`) inside `App.tsx`. No router, no URLs, no guards, no deep-linking.

### 0.7 Current state management
Single `AppState` in `App.tsx`, persisted to `localStorage`. No Context, no Redux, no hooks layer. `Dashboard` additionally keeps a **second, conflicting** `allComments` local state.

### 0.8 Current Firebase usage
- Firebase Auth (email/password, anonymous).
- Firestore: 3 collections (`users`, `cases`, `comments`).
- No Storage, no Functions, no Indexes config, no emulator config.

### 0.9 Current Firestore collections
- `users/{uid}`: profile fields.
- `cases/{caseId}`: full case incl. base64 images, `authorUid`, `commentsCount`, `viewsCount`, denormalized author.
- `comments/{commentId}`: `caseId`, author fields, text.

### 0.10 Current image upload flow
Picker/drag-drop → `FileReader` → base64 → canvas downscale → stored in component state → submitted as base64 inside case doc. "Progress bar" is **fake** (random %). Predefined Unsplash URLs also selectable.

### 0.11 Current security problems
- `firestore.rules`: `read: true` for **all** collections → every doctor's email/phone/profile is world-readable.
- `update, delete` allowed for **any authenticated user** (no ownership check).
- Hardcoded magic bypass literals `guest_bypass` and `seed_author_uid` allow document writes **without real ownership**.
- Firebase `apiKey` hardcoded in source and `firebase-applet-config.json` (committed).
- No input/field validation in rules; only client-side checks.
- `handleFirestoreError` logs the user's email + auth state to the browser console (PII leak).

### 0.12 Current performance problems
- Single bundle **1.57 MB (443 KB gzip)**; no code splitting; `vite build` warns >500 KB.
- `fetchAllRecentComments()` loads the **entire comments collection** on every Dashboard mount.
- `incrementCaseViews` and `saveNewComment` do **read-modify-write** (non-atomic) → count drift/races.
- `seedDatabaseIfEmpty` runs two full-collection scans on every load.
- No pagination, no lazy images, no `React.memo`.

### 0.13 Current scalability issues
- Base64-in-Firestore hits the **1 MB document limit** and bloats every read.
- No indexes config → composite queries (`comments` where `caseId` + order) will fail at runtime.
- O(N) full-collection reads; no cursors.

### 0.14 Current code smells
- God modules (`App.tsx`, `firebase.ts`).
- Dead constants `INITIAL_CASES_SEED` / `INITIAL_COMMENTS_SEED` (seeding removed, now only deletes).
- Duplicated sidebar/header/"Firestore Synced" indicator + online/offline listener across 3 screens.
- "Is this my case?" decided by `lastName.includes()` string matching.
- Fragile `timestamp: "Just now"` vs `createdAt` ISO duplication.

### 0.15 Current dead code / fake features
- Dead deps: `express`, `@google/genai`, `dotenv`, `tsx`, `autoprefixer` (unused).
- Fake: "Cases Shared" stat hardcodes `+24`; Discussions search input has **no handler**; Bookmarks/Share/Lab Results are toast-only; `UpgradeModal` "upgrade" is a no-op; AI/Gemini advertised but **not implemented**; `metadata.json` claims `SERVER_SIDE_GEMINI_API`.
- Dark mode force-disabled (`App.tsx` always removes `.dark`).

---

# 1. Software Architecture (Target)

## 1.1 Principles
- **Firebase as the only backend.** Auth, Firestore, Storage, Rules, Hosting.
- **Server-side AI.** Groq is called exclusively from a Firebase Cloud Function (key never reaches the browser). Model name from environment variable.
- **Strict layering.** Components → Hooks/Context → API layer → Services → Repositories → Firebase SDK. **No component may import `firebase/firestore` or call `addDoc`/`setDoc` directly.**
- **Firebase = source of truth.** `localStorage` is removed for application state. Theme preference lives in the user profile.
- **Realtime by default.** `onSnapshot` listeners with correct cleanup replace manual refetching.
- **Validation everywhere.** Shared schema validation (client + Cloud Function re-validation).
- **Zero fakes.** Every button, stat, and counter reads real data or is removed.

## 1.2 Layers
```
UI Components (presentational, no business logic)
        │  calls
React Hooks / Contexts (useAuth, useCases, useCase, useComments,
        useNotifications, useProfile, useBookmarks, useAiReport, Theme, Toast)
        │  calls
API Layer (src/api) — typed boundary, "behaves like a REST API"
        │  calls
Services (src/services) — business logic, orchestration, realtime setup
        │  use
Repositories (src/repositories) — raw Firestore/Storage read/write +
        query construction + pagination cursors
        │  use
Firebase SDK (auth, firestore, storage)
        │
Cloud Functions (functions/) — Groq AI, auth triggers, notifications,
        validation, admin-only writes
```

## 1.3 Technology decisions (final)
- Frontend: React 19, Vite 6, TypeScript (strict), Tailwind v4, `react-router-dom` v6, `motion`, `lucide-react`, `jspdf` (client PDF), `zod` (validation).
- Backend: Firebase Cloud Functions (v2, Node 20). `groq-sdk` for AI. `firebase-admin` for triggers.
- Remove: `express`, `@google/genai`, `dotenv`, `tsx`, `autoprefixer` (frontend), and dead constants.
- Add: `react-router-dom`, `zod`, `firebase-functions`, `firebase-admin`, `groq-sdk` (functions), `vitest` + `@testing-library/react` (tests).

---

# 2. Firestore Database Design

Normalization strategy: reference by `uid`/`caseId` (string FKs), denormalize **only** small display fields (author name/avatar) to avoid joins on hot paths, but keep authoritative data in `profiles`.

## 2.1 Collections

### `users/{uid}`  (account/identity)
| Field | Type | Notes |
|---|---|---|
| email | string | from Auth |
| emailVerified | bool | mirrored from Auth |
| role | 'doctor' \| 'admin' | default 'doctor' |
| status | 'active' \| 'disabled' | |
| verified | bool | doctor-verification readiness flag |
| profileCompleted | bool | drives profile-completion gate |
| createdAt | timestamp | server |
| updatedAt | timestamp | server |
| lastLoginAt | timestamp | server |

### `profiles/{uid}`  (professional info, separate from account)
| Field | Type | Validation |
|---|---|---|
| firstName | string(1–50) | required |
| lastName | string(1–50) | required |
| displayName | string | derived |
| avatarUrl | string | Storage URL or dicebear |
| designation | string(1–80) | |
| specializationId | string | ref → specializations |
| hospital | string(0–120) | |
| mobile | string(0–30) | |
| bio | string(0–500) | |
| credentials | array<string> | verification docs (ready, not enforced) |
| badges | map | computed/denormalized for display (optional) |
| createdAt / updatedAt | timestamp | |

### `specializations/{id}`  (static catalog, seeded once)
| Field | Type |
|---|---|
| name | string |
| slug | string |
| description | string |
| order | number |

Seed: Cardiology, Dermatology, Neurology, Radiology, Pediatrics, Pathology, General Medicine.

### `cases/{caseId}`
| Field | Type | Notes |
|---|---|---|
| caseNumber | string | server-generated, unique, e.g. `MC-XXXXXX` (Firestore counter or random+check) |
| title | string(4–120) | |
| authorUid | string | = request.auth.uid on create |
| authorName | string | denormalized display |
| authorAvatar | string | denormalized display |
| specializationId | string | ref |
| category | string | = specialization name (denormalized) |
| description | string(10–2000) | |
| urgent | bool | |
| diseaseTags | array<string>(0–12, each ≤30) | |
| caseQuote | string(0–280) | |
| status | 'open' \| 'resolved' | |
| aiReportId | string? | ref → aiReports |
| viewsCount | number | **server `increment()` only** |
| commentsCount | number | **server `increment()` only** |
| createdAt / updatedAt | timestamp | |

Images are **NOT** stored here. They live in `caseImages` and are resolved via query.

### `caseImages/{imageId}`
| Field | Type | Notes |
|---|---|---|
| caseId | string | ref |
| uploadedBy | string | = uid |
| storagePath | string | `cases/{uid}/{caseId}/{file}` |
| downloadURL | string | |
| thumbnailURL | string | |
| width / height | number | |
| size | number | bytes |
| contentType | string | |
| createdAt | timestamp | |

### `caseComments/{commentId}`
| Field | Type | Notes |
|---|---|---|
| caseId | string | ref |
| authorUid | string | = uid on create |
| authorName | string | denormalized |
| authorAvatar | string | denormalized |
| text | string(1–1000) | |
| attachmentName | string? | label only (no file) |
| createdAt | timestamp | |

### `notifications/{notifId}`
| Field | Type | Notes |
|---|---|---|
| userId | string | recipient (must != author for client-created) |
| type | enum | 'comment' \| 'bookmark' \| 'mention' \| 'ai_complete' \| 'system' |
| caseId | string? | |
| fromUid | string? | |
| fromName | string? | |
| text | string | |
| read | bool | default false |
| createdAt | timestamp | |

### `bookmarks` — subcollection `users/{uid}/bookmarks/{caseId}`
| Field | Type |
|---|---|
| caseId | string (= doc id) |
| title | string (denorm) |
| createdAt | timestamp |
> Subcollection chosen over a top-level collection for per-user ownership, query efficiency, and simpler rules. (Documented deviation from the example list, justified below.)

### `aiReports/{reportId}`
| Field | Type | Notes |
|---|---|---|
| caseId | string | ref |
| generatedBy | string | 'groq' |
| model | string | e.g. model name from env |
| promptVersion | string | |
| status | 'pending' \| 'completed' \| 'failed' | |
| confidence | number(0–1) | |
| findings | array<object> | structured |
| differentialDiagnosis | array<string> | |
| recommendations | array<string> | |
| severity | enum | 'low'\|'medium'\|'high'\|'critical' |
| disclaimer | string | mandatory |
| error | string? | on failure |
| createdAt / updatedAt | timestamp | |
> Writable only by the AI Cloud Function (admin). Readable by authenticated users.

### `activityLogs/{logId}`
| Field | Type | Notes |
|---|---|---|
| userId | string | actor |
| action | string | create_case, comment, upload, ai_generate, login, ... |
| entityType | string | |
| entityId | string? | |
| meta | map | |
| createdAt | timestamp |
> Written by Cloud Functions (admin) for audit; readable by the user themselves or admin.

### `reports/{reportId}`  (exported/shareable case report metadata)
| Field | Type |
|---|---|
| caseId | string |
| generatedBy | string (= uid) |
| format | 'pdf' |
| shareToken | string? | for signed external view |
| createdAt | timestamp |

### `settings/global`  (single doc)
| Field | Type | Notes |
|---|---|---|
| aiModel | string | default model name (mirrors env) |
| features | map | feature flags |
| updatedAt | timestamp | |

## 2.2 Relationships
- `profiles.uid == users.uid == auth.uid`
- `cases.authorUid → users/profiles`
- `caseImages.caseId → cases` (one-to-many; query by caseId)
- `caseComments.caseId → cases`
- `notifications.userId → users`
- `users/{uid}/bookmarks/{caseId} → cases`
- `aiReports.caseId → cases`

## 2.3 Indexes (firestore.indexes.json)
- `cases`: `specializationId` ASC, `createdAt` DESC
- `cases`: `authorUid` ASC, `createdAt` DESC
- `cases`: `createdAt` DESC (default feed)
- `cases`: `commentsCount` DESC (Most Commented)
- `caseImages`: `caseId` ASC, `createdAt` ASC
- `caseComments`: `caseId` ASC, `createdAt` ASC
- `notifications`: `userId` ASC, `createdAt` DESC
- `users/{uid}/bookmarks`: `createdAt` DESC
- `aiReports`: `caseId` ASC, `createdAt` DESC
- `activityLogs`: `userId` ASC, `createdAt` DESC

## 2.4 Security (summary; full rules in §5)
- `read` requires authentication for all clinical data (PHI protection).
- Writes require `request.auth.uid == resource.data.<ownerField>` and pass field/type/size validation.
- No `guest_bypass`, no `seed_author_uid`, no anonymous auth.
- `aiReports`, `activityLogs`, `settings` writes restricted to admin (`request.auth.token.admin`).

## 2.5 Query patterns
- Feed: `cases` ordered by `createdAt` desc, paginated (`limit(12)`, cursor).
- Filter by specialization: composite index above.
- Case thread: `caseImages` + `caseComments` by `caseId`.
- Notifications: by `userId` desc.
- Search: client-side filter on loaded page (MVP); later Algolia/Elastic optional.

## 2.6 Future scalability
- Subcollections for user-scoped data (bookmarks) avoid hot parent docs.
- `increment()` for counters avoids read-modify-write races.
- Pagination + indexes keep reads O(page).
- Storage URLs keep docs small (< 50 KB).
- Cloud Functions scale independently for AI.

## 2.7 Offline support
- Firestore persistence enabled (`enablePersistence`) for read cache.
- Writes queue offline and sync on reconnect (Firestore default).
- UI shows "Sync Paused / Synced" based on `firebase.auth`/`firestore` network state (real, not fake).
- Images: optional offline cache via Storage; MVP relies on browser HTTP cache of download URLs.

---

# 3. Folder Structure (Target)

```
medconnect/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── .eslintrc.cjs
├── .env.example
├── firebase.json                # hosting + functions + rules + indexes wiring
├── firestore.rules
├── storage.rules
├── firestore.indexes.json
├── .firebaserc
├── functions/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example             # GROQ_API_KEY, GROQ_MODEL
│   └── src/
│       ├── index.ts             # exports all functions
│       ├── config.ts            # env: GROQ_API_KEY, GROQ_MODEL
│       ├── auth.triggers.ts     # onCreate user → provision profile
│       ├── notifications.ts     # onCaseCommentCreate → notify case author
│       ├── ai.ts                # callable generateCaseAnalysis (Groq)
│       ├── validation.ts        # server-side schema checks
│       └── utils.ts
├── docs/
│   └── ARCHITECTURE.md
└── src/
    ├── main.tsx
    ├── App.tsx                  # router + providers only (no business logic)
    ├── index.css
    ├── config/
    │   └── firebase.ts          # init app/auth/db/storage, persistence
    ├── types/
    │   ├── domain.ts            # User, Profile, Case, Comment, ...
    │   └── ai.ts                # AiReport, GroqResponse
    ├── validation/
    │   ├── case.schema.ts       # zod
    │   ├── comment.schema.ts
    │   ├── profile.schema.ts
    │   └── index.ts
    ├── repositories/
    │   ├── firestore/
    │   │   ├── cases.repo.ts
    │   │   ├── comments.repo.ts
    │   │   ├── images.repo.ts
    │   │   ├── profiles.repo.ts
    │   │   ├── notifications.repo.ts
    │   │   ├── bookmarks.repo.ts
    │   │   ├── specializations.repo.ts
    │   │   ├── aiReports.repo.ts
    │   │   └── activity.repo.ts
    │   └── storage/
    │       └── images.storage.ts
    ├── services/
    │   ├── auth.service.ts
    │   ├── case.service.ts
    │   ├── comment.service.ts
    │   ├── image.service.ts
    │   ├── profile.service.ts
    │   ├── notification.service.ts
    │   ├── bookmark.service.ts
    │   ├── specialization.service.ts
    │   ├── ai.service.ts
    │   └── settings.service.ts
    ├── api/
    │   └── index.ts             # typed facade: api.cases.*, api.auth.*, ...
    ├── hooks/
    │   ├── useAuth.tsx          # AuthContext provider + useAuth
    │   ├── useCases.ts          # realtime list + pagination
    │   ├── useCase.ts           # realtime single case + images + comments
    │   ├── useComments.ts
    │   ├── useNotifications.ts
    │   ├── useProfile.ts
    │   ├── useBookmarks.ts
    │   ├── useAiReport.ts
    │   ├── useSpecializations.ts
    │   └── useTheme.tsx
    ├── contexts/
    │   └── ToastContext.tsx
    ├── ai/
    │   ├── prompt.builder.ts
    │   └── response.parser.ts
    ├── utils/
    │   ├── image.ts             # compress + thumbnail (canvas)
    │   ├── time.ts
    │   ├── id.ts
    │   └── badges.ts            # REAL counts from profile/case/comment data
    ├── routes/
    │   ├── ProtectedRoute.tsx
    │   └── PublicRoute.tsx
    ├── components/              # EXISTING UI preserved, rewired to hooks/api
    │   ├── LandingPage.tsx
    │   ├── LoginScreen.tsx
    │   ├── SignupScreen.tsx
    │   ├── Dashboard.tsx
    │   ├── Discussions.tsx
    │   ├── ProfileScreen.tsx
    │   ├── UpgradeModal.tsx     # becomes REAL premium (entitlement in profile; AI feature gated)
    │   ├── NotificationToast.tsx
    │   ├── DoctorIllustration.tsx
    │   └── (new) ForgotPassword.tsx, ProfileComplete.tsx, CaseDetail guarded via Discussions
    └── styles or assets as needed
```

---

# 4. Firebase Storage Design

## 4.1 Paths
- Avatars: `avatars/{uid}/{timestamp}_{file}`
- Case images: `cases/{uid}/{caseId}/{uuid}_{file}`
- Thumbnails: `cases/{uid}/{caseId}/thumbs/{uuid}_{file}`

## 4.2 Upload flow
1. User selects image(s) in Dashboard.
2. `utils/image.ts`: validate type (`image/*`), size ≤ 15 MB; draw to canvas, produce:
   - full: max 1600px longest side, JPEG 80%.
   - thumbnail: 400px, JPEG 70%.
3. `image.service.uploadCaseImages(caseId, files)`: for each file → `images.storage.upload(path, blob)` → get `downloadURL` → create `caseImages` doc (metadata only). Returns array of `caseImages`.
4. Case doc references images via query (no base64).
5. Progress: **real** `UploadTask.on('state_changed')` percentage (replaces fake random bar).

## 4.3 Compression & thumbnail
- Browser canvas compression (client-side) to limit Storage/egress cost.
- Thumbnails served for grids; full image lazy-loaded on detail.

## 4.4 Security (storage.rules)
- Read: authenticated users only (PHI). Optional signed URLs for external share (generated in Function, stored on `reports.shareToken`).
- Write: `request.auth != null` AND `resource.name` matches `avatars/{uid}/**` or `cases/{uid}/**` where `{uid} == request.auth.uid`; contentType starts with `image/`; `resource.size < 15 * 1024 * 1024`; limit file count via Function check.

## 4.5 Cleanup & deletion
- Deleting a case → `case.service.deleteCase` deletes all `caseImages` docs + their Storage objects (Function or batched client with ownership check), then the case doc.
- Deleting a comment → no images.
- Orphan detection: a periodic Function can sweep `caseImages` whose `caseId` no longer exists.

---

# 5. Security Rules Design

## 5.1 firestore.rules (complete)
```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuth() { return request.auth != null; }
    function isAdmin() { return isAuth() && request.auth.token.admin == true; }
    function isOwner(uid) { return isAuth() && request.auth.uid == uid; }
    function str(v, min, max) {
      return v is string && v.size() >= min && v.size() <= max;
    }
    function arrOfStr(v, maxLen, maxItem) {
      return v is list && v.size() <= maxLen &&
        v.all(function(x){ return x is string && x.size() <= maxItem; });
    }

    // -------- USERS --------
    match /users/{uid} {
      allow read: if isAuth();
      allow create, update: if isOwner(uid)
        && str(request.resource.data.email, 3, 200)
        && request.resource.data.keys().hasOnly(['email','emailVerified','role','status','verified','profileCompleted','createdAt','updatedAt','lastLoginAt']);
      allow delete: if isAdmin();
    }

    // -------- PROFILES --------
    match /profiles/{uid} {
      allow read: if isAuth();
      allow create, update: if isOwner(uid)
        && str(request.resource.data.firstName, 1, 50)
        && str(request.resource.data.lastName, 1, 50)
        && (request.resource.data.specializationId is string)
        && arrOfStr(request.resource.data.credentials, 10, 120)
        && request.resource.data.keys().hasOnly(['firstName','lastName','displayName','avatarUrl','designation','specializationId','hospital','mobile','bio','credentials','badges','createdAt','updatedAt']);
      allow delete: if isAdmin();
    }

    // -------- SPECIALIZATIONS --------
    match /specializations/{id} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }

    // -------- CASES --------
    match /cases/{caseId} {
      allow read: if isAuth();
      allow create: if isAuth()
        && request.resource.data.authorUid == request.auth.uid
        && str(request.resource.data.title, 4, 120)
        && str(request.resource.data.description, 10, 2000)
        && arrOfStr(request.resource.data.diseaseTags, 12, 30)
        && request.resource.data.keys().hasOnly(['caseNumber','title','authorUid','authorName','authorAvatar','specializationId','category','description','urgent','diseaseTags','caseQuote','status','aiReportId','viewsCount','commentsCount','createdAt','updatedAt']);
      allow update: if isOwner(resource.data.authorUid)
        && request.resource.data.keys().hasOnly(['title','description','urgent','diseaseTags','caseQuote','status','aiReportId','viewsCount','commentsCount','updatedAt']);
      allow delete: if isOwner(resource.data.authorUid) || isAdmin();
    }

    // -------- CASE IMAGES --------
    match /caseImages/{imageId} {
      allow read: if isAuth();
      allow create: if isAuth()
        && request.resource.data.uploadedBy == request.auth.uid
        && str(request.resource.data.caseId, 1, 100)
        && request.resource.data.keys().hasOnly(['caseId','uploadedBy','storagePath','downloadURL','thumbnailURL','width','height','size','contentType','createdAt']);
      allow delete: if isOwner(resource.data.uploadedBy) || isAdmin();
    }

    // -------- CASE COMMENTS --------
    match /comments/{commentId} {
      allow read: if isAuth();
      allow create: if isAuth()
        && request.resource.data.authorUid == request.auth.uid
        && str(request.resource.data.text, 1, 1000)
        && request.resource.data.keys().hasOnly(['caseId','authorUid','authorName','authorAvatar','text','attachmentName','createdAt']);
      allow update: if isOwner(resource.data.authorUid)
        && request.resource.data.keys().hasOnly(['text','updatedAt']);
      allow delete: if isOwner(resource.data.authorUid) || isAdmin();
    }

    // -------- NOTIFICATIONS --------
    match /notifications/{id} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuth()
        && request.resource.data.userId != request.auth.uid   // can't self-notify
        && str(request.resource.data.text, 1, 300)
        && request.resource.data.keys().hasOnly(['userId','type','caseId','fromUid','fromName','text','read','createdAt']);
      allow update: if isOwner(resource.data.userId)
        && request.resource.data.keys().hasOnly(['read','updatedAt']);
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }

    // -------- BOOKMARKS (per-user subcollection) --------
    match /users/{uid}/bookmarks/{caseId} {
      allow read, write: if isOwner(uid)
        && request.resource.data.keys().hasOnly(['caseId','title','createdAt']);
    }

    // -------- AI REPORTS (function-written) --------
    match /aiReports/{id} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }

    // -------- ACTIVITY LOGS --------
    match /activityLogs/{id} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow write: if isAdmin();
    }

    // -------- SETTINGS --------
    match /settings/{doc} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }
  }
}
```

## 5.2 storage.rules (complete)
```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuth() { return request.auth != null; }
    function uid() { return request.auth.uid; }

    match /avatars/{uId}/{file} {
      allow read: if isAuth();
      allow write: if isAuth() && uId == uid()
        && file.matches('^.{1,200}\\.(jpg|jpeg|png|webp)$')
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
    match /cases/{uId}/{caseId}/{file} {
      allow read: if isAuth();
      allow write: if isAuth() && uId == uid()
        && request.resource.size < 15 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
    match /cases/{uId}/{caseId}/thumbs/{file} {
      allow read: if isAuth();
      allow write: if isAuth() && uId == uid()
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 5.3 Removed vulnerabilities
- No `guest_bypass` / `seed_author_uid` literals.
- No anonymous auth.
- No `read: true`; all reads require auth.
- Ownership enforced on every mutable doc.
- Admin-only writes for AI/logs/settings.
- Field allow-lists + length/size limits block abuse.
- `apiKey` stays in `firebase-applet-config.json` (public by design) but rules now protect data; key can also be restricted in Firebase console.

---

# 6. Authentication Flow

- **Email/Password:** `auth.service.register(email, password, profile)` → `createUserWithEmailAndPassword` → Cloud Function `onCreate` provisions `users/{uid}` + `profiles/{uid}` (server-authored, `profileCompleted=false`) → client completes profile (update own). Login via `signInWithEmailAndPassword`.
- **Google Sign-In:** `signInWithPopup(googleProvider)` → `onCreate` provisions profile → if `profileCompleted==false`, route to `/complete-profile`.
- **Session persistence:** Firebase default `Persistence.LOCAL`; `AuthProvider` uses `onAuthStateChanged` to set user and drive routing. Refresh resumes session correctly.
- **Forgot password:** `sendPasswordResetEmail(email)` from LoginScreen.
- **Profile completion:** gate (`ProtectedRoute` redirects to `/complete-profile` when `profileCompleted==false`).
- **Role management:** `role` field; admin set via Firebase Admin/Function. UI shows admin-only controls if `role==='admin'`.
- **Doctor verification readiness:** `verified` bool + `credentials[]` array in profile; UI shows "Verification pending/verified" badge. (Actual credential vetting is out of scope but the structure is ready.)
- **Removed:** Guest Bypass, anonymous auth, disabled social placeholders (Google becomes real; Apple/LinkedIn removed or implemented later via Firebase providers).

---

# 7. Realtime Flow

Hooks subscribe with `onSnapshot` and **return unsubscribe in cleanup**:
- `useCases`: feed list, paginated (limit + cursor), realtime inserts/reorders.
- `useCase(caseId)`: case doc + `useComments(caseId)` + `useCaseImages(caseId)` (all realtime).
- `useNotifications`: realtime unread count + list; mark-read updates doc.
- `useProfile`: realtime profile (reflects edits instantly).
- `useBookmarks`: realtime bookmark state for toggle UI.
- `useAiReport(caseId)`: realtime report status (pending → completed/failed) so UI updates when the Function finishes.

All listeners are torn down on unmount (`useEffect` return). Pagination + realtime combined via `query(..., orderBy, limit, startAfter(cursor))` and appending snapshots.

---

# 8. AI Pipeline (Groq, server-side)

```
Doctor uploads images ─▶ Storage (original + thumbnail) ─▶ caseImages docs
        │
Doctor submits case (text + tags + specialization)
        │
UI: "Generate AI analysis" ─▶ api.ai.generate({ caseId })
        │  (callable Cloud Function, auth-required)
        ▼
Cloud Function generateCaseAnalysis:
   1. Load case + images (downloadURLs) from Firestore
   2. prompt.builder.build(case, images) → system+user prompt
   3. Call Groq: model = process.env.GROQ_MODEL (NOT hardcoded)
      - timeout via AbortController (~20s)
      - retries: 1 retry on 5xx/timeout; backoff
      - request: chat completion, response_format json (if supported) or
        instruction to return strict JSON
   4. response.parser: validate + coerce to AiReport shape
      - on invalid JSON → retry parse; if still invalid → status 'failed' + error
   5. Write aiReports/{id} (status completed/failed, confidence, findings,
      recommendations, severity, disclaimer) + set cases.aiReportId
   6. Write activityLogs (admin)
   7. Notify case author (notification type 'ai_complete')
        │
UI subscribes (useAiReport) → renders findings, confidence, suggestions,
mandatory disclaimer. Errors → toast, never fake.
```

- **Model config:** `GROQ_MODEL` env in Functions (e.g. `llama-3.3-70b-versatile`); `settings/global.aiModel` mirrors for display. Frontend never sees the key or hardcodes a model.
- **Confidence:** numeric 0–1 returned by the model or derived from response; displayed with clear labeling ("AI-generated, not a diagnosis").
- **Timeouts/retries/errors/invalid:** handled in Function; client surfaces status.
- **Logging:** Function logs request id, model, latency, token usage, failures (no PII beyond case id).

---

# 9. Data Flow Diagrams

### 9.1 Create case (end-to-end)
```
Dashboard(form+images)
  → image.service.uploadCaseImages → Storage + caseImages docs (realtime)
  → case.service.create({...}) → Firestore cases doc (authorUid=uid)
  → useCases listener appends card; viewsCount/commentsCount via increment()
```

### 9.2 Comment + notification
```
Discussions(comment) → comment.service.create
  → Firestore comments doc (authorUid=uid)
  → Function onCaseCommentCreate → notification to case.authorUid
  → useComments + useNotifications update in realtime
  → case.commentsCount increment()
```

### 9.3 AI
```
Discussions("Generate") → api.ai.generate(caseId)
  → Cloud Function → Groq → aiReports doc
  → useAiReport renders; case.aiReportId set
```

### 9.4 Auth/resume
```
App mount → AuthProvider.onAuthStateChanged
  → user? → load profile → route by profileCompleted
  → none? → /login
```

---

# 10. Component Interaction Diagram

```
<App> (Router + Providers: Auth, Toast, Theme)
 ├─ <PublicRoute>  ─ LandingPage, LoginScreen, SignupScreen, ForgotPassword
 └─ <ProtectedRoute> ─ (profileCompleted gate → ProfileComplete)
       ├─ Dashboard      ─ uses useCases, useCaseImages(draft), useProfile,
       │                  useNotifications, useSpecializations, useBookmarks,
       │                  useAuth; calls api.case.*, api.image.*, api.ai.*
       ├─ Discussions    ─ uses useCase, useComments, useAiReport, useBookmarks;
       │                  calls api.comment.*, api.ai.*, api.notifications.read
       ├─ ProfileScreen  ─ uses useProfile, useAuth; calls api.profile.*
       └─ UpgradeModal   ─ uses useProfile (entitlement); gates AI feature
<NotificationToast> (ToastContext)
```
No component imports `firebase/*` directly; all via `api/*` → `services/*` → `repositories/*`.

---

# 11. Migration Plan

**From current (demo) → target (production).**

1. **Backup** existing Firestore (if any real data) via `firebase firestore:export`.
2. **Cleanup legacy data** (Function or one-off script):
   - Delete all docs where `authorUid in ['guest_bypass','seed_author_uid']` in `cases`, `comments`, `users`.
   - Strip base64 `image`/`secondaryImage` fields from remaining `cases` (they become invalid under new rules).
3. **Provision specializations** (seed 7 docs).
4. **Backfill profiles:** for every existing `users` doc, create/align `profiles/{uid}`; set `profileCompleted` (true if enough fields) and `role='doctor'`.
5. **Re-home images:** any legacy cases would need re-upload to Storage (out of scope; legacy demo cases can be purged).
6. **Deploy new rules + indexes + storage.rules** before app switch.
7. **Cutover:** deploy new frontend (Hosting) + Functions. Remove `localStorage` usage; old clients invalidated by new rules.
8. **Verify:** auth, create case with Storage image, comment+notification, AI generate, refresh persistence, offline banner.

> Because the current repo has no real users/data of value (demo), the safe path is **purge legacy + seed specializations + ship new schema**. The plan above supports preserving real data if it ever exists.

---

# 12. Implementation Roadmap (phased; validate each phase)

- **Phase 0 — Architecture doc** (this document). ✅
- **Phase 1 — Scaffold & layering:** new folder structure, `config/firebase.ts`, remove dead deps (`express`,`@google/genai`,`dotenv`,`tsx`,`autoprefixer`), add `react-router-dom`,`zod`, eslint, `tsconfig` strict, `.env.example`, `firebase.json` skeleton. `App.tsx` becomes router+providers only. **Validate:** build, tsc 0 errors, eslint, no broken imports.
- **Phase 2 — Auth & rules v1:** `auth.service`, `AuthProvider`/`useAuth`, `ProtectedRoute`/`PublicRoute`, Login/Signup/ForgotPassword wired to services, `onCreate` provisioning Function, `profiles` + `users` rules. **Validate:** register/login/logout/refresh/password-reset; rules unit-tested in emulator.
- **Phase 3 — Cases & realtime:** `cases.repo`, `case.service`, `useCases`, `useCase`, `useSpecializations`; Dashboard rewired; pagination; remove localStorage state; real badges from real counts. **Validate:** create/list/sort/filter realtime; refresh persists; no localStorage.
- **Phase 4 — Storage & images:** `storage/images.storage`, `image.service`, `utils/image.ts` (compress+thumb+real progress), `caseImages` repo/rules, `storage.rules`. **Validate:** upload real image → Storage → caseImages → render; delete case cleans Storage.
- **Phase 5 — Comments, notifications, bookmarks:** services+hooks+rules; `onCaseCommentCreate` Function; realtime; remove decorative buttons; wire Discussions search to real filter. **Validate:** comment, notify, bookmark toggle, delete (ownership).
- **Phase 6 — AI (Groq):** Functions `ai.ts` + `config.ts` (GROQ_API_KEY/GROQ_MODEL), `ai.service`, `useAiReport`, `prompt.builder`, `response.parser`, `aiReports` rules, settings model. **Validate:** generate → structured report renders with disclaimer; timeout/retry/invalid handled; key never in browser.
- **Phase 7 — Profile, theme, premium, cleanup:** `useProfile` realtime edit; `useTheme` from profile; `UpgradeModal` becomes real entitlement gating AI; remove fake stats (`+24`), fake counters, placeholder links, unused constants/files. **Validate:** edit persists+realtime; dark mode works; no fakes remain.
- **Phase 8 — Performance:** `React.lazy` routes, dynamic `jspdf` import, `React.memo` list items, `useMemo` selectors, lazy images, listener cleanup audit, pagination tuning, bundle analysis. **Validate:** build, reduced bundle, no regressions.
- **Phase 9 — Security hardening & tests:** final rules/indexes, zod validation client+Function, upload validation, emulator security tests, remove console PII logging. **Validate:** attempt unauthorized writes in emulator → denied.
- **Phase 10 — Deploy & verify:** Firebase emulators suite, Vitest unit/integration, Hosting + Functions deploy, `firebase.json` wiring, CI (lint+typecheck+test+build+deploy), smoke test in prod.

**Gate:** each phase must pass build + `tsc --noEmit` (0 errors) + eslint + targeted manual/automated verification before the next begins.

---

# 13. Risk Analysis

| Risk | Impact | Mitigation |
|---|---|---|
| Groq latency/cold start | Slow AI | Function v2 min instances (optional), 20s timeout, optimistic UI + status, caching per case |
| Groq rate limits / cost | Failures | Per-user quota in Function, retry w/ backoff, free-tier model default, logs/alerts |
| Invalid/malformed AI JSON | Broken UI | `response.parser` strict validation; status `failed`; user sees error, not fake |
| Firestore rules misconfig → PHI leak | Critical | Emulator security tests in Phase 9; deny-by-default; admin-only writes |
| Removing anonymous/guest breaks flows | UX | Clear auth gates; Google real; no guest path |
| Migration data loss | Data | Export before purge; backfill script |
| Bundle still large | Perf | Code splitting + lazy load (Phase 8) |
| Realtime + pagination complexity | Bugs | Cursor-based append; unsubscribe cleanup; tests |
| Storage egress cost | Cost | Thumbnails for grids; cache headers; compress client-side |
| Env/secret leakage | Security | Groq key only in Functions env/Secret Manager; never in client |

---

# 14. Performance Strategy

- **Bundle:** route-level `React.lazy` (Dashboard/Discussions/Profile/Upgrade), dynamic `import('jspdf')` only on export, tree-shake Firebase modular SDK.
- **Memoization:** `React.memo` on `CaseCard`/`CommentItem`; `useMemo` for filtered/sorted lists; stable callbacks.
- **Query optimization:** indexes as in §2.3; `limit(12)` + cursor pagination; `select()` only needed fields where possible.
- **Image optimization:** thumbnails in grids, `loading="lazy"`, `decoding="async"`, responsive `sizes`; compressed at source.
- **Caching:** Firestore persistent cache; Hosting cache headers for static assets; long-cache hashed bundles.
- **Realtime hygiene:** one `onSnapshot` per collection/screen; always unsubscribe; avoid refetch loops (fix the `state.cases/comments` dependency bug).
- **Counter correctness:** `increment()` server-side (no drift).

---

# 15. Production Deployment Plan

1. **Firebase project:** keep `lifemonk-68437`; enable Auth (Email/Password + Google), Firestore, Storage, Functions, Hosting. Restrict API key in console.
2. **Config files:** `firebase.json` (hosting rewrite to `index.html`; functions runtime Node 20; `firestore.rules`, `storage.rules`, `firestore.indexes.json` linked); `.firebaserc` project.
3. **Functions deploy:** `firebase deploy --only functions` (ai, auth triggers, notifications). Set `GROQ_API_KEY`, `GROQ_MODEL` via `firebase functions:config:set` or Secret Manager.
4. **Rules/indexes:** `firebase deploy --only firestore:rules,firestore:indexes,storage`.
5. **Hosting:** `firebase deploy --only hosting` (SPA, HTTPS, custom domain optional).
6. **CI/CD (GitHub Actions):** on push/PR → `npm ci` → eslint → `tsc --noEmit` → Vitest → `vite build` → (main branch) deploy with service-account secret. Block merge on failure.
7. **Monitoring:** Firebase Performance Monitoring + Crashlytics (web), Functions logs/error reporting, budget alerts.
8. **Rollback:** Hosting version rollback + previous Functions version; rules are version-controlled.
9. **Verification in prod:** auth, upload, comment, AI, refresh persistence, offline banner, unauthorized-write denied (negative test).

---

## Consistency Check (cross-references)
- Every fake element in §0.15 maps to a removal or real implementation in Phases 3/5/7.
- `guest_bypass`/`seed_author_uid` removed everywhere (rules §5, auth §6, migration §11).
- AI is real via Groq Function (§8) with env model (§1.3, §8, §15).
- No `localStorage` app state (§1.2, Phase 3).
- Images in Storage, DB holds metadata (§4, Phase 4).
- Components never touch Firestore directly (§1.2, §10).
- Rules deny public write/edit/delete and enforce ownership/roles/validation (§5).

**This document is internally consistent and complete. Implementation may begin at Phase 1.**
