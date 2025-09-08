export interface KnowledgeDocument {
    id: string;
    title: string;
    content: string;
    keywords: string[];
}

const en: KnowledgeDocument[] = [
    {
        id: 'bpjph-info',
        title: 'About BPJPH',
        content: 'BPJPH stands for the Halal Product Assurance Organizing Body (Badan Penyelenggara Jaminan Produk Halal). It is a government agency under the Ministry of Religious Affairs of Indonesia responsible for organizing halal product assurance. Its main tasks include issuing halal certificates, regulating halal auditors, and overseeing the entire halal ecosystem in Indonesia via the SIHALAL system.',
        keywords: ['bpjph', 'agency', 'government', 'ministry', 'certification body'],
    },
    {
        id: 'sihalal-system',
        title: 'The SIHALAL System',
        content: 'SIHALAL (Sistem Informasi Halal) is the official online platform for halal product certification in Indonesia, managed by BPJPH. It serves as an integrated, end-to-end system for all stakeholders in the halal certification process. Key features include: business registration (for UMKM and large companies), document submission, selection of a Halal Inspection Agency (LPH), online payment processing, and real-time tracking of the application status. Users can also download their final halal certificate directly from the platform. It is the primary gateway for any business wanting to get their products halal certified.',
        keywords: ['sihalal', 'online', 'platform', 'system', 'registration', 'application', 'apply', 'portal', 'website', 'document submission', 'tracking'],
    },
    {
        id: 'certification-process',
        title: 'Halal Certification Process via SIHALAL',
        content: 'The halal certification process is primarily conducted through the SIHALAL online system. The key steps are: 1. **Registration & Submission:** Business owners create an account on the SIHALAL platform (ptsp.halal.go.id) and submit their application, including business data, product details, and required documents. 2. **LPH Selection & Audit:** The applicant chooses an accredited Halal Inspection Agency (LPH) through the system. The LPH then conducts a thorough audit of the ingredients, production process, and facilities. 3. **MUI Fatwa:** The audit results are submitted to the Indonesian Ulema Council (MUI) Fatwa Commission for review. The commission holds a session (sidang fatwa) to determine if the product meets halal standards. 4. **Certificate Issuance:** If the MUI issues a halal determination, BPJPH will then issue the official Halal Certificate, which can be downloaded directly from the SIHALAL system.',
        keywords: ['process', 'certificate', 'certification', 'how to', 'steps', 'sihalal', 'lph', 'mui', 'audit', 'fatwa', 'application'],
    },
    {
        id: 'sihalal-users',
        title: 'User Roles in SIHALAL',
        content: 'The SIHALAL system is used by various parties. The main user roles are: 1. **Business Actors (Pelaku Usaha):** These are the companies or individuals applying for certification. They upload documents and track their application. 2. **Halal Inspection Agency (LPH):** These are accredited bodies that perform the audits. They receive applications, schedule audits, and submit reports through SIHALAL. 3. **Halal Supervisor (Penyelia Halal):** A person with knowledge of halal criteria who represents the business to ensure the production process remains halal. 4. **MUI (Indonesian Ulema Council):** The MUI uses the system to review audit results and issue halal fatwas. 5. **BPJPH:** The agency uses the system to manage the entire process, from registration to certificate issuance and oversight.',
        keywords: ['users', 'roles', 'pelaku usaha', 'lph', 'penyelia halal', 'auditor', 'mui', 'stakeholders'],
    },
    {
        id: 'sehati-program',
        title: 'SEHATI Program (Free Halal Certification)',
        content: 'SEHATI (Sertifikasi Halal Gratis) is a government-funded program by BPJPH that provides free halal certification for Micro and Small Enterprises (UMKM).\n\n**Benefits:** The primary benefit is that the certification fee is entirely covered by the government, making it free for the business. This helps UMKMs comply with mandatory halal regulations, increases consumer trust, and adds value to their products.\n\n**Eligibility Criteria:** To be eligible, businesses must typically meet the following criteria:\n1. Be classified as a Micro or Small Enterprise.\n2. Possess a valid Business Identification Number (NIB).\n3. Produce products with low-risk ingredients and simple production processes (e.g., not requiring complex slaughter).\n4. Have never received SEHATI funding in previous years for the same product.\n5. Be willing to commit to maintaining the Halal Product Process (PPH).\n\n**Application Procedure:**\n1. Create an account on the SIHALAL portal (ptsp.halal.go.id).\n2. Ensure business data, especially the NIB, is up-to-date.\n3. When the annual SEHATI quota is announced and opened by BPJPH, applicants can register via SIHALAL.\n4. During the application process, select the "self-declare" or SEHATI financing option.\n5. Complete the application and follow the subsequent verification and audit steps as guided by the system.',
        keywords: ['sehati', 'free', 'gratis', 'umkm', 'micro', 'small business', 'cost', 'fee', 'eligibility', 'criteria', 'requirements', 'benefits', 'apply', 'how to', 'procedure', 'nib', 'self-declare'],
    },
    {
        id: 'critical-ingredients',
        title: 'Critical Halal Ingredients',
        content: 'Some ingredients are considered critical points in halal assessment and require special attention. These are often labeled as "Syubhat" (doubtful) until their source is confirmed. Examples include: Gelatin (can be from pork or beef), Whey (can involve non-halal enzymes in cheese production), L-cysteine (can be derived from human hair, which is haram), and various emulsifiers or flavorings that might have animal-derived or alcohol-based components.',
        keywords: ['critical', 'ingredients', 'syubhat', 'doubtful', 'haram', 'gelatin', 'whey', 'emulsifier', 'l-cysteine'],
    },
    {
        id: 'mandatory-certification-2024',
        title: 'Mandatory Halal Certification 2024',
        content: 'The first phase of mandatory halal certification in Indonesia begins on October 17, 2024. This policy affects specific product categories. \n\n**Affected Categories (Phase 1):**\n1. Food and beverage products.\n2. Raw materials, food additives, and auxiliary materials for food and beverages.\n3. Butchery products and services.\n\n**Consequences of Non-Compliance:** Businesses that fail to certify their products by the deadline will face sanctions. These can range from written warnings and administrative fines to the potential withdrawal of their products from the market. \n\n**How Businesses Can Prepare:**\n1. **Register on SIHALAL:** Create a business account on the official portal (ptsp.halal.go.id).\n2. **Prepare Documents:** Gather necessary documents like the Business Identification Number (NIB), a detailed list of products, and a complete list of ingredients used.\n3. **Appoint a Halal Supervisor:** Designate a person responsible for overseeing the halal production process.\n4. **Submit Application:** Complete and submit the certification application through the SIHALAL system before the deadline.\n5. **For UMKMs:** Micro and Small Enterprises are encouraged to utilize the SEHATI program for free certification to ease the process.',
        keywords: ['mandatory', 'wajib', '2024', 'october', 'deadline', 'food', 'beverage', 'sanctions', 'non-compliance', 'fines', 'prepare', 'steps', 'categories', 'butchery', 'raw materials'],
    },
    {
        id: 'halal-regulation-law',
        title: 'Primary Halal Regulation Law',
        content: 'The main legal basis for Halal Product Assurance in Indonesia is Law No. 33 of 2014 concerning Halal Product Assurance (UU JPH). This law mandates that all products that enter, circulate, and are traded in Indonesia must be halal certified, with exceptions for products explicitly declared as non-halal. The law established BPJPH as the sole organizing body for this assurance. It also outlines the roles of Halal Inspection Agencies (LPH) and the Indonesian Ulema Council (MUI) in the certification process. Government Regulation (PP) No. 39 of 2021 provides further implementation details for this law, including the stages of mandatory certification.',
        keywords: ['regulation', 'law', 'uu 33 2014', 'uu jph', 'government regulation', 'pp 39 2021', 'legal', 'basis', 'rules'],
    }
];

