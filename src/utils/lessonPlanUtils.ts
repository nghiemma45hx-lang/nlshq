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

/**
 * Dynamically extract specific Lesson Title, Topic, or Lesson Number
 * from lesson content HTML or raw text.
 */
export function extractLessonTitle(contentHtml: string, subject: string, grade: string): string {
  if (!contentHtml) return `KHBD ${subject} (${grade}) - Tích hợp NLS`;

  // Strip HTML tags to get plain lines
  const cleanText = contentHtml.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // Search first 35 lines for explicit lesson title patterns
  for (const line of lines.slice(0, 35)) {
    // Check for "Tên bài dạy: ...", "TÊN BÀI DẠY: ...", "BÀI DẠY: ..."
    const matchExplicit = line.match(/(?:TÊN BÀI DẠY|Tên bài dạy|BÀI DẠY|Bài dạy|TÊN BÀI|Tên bài)\s*:\s*(.+)/i);
    if (matchExplicit && matchExplicit[1]?.trim().length > 3) {
      return matchExplicit[1].trim();
    }

    // Check for "Bài 9: HÔM NAY VÀ NGÀY MAI (13 tiết)", "Bài 1. ...", "Chủ đề 2: ...", "Tiết 12: ..."
    const matchBai = line.match(/^(Bài\s+\d+[^:\n]*:[^\n]+)/i) || 
                     line.match(/^(Bài\s+\d+\.[^\n]+)/i) ||
                     line.match(/^(Chủ đề\s+\d+[^:\n]*:[^\n]+)/i) ||
                     line.match(/^(Tiết\s+\d+[^:\n]*:[^\n]+)/i);
    if (matchBai && matchBai[1]?.trim().length > 5) {
      return matchBai[1].trim();
    }
  }

  // Check for lines starting with "Bài ", "BÀI ", "Chủ đề "
  for (const line of lines.slice(0, 45)) {
    if (/^(bài|chủ đề|tiết)\s+\d+/i.test(line) && line.length > 5 && line.length < 130) {
      return line;
    }
  }

  // Check for lines like "BÀI 9: ...", "CHỦ ĐỀ 3: ..."
  for (const line of lines.slice(0, 20)) {
    if (/^BÀI\s+/i.test(line) || /^CHỦ ĐỀ\s+/i.test(line)) {
      return line;
    }
  }

  return `KHBD ${subject} (${grade}) - Tích hợp NLS`;
}

/**
 * Format timestamp / dateString into full HH:mm - DD/MM/YYYY display.
 */
export function formatDateTime(dateString: string, createdAt?: number): string {
  if (createdAt && typeof createdAt === 'number' && !isNaN(createdAt) && createdAt > 1000000000) {
    const d = new Date(createdAt);
    const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${timeStr} - ${dateStr}`;
  }

  if (dateString && dateString.includes(':') && dateString.includes('-')) {
    return dateString;
  }

  // Fallback format current date with time if only date was provided
  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  if (dateString) {
    return `${timeStr} - ${dateString}`;
  }
  return `${timeStr} - ${now.toLocaleDateString('vi-VN')}`;
}

