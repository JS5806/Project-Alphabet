# QuickLink UX Specification

## 1. Core Principles
- **Speed First:** No splash screens during redirection. Direct 301/302 execution.
- **Minimalism:** Single input field, single action button.

## 2. Feedback Loops
- **Validation:** Instant border color change on invalid URL regex.
- **Success:** Visual confirmation via Lucide CheckCircle icon and auto-highlight of the result link.

## 3. Technical Performance (Admin Checkpoints)
- Redirection Latency Target: < 10ms (achieved via In-memory Map/Redis).
- Collision Avoidance: Base62 encoding based on unique sequence/Snowflake IDs.