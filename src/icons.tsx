import type { SVGProps } from 'react';

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
type P = SVGProps<SVGSVGElement>;

export const IconStations = (p: P) => <svg {...base} {...p}><path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></svg>;
export const IconDevices = (p: P) => <svg {...base} {...p}><path d="M13 3 5 13h6l-1 8 8-10h-6z" /></svg>;
export const IconSessions = (p: P) => <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const IconLog = (p: P) => <svg {...base} {...p}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></svg>;
export const IconSearch = (p: P) => <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;
export const IconBack = (p: P) => <svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const IconChevronLeft = (p: P) => <svg {...base} {...p}><path d="m15 5-7 7 7 7" /></svg>;
export const IconChevronRight = (p: P) => <svg {...base} {...p}><path d="m9 5 7 7-7 7" /></svg>;
export const IconChevronDown = (p: P) => <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>;
export const IconLock = (p: P) => <svg {...base} {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
export const IconClose = (p: P) => <svg {...base} {...p}><path d="m6 6 12 12M18 6 6 18" /></svg>;
export const IconSort = (p: P) => <svg {...base} {...p}><path d="m8 9 4-4 4 4M8 15l4 4 4-4" /></svg>;
export const IconCard = (p: P) => <svg {...base} {...p}><rect x="3" y="6" width="18" height="12" rx="3" /><path d="M3 10h18" /></svg>;
export const IconPlug = (p: P) => <svg {...base} {...p}><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" /></svg>;
export const IconWifiOff = (p: P) => <svg {...base} {...p}><path d="M3 3l18 18M5 12.5a10 10 0 0 1 4-2.4M19 12.5a10 10 0 0 0-4.3-2.5M8.5 16a5 5 0 0 1 3-1.4M15.5 16a5 5 0 0 0-1.2-.8" /><circle cx="12" cy="19" r=".6" fill="currentColor" /></svg>;
export const IconNavigation = (p: P) => <svg {...base} {...p}><path d="m4 11 16-7-7 16-2-7z" /></svg>;
export const IconBolt = (p: P) => <svg {...base} {...p}><path d="M13 3 5 13h6l-1 8 8-10h-6z" fill="currentColor" /></svg>;
