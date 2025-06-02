import slugify from 'slugify';

export function extractHeadingsFromHtml(htmlContent) {
  const headings = [];
  const headingRegex = /<h([2-4])(?:[^>]*id="([^"]*)")?[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    let id = match[2];
    const text = match[3].replace(/<[^>]+>/g, '').trim();

    if (!id) {
      id = slugify(text, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });
      let tempId = id;
      let counter = 1;
      while (headings.find((h) => h.id === tempId)) {
        tempId = `${id}-${counter}`;
        counter++;
      }
      id = tempId;
    }

    if (text) {
      headings.push({ id, level, text });
    }
  }
  return headings;
}