const id: KnowledgeDocument[] = [
    {
        id: 'bpjph-info',
        title: 'Tentang BPJPH',
        content: 'BPJPH adalah singkatan dari Badan Penyelenggara Jaminan Produk Halal. Ini adalah lembaga pemerintah di bawah Kementerian Agama Republik Indonesia yang bertanggung jawab untuk menyelenggarakan jaminan produk halal. Tugas utamanya meliputi penerbitan sertifikat halal, mengatur auditor halal, dan mengawasi seluruh ekosistem halal di Indonesia melalui sistem SIHALAL.',
        keywords: ['bpjph', 'badan', 'pemerintah', 'kementerian', 'lembaga sertifikasi'],
    },
    {
        id: 'sihalal-system',
        title: 'Sistem SIHALAL',
        content: 'SIHALAL (Sistem Informasi Halal) adalah platform online resmi untuk sertifikasi produk halal di Indonesia, yang dikelola oleh BPJPH. Ini berfungsi sebagai sistem terintegrasi ujung-ke-ujung untuk semua pemangku kepentingan dalam proses sertifikasi halal. Fitur utamanya meliputi: pendaftaran usaha (untuk UMKM dan perusahaan besar), pengajuan dokumen, pemilihan Lembaga Pemeriksa Halal (LPH), proses pembayaran online, dan pelacakan status aplikasi secara real-time. Pengguna juga dapat mengunduh sertifikat halal akhir mereka langsung dari platform. Ini adalah gerbang utama bagi setiap bisnis yang ingin mendapatkan sertifikasi halal untuk produk mereka.',
        keywords: ['sihalal', 'online', 'platform', 'sistem', 'pendaftaran', 'aplikasi', 'mengajukan', 'portal', 'situs web', 'pengajuan dokumen', 'pelacakan'],
    },
    {
        id: 'certification-process',
        title: 'Proses Sertifikasi Halal melalui SIHALAL',
        content: 'Proses sertifikasi halal utamanya dilakukan melalui sistem online SIHALAL. Langkah-langkah utamanya adalah: 1. **Pendaftaran & Pengajuan:** Pelaku usaha membuat akun di platform SIHALAL (ptsp.halal.go.id) dan mengajukan permohonan, termasuk data usaha, detail produk, dan dokumen yang diperlukan. 2. **Pemilihan LPH & Audit:** Pemohon memilih Lembaga Pemeriksa Halal (LPH) yang terakreditasi melalui sistem. LPH kemudian melakukan audit menyeluruh terhadap bahan, proses produksi, dan fasilitas. 3. **Fatwa MUI:** Hasil audit diserahkan kepada Komisi Fatwa Majelis Ulama Indonesia (MUI) untuk ditinjau. Komisi mengadakan sidang fatwa untuk menentukan apakah produk tersebut memenuhi standar halal. 4. **Penerbitan Sertifikat:** Jika MUI mengeluarkan ketetapan halal, BPJPH akan menerbitkan Sertifikat Halal resmi, yang dapat diunduh langsung dari sistem SIHALAL.',
        keywords: ['proses', 'sertifikat', 'sertifikasi', 'cara', 'langkah', 'sihalal', 'lph', 'mui', 'audit', 'fatwa', 'permohonan'],
    },
    {
        id: 'sihalal-users',
        title: 'Peran Pengguna di SIHALAL',
        content: 'Sistem SIHALAL digunakan oleh berbagai pihak. Peran pengguna utamanya adalah: 1. **Pelaku Usaha:** Ini adalah perusahaan atau perorangan yang mengajukan sertifikasi. Mereka mengunggah dokumen dan melacak permohonan mereka. 2. **Lembaga Pemeriksa Halal (LPH):** Ini adalah badan terakreditasi yang melakukan audit. Mereka menerima permohonan, menjadwalkan audit, dan menyerahkan laporan melalui SIHALAL. 3. **Penyelia Halal:** Seseorang dengan pengetahuan tentang kriteria halal yang mewakili bisnis untuk memastikan proses produksi tetap halal. 4. **MUI (Majelis Ulama Indonesia):** MUI menggunakan sistem untuk meninjau hasil audit dan mengeluarkan fatwa halal. 5. **BPJPH:** Badan ini menggunakan sistem untuk mengelola seluruh proses, dari pendaftaran hingga penerbitan sertifikat dan pengawasan.',
        keywords: ['pengguna', 'peran', 'pelaku usaha', 'lph', 'penyelia halal', 'auditor', 'mui', 'pemangku kepentingan'],
    },
    {
        id: 'sehati-program',
        title: 'Program SEHATI (Sertifikasi Halal Gratis)',
        content: 'SEHATI (Sertifikasi Halal Gratis) adalah program yang didanai pemerintah oleh BPJPH yang menyediakan sertifikasi halal gratis untuk Usaha Mikro dan Kecil (UMKM).\n\n**Manfaat:** Manfaat utamanya adalah biaya sertifikasi ditanggung sepenuhnya oleh pemerintah, sehingga gratis bagi pelaku usaha. Ini membantu UMKM mematuhi peraturan wajib halal, meningkatkan kepercayaan konsumen, dan menambah nilai pada produk mereka.\n\n**Kriteria Kelayakan:** Agar memenuhi syarat, usaha biasanya harus memenuhi kriteria berikut:\n1. Tergolong sebagai Usaha Mikro atau Kecil.\n2. Memiliki Nomor Induk Berusaha (NIB) yang valid.\n3. Memproduksi produk dengan bahan berisiko rendah dan proses produksi sederhana (misalnya, tidak memerlukan penyembelihan yang rumit).\n4. Belum pernah menerima pendanaan SEHATI di tahun-tahun sebelumnya untuk produk yang sama.\n5. Bersedia berkomitmen untuk menjaga Proses Produk Halal (PPH).\n\n**Prosedur Pendaftaran:**\n1. Buat akun di portal SIHALAL (ptsp.halal.go.id).\n2. Pastikan data usaha, terutama NIB, sudah diperbarui.\n3. Saat kuota tahunan SEHATI diumumkan dan dibuka oleh BPJPH, pendaftar dapat mendaftar melalui SIHALAL.\n4. Selama proses pendaftaran, pilih opsi pembiayaan "self-declare" atau SEHATI.\n5. Lengkapi pendaftaran dan ikuti langkah-langkah verifikasi dan audit selanjutnya sesuai panduan sistem.',
        keywords: ['sehati', 'gratis', 'bebas', 'umkm', 'mikro', 'usaha kecil', 'biaya', 'ongkos', 'syarat', 'kriteria', 'persyaratan', 'manfaat', 'mendaftar', 'cara', 'prosedur', 'nib', 'deklarasi mandiri'],
    },
    {
        id: 'critical-ingredients',
        title: 'Bahan Kritis Halal',
        content: 'Beberapa bahan dianggap sebagai titik kritis dalam penilaian halal dan memerlukan perhatian khusus. Bahan-bahan ini sering diberi label "Syubhat" (meragukan) sampai sumbernya dapat dikonfirmasi. Contohnya termasuk: Gelatin (bisa dari babi atau sapi), Whey (bisa melibatkan enzim non-halal dalam produksi keju), L-sistein (bisa berasal dari rambut manusia, yang haram), dan berbagai pengemulsi atau perasa yang mungkin memiliki komponen turunan hewani atau berbasis alkohol.',
        keywords: ['kritis', 'bahan', 'syubhat', 'meragukan', 'haram', 'gelatin', 'whey', 'pengemulsi', 'l-sistein'],
    },
    {
        id: 'mandatory-certification-2024',
        title: 'Wajib Sertifikasi Halal 2024',
        content: 'Tahap pertama kewajiban sertifikasi halal di Indonesia dimulai pada 17 Oktober 2024. Kebijakan ini memengaruhi kategori produk tertentu. \n\n**Kategori yang Terkena Dampak (Tahap 1):**\n1. Produk makanan dan minuman.\n2. Bahan baku, bahan tambahan pangan, dan bahan penolong untuk makanan dan minuman.\n3. Produk dan jasa hasil sembelihan.\n\n**Konsekuensi Ketidakpatuhan:** Pelaku usaha yang gagal mensertifikasi produknya pada batas waktu akan menghadapi sanksi. Sanksi ini dapat berkisar dari peringatan tertulis dan denda administratif hingga potensi penarikan produk mereka dari pasar. \n\n**Cara Persiapan Pelaku Usaha:**\n1. **Daftar di SIHALAL:** Buat akun usaha di portal resmi (ptsp.halal.go.id).\n2. **Siapkan Dokumen:** Kumpulkan dokumen yang diperlukan seperti Nomor Induk Berusaha (NIB), daftar detail produk, dan daftar lengkap bahan yang digunakan.\n3. **Tunjuk Penyelia Halal:** Tunjuk seseorang yang bertanggung jawab untuk mengawasi proses produksi halal.\n4. **Ajukan Permohonan:** Lengkapi dan ajukan permohonan sertifikasi melalui sistem SIHALAL sebelum batas waktu.\n5. **Untuk UMKM:** Usaha Mikro dan Kecil didorong untuk memanfaatkan program SEHATI untuk sertifikasi gratis guna mempermudah proses.',
        keywords: ['wajib', 'mandatori', '2024', 'oktober', 'tenggat waktu', 'makanan', 'minuman', 'sanksi', 'ketidakpatuhan', 'denda', 'persiapan', 'langkah', 'kategori', 'jagal', 'bahan baku'],
    },
    {
        id: 'halal-regulation-law',
        title: 'Dasar Hukum Regulasi Halal',
        content: 'Dasar hukum utama untuk Jaminan Produk Halal di Indonesia adalah Undang-Undang No. 33 Tahun 2014 tentang Jaminan Produk Halal (UU JPH). Undang-undang ini mengamanatkan bahwa semua produk yang masuk, beredar, dan diperdagangkan di Indonesia wajib bersertifikat halal, dengan pengecualian untuk produk yang secara eksplisit dinyatakan tidak halal. Undang-undang ini mendirikan BPJPH sebagai satu-satunya badan penyelenggara jaminan ini. Ini juga menguraikan peran Lembaga Pemeriksa Halal (LPH) dan Majelis Ulama Indonesia (MUI) dalam proses sertifikasi. Peraturan Pemerintah (PP) No. 39 Tahun 2021 memberikan rincian pelaksanaan lebih lanjut untuk undang-undang ini, termasuk tahapan kewajiban sertifikasi.',
        keywords: ['regulasi', 'hukum', 'uu 33 2014', 'uu jph', 'peraturan pemerintah', 'pp 39 2021', 'legal', 'dasar', 'aturan'],
    }
];

