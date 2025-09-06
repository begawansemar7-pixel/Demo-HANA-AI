

export interface KnowledgeDocument {
    id: string;
    title: string;
    content: string;
    keywords: string[];
}

export const HALAL_KNOWLEDGE_BASE: KnowledgeDocument[] = [
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