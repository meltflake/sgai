// Feature flags that gate cross-PR wiring so each PR ships independently.
//
// TOPICS_ENABLED: the homepage / rails link to /topics/ only when true.
// The topic hub pages ship in a later PR; flipping this to true is that
// PR's last step. While false, no /topics/ link may appear in dist.
export const TOPICS_ENABLED = false;
