import { CompetencyDomain, LegalDocument, LessonPlanItem } from '../types';

export const COMPETENCY_DOMAINS: CompetencyDomain[] = [
  {
    id: "domain-1",
    code: "MIỀN 1 - TT 02/2025",
    title: "Khai thác dữ liệu và thông tin",
    icon: "Search",
    framework: "TT 02/2025/TT-BGDĐT",
    description: "Xác định nhu cầu thông tin; tìm kiếm, lọc, phân tích và đánh giá độ tin cậy của dữ liệu và nội dung số.",
    fullDescription: "Tập trung vào khả năng xác định rõ nhu cầu thông tin; truy cập, lọc và khai thác kết quả tìm kiếm trong môi trường số. Phân tích, so sánh và đánh giá độ tin cậy, tính xác thực của nguồn dữ liệu và nội dung số để hỗ trợ ra quyết định hoặc giải quyết vấn đề.",
    components: [
      { code: "1.1", title: "Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số", tag: "[NLS 1.1-a]" },
      { code: "1.2", title: "Đánh giá dữ liệu, thông tin và nội dung số (Độ tin cậy & Tính xác thực)", tag: "[NLS 1.2-b]" },
      { code: "1.3", title: "Quản lý, tổ chức và lưu trữ dữ liệu, thông tin và nội dung số", tag: "[NLS 1.3-a]" }
    ],
    lessonGuide: "Tích hợp mạnh ở Hoạt động 1 (Khởi động) và Hoạt động 2 (Hình thành kiến thức mới): Giao nhiệm vụ cho học sinh tự tìm kiếm dữ liệu, phân tích biểu đồ, tra cứu tài nguyên số trên Internet hoặc các kho học liệu mở.",
    tools: ["Google Search", "Perplexity AI", "ChatGPT", "Google Scholar", "Wikipedia Edu"]
  },
  {
    id: "domain-2",
    code: "MIỀN 2 - TT 02/2025",
    title: "Giao tiếp và hợp tác trong môi trường số",
    icon: "MessageSquare",
    framework: "TT 02/2025/TT-BGDĐT",
    description: "Tương tác, chia sẻ thông tin, hợp tác đồng sáng tạo nội dung số và quản lý danh tính số an toàn.",
    fullDescription: "Sử dụng công nghệ số để giao tiếp hiệu quả, chia sẻ tài nguyên, đồng sáng tạo kiến thức nhóm. Nhận thức đúng quy tắc ứng xử trên mạng (Digital Etiquette), đa dạng văn hóa và bảo vệ danh tiếng/danh tính số cá nhân.",
    components: [
      { code: "2.1", title: "Tương tác thông qua các phương tiện giao tiếp số", tag: "[NLS 2.1-a]" },
      { code: "2.2", title: "Chia sẻ thông tin và thực hành trích dẫn ghi nguồn", tag: "[NLS 2.2-b]" },
      { code: "2.3", title: "Sử dụng dịch vụ số thực hiện trách nhiệm công dân", tag: "[NLS 2.3-a]" },
      { code: "2.4", title: "Hợp tác và đồng sáng tạo dữ liệu/tài nguyên số", tag: "[NLS 2.4-a]" },
      { code: "2.5", title: "Quy tắc ứng xử trên mạng (Nghi thức số)", tag: "[NLS 2.5-c]" },
      { code: "2.6", title: "Quản lý và bảo vệ danh tính số cá nhân", tag: "[NLS 2.6-a]" }
    ],
    lessonGuide: "Tích hợp ở Hoạt động 2 & 3 (Hình thành kiến thức & Luyện tập): Tổ chức thảo luận nhóm trực tuyến trên Padlet, Google Docs/Slides, MS Teams, yêu cầu ghi rõ nguồn tư liệu trích dẫn.",
    tools: ["Padlet", "Google Docs", "MS Teams", "Canva Team", "Slack Edu"]
  },
  {
    id: "domain-3",
    code: "MIỀN 3 - TT 02/2025",
    title: "Sáng tạo nội dung số",
    icon: "FileCode",
    framework: "TT 02/2025/TT-BGDĐT",
    description: "Tạo lập, chỉnh sửa nội dung số ở nhiều định dạng, áp dụng bản quyền số và lập trình cơ bản.",
    fullDescription: "Phát triển, tinh chỉnh và tích hợp nội dung số ở các định dạng văn bản, hình ảnh, âm thanh, video hoặc mô hình tương tác. Hiểu và thực thi quy định bản quyền, giấy phép mở (Creative Commons) và phát triển câu lệnh/thuật toán lập trình.",
    components: [
      { code: "3.1", title: "Phát triển và chỉnh sửa nội dung số đa phương tiện", tag: "[NLS 3.1-a]" },
      { code: "3.2", title: "Tích hợp, tái cấu trúc và tạo lập lại nội dung số mới", tag: "[NLS 3.2-a]" },
      { code: "3.3", title: "Thực thi bản quyền, giấy phép sở hữu trí tuệ số", tag: "[NLS 3.3-b]" },
      { code: "3.4", title: "Lập trình & tư duy phát triển chuỗi lệnh cho máy tính", tag: "[NLS 3.4-a]" }
    ],
    lessonGuide: "Tích hợp ở Hoạt động 3 (Luyện tập) & Hoạt động 4 (Vận dụng): Học sinh thiết kế Infographic, làm Video ngắn trên CapCut, trình bày báo cáo bằng Canva AI hoặc lập trình mô phỏng Scratch.",
    tools: ["Canva AI", "Scratch AI", "CapCut", "Gamma App", "GeoGebra"]
  },
  {
    id: "domain-4",
    code: "MIỀN 4 - TT 02/2025",
    title: "An toàn và An sinh số",
    icon: "ShieldAlert",
    framework: "TT 02/2025/TT-BGDĐT",
    description: "Bảo vệ thiết bị, dữ liệu cá nhân, quyền riêng tư, sức khỏe thể chất/tinh thần và môi trường số.",
    fullDescription: "Trang bị kỹ năng bảo vệ thiết bị trước phần mềm độc hại; quản lý và bảo vệ quyền riêng tư cá nhân; phòng tránh nguy cơ bắt nạt trên mạng (Cyberbullying); duy trì sự cân bằng giữa cuộc sống thực và môi trường số.",
    components: [
      { code: "4.1", title: "Bảo vệ thiết bị số và phòng tránh rủi ro an ninh mạng", tag: "[NLS 4.1-a]" },
      { code: "4.2", title: "Bảo vệ dữ liệu cá nhân và quyền riêng tư trong không gian số", tag: "[NLS 4.2-c]" },
      { code: "4.3", title: "Bảo vệ sức khỏe thể chất, tinh thần & an sinh số", tag: "[NLS 4.3-a]" },
      { code: "4.4", title: "Nhận thức tác động của công nghệ số đến môi trường", tag: "[NLS 4.4-b]" }
    ],
    lessonGuide: "Tích hợp trong Mục tiêu Phẩm chất (Trách nhiệm & Trung thực) và Lưu ý Giáo viên: Hướng dẫn học sinh đặt mật khẩu an toàn, bảo mật thông tin cá nhân khi đăng ký ứng dụng học tập.",
    tools: ["Xác thực 2FA", "Bảo mật Quyền riêng tư", "An toàn thông tin mạng"]
  },
  {
    id: "domain-5",
    code: "MIỀN 5 - TT 02/2025",
    title: "Giải quyết vấn đề kỹ thuật & Công nghệ",
    icon: "Wrench",
    framework: "TT 02/2025/TT-BGDĐT",
    description: "Xác định sự cố kỹ thuật, đánh giá nhu cầu và lựa chọn giải pháp công nghệ sáng tạo.",
    fullDescription: "Tự chẩn đoán và khắc phục các sự cố phần cứng/phần mềm thông thường. Đánh giá nhu cầu thực tế để lựa chọn công cụ kỹ thuật số tối ưu; ứng dụng công nghệ để đổi mới quy trình học tập và cập nhật năng lực số cá nhân.",
    components: [
      { code: "5.1", title: "Xác định và xử lý các sự cố kỹ thuật thông thường", tag: "[NLS 5.1-a]" },
      { code: "5.2", title: "Xác định nhu cầu và lựa chọn giải pháp công nghệ phù hợp", tag: "[NLS 5.2-a]" },
      { code: "5.3", title: "Sử dụng sáng tạo công nghệ số để đổi mới sản phẩm", tag: "[NLS 5.3-a]" },
      { code: "5.4", title: "Đánh giá khoảng trống năng lực số và tự nâng cấp bản thân", tag: "[NLS 5.4-b]" }
    ],
    lessonGuide: "Tích hợp ở Hoạt động 2 & 3: Khuyến khích học sinh chủ động thử nghiệm giải pháp công nghệ thay thế khi ứng dụng gặp lỗi, hoặc đề xuất phần mềm mô phỏng phù hợp bài học.",
    tools: ["PhET Simulations", "GeoGebra Dynamic", "Google Colab", "Mô phỏng 3D"]
  },
  {
    id: "domain-6",
    code: "MIỀN 6 - QĐ 3439/QĐ-BGDĐT",
    title: "Ứng dụng Trí tuệ Nhân tạo (AI)",
    icon: "Bot",
    framework: "QĐ 3439/QĐ-BGDĐT",
    description: "Hiểu biết nguyên lý AI, sử dụng AI có đạo đức/trách nhiệm và đánh giá chất lượng kết quả AI.",
    fullDescription: "Nắm vững nguyên lý hoạt động của AI/GenAI (Dữ liệu -> Mô hình -> Dự đoán). Sử dụng kỹ thuật Prompt Engineering để giao tiếp với AI; kiểm chứng thông tin và đánh giá rủi ro đạo đức, thiên vị thuật toán (QĐ 3439/QĐ-BGDĐT).",
    components: [
      { code: "6.1", title: "Tư duy lấy con người làm trung tâm (NLa - QĐ 3439)", tag: "[AI-NLa: Human Centered]" },
      { code: "6.2", title: "Đạo đức AI & Sử dụng có trách nhiệm (NLb - QĐ 3439)", tag: "[AI-NLb: AI Ethics]" },
      { code: "6.3", title: "Kĩ thuật Kỹ năng Prompt & Ứng dụng AI (NLc - QĐ 3439)", tag: "[AI-NLc: Prompting]" },
      { code: "6.4", title: "Thiết kế & Đánh giá hệ thống AI (NLd - QĐ 3439)", tag: "[AI-NLd: AI Design]" }
    ],
    lessonGuide: "Tích hợp xuyên suốt 4 Hoạt động chuẩn CV 5512: Dùng Quizizz AI khởi động, ChatGPT/Gemini tạo gợi ý thảo luận, Teachable Machine thực hành nhận diện và kiểm chứng sản phẩm AI tạo sinh.",
    tools: ["ChatGPT / Gemini", "Teachable Machine", "Quizizz AI", "Claude AI", "QuickDraw AI"]
  }
];

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "tt-02-2025",
    code: "Thông tư 02/2025/TT-BGDĐT",
    title: "Khung Năng Lực Số Cho Người Học Trong Hệ Thống Giáo Dục Quốc Dân",
    authority: "Bộ Giáo dục và Đào tạo",
    date: "24/01/2025",
    summary: "Quy định 6 miền năng lực và 24 năng lực thành phần từ Bậc 1 đến Bậc 8, làm căn cứ đối chiếu chỉ số cho học sinh hệ thống giáo dục quốc dân.",
    keyPoints: [
      "Ban hành 6 Miền Năng lực số áp dụng cho toàn bộ các cấp học.",
      "Xác định rõ tiêu chuẩn từ Bậc 1 đến Bậc 8 theo độ tuổi học sinh.",
      "Căn cứ bắt buộc để giáo viên tích hợp mã chỉ báo vào Kế hoạch bài dạy."
    ],
    icon: "FileCheck",
    badgeColor: "bg-indigo-100 text-indigo-800"
  },
  {
    id: "qd-3439",
    code: "Quyết định 3439/QĐ-BGDĐT",
    title: "Khung Thí Điểm Giáo Dục Trí Tuệ Nhân Tạo (AI) Trong Giáo Dục Phổ Thông",
    authority: "Bộ Giáo dục và Đào tạo",
    date: "15/12/2025",
    summary: "Cấu trúc xoay quanh 4 mạch kiến thức & năng lực AI cốt lõi: Tư duy lấy con người làm trung tâm, Đạo đức AI, Kĩ thuật & Ứng dụng AI, Thiết kế hệ thống AI.",
    keyPoints: [
      "Xác định 4 Mạch Năng lực AI (NLa, NLb, NLc, NLd).",
      "Khuyến khích giáo viên đưa ứng dụng GenAI và Prompt Engineering vào tiết học.",
      "Nhấn mạnh Đạo đức AI và tính chịu trách nhiệm của người học."
    ],
    icon: "Sparkles",
    badgeColor: "bg-amber-100 text-amber-800"
  },
  {
    id: "cv-5512",
    code: "Công văn 5512/BGDĐT-GDTrH",
    title: "Hướng Dẫn Xây Dựng Và Thực Hiện Kế Hoạch Giáo Dục Của Nhà Trường",
    authority: "Bộ Giáo dục và Đào tạo - Vụ GDTrH",
    date: "18/12/2020",
    summary: "Quy định cấu trúc KHBD chuẩn gồm: I. Mục tiêu; II. Thiết bị dạy học; III. Tiến trình dạy học với 4 Hoạt động chuẩn (Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng).",
    keyPoints: [
      "Khung chuẩn 4 Hoạt động sư phạm.",
      "Cấu trúc bảng 2 cột (Tổ chức thực hiện vs Sản phẩm học sinh).",
      "Quy định rõ mục tiêu Kiến thức, Năng lực, Phẩm chất."
    ],
    icon: "BookOpen",
    badgeColor: "bg-emerald-100 text-emerald-800"
  }
];

