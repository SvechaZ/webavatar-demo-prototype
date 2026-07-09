export interface AgendaSession {
  time: string;
  titleEn: string;
  titleTh: string;
}

export interface AgendaDay {
  day: number;
  dateEn: string;
  dateTh: string;
  sessions: AgendaSession[];
}

export interface AgendaHall {
  id: string;
  nameEn: string;
  nameTh: string;
  days: AgendaDay[];
}

export const niaSiteAgendaData: AgendaHall[] = [
  {
    id: "main-stage",
    nameEn: "Main Stage",
    nameTh: "เวทีหลัก (Main Stage)",
    days: [
      {
        day: 1,
        dateEn: "25 June 2026",
        dateTh: "25 มิถุนายน 2026",
        sessions: [
          { time: "10.00 - 11.00", titleEn: "Press Registration & Opening Ceremony of SITE 2026", titleTh: "ลงทะเบียนสื่อมวลชนและเข้าร่วมพิธีเปิดงาน SITE 2026" },
          { time: "11.05 - 11.10", titleEn: "Opening Report of SITE 2026 by Dr. Krithpaka Boonfueng (Executive Director, NIA)", titleTh: "กล่าวรายงานการจัดการ SITE 2026 โดย ดร.กริชผกา บุญเฟื่อง ผู้อำนวยการสำนักงานนวัตกรรมแห่งชาติ" },
          { time: "11.10 - 11.20", titleEn: "Prime Minister's Award Ceremony by Mr. Anutin Charnvirakul (Prime Minister)", titleTh: "พิธีมอบรางวัล PM Award โดย นายอนุทิน ชาญวีรกูล นายกรัฐมนตรี" },
          { time: "11.25 - 11.30", titleEn: "Official Opening Ceremony by Mr. Anutin Charnvirakul (Prime Minister)", titleTh: "พิธีเปิดงาน SITE2026 โดย นายอนุทิน ชาญวีรกูล นายกรัฐมนตรี" },
          { time: "11.30 - 11.40", titleEn: "Prime Minister witnesses MOU Signing between NIA and 8 Innovation Partners", titleTh: "นายกรัฐมนตรี ถ่ายภาพเป็นสักขีพยานบันทึกความเข้าใจด้านนวัตกรรม ระหว่าง สำนักงานนวัตกรรมแห่งชาติ (องค์การมหาชน) กับ 8 หน่วยงาน" },
          { time: "11.40 - 12.10", titleEn: "Panel Discussion: Innovation Diplomacy by Ambassadors (Finland, Norway, Chile, Switzerland, UK, Luxembourg)", titleTh: "เสวนาเรื่อง Innovation Diplomacy โดย เอกอัครราชทูต (Finland, Norway, Chile, Switzerland, United Kingdom, Luxembourg)" },
          { time: "13.30 - 14.00", titleEn: "Behavioral Science and AI: The Path of Sapient and Sentience - Jamie Brennan (DDX & Brenkins Technologies)", titleTh: "Behavioral Science and AI, the path of Sapient and Sentience. - Jamie Brennan - Chief Product and Policy Officer at DDX and Co-Founder and CEO of Brenkins Technologies" },
          { time: "14.00 - 14.30", titleEn: "Scaling Innovation Globally: What Startups Can Learn from Sweden - Mr. Per Linnér (Embassy of Sweden)", titleTh: "Scaling Innovation Globally: What Startups Can Learn from Sweden - Mr. Per Linnér, Chargé d'affaires, Embassy of Sweden in Bangkok, Thailand" },
          { time: "14.30 - 15.00", titleEn: "Expanding to the UK: Opportunities and Pathways for International Startups - Mr. Tanatat Swattanakoon", titleTh: "Expanding to the UK: Opportunities and Pathways for International Startups - Mr. Tanatat Swattanakoon, Senior Investment Adviser, British Embassy Bangkok" },
          { time: "15.00 - 15.30", titleEn: "Hong Kong as a Launchpad for Innovation, Investment, and Global Expansion - Ms. Sophia Chong", titleTh: "Topic : Hong Kong as a Launchpad for Innovation, Investment, and Global Expansion - Ms. Sophia Chong, Executive Director Hong Kong Trade Development Council" },
          { time: "16.00 - 16.30", titleEn: "NEDO's Sustainability Initiatives: Clean Energy Solutions and Deep Tech Innovation - Mr. Yoshida Takeshi", titleTh: "NEDO's sustainability initiatives: Clean Energy Solutions and Deep tech Innovation - Mr. Yoshida Takeshi, Executive Director, NEDO" },
          { time: "16.30 - 17.00", titleEn: "Press Conference: Launch of 'Dream Big' Innovator Series & Talk with Actors - Dr. Krithpaka, Tee Thanapon & Tofusan CEO", titleTh: "งานแถลงข่าวเปิดตัวละครนวัตกร(ทำ) ขวดเล็กความฝันใหญ่ - ดู Trailer & พบปะพูดคุยกับนักแสดงหลัก โดย ดร.กริชผกา บุญเฟื่อง ผอ.สนช., คุณตี๋ ธนพล จารุจิตรานนท์ นักแสดง และคุณสุรนาม พานิชการ ผู้ก่อตั้งและ CEO บริษัท โทฟุซัง จำกัด" },
          { time: "18.00 - 20.00", titleEn: "Business Networking Session", titleTh: "NETWORKING" }
        ]
      },
      {
        day: 2,
        dateEn: "26 June 2026",
        dateTh: "26 มิถุนายน 2026",
        sessions: [
          { time: "10.30 - 11.00", titleEn: "Opening Remarks by Dr. Krithpaka Boonfueng (NIA) & H.E. Mr. OTAKA Masato (Ambassador of Japan to Thailand)", titleTh: "Opening Remarks : Dr. Krithpaka Boonfueng NATIONAL INNOVATION AGENCY (Thailand)｜Executive Director : H.E. Mr. OTAKA Masato Ambassador of Japan to Thailand" },
          { time: "11.00 - 11.30", titleEn: "Special Session: Dr. Chakrit Pichyangkul (CEA Executive Director) & Dr. Supakorn Siddhichai (depa CIO)", titleTh: "SPECIAL SESSION : Dr. Chakrit Pichyangkul Creative Economy Agency (Thailand)｜Executive Director : Dr. Supakorn Siddhichai depa, Bangkok｜Chief Information Officer, Group Executive Vice President (Smart City, Digital Innovation and Ecosystem)" },
          { time: "11.30 - 12.00", titleEn: "[Sustainability & Design] Climate Change Design Strategies - NOSIGNER | Prof. Eisuke Tachikawa", titleTh: "[Sustainability & Design] กลยุทธ์การดีไซน์รับมือการเปลี่ยนแปลงสภาพภูมิอากาศ - NOSIGNER｜Prof. Eisuke Tachikawa" },
          { time: "12.00 - 12.30", titleEn: "[Sustainability & Design] Birth of Kumamon: Connecting Design with Business - good design company | Manabu Mizuno", titleTh: "[Sustainability & Design] กำเนิด Kumamon : เชื่อมต่อดีไซน์กับธุรกิจ - good design company｜Manabu Mizuno with Kumamon" },
          { time: "12.30 - 12.50", titleEn: "Kumamon Special Stage", titleTh: "Kumamon Special Stage By Kumamon" },
          { time: "13.30 - 14.00", titleEn: "[AI x Design] The Science of Look & Fit - Akio Kazama (ZOZO Inc. Executive Officer)", titleTh: "[AI x Design] ศาสตร์แห่งความดูดี - Akio Kazama ZOZO Inc.｜Executive Officer" },
          { time: "14.00 - 14.20", titleEn: "CAIO Platinum Session: Satoru Yamamoto (Dentsu Digital & Dentsu Japan CAIO)", titleTh: "เซสชันแพลตทินัม - Satoru Yamamoto Dentsu Digital｜CAIO, Executive Officer Dentsu Japan｜Deputy CAIO" },
          { time: "14.30 - 15.10", titleEn: "[Finance x Design] Panel: Shinichiro Nishikawa (NTT DATA) & Takehiro Suenari (FOURDIGIT COO)", titleTh: "[Finance x Design] เสวนากลุ่ม : Shinichiro Nishikawa NTT DATA Corporation｜Head of Global Payment & Services Business Unit : Takehiro Suenari FOURDIGIT Inc.｜COO" },
          { time: "15.10 - 15.30", titleEn: "Japan-Thailand Innovation Co-creation: Suebsit Sarntisart (Krungsri Bank)", titleTh: "การร่วมสร้างสรรค์นวัตกรรม ญี่ปุ่น-ไทย : Suebsit Sarntisart Bank of Ayudhya PCL｜Global Business Synergy Director" },
          { time: "15.40 - 16.10", titleEn: "[Lifestyle x Design] Tiny Bonds to Big Impact: Design Driving Developing Countries - MOTHERHOUSE | Eriko Yamaguchi", titleTh: "[Lifestyle x Design] อุตสาหกรรมการผลิตที่มีจุดเริ่มต้นจากสายสัมพันธ์เล็กๆ: พลังแห่งการออกแบบเพื่อขับเคลื่อนศักยภาพของประเทศกำลังพัฒนาสู่สากล - MOTHERHOUSE｜Eriko Yamaguchi MOTHERHOUSE Co., Ltd.｜CEO and Chief Designer" },
          { time: "16.20 - 16.50", titleEn: "[Education x Design] Design Education in AI Era - Tama Art University, MHESI & FOURDIGIT Partners", titleTh: "[Education x Design] การศึกษาดีไซน์ในยุค AI - Tama Art University｜Kazufumi Nagai × Ministry of Higher Education, Science, Research and Innovation｜Dr. Surapant Meknavin × FOURDIGIT｜Ryo Taguchi" },
          { time: "17.00 - 17.20", titleEn: "[Communication x Design] The Future of Communication & Design - CJ WORX | Jinn Powprapai", titleTh: "[Communication x Design] อนาคตแห่งการสื่อสารและการออกแบบ - CJ WORX l Jinn Powprapai" },
          { time: "17.20 - 17.50", titleEn: "Designing Brand Destiny - Dentsu | Yoshihiro Yagi (Executive Creative Director / Growth Officer)", titleTh: "Designing Brand Destiny - Dentsu｜Yoshihiro Yagi dentsu Japan｜Executive Creative Director / Growth Officer" }
        ]
      },
      {
        day: 3,
        dateEn: "27 June 2026",
        dateTh: "27 มิถุนายน 2026",
        sessions: [
          { time: "10.00 - 13.30", titleEn: "National Pitching: Startup Thailand League", titleTh: "National Pitching Startup Thailand League" },
          { time: "13.30 - 14.00", titleEn: "Startup Thailand League Award Ceremony & Announcement", titleTh: "พิธีประกาศผลและมอบรางวัล National Pitching Startup Thailand League" },
          { time: "14.30 - 15.00", titleEn: "Thailand Startup Ecosystem Update 2026 by Dr. Krithpaka Boonfueng (Executive Director, NIA)", titleTh: "Thailand Startup Ecosystem Update 2026 โดย ดร.กริชผกา บุญเฟื่อง ผู้อำนวยการสำนักงานนวัตกรรมแห่งชาติ (องค์การมหาชน)" },
          { time: "15.00 - 17.00", titleEn: "Innovation Influencer Awards & InnovaTok Contest 2026", titleTh: "Innovation Infuencer Awards (InnovaTok Contest 2026)" },
          { time: "17.00 - 17.30", titleEn: "OpenAI Kick-Off (TBC)", titleTh: "OpenAI Kick-Off (tbc)" },
          { time: "19.30 - 20.30", titleEn: "Closing & Networking Session", titleTh: "Networking" }
        ]
      }
    ]
  },
  {
    id: "global-stage",
    nameEn: "Global Stage",
    nameTh: "เวทีระดับโลก (Global Stage)",
    days: [
      {
        day: 1,
        dateEn: "25 June 2026",
        dateTh: "25 มิถุนายน 2026",
        sessions: [
          { time: "13.10 - 13.20", titleEn: "MOU Signing: Intellectual Property & Innovation Cooperation - NIA & Department of Intellectual Property", titleTh: "พิธีลงนามบันทึกความเข้าใจ “ความร่วมมือด้านทรัพย์สินทางปัญญาและนวัตกรรม” ระหว่าง สำนักงานนวัตกรรมแห่งชาติ (องค์การมหาชน) กับ กรมทรัพย์สินทางปัญญา" },
          { time: "13.20 - 13.30", titleEn: "MOU Signing: Innovation Education & Talent Development - NIA & NIDA", titleTh: "พิธีลงนามบันทึกบันทึกความเข้าใจ \"การพัฒนาหลักสูตรและศักยภาพบุคลากรด้านนวัตกรรม”ระหว่าง สำนักงานนวัตกรรมแห่งชาติ (องค์การมหาชน) กับ สถาบันบัณฑิตพัฒนบริหารศาสตร์" },
          { time: "13.30 - 15.00", titleEn: "Tokyo SME Support Center (TMG) Innovation Focus", titleTh: "Tokyo SME Support Center (TMG)" },
          { time: "15.00 - 15.10", titleEn: "MOU Signing: Thai Entrepreneur Capacity Building - NIA & Kenan Foundation Asia", titleTh: "พิธีลงนามบันทึกความเข้าใจ “การดำเนินส่งเสริมศักยภาพผู้ประกอบการไทย” ระหว่าง สำนักงานนวัตกรรมแห่งชาติ (องค์การมหาชน) กับ มูลนิธิคีนันแห่งเอเซีย" },
          { time: "15.10 - 15.20", titleEn: "MOU Signing: Global Market Expansion for Startups - NIA & STARTBOX SOLE CO., LTD.", titleTh: "พิธีลงนามบันทึกความเข้าใจ “ความร่วมมือเพื่อส่งเสริมระบบนิเวศสตาร์ตอัปออกสู่ตลาดต่างประเทศ” ระหว่าง สำนักงานนวัตกรรมแห่งชาติ (องค์การมหาชน) กับ STARTBOX SOLE CO., LTD." },
          { time: "15.20 - 15.30", titleEn: "MOU Launch: Humanoid ASEAN+ (HEI-3A+) Ecosystem for AI & Robotics", titleTh: "Memorandum of Understanding of Humanoid ASEAN+ (HEI-3A+) Ecosystem on Strategic collaboration in Humanoid, Embodied intelligent robotics, Artificial intelligent (AI), and Advanced technology." },
          { time: "15.30 - 15.50", titleEn: "Wisdom × Innovation: Asia’s Big Opportunity - Priscilla Koh (Singapore University of Social Sciences)", titleTh: "Wisdom × Innovation: Asia’s Big Opportunity - Priscilla Koh, Head (Entrepreneurship), Student Success Centre, Singapore University of Social Sciences" },
          { time: "15.50 - 16.00", titleEn: "Scaling Startups through Hong Kong: Access & Funding - Ernest Chung (Cyberport Support)", titleTh: "Scaling Startups through Hong Kong: Market Access, Funding, and Cyberport Support - Ms. Ernest Chung, Manager- Partnership Development Ecosystem Development" },
          { time: "16.00 - 17.00", titleEn: "Investment In-Depth: Corporate Venture Capital (CVC) Trends", titleTh: "เจาะลึกทิศทางการลงทุนธุรกิจนวัตกรรม Corporate Venture Capital (CVC)" },
          { time: "17.00 - 17.40", titleEn: "Government Market Access Mechanisms & Investment for Startups", titleTh: "กลไกในการส่งเสริมผู้ประกอบการในการเข้าถึงตลาดภาครัฐและการลงทุน" }
        ]
      },
      {
        day: 2,
        dateEn: "26 June 2026",
        dateTh: "26 มิถุนายน 2026",
        sessions: [
          { time: "11.40 - 12.00", titleEn: "[Keynote] Opening: Ryo Taguchi (FOURDIGIT) & Hiroaki Sato (Nikkei BP)", titleTh: "[Keynote] Opening Session - FOURDIGIT l Ryo Takuchi x Nikei BP l Hiroaki Sato" },
          { time: "12.10 - 12.30", titleEn: "Startup × Design - Risa Ohashi (ZIPAIR Tokyo)", titleTh: "Startup × Design - ZIPAIR Tokyo l Risa Ohashi" },
          { time: "12.40 - 13.00", titleEn: "Lifestyle × Design - Atsushi Okumori (Managing Director, Siam Takashimaya Thailand)", titleTh: "Lifestyle × Design Atsushi Okumori ｜SIAM TAKASHIMAYA (THAILAND) CO.,LTD.｜Managing Director" },
          { time: "14.00 - 14.20", titleEn: "[Product x Design] Manufacturing Philosophy: From Thailand to the World - Yasutaka Yoshida (Yamaha Motor)", titleTh: "[Product x Design] จากประเทศไทยสู่เวทีโลก: ปรัชญาแห่งการสรรค์สร้างงานผลิต (สำรอง) - Yamaha Motor Asian Center｜Yasutaka Yoshida" },
          { time: "14.30 - 15.00", titleEn: "[Healthcare x Design] Panel: Elevating Patient Experiences - King Chulalongkorn Hospital & IBERD Partners", titleTh: "[Healthcares x Design] เสวนากลุ่ม นวัตกรรมเพื่อยกระดับประสบการณ์การดูแลสุขภาพ - King Chulalongkorn Memorial Hospital｜Prof. Dr. Sarich Chotipanich King Chulalongkorn Memorial Hospital｜Deputy Director (Facility Development and Management)｜Dr. Nares Damrongchai Institute of Business Economics Research and Development - IBERD Thailand｜Board Member" },
          { time: "15.10 - 15.35", titleEn: "[AI x Design] Panel Discussion - Tom Kawada & Takehiro Suenari (FOURDIGIT)", titleTh: "[AI x Design] Panel Discussion - Tom Kawada x FOURDIGIT l Takehiro Suenari" },
          { time: "15.35 - 16.00", titleEn: "[AI x Design] Group Session - Makiko Yamazaki (JETRO Bangkok) & Takehiro Suenari (FOURDIGIT COO)", titleTh: "[AI x Design] เสวนากลุ่ม Makiko Yamazaki JETRO Bangkok｜Deputy Director General ｜ Takehiro Suenari FOURDIGIT｜COO" },
          { time: "16.10 - 16.35", titleEn: "[iDID Collaboration] Branding & Identity for Thai League & J-League - Farmgroup & Takram NY Partners", titleTh: "[iDID Collaboration] การสร้างแบรนด์และอัตลักษณ์ Thai League และ J-League - Farmgroup｜Sumpatha Jadee × Takram NY｜Motosuke Fukuda" },
          { time: "16.35 - 17.00", titleEn: "[iDID Collaboration] Expo Design System - Kota Hikichi (CEO of VISIONs Inc.)", titleTh: "[iDID Collaboration] Expo Design System - VISIONs｜Kota Hikichi Creative Director / CEO of VISIONs Inc. / Representative Director of COMMONs Association." },
          { time: "17.10 - 17.40", titleEn: "Special Session: Communication × Design Future", titleTh: "Communication × Design" }
        ]
      },
      {
        day: 3,
        dateEn: "27 June 2026",
        dateTh: "27 มิถุนายน 2026",
        sessions: [
          { time: "10.30 - 11.00", titleEn: "Future of Clean Energy Funding in Southeast Asia", titleTh: "The Future of Clean Energy Funding in Southeast Asia (Eng)" },
          { time: "11.00 - 12.00", titleEn: "Early Stage Startups in Thailand: Green Innovation Pathways", titleTh: "Early Stage Startups in Thailand: Learning from Regional Pathways for Green Innovation (Eng)" },
          { time: "13.00 - 13.30", titleEn: "S Impact Forum: Deciphering Social Investment for Sustainable Ventures", titleTh: "S Impact Forum : ถอดรหัสการลงทุนทางสังคม เพื่อสร้างธุรกิจนวัตกรรมเพื่อสร้างสังคมที่ยั่งยืน" },
          { time: "13.30 - 14.15", titleEn: "S Impact Forum: Pay for Success - The Future of Social Impact Investment in Thailand", titleTh: "S Impact Forum : Pay for Success: The Future of Social Impact Investment in Thailand" },
          { time: "14.15 - 15.00", titleEn: "S Impact Forum: How Thai Social Enterprises Thrive on International Investment", titleTh: "S Impact Forum : How can Thai Social Enterprises thrive on social impact investment from the International investors?" },
          { time: "15.00 - 15.30", titleEn: "TIGORS-2 National Continuous Positioning Reference Station Project Phase 2", titleTh: "โครงการพัฒนาศักยภาพและส่งเสริมการใช้ประโยชน์ศูนย์ข้อมูลสถานีค่าอ้างอิงพิกัดแบบต่อเนื่องแห่งชาติ ระยะที่ 2 (TIGORS-2)" },
          { time: "15.30 - 16.00", titleEn: "The Techno Bridge: From Asia to Berlin - Marten Rauschenberg (AsiaBerlin)", titleTh: "The Techno Bridge: From Asia to Berlin - Mr.Marten Rauschenberg, Managing Director of AsiaBerlin" },
          { time: "16.00 - 16.30", titleEn: "Expanding Business in Korea - Charles Kim (Y&Archer) & Navaporn Nakanithi (KTO)", titleTh: "Expanding your business in Korea - Charles Kim,Executive Director of Global Strategy, Y&Archer / Navaporn Nakanithi, Manager KTO" },
          { time: "17.00 - 17.30", titleEn: "Global Market Opportunities Showcase", titleTh: "Global Market" }
        ]
      }
    ]
  },
  {
    id: "pitch-stage",
    nameEn: "Pitch Stage",
    nameTh: "เวทีพิชชิ่ง (Pitch Stage)",
    days: [
      {
        day: 1,
        dateEn: "25 June 2026",
        dateTh: "25 มิถุนายน 2026",
        sessions: [
          { time: "13.00 - 17.30", titleEn: "SITE 2026 TOP 100 Pitching - Track A", titleTh: "TOP 100 Pitching" }
        ]
      },
      {
        day: 2,
        dateEn: "26 June 2026",
        dateTh: "26 มิถุนายน 2026",
        sessions: [
          { time: "10.30 - 12.00", titleEn: "Deep Tech Pitching: Best Performance Track", titleTh: "Deep Tech Pitching the best performance" },
          { time: "13.00 - 17.00", titleEn: "SPACE-F Acceleration Pitching and Match", titleTh: "SPACE-F Pitching" }
        ]
      },
      {
        day: 3,
        dateEn: "27 June 2026",
        dateTh: "27 มิถุนายน 2026",
        sessions: [
          { time: "10.30 - 12.30", titleEn: "Startup Thailand League Pitching: All Stars & International Tracks", titleTh: "Startup Thailand League Pitching (All stars + International Tracks)" },
          { time: "13.00 - 17.30", titleEn: "SITE 2026 TOP 100 Pitching Championship Round", titleTh: "TOP100 Pitching" }
        ]
      }
    ]
  },
  {
    id: "nex-hall",
    nameEn: "NEX Hall",
    nameTh: "เน็กซ์ฮอลล์ (NEX Hall)",
    days: [
      {
        day: 1,
        dateEn: "25 June 2026",
        dateTh: "25 มิถุนายน 2026",
        sessions: [
          { time: "10.00 - 10.30", titleEn: "Makerthon: Registration & Onboarding", titleTh: "Makerthon: ลงทะเบียน" },
          { time: "10.30 - 12.00", titleEn: "Makerthon: Training & Development Workshop", titleTh: "Makerthon: Workshop" },
          { time: "10.00 - 17.30", titleEn: "Drone Soccer Championship 2026 Matches", titleTh: "Drone Soccer Champiomship 2026" },
          { time: "10.00 - 17.30", titleEn: "Maker Exhibition Booths (30+ Creative Makers)", titleTh: "Maker Booths (30+ Makers)" },
          { time: "13.00 - 14.30", titleEn: "Makerthon: Prototyping Demo Showcase", titleTh: "Makerthon: Demo ตัวอย่าง" },
          { time: "16.00 - 17.00", titleEn: "Makerthon: Ideation and Hardware Kit Unboxing", titleTh: "Makerthon: Ideation + Kit" }
        ]
      },
      {
        day: 2,
        dateEn: "26 June 2026",
        dateTh: "26 มิถุนายน 2026",
        sessions: [
          { time: "12.00 - 12.30", titleEn: "Live Concert: inmintcondition (TH)", titleTh: "inmintcondition (TH)" },
          { time: "12.40 - 13.10", titleEn: "Live Performance: Ohzora Kimishima & Taguchi Hana (JP)", titleTh: "Ohzora Kimishima & Taguchi Hana (JP)" },
          { time: "13.20 - 13.50", titleEn: "Live Performance: Takahito Uchisawa (androp) (JP)", titleTh: "Takahito Uchisawa (androp) (JP)" },
          { time: "14.20 - 15.00", titleEn: "Live Performance: STEREO DIVE FOUNDATION & Tom Kawada (JP)", titleTh: "STEREO DIVE FOUNDATION & Tom Kawada (JP)" },
          { time: "15.30 - 16.10", titleEn: "Live Performance: EYE VDJ MASA with Takahito Uchisawa (JP)", titleTh: "EYE VDJ MASA (with ALS MASATANE MUTO) with Takahito Uchisawa (androp) (JP)" },
          { time: "16.50 - 17.30", titleEn: "Live Concert: KIKI (TH)", titleTh: "KIKI(TH)" }
        ]
      },
      {
        day: 3,
        dateEn: "27 June 2026",
        dateTh: "27 มิถุนายน 2026",
        sessions: [
          { time: "10.00 - 10.20", titleEn: "Nature Positive Thailand Seminar: Next Frontier Startups for Nature - Dr. Krithpaka Boonfueng (NIA)", titleTh: "Naturing the Next Frontier Startup for Nature Positive ยุทธศาสตร์ในการสร้างระบบนิเวศนวัตกรรมและสนับสนุนสตาร์ตอัปเพื่อพัฒนานวัตกรรมในด้านการฟื้นฟูธรรมชาติ - ดร.กริชผกา บุญเฟื่อง ผู้อำนวยการสำนักงานนวัตกรรมแห่งชาติ (NIA)" },
          { time: "10.20 - 10.45", titleEn: "Nature as the Solution: Driving Actions for Climate-Resilience - Rosarin Amornpitakpan (Department of Climate Change)", titleTh: "Nature as the Solution : Driving Nature Positive Actions for a Climate - Resilient Future. เมื่อธรรมขาติคือทางออก : ขับเคลื่อน Nature Positive แก้วิกฤตโลกเดือด - คุณรสริน อมรพิทักษ์พันธ์ ผอ.กลุ่มพัฒนาแนวทางการปรับตัว กรมการเปลี่ยนแปลงสภาพภูมิอากาศและสิ่งแวดล้อม" },
          { time: "10.45 - 11.10", titleEn: "From Numbers to Action: Assessing Thailand's Biodiversity Footprint - Dr. Ukrit Charoenkiatkachorn (KMUTT)", titleTh: "จากตัวเลขสู่ธรรมชาติที่ยั่งยืน : ขีดจำกัดความท้าทาย และแนวทางในการประเมินรอยเท้าความหลากหลายทางชีวภาพของประเทศไทย - ดร.อุกฤษ เจริญเกียรติขจร บัณฑิตวิทยาลัยร่วมด้านพลังงานและสิ่งแวดล้อม มหาวิทยาลัยเทคโนโลยีพระจอมเก้าธนบุรี" },
          { time: "11.10 - 11.35", titleEn: "Biodiversity Finance - Assoc. Prof. Dr. Khanittha Tambunlertchai (Chulalongkorn University)", titleTh: "การเงินเพื่อความหลากหลายทางชีวภาพ - รศ.ดร.ขนิษฐา แต้มบุญเลิศชัย คณะเศรษฐศาสตร์ จุฬาลงกรณ์ มหาวิทยาลัย" },
          { time: "11.35 - 12.00", titleEn: "Business Opportunities for Corporates and Startups - Dr. Pornphimon Boonkum (TIIS & MTEC)", titleTh: "โอกาสทางธุรกิจสำหรับองค์กรและสตาร์ตอัป - ดร.พรพิมล บุญคุ้ม สถาบันเทคโนโลยีและการสื่อสารเพื่อการพัฒนาที่ยังยืน (TIIS) ศูนย์เทคโนโลยีโลหะและวัสดุแห่งชาติ" },
          { time: "12.00 - 12.30", titleEn: "Nature Positive as Thailand's Next Growth Engine - Policy Vision - Prof. Dr. Yoschanan Wongsawat (MHESI Minister)", titleTh: "Nature Positive as Thailand's Next Growth Engine - การแสดงวิสัยทัศน์ระดับนโยบายของประเทศไทยในการยกระดับเป้าหมายของการใช้นวัตกรรมขับเคลื่อนขับเคลื่อน Nature Positive - ศ.ดร.ยศชนัน วงศ์สวัสดิ์ รองนายกรัฐมนตรีและรัฐมนตรีว่าการกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัย และนวัตกรรม" },
          { time: "13.00 - 17.30", titleEn: "Maker Exhibition Booths (30+ Makers Showcase)", titleTh: "Maker Booth (30+ Makers)" },
          { time: "13.00 - 13.30", titleEn: "Makerthon: Setup & Final Preparations", titleTh: "Makerthon: Setup " },
          { time: "13.30 - 15.30", titleEn: "Makerthon: Judges' Evaluation & Walkthrough", titleTh: "Makerthon : กรรมการเยี่ยมชม" },
          { time: "15.30 - 16.30", titleEn: "Makerthon: Public Showcase & General Visits", titleTh: "Makerthon : ผู้เข้าร่วมและผู้ชมทั่วไปเยี่ยมชม" },
          { time: "16.30 - 17.00", titleEn: "Makerthon: Award Announcement & Closing", titleTh: "Makerthon : ประกาศผล" }
        ]
      }
    ]
  },
  {
    id: "innovatok-pod",
    nameEn: "InnovaTok POD",
    nameTh: "อินโนวาต๊อกพ็อด (InnovaTok POD)",
    days: [
      {
        day: 1,
        dateEn: "25 June 2026",
        dateTh: "25 มิถุนายน 2026",
        sessions: [
          { time: "14.00 - 15.00", titleEn: "Beyond the Board: Board Game Industry Investment Opportunities - Watanachai Treedecha (TBGA President)", titleTh: "Beyond the Board: โอกาสการลงทุนในอุตสาหกรรมบอร์ดเกมยุคใหม่ โดย พี่วัฒน์ - วัฒนชัย ตรีเดชา นายกสมาคมบอร์ดเกมประเทศไทย (TBGA:Thailand Board Game Association) " }
        ]
      },
      {
        day: 2,
        dateEn: "26 June 2026",
        dateTh: "26 มิถุนายน 2026",
        sessions: [
          { time: "11.00 - 12.00", titleEn: "Personal Branding as an Asset: Growing Channels - Sam Polsan (@samponsan)", titleTh: "Personal Branding as an Asset: เมื่อการสร้างตัวตน เท่ากับการสร้างสินทรัพย์ที่เติบโตได้ - คุณแซม พลสัน เจ้าของช่องเล่าเรื่องแบรนด์กับ แซม พลสัน (@samponsan)" },
          { time: "14.00 - 15.00", titleEn: "Creative Business Community by Creative Talk - Keng-Sittipong & Joe-Chaveewan", titleTh: "Creative Business Community by Creative Talk - คุณเก่ง-สิทธิพงศ์ ศิริมาศเกษม, คุณโจ้-ฉวีวรรณ คงโชคสมัย Creative Talk" },
          { time: "16.00 - 17.00", titleEn: "What Data Tells Investors: Consumer Trends - Kla Tangsuwan (Wisesight CEO)", titleTh: "What Data Tells Investors: มองโอกาสการลงทุนผ่านข้อมูลและเทรนด์ผู้บริโ ผู้โภค - คุณกล้า ตั้งสุวรรณ CEO, Wisesight " }
        ]
      },
      {
        day: 3,
        dateEn: "27 June 2026",
        dateTh: "27 มิถุนายน 2026",
        sessions: [
          { time: "11.00 - 12.00", titleEn: "The Creator Playbook: Creating Knowledge Channels with Millions of Views", titleTh: "The Creator Playbook: เจาะเบื้องหลังการสร้างช่องความรู้ให้คนดูหลักล้าน" },
          { time: "14.00 - 15.00", titleEn: "Money Journey: From Saving to Investing - Chompoo Share Journey", titleTh: "Money Journey: จากการออมสู่การลงทุน กับ ชมพู่แชร์เจอนี่" }
        ]
      }
    ]
  },
  {
    id: "meeting-room-1",
    nameEn: "Meeting Room 1",
    nameTh: "ห้องประชุม 1 (Meeting Room 1)",
    days: [
      {
        day: 1,
        dateEn: "25 June 2026",
        dateTh: "25 มิถุนายน 2026",
        sessions: [
          { time: "14.00 - 16.00", titleEn: "NIA x Kenan Foundation Training Session", titleTh: "NIA x คีนัน จัดอบรมมูลนิธิคีนันแห่งประเทศไทย" },
          { time: "17.00 - 17.30", titleEn: "Humanoid Robotics Development Workshop", titleTh: "Humanoid workshop" }
        ]
      },
      {
        day: 2,
        dateEn: "26 June 2026",
        dateTh: "26 มิถุนายน 2026",
        sessions: [
          { time: "10.00 - 14.00", titleEn: "Thai Programmer Association Coding Workshop", titleTh: "สมาคมโปรแกรมเมอร์ไทย" }
        ]
      },
      {
        day: 3,
        dateEn: "27 June 2026",
        dateTh: "27 มิถุนายน 2026",
        sessions: [
          { time: "10.00 - 17.00", titleEn: "Private B2B Meetings & Matchmaking Sessions", titleTh: "การเจรจาธุรกิจแบบปิดและการจับคู่ธุรกิจนวัตกรรม" }
        ]
      }
    ]
  },
  {
    id: "meeting-room-2",
    nameEn: "Meeting Room 2",
    nameTh: "ห้องประชุม 2 (Meeting Room 2)",
    days: [
      {
        day: 1,
        dateEn: "25 June 2026",
        dateTh: "25 มิถุนายน 2026",
        sessions: [
          { time: "15.00 - 17.00", titleEn: "Local Seed to Success: Social Innovators Scaling & Sharing", titleTh: "Local Seed to Success: ต่อยอดความสำเร็จจากนวัตกรเพื่อสังคม" }
        ]
      },
      {
        day: 2,
        dateEn: "26 June 2026",
        dateTh: "26 มิถุนายน 2026",
        sessions: [
          { time: "13.00 - 18.00", titleEn: "PPCIL #8 Public Policy Innovation Sandbox", titleTh: "PPCIL#8" }
        ]
      },
      {
        day: 3,
        dateEn: "27 June 2026",
        dateTh: "27 มิถุนายน 2026",
        sessions: [
          { time: "13.00 - 17.00", titleEn: "CONNEX: Finance, Tech & Market Gaps for Thai Climate Entrepreneurs", titleTh: "CONNEX: Understanding the Finance, Technical, and Market Access Gaps for Thailand's Climate Entrepreneurs" }
        ]
      }
    ]
  }
];
