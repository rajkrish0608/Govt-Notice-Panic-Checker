# Analytics Strategy
> **Goal**: Demonstrate growth thinking to investors by outlining how data would be used to improve the product.

## Key Metrics to Track

### 1. Acquisition & Engagement
- **Visitor Count**: Total unique visitors to `/`.
- **Engagement Rate**: % of visitors who interact with the text input field.
- **Conversion Rate**: % of visitors who click "Analyze Notice".

### 2. Analysis Performance
- **Success/Failure Rate**: Track HTTP 200 vs 400/500 responses on `/api/analyze`.
- **Latency**: Average time taken to generate an analysis.
- **Notice Type Distribution**: Breakdown of notice types (e.g., 40% Traffic, 30% Tax, 10% Scam).

### 3. User Retention
- **Return Rate**: Users who return within 7 days.
- **Result Scroll Depth**: Do users scroll down to see the full analysis?

## Implementation Plan (Future)

### Phase 1: Privacy-Preserving Analytics (e.g., Plausible / PostHog)
1.  Install analytics SDK.
2.  Track events:
    - `page_view` (Home, Terms, Privacy)
    - `analyze_click` (Metadata only: length of text, not content)
    - `result_view` (Did they see the result?)
3.  **Strict Privacy Controls**: NEVER track the actual PII or notice content.

### Phase 2: A/B Testing
- Test different "Don't Panic" headlines to see which drives more uploads.
- Test "Panic Level" UI variations (Color vs Text focus).

## Investor Value Proposition
This data will prove:
1.  **Market Demand**: Volume of users needing help.
2.  **Product Efficacy**: Users successfully getting "Low Panic" reassurance.
3.  **Monetization Potential**: Identifying high-frequency users (e.g., lawyers, businesses) for premium tiers.