export const SAMPLE_LESSONS: LessonPlanItem[] = [
  {
    id: "sample-1",
    title: "Sự biến thiên và Đồ thị Hàm số Bậc hai (Toán 10 - Chuẩn CV 5512)",
    subject: "Toán học",
    grade: "Lớp 10",
    framework: "TT 02/2025 + QĐ 3439",
    template: "CV 5512/BGDĐT-GDTrH",
    status: "Đã tích hợp NLS",
    createdAt: Date.now() - 86400000 * 2,
    dateString: "26/07/2026",
    isFeatured: true,
    originalContent: `<b>I. MỤC TIÊU BÀI HỌC (CV 5512/BGDĐT-GDTrH)</b><br>
1. Kiến thức: Học sinh hiểu được khái niệm hàm số bậc hai y = ax² + bx + c (a ≠ 0), xác định được tọa độ đỉnh, trục đối xứng.<br>
2. Năng lực: Lập được bảng biến thiên và vẽ được đồ thị hàm số bậc hai.<br>
3. Phẩm chất: Trung thực, chăm chỉ, có tinh thần hợp tác nhóm.<br><br>
<b>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</b><br>
1. Giáo viên: Sách giáo khoa, bảng phụ, thước kẻ, phấn màu.<br>
2. Học sinh: Sách giáo khoa, vở ghi, giấy nháp.<br><br>
<b>III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CHUẨN CV 5512)</b><br>
<b>Hoạt động 1: Mở đầu (Khởi động)</b><br>
- GV giao nhiệm vụ: Cho bài toán tìm quỹ đạo bay của quả bóng.<br>
- HS suy nghĩ, trả lời nhận xét về hình dạng đường bay.<br><br>
<b>Hoạt động 2: Hình thành kiến thức mới</b><br>
- GV trình bày công thức xác định đỉnh I(-b/2a; -Δ/4a).<br>
- HS ghi chép công thức và làm ví dụ 1 trong SGK.<br><br>
<b>Hoạt động 3: Luyện tập</b><br>
- GV cho 3 bài tập vẽ đồ thị hàm số y = x² - 4x + 3.<br>
- HS lên bảng làm bài, GV sửa lỗi.<br><br>
<b>Hoạt động 4: Vận dụng</b><br>
- GV giao bài tập thực tế tính chiều cao cổng Parabol tích hợp toán thực tiễn.`,
    integratedContent: `<div class="space-y-4">
  <div class="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-lg">
    <span class="font-bold text-rose-900 block text-xs uppercase mb-1">
      CĂN CỨ PHÁP LÝ TÍCH HỢP
    </span>
    <p class="text-[11px] text-rose-800">
      • Cấu trúc Kế hoạch bài dạy tuân thủ <b>Công văn 5512/BGDĐT-GDTrH</b>.<br>
      • Khung Chỉ báo Năng lực số áp dụng <b>Thông tư 02/2025/TT-BGDĐT</b>.<br>
      • Khung Mạch Năng lực AI áp dụng <b>Quyết định 3439/QĐ-BGDĐT (2025)</b>.
    </p>
  </div>

  <div class="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg">
    <span class="font-bold text-indigo-900 block text-xs uppercase mb-1">I. MỤC TIÊU BÀI HỌC (TÍCH HỢP NLS & AI CHUẨN BỘ)</span>
    <p class="text-xs text-indigo-800"><b>1. Kiến thức & Năng lực Toán học:</b> Giữ nguyên theo chuẩn chương trình 2018.</p>
    <p class="text-xs text-brand-700 font-semibold mt-1.5">
      2. Năng lực Số & AI (Đối chiếu TT 02/2025 & QĐ 3439):
    </p>
    <ul class="list-disc pl-5 text-xs text-slate-700 space-y-1 mt-1">
      <li>
        <span class="bg-indigo-100 text-indigo-800 font-semibold px-1.5 py-0.5 rounded font-mono">[NLS 1.1-a]</span>
        <span class="bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded font-mono">[TT 02/2025]</span>
        Học sinh khai thác công cụ mô phỏng <b>GeoGebra Dynamic Graphing</b> để khảo sát sự thay đổi hình dáng Parabol.
      </li>
      <li>
        <span class="bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.5 rounded font-mono">[AI-NLc: Kĩ thuật AI]</span>
        <span class="bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded font-mono">[QĐ 3439/2025]</span>
        Sử dụng trợ lý AI tương tác để kiểm chứng đồ thị và nhận diện tọa độ đỉnh Parabol.
      </li>
      <li>
        <span class="bg-rose-100 text-rose-800 font-semibold px-1.5 py-0.5 rounded font-mono">[AI-NLb: Đạo đức AI]</span>
        Học sinh biết kiểm tra tính chính xác của đáp án do AI gợi ý, không phụ thuộc thụ động vào máy tính.
      </li>
    </ul>
  </div>

  <div class="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-lg">
    <span class="font-bold text-emerald-900 block text-xs uppercase mb-1">II. THIẾT BỊ DẠY HỌC & HỌC LIỆU SỐ (CV 5512)</span>
    <p class="text-xs text-slate-700"><b>1. Thiết bị số:</b> Máy tính giáo viên, màn hình tương tác, thiết bị di động cá nhân/nhóm học sinh.</p>
    <p class="text-xs text-slate-700 mt-1"><b>2. Học liệu số & Nền tảng AI:</b> GeoGebra App, Quizizz AI, ChatGPT / Gemini.</p>
  </div>

  <div class="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
    <span class="font-bold text-amber-900 block text-xs uppercase mb-1">III. TIẾN TRÌNH DẠY HỌC TÍCH HỢP NLS & AI (4 HOẠT ĐỘNG CV 5512)</span>
    <div class="space-y-3 mt-2 text-xs text-slate-700">
      <div class="bg-white p-2.5 rounded border border-amber-200">
        <span class="font-bold text-slate-800">Hoạt động 1: Mở đầu với Quizizz AI <span class="text-brand-600 font-mono">[NLS 1.1-a]</span></span>
        <p class="mt-1">GV quét mã QR cho HS tham gia 3 câu hỏi khởi động tương tác về quỹ đạo Parabol. AI tự động phân tích tỷ lệ trả lời đúng/sai của lớp.</p>
      </div>
      <div class="bg-white p-2.5 rounded border border-amber-200">
        <span class="font-bold text-slate-800">Hoạt động 2: Hình thành kiến thức qua GeoGebra App <span class="text-brand-600 font-mono">[NLS 3.1-a]</span> <span class="text-amber-700 font-mono">[AI-NLc]</span></span>
        <p class="mt-1">HS thao tác trên thanh trượt hệ số a, b, c trong ứng dụng GeoGebra để quan sát sự biến thiên của đỉnh Parabol.</p>
      </div>
      <div class="bg-white p-2.5 rounded border border-amber-200">
        <span class="font-bold text-slate-800">Hoạt động 3: Luyện tập & Đánh giá tự động <span class="text-brand-600 font-mono">[NLS 2.4-a]</span></span>
        <p class="mt-1">HS vẽ đồ thị ra giấy, chụp ảnh sản phẩm nộp lên Padlet/Google Classroom để GV và các nhóm bạn đối sánh, góp ý trực tiếp.</p>
      </div>
      <div class="bg-white p-2.5 rounded border border-amber-200">
        <span class="font-bold text-slate-800">Hoạt động 4: Vận dụng & Sáng tạo Số <span class="text-brand-600 font-mono">[NLS 5.3-a]</span></span>
        <p class="mt-1">HS dùng công cụ Canva/AI thiết kế infographic ngắn mô phỏng ứng dụng của Parabol trong kiến trúc gửi về kho tài nguyên số bài học.</p>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: "sample-2",
    title: "Văn bản Bình Ngô Đại Cáo - Phân tích tác phẩm Nguyễn Trãi (Ngữ văn 10)",
    subject: "Ngữ văn",
    grade: "Lớp 10",
    framework: "TT 02/2025/TT-BGDĐT",
    template: "CV 5512/BGDĐT-GDTrH",
    status: "Đã tích hợp NLS",
    createdAt: Date.now() - 86400000 * 3,
    dateString: "25/07/2026",
    isFeatured: true,
    originalContent: `<b>I. MỤC TIÊU BÀI HỌC</b><br>
1. Kiến thức: Cảm nhận được khí phách anh hùng và tư tưởng nhân nghĩa trong tác phẩm Bình Ngô Đại Cáo.<br>
2. Năng lực: Phân tích bố cục, nghệ thuật chính luận đặc sắc.<br>
3. Phẩm chất: Yêu nước, tự hào dân tộc.<br><br>
<b>II. TIẾN TRÌNH DẠY HỌC</b><br>
Hoạt động 1: Khởi động - Tìm hiểu về cuộc đời Nguyễn Trãi.<br>
Hoạt động 2: Đọc - Tìm hiểu chi tiết tác phẩm (Bố cục 4 phần).<br>
Hoạt động 3: Luyện tập - Báo cáo sơ đồ tư duy tác phẩm.<br>
Hoạt động 4: Vận dụng - Viết đoạn văn nghị luận xã hội.`,
    integratedContent: `<div class="space-y-4">
  <div class="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg">
    <span class="font-bold text-indigo-900 block text-xs uppercase mb-1">MỤC TIÊU BÀI HỌC TÍCH HỢP NLS & AI</span>
    <ul class="list-disc pl-5 text-xs text-slate-700 space-y-1 mt-1">
      <li><span class="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded font-mono">[NLS 1.1-a]</span> Khai thác dữ liệu - Học sinh tra cứu tư liệu lịch sử về tác giả Nguyễn Trãi trên kho học liệu số số hóa.</li>
      <li><span class="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono">[NLS 2.4-a]</span> Hợp tác số - Thảo luận nhóm trên Padlet phân tích luận đề nhân nghĩa.</li>
      <li><span class="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono">[AI-NLc]</span> Sử dụng GenAI - Tạo hình ảnh mô phỏng không khí Lam Sơn bằng AI prompt.</li>
    </ul>
  </div>
</div>`
  }
];
