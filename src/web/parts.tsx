import type { ReactNode } from 'react';
import { IconBack, IconChevronDown, IconChevronLeft, IconChevronRight, IconDevices, IconLog, IconSearch, IconSessions, IconSort, IconStations } from '../icons';
import type { ConnectorStatus, DeviceStatus, PowerType } from '../data';

export function Logo() {
  return (
    <div className="logo">
      <span className="logo__bars" aria-hidden><i /><i /><i /><i /><i /></span>
      AdNoc
    </div>
  );
}

const NAV = [
  { id: 'stations', label: 'Станции', icon: <IconStations /> },
  { id: 'devices', label: 'Устройства', icon: <IconDevices /> },
  { id: 'sessions', label: 'Сессии', icon: <IconSessions /> },
  { id: 'log', label: 'Журнал', icon: <IconLog /> },
];

export function Sidebar({ active = 'devices', onNavigate }: { active?: string; onNavigate?: (id: string) => void }) {
  return (
    <aside className="sidebar">
      <Logo />
      <nav className="nav" aria-label="Разделы">
        {NAV.map((n) => (
          <button key={n.id} className="nav__item" aria-current={n.id === active ? 'page' : undefined} onClick={() => onNavigate?.(n.id)}>
            {n.icon}{n.label}
          </button>
        ))}
      </nav>
      <div className="user">
        <span className="user__avatar">О</span>
        <div><b>Оператор</b><span>Администратор сети</span></div>
      </div>
    </aside>
  );
}

export function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="search">
      <IconSearch width={18} height={18} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Поиск по названию или ID" aria-label="Поиск по названию или ID" />
    </label>
  );
}

const DOT: Record<string, string> = { 'Все': '', 'Свободно': 'var(--dot-green)', 'Работает': 'var(--dot-blue)', 'Нет связи': 'var(--dot-orange)', 'Неисправно': 'var(--dot-red)' };
export function FilterChip({ label, count, pressed, onClick }: { label: string; count: number; pressed: boolean; onClick: () => void }) {
  return (
    <button className="chip" aria-pressed={pressed} onClick={onClick}>
      {DOT[label] && <span className="chip__dot" style={{ background: DOT[label] }} />}
      {label}<span className="chip__n">{count}</span>
    </button>
  );
}

export function TypeTag({ type }: { type: PowerType }) {
  return <span className={`tag${type === 'DC' ? ' tag--dc' : ''}`}>{type}</span>;
}

const STATUS_CLASS: Record<DeviceStatus | ConnectorStatus, string> = {
  'Свободно': 'free', 'Свободен': 'free', 'Работает': 'work', 'Заряжает': 'work', 'Нет связи': 'warn', 'Неисправно': 'error',
};
export function StatusBadge({ status }: { status: DeviceStatus | ConnectorStatus }) {
  return <span className={`status status--${STATUS_CLASS[status]}`}><i />{status}</span>;
}

export function ColumnHeader({ children, sort, onSort }: { children: ReactNode; sort?: 'asc' | 'desc'; onSort?: () => void }) {
  return (
    <div className="th">
      {onSort ? <button onClick={onSort} aria-label={`Сортировать: ${children}`}>{children}<IconSort width={14} height={14} style={{ opacity: sort ? 1 : 0.6 }} /></button> : children}
    </div>
  );
}

export function Pagination({ page, onPage, total, perPage, shown }: { page: number; onPage: (p: number) => void; total: number; perPage: number; shown: number }) {
  const pages = [1, 2, 3, '…', 13] as const;
  return (
    <div className="pager">
      <div className="pager__left">
        <span>Показывать по</span>
        <span className="select">{perPage}<IconChevronDown width={16} height={16} /></span>
        <span>1–{shown} из {total}</span>
      </div>
      <div className="pager__pages">
        <button className="page page--arrow" disabled={page === 1} aria-label="Назад" onClick={() => onPage(page - 1)}><IconChevronLeft width={16} height={16} /></button>
        {pages.map((p, i) => typeof p === 'number'
          ? <button key={i} className="page" aria-current={p === page ? 'page' : undefined} onClick={() => onPage(p)}>{p}</button>
          : <span key={i} className="page" style={{ color: 'var(--muted)' }}>{p}</span>)}
        <button className="page page--arrow" aria-label="Вперёд" onClick={() => onPage(page + 1)}><IconChevronRight width={16} height={16} /></button>
      </div>
    </div>
  );
}

export function BackLink({ onClick }: { onClick: () => void }) {
  return <button className="back" onClick={onClick}><IconBack />Вернуться назад</button>;
}

export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return <div className="fact"><span>{label}</span><b>{children}</b></div>;
}

export function ConfirmDialog({ title, text, confirm, danger, onConfirm, onCancel }: { title: string; text: string; confirm: string; danger?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="overlay" role="presentation" onClick={onCancel}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="dialog__btns">
          <button className="btn" onClick={onCancel}>Отмена</button>
          <button className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`} onClick={onConfirm} autoFocus>{confirm}</button>
        </div>
      </div>
    </div>
  );
}
