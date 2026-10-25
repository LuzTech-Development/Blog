interface FileNameTransformerOptions {
  style?: 'v1' | 'v2';
  hideDot?: boolean;
}

/**
 * Custom Shiki transformer that adds file name labels to code blocks.
 *
 * This transformer looks for the `file="filename"` meta attribute in code blocks
 * and creates a styled label showing the filename. It supports two different
 * styling options and can optionally hide the green dot indicator.
 */
export const transformerFileName = ({
  style = 'v2',
  hideDot = false
}: FileNameTransformerOptions = {}) => ({
  // The `this` context and `node` are Shiki's HAST types, which are not
  // exported from a direct dependency. We keep them loosely typed to avoid
  // a fragile transitive import; the original `.js` file was untyped here.
  pre(this: any, node: any) {
    // Add CSS custom property to the node
    const fileNameOffset = style === 'v1' ? '0.75rem' : '-0.75rem';
    node.properties.style =
      (node.properties.style || '') + `--file-name-offset: ${fileNameOffset};`;

    const raw = this.options.meta?.__raw?.split(' ');

    if (!raw) return;

    const metaMap = new Map<string, string>();

    for (const item of raw) {
      const [key, value] = item.split('=');
      if (!key || !value) continue;
      metaMap.set(key, value.replace(/["'`]/g, ''));
    }

    const file = metaMap.get('file');

    if (!file) return;

    // Add additional margin to code block
    this.addClassToHast(
      node,
      `mt-8 ${style === 'v1' ? 'rounded-tl-none' : ''}`
    );

    // Add file name to code block
    node.children.push({
      type: 'element',
      tagName: 'span',
      properties: {
        class: [
          'absolute py-1 text-foreground text-xs font-medium leading-4',
          hideDot
            ? 'px-2'
            : 'pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2',
          style === 'v1'
            ? 'left-0 -top-6 rounded-t-md border border-b-0 bg-muted/50'
            : 'left-2 top-(--file-name-offset) border rounded-md bg-background'
        ]
      },
      children: [
        {
          type: 'text',
          value: file
        }
      ]
    });
  }
});
