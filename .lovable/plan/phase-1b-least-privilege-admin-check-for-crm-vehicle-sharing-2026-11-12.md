# Phase 1B: least-privilege admin check for CRM vehicle sharing (draft only)

## Goal
Admin-only CRM vehicle sharing (WhatsApp and Copy Link) works without letting any signed-in user ask whether some other account is an admin. All work happens in a new isolated draft. Production, real inventory and Phase 1C are not touched, and nothing is published.

## What changes for the user
- Admins can share vehicle links from the CRM again.
- Non-admins and signed-out visitors are still blocked.
- No one can use the new check to look up another person's role.

## Steps
1. **Create a new draft** with its own test database. Do not reuse or accept the earlier draft that used the broad grant.
2. **Investigate first** (read-only in the draft):
   - Who can currently execute `has_role`: `anon`, `authenticated`, `PUBLIC`.
   - Which policies and functions depend on it.
   - How admin pages pass today, given that authenticated cannot execute it, so the new path doesn't change how existing admin pages work.
   - Whether SECURITY INVOKER is enough to read your own row. The "view own roles" policy suggests yes, but the user_roles "manage" policy calls `has_role`, which could raise permission-denied for the caller. That decides INVOKER vs DEFINER.
3. **Add an own-user helper** with no arguments, so the caller cannot pass a user ID or a role.
4. **Switch the CRM vehicle-link server check** from `has_role(...)` to `is_current_user_admin()`. Leave the CRM page gate, the vehicle lookup, slug rules and UI unchanged.
5. **Add fixtures in the draft's test database only**: one admin, one non-admin, and example cars (active, sold, inactive, custom). No production data.
6. **Tests:**
   - Admin share works.
   - Non-admin and signed-out callers are denied.
   - Anon cannot execute the helper.
   - A call that tries to pass another user's ID is rejected because the function takes no arguments.
   - `has_role` is still not executable by authenticated.
   - Policies and grants are identical before and after (catalog diff).
   - Existing Phase 1A and Phase 1B unit tests still pass.
   - Browser test with the WhatsApp handoff captured, so nothing is sent.
7. **Report back**: exact SQL, function definition, grants, policy diff (expected: none), code diff, test results and limitations. Phase 1B stays marked "draft only, pending production review".

## Technical details

Planned migration (final INVOKER/DEFINER choice comes from step 2):
```sql
CREATE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
$$;
REVOKE ALL ON FUNCTION public.is_current_user_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_current_user_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
```
- **Search path:** empty, with fully qualified names and no dynamic SQL.
- **What it reveals:** only the caller's own admin status, which is already visible to them under the existing "view own roles" policy.
- **Choosing INVOKER instead:** if step 2 shows INVOKER works without errors, use INVOKER, since it has even less power.
- **has_role:** the function, its grants and all policies stay unchanged. No grant on `has_role` to authenticated.
- **Rollback:**
  ```sql
  REVOKE EXECUTE ON FUNCTION public.is_current_user_admin() FROM authenticated;
  ```
  Or drop the function after reverting the code.
- **Code:** `src/lib/crm-vehicle-link.functions.ts` replaces `rpc("has_role", {...})` with `rpc("is_current_user_admin")`. The handler tests are updated and run with `vitest.crm.config.ts`.

## Limitations to report
- Draft-only test data, not live inventory.
- No physical-device or real WhatsApp check.
- Production apply waits for your explicit approval.
