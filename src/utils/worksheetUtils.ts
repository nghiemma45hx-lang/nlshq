import html2canvas from 'html2canvas';

export interface WorksheetParams {
  schoolName: string;
  durationMinutes: string;
  workMode: 'Cá nhân' | 'Cặp đôi' | 'Nhóm' | string;
  subject: string;
  grade: string;
  lessonTitle: string;
  sourceNotes: string;
  additionalNotes?: string;
}

export function buildDynamicLocalWorksheet(params: WorksheetParams): string {
  const school = params.schoolName || 'Trường THCS Hồng Quang';
  const duration = params.durationMinutes || '20 phút';
  const mode = params.workMode || 'Nhóm';
  const subject = params.subject || 'Ngữ văn';
  const grade = params.grade || 'Khối 8';
  const title = params.lessonTitle || 'Khám phá tri thức bài học';
  const notes = params.sourceNotes ? params.sourceNotes.trim() : '';

  const noteSnippet = notes.length > 0 
    ? notes.slice(0, 800) + (notes.length > 800 ? '...' : '')
    : 'Không thấy trong tài liệu nguồn';

  return `
<div class="worksheet-container font-serif max-w-4xl mx-auto p-6 sm:p-8 bg-white text-slate-900 border-2 border-slate-900 rounded-xl shadow-lg my-4 text-sm leading-relaxed" id="worksheet-print-area">
  
  <!-- PHẦN 1: HEADER TRƯỜNG & TIÊU ĐỀ PHIẾU -->
  <div class="border-b-2 border-slate-900 pb-4 mb-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
      <div>
        <div class="font-extrabold uppercase text-xs sm:text-sm tracking-wider text-slate-800">${school}</div>
        <div class="text-xs text-slate-600 font-semibold italic">Tổ / Nhóm Chuyên môn: Khoa học tự nhiên & Xã hội</div>
      </div>
      <div class="text-right sm:text-right">
        <span class="inline-block px-3 py-1 bg-slate-100 border border-slate-400 font-bold text-xs uppercase tracking-wider rounded">
          PHIẾU KHÁM PHÁ KIẾN THỨC
        </span>
      </div>
    </div>

    <div class="text-center my-3">
      <h1 class="text-xl sm:text-2xl font-black uppercase tracking-wide text-indigo-950 font-sans">
        PHIẾU HỌC TẬP KHÁM PHÁ KIẾN THỨC
      </h1>
      <h2 class="text-base sm:text-lg font-bold text-slate-800 mt-1">
        BÀI DẠY: ${title.toUpperCase()}
      </h2>
      <div class="text-xs font-semibold text-slate-600 mt-0.5">
        Môn học: <span class="font-bold text-slate-900">${subject}</span> | Lớp: <span class="font-bold text-slate-900">${grade}</span>
      </div>
    </div>
  </div>

  <!-- PHẦN 2: THÔNG TIN HỌC SINH -->
  <div class="bg-slate-50 border border-slate-300 rounded-lg p-3.5 mb-5 font-sans">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <div>
        <span class="font-bold text-slate-800">Họ và tên học sinh / Tên nhóm:</span>
        <div class="border-b border-dotted border-slate-500 mt-1 min-h-[22px] flex items-end font-mono text-slate-700">...........................................................................................</div>
      </div>
      <div>
        <span class="font-bold text-slate-800">Lớp / Nhóm / Bàn:</span>
        <div class="border-b border-dotted border-slate-500 mt-1 min-h-[22px] flex items-end font-mono text-slate-700">...........................................................................................</div>
      </div>
      <div>
        <span class="font-bold text-slate-800">Thời lượng thực hiện:</span> <span class="font-bold text-indigo-900">${duration}</span>
      </div>
      <div>
        <span class="font-bold text-slate-800">Hình thức học tập:</span> <span class="font-bold text-emerald-800">${mode}</span>
      </div>
    </div>
  </div>

  <!-- PHẦN 3: MỤC TIÊU HỌC TẬP -->
  <div class="mb-5">
    <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wide border-l-4 border-indigo-700 pl-2.5 py-0.5 mb-2 font-sans bg-indigo-50/50">
      3. MỤC TIÊU HỌC TẬP
    </h3>
    <ul class="list-disc list-inside text-xs sm:text-sm text-slate-800 space-y-1 pl-2">
      <li><strong>Về kiến thức:</strong> Khám phá, phân tích và tự đúc kết các nội dung cốt lõi của bài <em>"${title}"</em> từ tài liệu nguồn được cung cấp.</li>
      <li><strong>Về năng lực:</strong> Phát triển năng lực quan sát, tư duy phản biện, tự học và hợp tác nhóm khi hoàn thành các nhiệm vụ.</li>
      <li><strong>Về phẩm chất:</strong> Chủ động, cẩn thận, trung thực và có trách nhiệm trong quá trình học tập.</li>
    </ul>
  </div>

  <!-- PHẦN 4: TÌNH HUỐNG KHỞI ĐỘNG -->
  <div class="mb-5 bg-amber-50/60 border border-amber-300 rounded-lg p-4">
    <h3 class="font-bold text-sm text-amber-950 uppercase tracking-wide border-l-4 border-amber-600 pl-2.5 py-0.5 mb-2 font-sans">
      4. TÌNH HUỐNG KHỞI ĐỘNG (Kích thích tò mò)
    </h3>
    <p class="text-xs sm:text-sm text-amber-900 italic leading-relaxed">
      Em hãy đọc thông tin gợi mở dưới đây và suy nghĩ trả lời câu hỏi xuất phát: Khi tiếp cận bài học này, vấn đề quan trọng nhất cần khám phá và giải quyết là gì?
    </p>
    <div class="mt-3 bg-white p-3 border border-amber-200 rounded font-mono text-xs text-slate-800">
      <strong>Vấn đề cần khám phá:</strong> Tìm hiểu quy luật / bản chất từ tài liệu nguồn và liên hệ thực tế.
    </div>
  </div>

  <!-- PHẦN 5: NHIỆM VỤ QUAN SÁT / ĐỌC TÀI LIỆU -->
  <div class="mb-5">
    <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wide border-l-4 border-indigo-700 pl-2.5 py-0.5 mb-2 font-sans bg-indigo-50/50">
      5. NHIỆM VỤ QUAN SÁT & ĐỌC TÀI LIỆU NGUỒN (NOTE)
    </h3>
    <div class="p-3.5 bg-slate-100 border border-slate-300 rounded-lg text-xs leading-relaxed text-slate-800 mb-2">
      <div class="font-bold text-indigo-900 mb-1">📖 TRÍCH ĐOẠN TÀI LIỆU NGUỒN DÙNG CHUNG PHIẾU:</div>
      <div class="whitespace-pre-wrap font-sans bg-white p-3 border border-slate-200 rounded text-slate-800">
        ${noteSnippet}
      </div>
      ${notes.length === 0 ? '<div class="text-rose-600 font-bold mt-2">⚠️ Không thấy trong tài liệu nguồn. Giáo viên vui lòng nhập Note nội dung bài học.</div>' : ''}
    </div>
  </div>

  <!-- PHẦN 6: CÂU HỎI GỢI MỞ TỪ DỄ ĐẾN KHÓ -->
  <div class="mb-5">
    <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wide border-l-4 border-indigo-700 pl-2.5 py-0.5 mb-2 font-sans bg-indigo-50/50">
      6. CÂU HỎI GỢI MỞ TỪ DỄ ĐẾN KHÓ
    </h3>
    <div class="space-y-4 text-xs sm:text-sm text-slate-800 pl-1">
      <div>
        <p class="font-bold text-slate-900">🔹 Mức 1 (Nhận biết): Dựa vào tài liệu nguồn, em hãy nêu khái niệm / từ khóa quan trọng chính trong đoạn trích?</p>
        <div class="border-b border-dotted border-slate-400 my-1.5 h-6"></div>
        <div class="border-b border-dotted border-slate-400 my-1.5 h-6"></div>
      </div>

      <div>
        <p class="font-bold text-slate-900">🔹 Mức 2 (Thông hiểu): Hãy giải thích vì sao nội dung trên lại đóng vai trò quan trọng? So sánh sự khác biệt cơ bản nếu có?</p>
        <div class="border-b border-dotted border-slate-400 my-1.5 h-6"></div>
        <div class="border-b border-dotted border-slate-400 my-1.5 h-6"></div>
        <div class="border-b border-dotted border-slate-400 my-1.5 h-6"></div>
      </div>

      <div>
        <p class="font-bold text-slate-900">🔹 Mức 3 (Vận dụng): Nếu ứng dụng công thức / biểu thức $\\displaystyle f(x) = \\int a x dx$ hoặc nguyên lý bài học vào bài tập thực tế, em sẽ thực hiện theo các bước nào?</p>
        <div class="border-b border-dotted border-slate-400 my-1.5 h-6"></div>
        <div class="border-b border-dotted border-slate-400 my-1.5 h-6"></div>
      </div>
    </div>
  </div>

  <!-- PHẦN 7: BẢNG HOẶC CHỖ TRỐNG ĐỂ HỌC SINH HOÀN THÀNH -->
  <div class="mb-5">
    <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wide border-l-4 border-indigo-700 pl-2.5 py-0.5 mb-2 font-sans bg-indigo-50/50">
      7. BẢNG TỔNG HỢP & HOÀN THÀNH NHIỆM VỤ (CHỖ TRỐNG LÀM BÀI)
    </h3>
    <p class="text-xs text-slate-600 mb-2 italic">Em hãy đọc kỹ tài liệu nguồn và điền đầy đủ nội dung thích hợp vào các ô trống dưới đây:</p>
    
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-slate-900 text-xs text-left">
        <thead>
          <tr class="bg-slate-200 text-slate-900 font-extrabold font-sans">
            <th class="border border-slate-900 p-2 text-center w-12">STT</th>
            <th class="border border-slate-900 p-2 w-1/3">Tiêu chí / Khái niệm</th>
            <th class="border border-slate-900 p-2">Nội dung học sinh hoàn thành (Điền vào chỗ trống)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-900 p-2 text-center font-bold">1</td>
            <td class="border border-slate-900 p-2 font-bold bg-slate-50">Đặc điểm / Khái niệm chính</td>
            <td class="border border-slate-900 p-2 min-h-[40px]">
              ..........................................................................................................................................
            </td>
          </tr>
          <tr>
            <td class="border border-slate-900 p-2 text-center font-bold">2</td>
            <td class="border border-slate-900 p-2 font-bold bg-slate-50">Biểu hiện / Công thức LaTeX</td>
            <td class="border border-slate-900 p-2 min-h-[40px]">
              $E = mc^2$ hoặc $a^2 + b^2 = c^2$ ................................................................................
            </td>
          </tr>
          <tr>
            <td class="border border-slate-900 p-2 text-center font-bold">3</td>
            <td class="border border-slate-900 p-2 font-bold bg-slate-50">Ứng dụng / Ý nghĩa thực tiễn</td>
            <td class="border border-slate-900 p-2 min-h-[40px]">
              ..........................................................................................................................................
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- PHẦN 8: PHẦN HỌC SINH TỰ RÚT RA KẾT LUẬN -->
  <div class="mb-5">
    <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wide border-l-4 border-indigo-700 pl-2.5 py-0.5 mb-2 font-sans bg-indigo-50/50">
      8. PHẦN HỌC SINH TỰ RÚT RA KẾT LUẬN (Ghi nhớ cốt lõi)
    </h3>
    <div class="border-2 border-indigo-900 rounded-lg p-3 bg-indigo-50/20">
      <div class="font-bold text-xs text-indigo-950 mb-1">✍️ KẾT LUẬN TỰ ĐÚC KẾT CỦA HỌC SINH / NHÓM:</div>
      <p class="text-xs text-slate-700 italic mb-2">Qua các hoạt động quan sát và phân tích trên, em rút ra quy tắc/bài học quan trọng nhất là:</p>
      <div class="border-b border-dotted border-slate-500 my-1.5 h-6"></div>
      <div class="border-b border-dotted border-slate-500 my-1.5 h-6"></div>
      <div class="border-b border-dotted border-slate-500 my-1.5 h-6"></div>
    </div>
  </div>

  <!-- PHẦN 9: HAI CÂU KIỂM TRA NHANH -->
  <div class="mb-5">
    <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wide border-l-4 border-indigo-700 pl-2.5 py-0.5 mb-2 font-sans bg-indigo-50/50">
      9. HAI CÂU KIỂM TRA NHANH (LUYỆN TẬP CỦNG CỐ)
    </h3>
    <div class="space-y-3 text-xs sm:text-sm text-slate-800 pl-1">
      <div class="bg-slate-50 p-3 border border-slate-300 rounded">
        <p class="font-bold text-slate-900">Câu 1 (Trắc nghiệm): Đâu là khẳng định chính xác nhất theo tài liệu bài học?</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 font-sans text-xs">
          <div>[ ] A. Khẳng định 1 dựa trên tài liệu nguồn</div>
          <div>[ ] B. Khẳng định 2 chưa chính xác</div>
          <div>[ ] C. Khẳng định 3 phân tích nguyên lý</div>
          <div>[ ] D. Tất cả các phương án trên</div>
        </div>
      </div>

      <div class="bg-slate-50 p-3 border border-slate-300 rounded">
        <p class="font-bold text-slate-900">Câu 2 (Tự luận ngắn): Em hãy giải thích ngắn gọn trong 2-3 dòng bài học kinh nghiệm qua bài học này?</p>
        <div class="border-b border-dotted border-slate-400 my-1.5 h-6"></div>
        <div class="border-b border-dotted border-slate-400 my-1.5 h-6"></div>
      </div>
    </div>
  </div>

  <!-- PHẦN 10: PHẦN TỰ ĐÁNH GIÁ CỦA HỌC SINH & NHẬN XÉT GIÁO VIÊN -->
  <div class="border-t-2 border-slate-900 pt-4 font-sans">
    <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wide border-l-4 border-indigo-700 pl-2.5 py-0.5 mb-3">
      10. TỰ ĐÁNH GIÁ CỦA HỌC SINH VÀ NHẬN XÉT CỦA GIÁO VIÊN
    </h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <!-- Học sinh tự đánh giá -->
      <div class="border border-slate-400 rounded-lg p-3 bg-slate-50">
        <div class="font-bold text-slate-900 mb-2">📌 Mức độ tự đánh giá của Học sinh:</div>
        <div class="space-y-1.5 text-slate-800">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-indigo-600" />
            <span>[ ] Đã hiểu rõ và tự làm được bài</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-indigo-600" />
            <span>[ ] Đã hiểu bài nhưng cần luyện tập thêm</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-indigo-600" />
            <span>[ ] Cần cô giáo hướng dẫn lại phần khó</span>
          </label>
        </div>
        <div class="mt-3">
          <span class="font-bold text-slate-800">Điều em ấn tượng nhất hoặc câu hỏi muốn hỏi thêm:</span>
          <div class="border-b border-dotted border-slate-400 mt-1 min-h-[20px]">...........................................................................................</div>
        </div>
      </div>

      <!-- Nhận xét Giáo viên -->
      <div class="border border-slate-400 rounded-lg p-3 bg-indigo-50/40">
        <div class="font-bold text-indigo-950 mb-2">👨‍🏫 Nhận xét & Đánh giá của Giáo viên:</div>
        <div class="space-y-2 text-slate-800">
          <div>
            <span>Mức độ tích cực & hoàn thành nhiệm vụ:</span>
            <div class="flex items-center space-x-3 mt-1 font-bold text-slate-700">
              <span>[ ] Tốt</span>
              <span>[ ] Khá</span>
              <span>[ ] Đạt</span>
              <span>[ ] Cần cố gắng</span>
            </div>
          </div>
          <div>
            <span>Lời phê của giáo viên:</span>
            <div class="border-b border-dotted border-slate-500 mt-1 min-h-[20px]">...........................................................................................</div>
            <div class="border-b border-dotted border-slate-500 mt-1 min-h-[20px]">...........................................................................................</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- PHẦN TÁCH BIỆT: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT (DÀNH CHO GIÁO VIÊN) -->
  <div class="mt-12 pt-8 border-t-4 border-dashed border-indigo-900 font-sans" style="page-break-before: always;">
    <div class="bg-indigo-950 text-amber-300 p-4 rounded-xl mb-6 shadow text-center">
      <div class="text-xs font-bold uppercase tracking-widest text-indigo-200">DÀNH CHO GIÁO VIÊN BIÊN SOẠN & GIẢNG DẠY</div>
      <h2 class="text-lg sm:text-xl font-black uppercase tracking-wide mt-1">
        ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT
      </h2>
      <p class="text-xs text-indigo-200 italic mt-0.5">
        (Căn cứ duy nhất trên ngữ liệu gốc gửi lên - Tách biệt hoàn toàn khỏi phiếu học tập của học sinh)
      </p>
    </div>

    <div class="space-y-4 text-xs sm:text-sm text-slate-900 leading-relaxed">
      
      <!-- Lời giải cho Câu hỏi gợi mở -->
      <div class="bg-slate-50 border border-slate-300 rounded-lg p-4">
        <h4 class="font-bold text-indigo-950 uppercase border-b border-indigo-200 pb-1.5 mb-2">
          1. Lời giải chi tiết phần Câu hỏi gợi mở (Mức 1 - Mức 3)
        </h4>
        <ul class="space-y-2 list-disc list-inside text-slate-800">
          <li><strong>Mức 1 (Nhận biết):</strong> Từ khóa/Khái niệm chính rút ra trực tiếp từ tài liệu gốc gửi lên: <em>"${noteSnippet.slice(0, 120)}..."</em></li>
          <li><strong>Mức 2 (Thông hiểu):</strong> Học sinh giải thích vai trò, nguyên lý theo đúng luận điểm có trong tài liệu nguồn.</li>
          <li><strong>Mức 3 (Vận dụng):</strong> Học sinh vận dụng các bước hoặc nguyên lý từ tài liệu nguồn để thực hiện bài tập.</li>
        </ul>
      </div>

      <!-- Đáp án hoàn chỉnh cho Bảng tổng hợp -->
      <div class="bg-slate-50 border border-slate-300 rounded-lg p-4">
        <h4 class="font-bold text-indigo-950 uppercase border-b border-indigo-200 pb-1.5 mb-2">
          2. Đáp án mẫu điền Bảng tổng hợp & Hoàn thành nhiệm vụ
        </h4>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-slate-700 text-xs text-left">
            <thead>
              <tr class="bg-indigo-100 text-indigo-950 font-bold">
                <th class="border border-slate-700 p-2 w-12 text-center">STT</th>
                <th class="border border-slate-700 p-2 w-1/3">Tiêu chí</th>
                <th class="border border-slate-700 p-2">Nội dung đáp án chuẩn từ tài liệu nguồn</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-slate-700 p-2 text-center font-bold">1</td>
                <td class="border border-slate-700 p-2 font-bold bg-slate-100">Đặc điểm / Khái niệm chính</td>
                <td class="border border-slate-700 p-2">Được tổng hợp chính xác từ trích đoạn ngữ liệu nguồn gửi lên.</td>
              </tr>
              <tr>
                <td class="border border-slate-700 p-2 text-center font-bold">2</td>
                <td class="border border-slate-700 p-2 font-bold bg-slate-100">Biểu hiện / Quy tắc cốt lõi</td>
                <td class="border border-slate-700 p-2">Căn cứ đúng theo các luận điểm/công thức có trong văn bản nguồn.</td>
              </tr>
              <tr>
                <td class="border border-slate-700 p-2 text-center font-bold">3</td>
                <td class="border border-slate-700 p-2 font-bold bg-slate-100">Ứng dụng / Bài học đúc kết</td>
                <td class="border border-slate-700 p-2">Đúc kết thông điệp chính hoặc nguyên lý hoạt động từ tài liệu gốc.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Đáp án & Thang điểm cho 2 câu kiểm tra nhanh -->
      <div class="bg-slate-50 border border-slate-300 rounded-lg p-4">
        <h4 class="font-bold text-indigo-950 uppercase border-b border-indigo-200 pb-1.5 mb-2">
          3. Đáp án & Thang điểm 2 câu Kiểm tra nhanh
        </h4>
        <p class="mb-1.5"><strong>Câu 1 (Trắc nghiệm):</strong> Đáp án đúng là <strong>A</strong> (Căn cứ trực tiếp theo văn bản ngữ liệu gửi lên). <em>(Thang điểm: 5.0 điểm)</em></p>
        <p><strong>Câu 2 (Tự luận ngắn):</strong> Học sinh giải thích ngắn gọn trong 2-3 dòng đúng các ý chính từ bài học, không thêm chi tiết ngoài ngữ liệu gốc. <em>(Thang điểm: 5.0 điểm)</em></p>
      </div>

    </div>
  </div>

</div>
  `.trim();
}

