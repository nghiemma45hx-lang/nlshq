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
    badgeColor: "bg-indigo-100 text-indigo-800",
    fullText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
------------------
BỘ GIÁO DỤC VÀ ĐÀO TẠO

Số: 02/2025/TT-BGDĐT                          Hà Nội, ngày 24 tháng 01 năm 2025

THÔNG TƯ
BAN HÀNH KHUNG NĂNG LỰC SỐ CHO NGƯỜI HỌC TRONG HỆ THỐNG GIÁO DỤC QUỐC DÂN

Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;
Căn cứ Nghị định số 86/2022/NĐ-CP ngày 24 tháng 10 năm 2022 của Chính phủ quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Bộ Giáo dục và Đào tạo;
Căn cứ Quyết định số 749/QĐ-TTg ngày 03 tháng 6 năm 2020 của Thủ tướng Chính phủ phê duyệt "Chương trình Chuyển đổi số quốc gia đến năm 2025, định hướng đến năm 2030";
Theo đề nghị của Cục trưởng Cục Công nghệ thông tin;

Bộ trưởng Bộ Giáo dục và Đào tạo ban hành Thông tư Khung Năng lực số cho người học trong hệ thống giáo dục quốc dân.

Điều 1. Ban hành kèm theo Thông tư này "Khung Năng lực số cho người học trong hệ thống giáo dục quốc dân".

Điều 2. Đối tượng áp dụng
Thông tư này áp dụng đối với người học trong các cơ sở giáo dục mầm non, giáo dục phổ thông, giáo dục thường xuyên, giáo dục nghề nghiệp và giáo dục đại học thuộc hệ thống giáo dục quốc dân; các tổ chức, cá nhân có liên quan.

Điều 3. Cấu trúc Khung Năng lực số
Khung Năng lực số gồm 06 miền năng lực cốt lõi với 24 năng lực thành phần, chuẩn hóa theo 8 bậc trình độ năng lực số tương ứng với từng độ tuổi và cấp học:

MIỀN 1: KHAI THÁC DỮ LIỆU VÀ THÔNG TIN
- Năng lực 1.1: Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số [NLS 1.1-a, NLS 1.1-b, NLS 1.1-c]
- Năng lực 1.2: Đánh giá dữ liệu, thông tin và nội dung số [NLS 1.2-a, NLS 1.2-b]
- Năng lực 1.3: Quản lý, lưu trữ và sắp xếp dữ liệu, thông tin [NLS 1.3-a, NLS 1.3-b]

MIỀN 2: GIAO TIẾP VÀ HỢP TÁC TRONG MÔI TRƯỜNG SỐ
- Năng lực 2.1: Tương tác thông qua các công nghệ số [NLS 2.1-a, NLS 2.1-b]
- Năng lực 2.2: Chia sẻ thông tin và nội dung số [NLS 2.2-a]
- Năng lực 2.3: Thực hành công dân số và tham gia xã hội trực tuyến [NLS 2.3-a]
- Năng lực 2.4: Hợp tác thông qua các công nghệ số [NLS 2.4-a, NLS 2.4-b]
- Năng lực 2.5: Quy tắc ứng xử trên mạng (Netiquette) [NLS 2.5-a, NLS 2.5-b, NLS 2.5-c]
- Năng lực 2.6: Quản lý danh tính số và dữ liệu cá nhân [NLS 2.6-a]

MIỀN 3: SÁNG TẠO NỘI DUNG SỐ
- Năng lực 3.1: Phát triển và biên tập nội dung số [NLS 3.1-a, NLS 3.1-b]
- Năng lực 3.2: Sửa đổi, tích hợp và tái tạo nội dung số [NLS 3.2-a]
- Năng lực 3.3: Bản quyền và giấy phép trí tuệ số [NLS 3.3-a, NLS 3.3-b]
- Năng lực 3.4: Lập trình và tư duy máy tính [NLS 3.4-a, NLS 3.4-b]

