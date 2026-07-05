// Feature flags that gate cross-PR wiring so each PR ships independently.
//
// TOPICS_ENABLED: the homepage / rails link to /topics/ only when true.
// Flipped on in the topic-hub PR — the /topics/ routes now exist.
export const TOPICS_ENABLED = true;