/**
 * Export HTML string as Word Document (.docx / .doc)
 */
export function exportToWordDocument(htmlContent: string, fileName = 'Phieu_Hoc_Tap.doc') {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Phiếu Học Tập</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #111; }
        h1 { font-size: 18pt; text-align: center; color: #0f172a; font-weight: bold; margin-bottom: 4px; }
        h2 { font-size: 14pt; text-align: center; color: #1e293b; font-weight: bold; margin-bottom: 12px; }
        h3 { font-size: 13pt; font-weight: bold; color: #0f172a; background-color: #f1f5f9; padding: 4px; border-left: 4px solid #3730a3; margin-top: 12px; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 12px; }
        th, td { border: 1px solid #000; padding: 6px; font-size: 12pt; text-align: left; }
        th { background-color: #e2e8f0; font-weight: bold; }
        .border-dotted { border-bottom: 1px dotted #666; }
      </style>
    </head>
    <body>
  `;
  const footer = `</body></html>`;
  const fullHtml = header + htmlContent + footer;

  const blob = new Blob(['\ufeff', fullHtml], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.doc') || fileName.endsWith('.docx') ? fileName : `${fileName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Print / Save PDF using clean browser Print window
 */
export function printWorksheetDocument(elementId: string) {
  const printElement = document.getElementById(elementId);
  if (!printElement) {
    alert('Không tìm thấy vùng in phiếu học tập.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Vui lòng cho phép popup trình duyệt để mở cửa sổ in phiếu.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Phiếu Học Tập - In / Tải PDF</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { margin: 0; padding: 10px; font-family: 'Times New Roman', serif; }
            #worksheet-print-area { border: 2px solid #000 !important; box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body class="p-4 bg-slate-100 flex justify-center">
        <div class="w-full max-w-4xl">
          ${printElement.outerHTML}
        </div>
        <script>
          setTimeout(() => {
            window.print();
          }, 600);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Export Worksheet HTML as PNG image
 */
export async function exportWorksheetAsImage(elementId: string, fileName = 'Phieu_Hoc_Tap.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Không tìm thấy thẻ phiếu học tập để tạo ảnh.');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imgData;
    a.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error('Error exporting image:', err);
    alert('Không thể tạo ảnh phiếu học tập: ' + String(err));
  }
}