MIỀN 4: AN TOÀN SỐ VÀ ĐẠO ĐỨC MÔI TRƯỜNG SỐ
- Năng lực 4.1: Bảo vệ thiết bị và hạ tầng số [NLS 4.1-a]
- Năng lực 4.2: Bảo vệ dữ liệu cá nhân và quyền riêng tư [NLS 4.2-a, NLS 4.2-b, NLS 4.2-c]
- Năng lực 4.3: Bảo vệ sức khỏe và thể chất trong môi trường số [NLS 4.3-a]
- Năng lực 4.4: Bảo vệ môi trường tự nhiên khỏi tác động của công nghệ [NLS 4.4-a]

MIỀN 5: GIẢI QUYẾT VẤN ĐỀ VÀ TƯ DUY MÁY TÍNH
- Năng lực 5.1: Giải quyết các vấn đề kỹ thuật [NLS 5.1-a, NLS 5.1-b]
- Năng lực 5.2: Xác định nhu cầu và lựa chọn giải pháp công nghệ [NLS 5.2-a]
- Năng lực 5.3: Sử dụng sáng tạo các công nghệ số & AI [NLS 5.3-a, NLS 5.3-b]
- Năng lực 5.4: Nhận diện lỗ hổng năng lực số cá nhân [NLS 5.4-a]

MIỀN 6: ĐỊNH HƯỚNG NGHỀ NGHIỆP SỐ
- Năng lực 6.1: Nhận thức các xu hướng công nghệ số phát triển mới [NLS 6.1-a]

Điều 4. Tổ chức thực hiện
1. Các Sở Giáo dục và Đào tạo chỉ đạo các cơ sở giáo dục phổ thông căn cứ Khung Năng lực số này để tích hợp vào các môn học và hoạt động giáo dục trong Kế hoạch bài dạy (KHBD).
2. Giáo viên chủ động đưa các chỉ báo năng lực số [NLS x.x] vào mục tiêu và tiến trình dạy học.

Điều 5. Hiệu lực thi hành
Thông tư này có hiệu lực thi hành kể từ ngày 10 tháng 03 năm 2025.

