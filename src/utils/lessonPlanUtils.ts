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

      // Check if this row is for 'Đọc - tìm hiểu chung' / 'Tìm hiểu chung' / 'Tác giả, tác phẩm' / 'Đọc văn bản'
      const isReadingGeneralRow = /(?:đọc\s*-\s*tìm hiểu chung|i\.\s*đọc|i\.\s*tìm hiểu chung|1\.\s*tác giả|2\.\s*tác phẩm|b\.\s*đọc văn bản|tìm hiểu chung)/i.test(cells[0].content + cells[1].content);

      // Check if rightCell contains NLS badges or blocks
      const hasNlsInRight = /\[(?:NLS|AI-NL)[^\]]*\]|\[(?:Ứng dụng|Tích hợp) NLS/i.test(rightCell);

      // Auto-inject NLS Miền 1 into Left column if this is a 'Đọc - tìm hiểu chung' row and doesn't have NLS 1 yet
      const hasNls1 = /\[NLS 1/i.test(cells[0].content + cells[1].content);
      if (isReadingGeneralRow && !hasNls1) {
        const domain1Block = `<div class="my-1.5 p-2 bg-rose-50/90 border-l-3 border-rose-500 rounded-r text-[11px] text-rose-950 font-sans flex items-start flex-wrap gap-1.5"><span class="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-1.5 py-0.5 rounded font-mono text-xs shrink-0">[NLS 1.1-a]</span> <div><b>[Tích hợp NLS Miền 1 - Khai thác dữ liệu & Tra cứu thông tin]:</b> GV hướng dẫn HS sử dụng thiết bị số/Internet tra cứu thông tin tác giả, tác phẩm, bối cảnh và hoàn thành Phiếu học tập số (PHT).</div></div>`;
        leftCell = domain1Block + '\n' + leftCell;
        cells[0].content = leftCell;
      }

      if (hasNlsInRight) {
        const nlsBlocksToMove: string[] = [];

        // Extract <div> blocks containing [Ứng dụng NLS...] or [Tích hợp NLS...] or [NLS...]
        rightCell = rightCell.replace(/<div\b[^>]*>[\s\S]*?(?:\[(?:Ứng dụng|Tích hợp) NLS|\[NLS|\[AI-NL)[\s\S]*?<\/div>/gi, (block) => {
          const updatedBlock = block.replace(/\[Ứng dụng/g, '[Tích hợp').replace(/Ứng dụng NLS/g, 'Tích hợp NLS');
          nlsBlocksToMove.push(updatedBlock);
          return '';
        });

        // Extract <p> blocks containing [Ứng dụng NLS...] or [Tích hợp NLS...] or [NLS...]
        rightCell = rightCell.replace(/<p\b[^>]*>[\s\S]*?(?:\[(?:Ứng dụng|Tích hợp) NLS|\[NLS|\[AI-NL)[\s\S]*?<\/p>/gi, (block) => {
          const updatedBlock = block.replace(/\[Ứng dụng/g, '[Tích hợp').replace(/Ứng dụng NLS/g, 'Tích hợp NLS');
          nlsBlocksToMove.push(updatedBlock);
          return '';
        });

        // Extract <span> badges <span ...>[NLS ...]</span> or <span ...>[AI-NL...]</span>
        rightCell = rightCell.replace(/<span\b[^>]*>[\s\S]*?\[(?:NLS|AI-NL)[^\]]*\][\s\S]*?<\/span>/gi, (badge) => {
          nlsBlocksToMove.push(badge);
          return '';
        });

        // Extract inline [Ứng dụng NLS & AI...] or [Tích hợp NLS & AI...]: ... up to <br> or end
        rightCell = rightCell.replace(/\[(?:Ứng dụng|Tích hợp) NLS[^\]]*\]:[^\n<]*/gi, (inlineText) => {
          const cleanText = inlineText.replace(/^\[Ứng dụng/i, '[Tích hợp');
          nlsBlocksToMove.push(`<div class="my-1.5 p-2 bg-rose-50/90 border-l-3 border-rose-500 rounded-r text-[11px] text-rose-950 font-sans"><b>${cleanText}</b></div>`);
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
  if (!contentHtml) {
    const subClean = subject || 'Ngữ văn';
    const grdClean = grade || 'Khối THCS';
    return `Bài dạy ${subClean} (${grdClean}) - Tích hợp NLS`;
  }

  // Strip HTML tags to get plain text lines
  const cleanText = contentHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ');

  const lines = cleanText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 2);

  let detectedBai = '';
  let detectedDocVanBan = '';
  let detectedExplicit = '';

  // Non-title boilerplate keywords to filter out
  const isBoilerplate = (str: string) => {
    return /^(TRƯỜNG|PHÒNG GIÁO DỤC|TỔ CHUYÊN MÔN|CÔNG VĂN|THÔNG TƯ|QUYẾT ĐỊNH|BỘ GIÁO DỤC|CỘNG HÒA|ĐỘC LẬP|GIÁO VIÊN|HỌ VÀ TÊN|NGÀY SOẠN|LỚP|SĨ SỐ|I\.|II\.|III\.|IV\.|1\. Kiến thức|1\. Năng lực|MỤC TIÊU|THIẾT BỊ|TIẾN TRÌNH)/i.test(str);
  };

  // Search first 40 lines for explicit markers and key patterns
  for (const line of lines.slice(0, 45)) {
    if (isBoilerplate(line)) continue;

    // 1. Check for "TÊN BÀI DẠY: ...", "KẾ HOẠCH BÀI DẠY: ...", "BÀI DẠY: ...", "TÊN BÀI: ..."
    const matchExplicit = line.match(/(?:TÊN BÀI DẠY|Tên bài dạy|KẾ HOẠCH BÀI DẠY|BÀI DẠY|Bài dạy|TÊN BÀI|Tên bài|TÊN BÀI HỌC)\s*[:\-]\s*(.+)/i);
    if (matchExplicit && matchExplicit[1]?.trim().length > 3) {
      const candidate = matchExplicit[1].trim();
      if (!isBoilerplate(candidate) && candidate.toLowerCase() !== 'tích hợp nls') {
        detectedExplicit = candidate;
        break;
      }
    }

    // 2. Check for "Bài 9: HÔM NAY VÀ NGÀY MAI (13 tiết)", "Bài 1. ...", "Chủ đề 2: ...", "Tiết 12: ..."
    if (!detectedBai) {
      const matchBai = line.match(/^(Bài\s+\d+[^:\n]*:[^\n]+)/i) || 
                       line.match(/^(Bài\s+\d+\.[^\n]+)/i) ||
                       line.match(/^(Chủ đề\s+\d+[^:\n]*:[^\n]+)/i) ||
                       line.match(/^(Tiết\s+\d+[^:\n]*:[^\n]+)/i) ||
                       line.match(/^(Văn bản\s+\d+:[^\n]+)/i);
      if (matchBai && matchBai[1]?.trim().length > 4) {
        detectedBai = matchBai[1].trim();
      }
    }

    // 3. Check for specific text reading title like "B. Đọc văn bản: Nhà thơ của quê hương..." or "Đọc văn bản: ..." or "Văn bản 1: ..."
    if (!detectedDocVanBan) {
      const matchDoc = line.match(/(?:Đọc văn bản|Văn bản|Đọc - tìm hiểu chung|Văn bản 1|Văn bản 2|Văn bản 3)\s*[:\-]\s*([^\n]+)/i);
      if (matchDoc && matchDoc[1]?.trim().length > 3) {
        const val = matchDoc[1].trim();
        if (!/^(i|ii|iii|1|2|3|mục tiêu|thiết bị)/i.test(val)) {
          detectedDocVanBan = `Đọc văn bản: ${val}`;
        }
      }
    }
  }

  // Combine detected components if available
  if (detectedExplicit) {
    return detectedExplicit;
  }

  if (detectedBai && detectedDocVanBan) {
    // Avoid duplication if detectedDocVanBan is already inside detectedBai
    if (detectedBai.toLowerCase().includes(detectedDocVanBan.toLowerCase().replace('đọc văn bản:', '').trim())) {
      return detectedBai;
    }
    return `${detectedBai} - ${detectedDocVanBan}`;
  }

  if (detectedBai) {
    return detectedBai;
  }

  if (detectedDocVanBan) {
    return detectedDocVanBan;
  }

  // Check uppercase headings or lines starting with "BÀI ", "CHỦ ĐỀ ", "NGỮ VĂN "
  for (const line of lines.slice(0, 30)) {
    if (isBoilerplate(line)) continue;
    if (/^(bài|chủ đề|tiết|văn bản)\s+/i.test(line) && line.length > 5 && line.length < 140) {
      return line;
    }
  }

  for (const line of lines.slice(0, 20)) {
    if (isBoilerplate(line)) continue;
    if (line === line.toUpperCase() && line.length >= 8 && line.length <= 100 && !line.includes('CỘNG HÒA')) {
      return line;
    }
  }

  const subClean = subject || 'Ngữ văn';
  const grdClean = grade || 'Khối THCS';
  return `Bài dạy ${subClean} (${grdClean}) - Tích hợp NLS`;
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

