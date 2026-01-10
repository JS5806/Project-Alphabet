# QA Checklist (Phase 4)

## 1. Visual QA (UX/UI)
- [ ] Font rendering consistency across Chrome/Safari.
- [ ] Responsive layout check: Mobile (375px), Tablet (768px), Desktop (1440px).
- [ ] High-resolution asset optimization check.

## 2. Frontend QA
- [ ] Unit Test Coverage > 80% (Vitest).
- [ ] Lighthouse Performance Score > 90.
- [ ] API Error Boundary: Display user-friendly message when backend is down.

## 3. Backend & Security
- [ ] Endpoint Authorization (JWT check).
- [ ] Input Validation: Prevent XSS and SQL Injection.
- [ ] Load Test: Handle 100 concurrent requests (JMeter/k6).

## 4. Infrastructure
- [ ] Memory threshold alerts configured in CloudWatch.
- [ ] DB Backup script verified.