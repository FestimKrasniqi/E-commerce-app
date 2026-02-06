# Codebase Issue Task Proposals

## 1) Typo fix task
**Issue:** The password-reset component and heading use “ForgetPassword”, which is grammatically incorrect and inconsistent with common naming (`ForgotPassword`).

**Evidence:** `const ForgetPassword = () => {` and `<h2 className="mb-4">ForgetPassword</h2>` in `frontend/src/Components/ForgetPassword.js`.

**Task proposal:**
- Rename the component/file from `ForgetPassword` to `ForgotPassword`.
- Update imports/usages in `frontend/src/App.js`.
- Update the page heading text to `Forgot Password`.

**Acceptance criteria:**
- No references to `ForgetPassword` remain.
- Route still renders correctly.
- Existing reset-password flow still works.

---

## 2) Bug fix task
**Issue:** Product image path handling is inconsistent between create and update flows.
- Create stores `req.file.path`.
- Update stores `req.file.filename`.
This can break image retrieval and delete behavior because saved values are in different formats.

**Evidence:** `image: req.file.path` in create and `updateData.image = req.file.filename` in update in `backend/controllers/ProductController.js`.

**Task proposal:**
- Standardize image persistence to one format (prefer full relative path used by create).
- If replacing an image, optionally clean up old file safely.
- Add validation/guarding for missing files.

**Acceptance criteria:**
- New and updated products persist image paths in the same format.
- Product image URLs remain valid after updates.
- Deleting a product with an updated image no longer risks referencing an invalid path format.

---

## 3) Comment/documentation discrepancy task
**Issue:** `frontend/src/PublicRoutes.js` has a stale comment that references a different file path/name than the actual file/component.

**Evidence:** Top-of-file comment is `// src/components/PublicOnlyRoute.js`, but actual file is `frontend/src/PublicRoutes.js`.

**Task proposal:**
- Update/remove the stale header comment to match current file name and location.
- Align naming in comments with actual exported component and route purpose.

**Acceptance criteria:**
- Header comments accurately reflect file path/component naming.
- No stale path comments remain in the route guard file.

---

## 4) Test improvement task
**Issue:** The default CRA test is still present and likely no longer matches the app UI (`learn react` link).

**Evidence:** `frontend/src/App.test.js` asserts `screen.getByText(/learn react/i)`.

**Task proposal:**
- Replace the boilerplate test with app-specific tests (e.g., landing page heading, navigation links, or auth route behavior).
- Mock router/context as needed.
- Keep tests deterministic and independent from backend network calls.

**Acceptance criteria:**
- `App.test.js` contains at least one meaningful assertion tied to real app behavior.
- Test suite runs without depending on removed CRA starter text.