const ar: KnowledgeDocument[] = [
    {
        id: 'bpjph-info',
        title: 'حول BPJPH',
        content: 'BPJPH هو اختصار لهيئة تنظيم ضمان المنتجات الحلال (Badan Penyelenggara Jaminan Produk Halal). وهي هيئة حكومية تابعة لوزارة الشؤون الدينية في إندونيسيا مسؤولة عن تنظيم ضمان المنتجات الحلال. تشمل مهامها الرئيسية إصدار شهادات الحلال، وتنظيم مدققي الحلال، والإشراف على النظام البيئي للحلال بأكمله في إندونيسيا عبر نظام SIHALAL.',
        keywords: ['bpjph', 'هيئة', 'حكومة', 'وزارة', 'جهة تصديق'],
    },
    {
        id: 'sihalal-system',
        title: 'نظام SIHALAL',
        content: 'SIHALAL (نظام معلومات الحلال) هو المنصة الإلكترونية الرسمية لشهادات المنتجات الحلال في إندونيسيا، وتديرها BPJPH. وهو بمثابة نظام متكامل وشامل لجميع أصحاب المصلحة في عملية إصدار شهادات الحلال. تشمل الميزات الرئيسية: تسجيل الأعمال (للمؤسسات الصغيرة والمتوسطة والشركات الكبيرة)، وتقديم المستندات، واختيار هيئة فحص الحلال (LPH)، ومعالجة الدفع عبر الإنترنت، وتتبع حالة الطلب في الوقت الفعلي. يمكن للمستخدمين أيضًا تنزيل شهادة الحلال النهائية مباشرة من المنصة. إنه البوابة الأساسية لأي شركة ترغب في الحصول على شهادة حلال لمنتجاتها.',
        keywords: ['sihalal', 'عبر الإنترنت', 'منصة', 'نظام', 'تسجيل', 'طلب', 'تقديم', 'بوابة', 'موقع ويب', 'تقديم المستندات', 'تتبع'],
    },
    {
        id: 'certification-process',
        title: 'عملية شهادة الحلال عبر SIHALAL',
        content: 'تتم عملية شهادة الحلال بشكل أساسي من خلال نظام SIHALAL عبر الإنترنت. الخطوات الرئيسية هي: 1. **التسجيل والتقديم:** يقوم أصحاب الأعمال بإنشاء حساب على منصة SIHALAL (ptsp.halal.go.id) وتقديم طلباتهم، بما في ذلك بيانات العمل وتفاصيل المنتج والمستندات المطلوبة. 2. **اختيار LPH والتدقيق:** يختار مقدم الطلب هيئة فحص حلال معتمدة (LPH) من خلال النظام. ثم تقوم LPH بإجراء تدقيق شامل للمكونات وعملية الإنتاج والمرافق. 3. **فتوى MUI:** يتم تقديم نتائج التدقيق إلى لجنة الفتوى بمجلس العلماء الإندونيسي (MUI) لمراجعتها. تعقد اللجنة جلسة (sidang fatwa) لتحديد ما إذا كان المنتج يفي بمعايير الحلال. 4. **إصدار الشهادة:** إذا أصدرت MUI قرارًا بالحلال، فستقوم BPJPH بعد ذلك بإصدار شهادة الحلال الرسمية، والتي يمكن تنزيلها مباشرة من نظام SIHALAL.',
        keywords: ['عملية', 'شهادة', 'تصديق', 'كيف', 'خطوات', 'sihalal', 'lph', 'mui', 'تدقيق', 'فتوى', 'طلب'],
    },
    {
        id: 'sihalal-users',
        title: 'أدوار المستخدمين في SIHALAL',
        content: 'يستخدم نظام SIHALAL من قبل أطراف مختلفة. أدوار المستخدمين الرئيسية هي: 1. **الفاعلون التجاريون (Pelaku Usaha):** هؤلاء هم الشركات أو الأفراد الذين يتقدمون للحصول على الشهادة. يقومون بتحميل المستندات وتتبع طلباتهم. 2. **هيئة فحص الحلال (LPH):** هذه هيئات معتمدة تقوم بإجراء عمليات التدقيق. يتلقون الطلبات ويجدولون عمليات التدقيق ويقدمون التقارير من خلال SIHALAL. 3. **مشرف الحلال (Penyelia Halal):** شخص لديه معرفة بمعايير الحلال يمثل الشركة لضمان بقاء عملية الإنتاج حلالاً. 4. **مجلس العلماء الإندونيسي (MUI):** يستخدم مجلس العلماء النظام لمراجعة نتائج التدقيق وإصدار فتاوى الحلال. 5. **BPJPH:** تستخدم الهيئة النظام لإدارة العملية بأكملها، من التسجيل إلى إصدار الشهادات والإشراف.',
        keywords: ['مستخدمون', 'أدوار', 'فاعل تجاري', 'lph', 'مشرف حلال', 'مدقق', 'mui', 'أصحاب المصلحة'],
    },
    {
        id: 'sehati-program',
        title: 'برنامج SEHATI (شهادة حلال مجانية)',
        content: 'SEHATI (شهادة حلال مجانية) هو برنامج ممول من الحكومة من قبل BPJPH يوفر شهادة حلال مجانية للمؤسسات الصغرى والصغيرة (UMKM).\n\n**الفوائد:** الفائدة الأساسية هي أن رسوم الشهادة مغطاة بالكامل من قبل الحكومة، مما يجعلها مجانية للشركة. وهذا يساعد المؤسسات الصغيرة والمتوسطة على الامتثال للوائح الحلال الإلزامية، ويزيد من ثقة المستهلك، ويضيف قيمة لمنتجاتها.\n\n**معايير الأهلية:** لكي تكون مؤهلاً، يجب على الشركات عادةً تلبية المعايير التالية:\n1. أن تصنف على أنها مؤسسة صغرى أو صغيرة.\n2. أن تمتلك رقم تعريف عمل صالح (NIB).\n3. أن تنتج منتجات بمكونات منخفضة المخاطر وعمليات إنتاج بسيطة (على سبيل المثال، لا تتطلب ذبحًا معقدًا).\n4. ألا تكون قد تلقت تمويل SEHATI في السنوات السابقة لنفس المنتج.\n5. أن تكون على استعداد للالتزام بالحفاظ على عملية المنتج الحلال (PPH).\n\n**إجراءات التقديم:**\n1. قم بإنشاء حساب على بوابة SIHALAL (ptsp.halal.go.id).\n2. تأكد من أن بيانات العمل، وخاصة NIB، محدثة.\n3. عندما يتم الإعلان عن حصة SEHATI السنوية وفتحها من قبل BPJPH، يمكن للمتقدمين التسجيل عبر SIHALAL.\n4. أثناء عملية التقديم، حدد خيار تمويل "الإقرار الذاتي" أو SEHATI.\n5. أكمل الطلب واتبع خطوات التحقق والتدقيق اللاحقة كما هو موضح في النظام.',
        keywords: ['sehati', 'مجاني', 'بدون تكلفة', 'umkm', 'صغير', 'أعمال صغيرة', 'تكلفة', 'رسوم', 'أهلية', 'معايير', 'متطلبات', 'فوائد', 'تقديم طلب', 'كيفية', 'إجراء', 'nib', 'إقرار ذاتي'],
    },
    {
        id: 'critical-ingredients',
        title: 'المكونات الحرجة في الحلال',
        content: 'تعتبر بعض المكونات نقاطًا حرجة في تقييم الحلال وتتطلب اهتمامًا خاصًا. غالبًا ما يتم تصنيفها على أنها "شبهات" حتى يتم تأكيد مصدرها. ومن الأمثلة على ذلك: الجيلاتين (يمكن أن يكون من الخنزير أو البقر)، ومصل اللبن (يمكن أن يتضمن إنزيمات غير حلال في إنتاج الجبن)، وإل-سيستين (يمكن أن يكون مشتقًا من شعر الإنسان، وهو حرام)، ومختلف المستحلبات أو النكهات التي قد تحتوي على مكونات مشتقة من الحيوانات أو الكحول.',
        keywords: ['حرجة', 'مكونات', 'شبهات', 'مشكوك فيه', 'حرام', 'جيلاتين', 'مصل اللبن', 'مستحلب', 'إل-سيستين'],
    },
    {
        id: 'mandatory-certification-2024',
        title: 'شهادة الحلال الإلزامية 2024',
        content: 'تبدأ المرحلة الأولى من شهادة الحلال الإلزامية في إندونيسيا في 17 أكتوبر 2024. تؤثر هذه السياسة على فئات منتجات محددة.\n\n**الفئات المتأثرة (المرحلة الأولى):**\n1. المنتجات الغذائية والمشروبات.\n2. المواد الخام والمضافات الغذائية والمواد المساعدة للأغذية والمشروبات.\n3. منتجات وخدمات الجزارة.\n\n**عواقب عدم الامتثال:** ستواجه الشركات التي تفشل في اعتماد منتجاتها بحلول الموعد النهائي عقوبات. يمكن أن تتراوح هذه العقوبات من تحذيرات كتابية وغرامات إدارية إلى احتمال سحب منتجاتها من السوق.\n\n**كيف يمكن للشركات الاستعداد:**\n1. **التسجيل في SIHALAL:** قم بإنشاء حساب تجاري على البوابة الرسمية (ptsp.halal.go.id).\n2. **إعداد المستندات:** اجمع المستندات اللازمة مثل رقم تعريف العمل (NIB)، وقائمة مفصلة بالمنتجات، وقائمة كاملة بالمكونات المستخدمة.\n3. **تعيين مشرف حلال:** عين شخصًا مسؤولاً عن الإشراف على عملية الإنتاج الحلال.\n4. **تقديم الطلب:** أكمل وقدم طلب الشهادة من خلال نظام SIHALAL قبل الموعد النهائي.\n5. **للمؤسسات الصغيرة والمتوسطة:** يتم تشجيع المؤسسات الصغرى والصغيرة على الاستفادة من برنامج SEHATI للحصول على شهادة مجانية لتسهيل العملية.',
        keywords: ['إلزامي', 'واجب', '2024', 'أكتوبر', 'موعد نهائي', 'طعام', 'شراب', 'عقوبات', 'عدم امتثال', 'غرامات', 'تحضير', 'خطوات', 'فئات', 'جزارة', 'مواد خام'],
    },
    {
        id: 'halal-regulation-law',
        title: 'القانون الأساسي لتنظيم الحلال',
        content: 'الأساس القانوني الرئيسي لضمان المنتجات الحلال في إندونيسيا هو القانون رقم 33 لعام 2014 بشأن ضمان المنتجات الحلال (UU JPH). ينص هذا القانون على أن جميع المنتجات التي تدخل وتتداول وتباع في إندونيسيا يجب أن تكون حاصلة على شهادة حلال، مع استثناءات للمنتجات المصرح بأنها غير حلال بشكل صريح. أنشأ القانون BPJPH كهيئة تنظيمية وحيدة لهذا الضمان. كما يحدد أدوار هيئات فحص الحلال (LPH) ومجلس العلماء الإندونيسي (MUI) في عملية إصدار الشهادات. توفر اللائحة الحكومية (PP) رقم 39 لعام 2021 تفاصيل تنفيذية إضافية لهذا القانون، بما في ذلك مراحل الشهادة الإلزامية.',
        keywords: ['تنظيم', 'قانون', 'uu 33 2014', 'uu jph', 'لائحة حكومية', 'pp 39 2021', 'قانوني', 'أساس', 'قواعد'],
    }
];

export const HALAL_KNOWLEDGE_BASE: { [key: string]: KnowledgeDocument[] } = {
    en,
    id,
    ar
};