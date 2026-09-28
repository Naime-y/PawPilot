# PawPilot Customer Booking Architecture & Integration Guide

## 1. Customer Booking Journey
PawPilot implements a progressive, 6-stage customer booking journey tailored for **Paw & Polish** in Kalyani Nagar, Pune:
1. **Landing & Identification (`CustomerStep.tsx`)**:
   - Identifies the authenticated Firebase user (`currentUser.uid`) or guides guest onboarding.
   - Binds pet parent contact information (WhatsApp phone, email, and Pune area address).
2. **Pet Information & Temperament (`PetStep.tsx`)**:
   - Queries Firestore collection `pets` filtered strictly by `ownerUid == currentUser.uid`.
   - Allows selecting existing companions or registering new ones.
   - Collects required fields: Name, Species (Dog/Cat), Breed, Weight in kg, and Temperament (`calm`, `friendly`, `nervous`, `anxious`, `reactive`).
   - Collects optional fields: Age in years, First Visit indicator, and special handling requirements.
3. **Service Selection & Dynamic Duration (`ServiceStep.tsx`)**:
   - Queries active services from Firestore (`services` collection) for `businessId: 'paw-and-polish-pune'`.
   - Evaluates real-time dynamic duration through `calculateAppointmentDuration()`.
4. **Scheduling Preferences (`PreferencesStep.tsx`)**:
   - Captures target date, time-of-day preferences (Morning, Afternoon, Evening, Any), date flexibility (±1 day), and stylist instructions.
5. **Availability Foundation (`AvailabilityStep.tsx`)**:
   - Feeds the prospective slot interface with allocated duration and assigned Fear-Free groomer (Maya or Riya).
   - Displays clear notice that slot reservation is logged as `status: "requested"` for honest verification.
6. **Review & Firestore Submission (`ReviewStep.tsx` & `ConfirmationStep.tsx`)**:
   - Summarizes companion, calculated duration, service, price in INR, and schedule.
   - Submits validated booking payload to Firestore `appointments` collection.
   - Presents a receipt pass with reference code (`PP-XXXX`) and clear "Requested" status tracking.

---

## 2. Business Logic: Dynamic Duration Calculation (`src/services/durationService.ts`)
To safeguard against rushed appointments, base service durations are dynamically augmented based on pet characteristics:
* **Base Duration**: e.g., Full Groom (90 mins).
* **Weight Rule**:
  * Large breed ($\ge 25\text{ kg}$): $+30\text{ mins}$
  * Medium breed ($15\text{--}24\text{ kg}$): $+15\text{ mins}$
* **Temperament Rule**:
  * Anxious or Reactive: $+30\text{ mins}$ for Fear-Free sensory de-escalation and quiet drying.
  * Nervous: $+15\text{ mins}$ for gentle handling.
* **First Visit Rule**:
  * First Visit: $+15\text{ mins}$ for scent acclimation and treat reinforcement.

### Example (Bruno Demo Scenario):
* **Pet**: Bruno (Golden Retriever, $28\text{ kg}$, Anxious, First visit: Yes)
* **Service**: Full Groom (Base $90\text{ mins}$)
* **Calculation**: $90\text{m (Base)} + 30\text{m (Large)} + 30\text{m (Anxious)} + 15\text{m (First Visit)} = \mathbf{165\text{ mins}}$ ($2\text{ hr } 45\text{ min}$)
* Browser cannot manipulate the final calculated duration.

---

## 3. Validation & Security Boundaries (`src/services/bookingService.ts` & `firestore.rules`)
* **Ownership Integrity**:
  * `customerId` is strictly validated against `request.auth.uid`. A customer cannot submit a booking on behalf of another user.
  * `pet.ownerUid` must match `request.auth.uid`. A customer cannot select or submit another customer's pet.
* **Duration Integrity**:
  * Server-side/domain validator recomputes `calculateAppointmentDuration()`. Discrepancies abort the submission.
* **Business Isolation**:
  * Target `businessId` must match the salon (`paw-and-polish-pune`).
* **Idempotency & Double-Click Protection**:
  * Submission button disables immediately and shows loading indicators.

---

## 4. Current Booking Status Behavior & Deferred Concurrency
* **Current Status**: All newly submitted customer bookings receive `status = "requested"`.
* **Deferred Concurrency Engine**: In the subsequent scheduling step, a transactional server-authoritative mutex will be introduced to allocate locked slots and transition records to `confirmed`.