BỘ TRƯỜNG
(Đã ký)`,
    details: {
      scope: "Quy định Khung năng lực số áp dụng cho người học trong hệ thống giáo dục quốc dân Việt Nam.",
      targetAudience: "Học sinh Tiểu học, THCS, THPT, Giáo dục thường xuyên và Sinh viên các cấp.",
      structure: [
        { name: "Miền 1: Khai thác dữ liệu và thông tin", desc: "Tra cứu, đánh giá độ tin cậy và lưu trữ dữ liệu số thông minh.", tags: ["[NLS 1.1-a]", "[NLS 1.2-b]", "[NLS 1.3-a]"] },
        { name: "Miền 2: Giao tiếp và hợp tác trong môi trường số", desc: "Chia sẻ thông tin, tương tác chuẩn mực và thảo luận nhóm trực tuyến.", tags: ["[NLS 2.1-b]", "[NLS 2.4-a]", "[NLS 2.5-c]"] },
        { name: "Miền 3: Sáng tạo nội dung số", desc: "Biên tập Infographic, Video, sơ đồ tư duy và lập trình giải quyết bài toán.", tags: ["[NLS 3.1-a]", "[NLS 3.3-a]", "[NLS 3.4-a]"] },
        { name: "Miền 4: An toàn số và Đạo đức môi trường số", desc: "Bảo vệ thông tin cá nhân, bản quyền tác giả và sức khỏe khi dùng thiết bị số.", tags: ["[NLS 4.1-a]", "[NLS 4.2-c]"] },
        { name: "Miền 5: Giải quyết vấn đề & Tư duy máy tính", desc: "Ứng dụng phần mềm mô phỏng, thuật toán và công cụ AI vào nhiệm vụ học tập.", tags: ["[NLS 5.1-a]", "[NLS 5.3-a]"] },
        { name: "Miền 6: Định hướng nghề nghiệp số", desc: "Tìm hiểu xu hướng nghề nghiệp công nghệ cao và hội nhập quốc tế.", tags: ["[NLS 6.1-a]"] }
      ],
      implementationGuide: [
        "1. Xác định Yêu cầu cần đạt về Năng lực số tương ứng với môn học và độ tuổi học sinh.",
        "2. Chèn thẻ chỉ báo [NLS x.x] trực tiếp vào phần Mục tiêu Năng lực trong Kế hoạch bài dạy.",
        "3. Lựa chọn công cụ số (Padlet, Quizizz, GeoGebra, Canva) tương ứng từng hoạt động 5512."
      ]
    }
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
    badgeColor: "bg-amber-100 text-amber-800",
    fullText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
------------------
BỘ GIÁO DỤC VÀ ĐÀO TẠO

Số: 3439/QĐ-BGDĐT                           Hà Nội, ngày 15 tháng 12 năm 2025

QUYẾT ĐỊNH
BAN HÀNH KHUNG THÍ ĐIỂM GIÁO DỤC TRÍ TUỆ NHÂN TẠO (AI) TRONG GIÁO DỤC PHỔ THÔNG

BỘ TRƯỜNG BỘ GIÁO DỤC VÀ ĐÀO TẠO

Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;
Căn cứ Quyết định số 127/QĐ-TTg ngày 26 tháng 01 năm 2021 của Thủ tướng Chính phủ ban hành Chiến lược quốc gia về nghiên cứu, phát triển và ứng dụng Trí tuệ nhân tạo đến năm 2030;
Xét đề nghị của Vụ trưởng Vụ Giáo dục Trung học;

QUYẾT ĐỊNH:

Điều 1. Ban hành kèm theo Quyết định này "Khung Thí điểm Giáo dục Trí tuệ Nhân tạo (AI) trong Giáo dục Phổ thông".

Điều 2. Mục tiêu của Khung thí điểm Giáo dục AI
1. Trang bị cho học sinh phổ thông những hiểu biết cơ bản, đúng đắn về Trí tuệ nhân tạo (AI), tạo dựng năng lực ứng dụng AI an toàn, hiệu quả và có trách nhiệm.
2. Định hướng cho giáo viên phương pháp tích hợp AI (GenAI, Chatbot, Prompt Engineering) vào các môn học như Toán, Ngữ văn, Tiếng Anh, Khoa học tự nhiên, Tin học, Lịch sử và Địa lý.

Điều 3. Bốn Mạch Năng lực Trí tuệ nhân tạo cốt lõi:

1. MẠCH [AI-NLa]: TƯ DUY LẤY CON NGƯỜI LÀM TRUNG TÂM (Human-Centered AI)
- Hiểu vai trò của AI là công cụ hỗ trợ, không thay thế tư duy phản biện và khả năng sáng tạo của con người.
- Con người luôn giữ quyền quyết định cuối cùng và chịu trách nhiệm đối với các kết quả do AI tạo ra.

2. MẠCH [AI-NLb]: ĐẠO ĐỨC AI VÀ TRÁCH NHIỆM XÃ HỘI (AI Ethics & Responsibility)
- Nhận thức về tính minh bạch, thiên vị (bias), bản quyền tác giả và quyền riêng tư dữ liệu.
- Trung thực trong học thuật, không sao chép nguyên văn sản phẩm của AI để nộp làm bài làm cá nhân.

3. MẠCH [AI-NLc]: KĨ THUẬT VÀ ỨNG DỤNG AI (AI Prompting & Applications)
- Kĩ năng kĩ thuật đặt câu lệnh (Prompt Engineering) chính xác, rõ ràng cho các mô hình AI ngôn ngữ lớn (LLM).
- Sử dụng các công cụ AI thế hệ mới (ChatGPT, Gemini, Canva AI, Quizizz AI) để hỗ trợ tìm kiếm, sáng tạo nội dung và luyện tập.

4. MẠCH [AI-NLd]: THIẾT KẾ VÀ HỆ THỐNG AI (AI System & Design)
- Hiểu nguyên lý vận hành cơ bản của Học máy (Machine Learning), Xử lý ngôn ngữ tự nhiên (NLP) và Thị giác máy tính (Computer Vision).
- Tham gia thiết kế mô hình AI đơn giản (như Teachable Machine, Scratch AI).

Điều 4. Hướng dẫn tích hợp cho Giáo viên
- Giáo viên chủ động đưa mã mạch năng lực [AI-NLa], [AI-NLb], [AI-NLc], [AI-NLd] vào Kế hoạch bài dạy.
- Xây dựng câu lệnh Prompt mẫu cho học sinh thực hành trong tiết học.

Điều 5. Hiệu lực thi hành
Quyết định này có hiệu lực kể từ ngày ký.

KT. BỘ TRƯỜNG
THỨ TRƯỜNG
(Đã ký)`,
    details: {
      scope: "Khung thí điểm Giáo dục Trí tuệ Nhân tạo (AI) trong giáo dục phổ thông toàn quốc.",
      targetAudience: "Cán bộ quản lý, Giáo viên và Học sinh các trường Phổ thông (Cấp 1, Cấp 2, Cấp 3).",
      structure: [
        { name: "Mạch NLa: Tư duy lấy con người làm trung tâm", desc: "Coi AI là trợ lý hỗ trợ con người, con người làm chủ và chịu trách nhiệm quyết định.", tags: ["[AI-NLa]"] },
        { name: "Mạch NLb: Đạo đức AI & Trách nhiệm xã hội", desc: "Tôn trọng bản quyền, không tạo thông tin sai lệch, bảo mật dữ liệu riêng tư.", tags: ["[AI-NLb]"] },
        { name: "Mạch NLc: Kĩ thuật & Ứng dụng AI", desc: "Kĩ năng viết câu lệnh Prompt Engineering, sử dụng ChatGPT, Gemini, Claude, Quizizz AI.", tags: ["[AI-NLc]"] },
        { name: "Mạch NLd: Thiết kế & Hệ thống AI", desc: "Hiểu nguyên lý cơ bản của Machine Learning, Computer Vision và xử lý ngôn ngữ tự nhiên.", tags: ["[AI-NLd]"] }
      ],
      implementationGuide: [
        "1. Lựa chọn 1 trong 4 Mạch AI phù hợp với nội dung bài dạy môn học.",
        "2. Đưa yêu cầu học sinh thực hành giao tiếp với AI trợ lý (Prompting) trong Hoạt động Luyện tập.",
        "3. Nhắc nhở và kiểm soát nguyên tắc Đạo đức AI khi học sinh nộp sản phẩm số."
      ]
    }
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
    badgeColor: "bg-emerald-100 text-emerald-800",
    fullText: `BỘ GIÁO DỤC VÀ ĐÀO TẠO                 CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
-------                                    Độc lập - Tự do - Hạnh phúc
                                                ------------------
Số: 5512/BGDĐT-GDTrH                       Hà Nội, ngày 18 tháng 12 năm 2020

V/v Xây dựng và thực hiện kế hoạch giáo dục của nhà trường

Kính gửi: Các Sở Giáo dục và Đào tạo

Thực hiện Chương trình giáo dục phổ thông ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT, Bộ Giáo dục và Đào tạo hướng dẫn xây dựng và thực hiện kế hoạch giáo dục của nhà trường như sau:

PHỤ LỤC IV: KHUNG KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
(Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GDĐT)

Trường: ............................................   Họ và tên giáo viên: ............................................
Tổ chuyên môn: ...............................   Tên bài dạy: .....................................................
Môn học/Hoạt động giáo dục: .............   Lớp: .......... Thời lượng thực hiện: (Số tiết)

I. MỤC TIÊU BÀI HỌC
1. Về Kiến thức: Nêu cụ thể kiến thức học sinh cần học trong bài.
2. Về Năng lực: 
- Năng lực đặc thù môn học.
- Năng lực chung và Năng lực số (Ghi rõ mã chỉ báo [NLS x.x], [AI-NLx]).
3. Về Phẩm chất: Nêu cụ thể phẩm chất học sinh được rèn luyện.

II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU SỐ
- Thiết bị của Giáo viên: Máy tính, máy chiếu, bài trình chiếu, phần mềm tương tác, công cụ AI.
- Thiết bị/học liệu của Học sinh: Sách giáo khoa, vở ghi, thiết bị thông minh, tài khoản học trực tuyến.

III. TIẾN TRÌNH DẠY HỌC

1. Hoạt động 1: Mở đầu / Khởi động (Xác định vấn đề / Nhiệm vụ học tập)
a) Mục tiêu: Tạo tâm thế, kết nối kiến thức cũ hoặc đặt vấn đề cần giải quyết.
b) Nội dung: GV giao nhiệm vụ, câu hỏi hoặc trò chơi tương tác số (Quizizz/Kahoot).
c) Sản phẩm: Câu trả lời của học sinh hoặc kết quả tương tác ban đầu.
d) Tổ chức thực hiện: GV chuyển giao nhiệm vụ -> HS thực hiện -> Báo cáo thảo luận -> GV kết luận.

2. Hoạt động 2: Hình thành kiến thức mới (Giải quyết vấn đề)
a) Mục tiêu: Học sinh chiếm lĩnh kiến thức cốt lõi.
b) Nội dung: Đọc tài liệu, xem video mô phỏng, thực hành khai thác dữ liệu số.
c) Sản phẩm: Bảng nhóm, câu trả lời, sơ đồ tư duy Infographic.
d) Tổ chức thực hiện: Tổ chức làm việc cá nhân / thảo luận nhóm / hướng dẫn sử dụng phần mềm.

3. Hoạt động 3: Luyện tập
a) Mục tiêu: Củng cố, khắc sâu kiến thức vừa học.
b) Nội dung: Bài tập SGK, câu hỏi trắc nghiệm số, thực hành Prompt AI giải bài tập.
c) Sản phẩm: Lời giải bài tập, kết quả điểm số tự động từ hệ thống.
d) Tổ chức thực hiện: GV giao bài -> HS độc lập làm bài -> Nhận xét, sửa lỗi.

4. Hoạt động 4: Vận dụng
a) Mục tiêu: Vận dụng kiến thức vào thực tiễn cuộc sống.
b) Nội dung: Nhiệm vụ dự án sáng tạo sản phẩm số, thiết kế poster Canva, quay video ngắn.
c) Sản phẩm: Sản phẩm vận dụng thực tế của học sinh.
d) Tổ chức thực hiện: GV giao nhiệm vụ về nhà -> HS nộp bài qua sản phẩm số.

TL. BỘ TRƯỜNG
VỤ TRƯỜNG VỤ GIÁO DỤC TRUNG HỌC
(Đã ký)`,
    details: {
      scope: "Hướng dẫn khung chuẩn xây dựng Kế hoạch bài dạy (Giáo án) áp dụng chung cho khối phổ thông.",
      targetAudience: "Tất cả Giáo viên THCS và THPT thuộc hệ thống giáo dục quốc dân.",
      structure: [
        { name: "I. Mục tiêu Bài học", desc: "Mô tả Kiến thức, Năng lực đặc thù, Năng lực chung (kèm mã [NLS x.x]) và Phẩm chất." },
        { name: "II. Thiết bị Dạy học & Học liệu Số", desc: "Ghi rõ thiết bị công nghệ của GV (máy tính, slide, AI tool) và HS (sách, điện thoại, tài khoản số)." },
        { name: "III. Tiến trình Dạy học (4 Hoạt động)", desc: "Mô tả 4 bước: 1. Mở đầu/Khởi động -> 2. Hình thành kiến thức -> 3. Luyện tập -> 4. Vận dụng." }
      ],
      implementationGuide: [
        "1. Trình bày mỗi hoạt động đủ 4 thành tố: a) Mục tiêu; b) Nội dung; c) Sản phẩm; d) Tổ chức thực hiện.",
        "2. Trình bày bảng 2 cột rõ ràng giữa Hoạt động của GV và Sản phẩm kỳ vọng của HS.",
        "3. Xuất file Word (.docx) đúng chuẩn font chữ Times New Roman 13pt."
      ]
    }
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
    integratedContent: `<div class="space-y-4 text-xs text-slate-800 font-sans leading-relaxed">
  <div class="border-b border-slate-200 pb-2">
    <h2 class="text-sm font-extrabold text-indigo-950 uppercase tracking-wide">KẾ HOẠCH BÀI DẠY: ĐỒ THỊ HÀM SỐ BẬC HAI Y = AX² + BX + C</h2>
    <p class="text-[11px] font-semibold text-slate-500">Môn: Toán 10 | Tích hợp Năng lực số chuẩn TT 02/2025 & QĐ 3439/QĐ-BGDĐT</p>
  </div>

  <div class="space-y-3">
    <div>
      <h3 class="font-bold text-slate-900 text-xs border-l-3 border-indigo-600 pl-2 uppercase">I. MỤC TIÊU BÀI HỌC</h3>
      <div class="pl-3 mt-1 space-y-1">
        <p><b>1. Kiến thức & Năng lực Toán học:</b> Nắm vững dạng Parabol, tọa độ đỉnh I(-b/2a; -Δ/4a), trục đối xứng x = -b/2a và sự biến thiên của hàm số bậc hai.</p>
        <p><b>2. Năng lực Số & AI tích hợp:</b></p>
        <ul class="list-disc pl-5 space-y-1 text-slate-700">
          <li><span class="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 1.1-a]</span> Thao tác tìm kiếm, khai thác mô phỏng <b>GeoGebra Dynamic Graphing</b> để khảo sát sự biến thiên đồ thị.</li>
          <li><span class="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 2.4-a]</span> Hợp tác số, nộp và chấm chéo sản phẩm vẽ Parabol nhóm trên nền tảng <b>Padlet / Google Classroom</b>.</li>
          <li><span class="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[AI-NLc: Prompting]</span> Sử dụng câu lệnh Prompt hỏi trợ lý AI để kiểm chứng công thức tọa độ đỉnh và chiều quay bề lõm.</li>
        </ul>
      </div>
    </div>

    <div>
      <h3 class="font-bold text-slate-900 text-xs border-l-3 border-indigo-600 pl-2 uppercase">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU SỐ</h3>
      <div class="pl-3 mt-1 space-y-0.5 text-slate-700">
        <p><b>1. Thiết bị:</b> Máy tính giáo viên, màn hình tương tác, điện thoại di động/máy tính bảng cá nhân hoặc nhóm HS.</p>
        <p><b>2. Ứng dụng & Học liệu số:</b> GeoGebra App, Quizizz AI, Padlet, Canva AI, Trợ lý Chatbot AI.</p>
      </div>
    </div>

    <div>
      <h3 class="font-bold text-slate-900 text-xs border-l-3 border-indigo-600 pl-2 uppercase mb-2">III. TIẾN TRÌNH DẠY HỌC TÍCH HỢP NLS & AI</h3>
      <div class="space-y-3 pl-2">
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div class="font-bold text-indigo-900 flex items-center justify-between">
            <span>Hoạt động 1: Mở đầu / Khởi động</span>
            <span class="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 1.1-a]</span>
          </div>
          <p class="mt-1 text-slate-700"><b>Tiến trình thực hiện:</b> GV quét mã QR cho HS tham gia 3 câu hỏi trắc nghiệm số trên <i>Quizizz AI</i> nhận diện dạng đường cong Parabol thực tế (vòm cầu, vòi nước). AI thống kê ngay kết quả và tỷ lệ trả lời đúng của lớp.</p>
        </div>

        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div class="font-bold text-purple-900 flex items-center justify-between">
            <span>Hoạt động 2: Hình thành kiến thức mới</span>
            <span class="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 3.1-a] [AI-NLc]</span>
          </div>
          <p class="mt-1 text-slate-700"><b>Tiến trình thực hiện:</b> HS thao tác trên thanh trượt hệ số a, b, c trong ứng dụng <i>GeoGebra</i> để quan sát vị trí đỉnh I và bề lõm Parabol. HS thực hành gõ Prompt hỏi AI trợ lý kiểm chứng công thức đỉnh I(-b/2a; -Δ/4a).</p>
        </div>

        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div class="font-bold text-emerald-900 flex items-center justify-between">
            <span>Hoạt động 3: Luyện tập</span>
            <span class="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 2.4-a]</span>
          </div>
          <p class="mt-1 text-slate-700"><b>Tiến trình thực hiện:</b> HS làm bài tập vẽ đồ thị hàm số y = x² - 4x + 3 ra giấy, chụp ảnh sản phẩm tải lên không gian lớp học <i>Padlet</i>. Giáo viên và các nhóm đối sánh, bình luận góp ý bài làm trực tuyến.</p>
        </div>

        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div class="font-bold text-amber-900 flex items-center justify-between">
            <span>Hoạt động 4: Vận dụng</span>
            <span class="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 5.3-a]</span>
          </div>
          <p class="mt-1 text-slate-700"><b>Tiến trình thực hiện:</b> HS sử dụng công cụ <i>Canva AI</i> thiết kế Infographic mô phỏng bài toán thực tế tính chiều cao cổng Parabol tích hợp kiến thức toán học và nộp về kho tài liệu số của lớp.</p>
        </div>
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
