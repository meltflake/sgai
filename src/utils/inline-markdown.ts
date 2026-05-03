// Minimal Markdown renderer for trusted in-repo data strings.
// Supports: blank-line separated paragraphs, `- ` bullet lists,
// `1.` numbered lists, and `**bold**` inline emphasis.
// HTML in the input is escaped first — do not feed untrusted input.

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (s: string): string => escapeHtml(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

export function renderInlineMarkdown(src: string): string {
  const blocks = src.trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length > 0 && lines.every((l) => /^- /.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^- /, ''))}</li>`).join('');
        return `<ul class="list-disc list-outside ml-5 space-y-1">${items}</ul>`;
      }
      if (lines.length > 0 && lines.every((l) => /^\d+\.\s/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^\d+\.\s+/, ''))}</li>`).join('');
        return `<ol class="list-decimal list-outside ml-5 space-y-1">${items}</ol>`;
      }
      return `<p>${inline(block.replace(/\n/g, ' '))}</p>`;
    })
    .join('\n');
}
