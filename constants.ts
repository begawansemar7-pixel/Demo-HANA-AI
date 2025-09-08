import type { Service, Persona, PersonaId } from './types';
import React from 'react';

// Icons
// Fix: Converted JSX to React.createElement to be valid in a .ts file.
const CertificateIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }));
const CheckIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }));
const MarketIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" }));
const NewsIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m-4 3H9m-4 3h2m-4 3h2m-4 3h2" }));
const SupplierIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { d: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" }));
const ScanIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v1m6 11h2m-6.586 4.414l-1-1m-10-10l-1-1m17 0l-1 1M12 20v-1M4 12H2m14.586-4.414l1-1m-10 10l1-1M4 4l1 1m15 15l-1-1" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 6h6v6H9z" }));
const RegulationIcon = () => React.createElement('svg', { xmlns:"http://www.w3.org/2000/svg", className:"h-8 w-8", fill:"none", viewBox:"0 0 24 24", stroke:"currentColor" }, React.createElement('path', { strokeLinecap:"round", strokeLinejoin:"round", strokeWidth:2, d:"M12 6.253v11.494m-5.45-9.456l10.9 2.228m-10.9-2.228L5.45 4.545 2.25 5.454l3.2 1.964L12 6.253zM5.45 4.545L2.25 5.454 5.45 7.42 12 6.253 5.45 4.545zM18.55 19.455l3.2-1.964-3.2-1.964-6.55 1.33-3.2 1.964 3.2 1.964 6.55-1.33z" }));
const MoreIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" }));
const HanaIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
  // Frame
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" }),
  // Eyes
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 10h.01M15 10h.01" }),
  // Smile
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 14s1.5 2 3 2 3-2 3-2" })
);
const BusinessIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }));
const AuditorIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }));
const ConsumerIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" }));
const OfficerIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }));
const InfoIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }));
const MapIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" }));
const SelfDeclareIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }),
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 13l-2.5 2.5L11 14" })
);
const VerificationIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }),
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4" })
);
const AuditChecklistIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 8h6m-6 4h6m-10-4l2 2 4-4" })
);
const DashboardIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m6 0v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" })
);


const ALL_LOGGED_IN: PersonaId[] = ['consumer', 'umkm', 'auditor', 'officer'];
const BUSINESS_ROLES: PersonaId[] = ['umkm', 'auditor', 'officer'];

export const SERVICES: Service[] = [
  { id: 'hana', title: 'home.services.items.hana', icon: HanaIcon() },
  { id: 'cert-check', title: 'home.services.items.certCheck', icon: CertificateIcon(), personas: ALL_LOGGED_IN },
  { id: 'ingredient-validator', title: 'home.services.items.ingredientValidator', icon: CheckIcon(), personas: ['consumer', 'umkm', 'auditor'] },
  { id: 'halal-verification', title: 'home.services.items.halalVerification', icon: VerificationIcon(), personas: ['consumer'] },
  { id: 'audit-checklist', title: 'home.services.items.auditChecklist', icon: AuditChecklistIcon(), personas: ['auditor'] },
  { id: 'monitoring-dashboard', title: 'home.services.items.monitoringDashboard', icon: DashboardIcon(), personas: ['officer'] },
  { id: 'self-declare', title: 'home.services.items.selfDeclare', icon: SelfDeclareIcon(), personas: ['umkm'] },
  { id: 'marketplace', title: 'home.services.items.marketplace', icon: MarketIcon(), personas: ['consumer', 'umkm'] },
  { id: 'map', title: 'home.services.items.map', icon: MapIcon(), personas: ['consumer'] },
  { id: 'regulation', title: 'home.services.items.regulation', icon: RegulationIcon(), personas: ALL_LOGGED_IN },
  { id: 'supplier-verification', title: 'home.services.items.supplierVerification', icon: SupplierIcon(), personas: BUSINESS_ROLES },
  { id: 'scan-barcode', title: 'home.services.items.scanBarcode', icon: ScanIcon(), personas: ['consumer'] },
  { id: 'about', title: 'home.services.items.about', icon: InfoIcon() },
  { id: 'more', title: 'home.services.items.more', icon: MoreIcon() },
];

export const NEWS_ARTICLE_IDS = [1, 2, 3, 4];

export const STORY_IDS = [1, 2, 3, 4, 5];

export const PERSONAS: Persona[] = [
    {
        id: 'umkm',
        name: 'personas.umkm.name',
        description: 'personas.umkm.description',
        icon: BusinessIcon(),
    },
    {
        id: 'auditor',
        name: 'personas.auditor.name',
        description: 'personas.auditor.description',
        icon: AuditorIcon(),
    },
    {
        id: 'consumer',
        name: 'personas.consumer.name',
        description: 'personas.consumer.description',
        icon: ConsumerIcon(),
    },
    {
        id: 'officer',
        name: 'personas.officer.name',
        description: 'personas.officer.description',
        icon: OfficerIcon(),
    },
];