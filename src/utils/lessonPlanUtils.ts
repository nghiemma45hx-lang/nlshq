/**
 * Utility to process and re-align Lesson Plan HTML.
 * Moves all NLS and AI integration badges/blocks ([NLS ...], [AI-NL...], [Ứng dụng NLS & AI...])
 * from the Right Column ("Nội dung / Sản phẩm") to the Left Column ("Tổ chức thực hiện").
 */
export function relocateNlsToLeftColumn(htmlStr: string): string {
  if (!htmlStr) return htmlStr;

  // 1. Process HTML table rows <tr>...</tr> if table structure exists
  let processed = htmlStr.replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (fullTrMatch, trContent) => {
    // Extract cells inside this row
    const cellRegex = /<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
    const cells: { tag: string; attrs: string; content: string }[] = [];
    let cellMatch;

    while ((cellMatch = cellRegex.exec(trContent)) !== null) {
      cells.push({
        tag: cellMatch[1],
        attrs: cellMatch[2],
        content: cellMatch[3],
      });
    }

    // If row has at least 2 cells (Left = index 0: Tổ chức thực hiện, Right = index 1: Nội dung/Sản phẩm)
    if (cells.length >= 2) {
      // Check if this row is a header row (e.g. contains "Tổ chức thực hiện" or "Sản phẩm")
      const isHeaderRow = /tổ chức thực hiện|sản phẩm|nội dung/i.test(cells[0].content + cells[1].content);
      if (isHeaderRow && cells[0].tag.toLowerCase() === 'th') {
        return fullTrMatch;
      }

      let leftCell = cells[0].content;
      let rightCell = cells[1].content;

      // Check if rightCell contains NLS badges or blocks
      const hasNlsInRight = /\[(?:NLS|AI-NL)[^\]]*\]|\[Ứng dụng NLS/i.test(rightCell);

      if (hasNlsInRight) {
        const nlsBlocksToMove: string[] = [];

        // Extract <div> blocks containing [Ứng dụng NLS...] or [NLS...]
        rightCell = rightCell.replace(/<div\b[^>]*>[\s\S]*?(?:\[Ứng dụng NLS|\[NLS|\[AI-NL)[\s\S]*?<\/div>/gi, (block) => {
          nlsBlocksToMove.push(block);
          return '';
        });

        // Extract <p> blocks containing [Ứng dụng NLS...] or [NLS...]
        rightCell = rightCell.replace(/<p\b[^>]*>[\s\S]*?(?:\[Ứng dụng NLS|\[NLS|\[AI-NL)[\s\S]*?<\/p>/gi, (block) => {
          nlsBlocksToMove.push(block);
          return '';
        });

        // Extract <span> badges <span ...>[NLS ...]</span> or <span ...>[AI-NL...]</span>
        rightCell = rightCell.replace(/<span\b[^>]*>[\s\S]*?\[(?:NLS|AI-NL)[^\]]*\][\s\S]*?<\/span>/gi, (badge) => {
          nlsBlocksToMove.push(badge);
          return '';
        });

        // Extract inline [Ứng dụng NLS & AI...]: ... up to <br> or end
        rightCell = rightCell.replace(/\[Ứng dụng NLS[^\]]*\]:[^\n<]*/gi, (inlineText) => {
          nlsBlocksToMove.push(`<div class="my-1.5 p-2 bg-emerald-50/80 border-l-3 border-emerald-500 rounded-r text-[11px] text-emerald-900 font-sans"><b>${inlineText}</b></div>`);
          return '';
        });

        // Extract remaining raw [NLS ...] or [AI-NL...] bracket tags
        rightCell = rightCell.replace(/\[(?:NLS|AI-NL)[^\]]*\]/gi, (tag) => {
          nlsBlocksToMove.push(`<span class="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded font-mono text-xs ml-1">${tag}</span>`);
          return '';
        });

        // Clean up empty lines or residual colons/break tags in right cell
        rightCell = rightCell
          .replace(/^(?:\s*<br\s*\/?>|\s*:\s*|\s*<\/p>|\s*<\/div>)+/gi, '')
          .replace(/<p>\s*:\s*<\/p>/gi, '')
          .trim();

        if (nlsBlocksToMove.length > 0) {
          const movedContent = nlsBlocksToMove.join('\n');
          // Prepend moved NLS content to the top or bottom of left cell (Tổ chức thực hiện)
          leftCell = `<div class="mb-2 p-1.5 bg-indigo-50/50 rounded border border-indigo-100">${movedContent}</div>\n` + leftCell;

          cells[0].content = leftCell;
          cells[1].content = rightCell;

          const trTagMatch = fullTrMatch.match(/^<tr\b[^>]*>/i);
          const trOpenTag = trTagMatch ? trTagMatch[0] : '<tr>';
          
          let rebuiltCells = '';
          for (let i = 0; i < cells.length; i++) {
            rebuiltCells += `<${cells[i].tag}${cells[i].attrs}>${cells[i].content}</${cells[i].tag}>`;
          }
          return trOpenTag + rebuiltCells + '</tr>';
        }
      }
    }

    return fullTrMatch;
  });

  return processed;
}
