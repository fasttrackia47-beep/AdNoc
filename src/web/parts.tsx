import { useEffect, useRef, useState, type ReactNode } from 'react';
import { IconBack, IconChevronDown, IconClose, IconChevronLeft, IconChevronRight, IconDevices, IconLog, IconSearch, IconSessions, IconStations } from '../icons';
import { CITY } from '../data';
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
      <button type="button" className="city" aria-label={`Город: ${CITY}`}>
        <span className="city__text"><span className="city__label">Город</span><span className="city__value">{CITY}</span></span>
        <IconChevronDown width={20} height={20} />
      </button>
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
      {value && <button type="button" className="search__clear" aria-label="Очистить поиск" onClick={(e) => { e.preventDefault(); onChange(''); }}><IconClose width={16} height={16} /></button>}
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
    <div className="th" aria-sort={sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined}>
      {onSort ? (
        <button onClick={onSort} className={sort ? 'th--active' : undefined} data-dir={sort} aria-label={`Сортировать: ${children}`}>
          {children}
          {/* Серые стрелки появляются при наведении; у выбранного столбца видна всегда, активная стрелка тёмная */}
          <svg className="th__sort" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path className="up" d="m8 9 4-4 4 4" />
            <path className="down" d="M8 15l4 4 4-4" />
          </svg>
        </button>
      ) : children}
    </div>
  );
}

export const PAGE_SIZES = [10, 20, 50] as const;

// 1, 2, 3, …, последняя: показываем первую, последнюю и соседние с текущей
function pageList(page: number, last: number): (number | '…')[] {
  const set = new Set([1, 2, last, page - 1, page, page + 1].filter((p) => p >= 1 && p <= last));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => { if (i && p - sorted[i - 1] > 1) out.push('…'); out.push(p); });
  return out;
}

function PageSizeSelect({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, bottom: 0 });
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLUListElement>(null);

  const toggle = () => {
    if (!open && btn.current) {
      const r = btn.current.getBoundingClientRect();
      setPos({ left: r.left, bottom: window.innerHeight - r.top + 8 }); // меню открывается вверх над кнопкой
    }
    setOpen((o) => !o);
  };
  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => { if (!menu.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    const off = () => setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    window.addEventListener('resize', off);
    window.addEventListener('scroll', off, true);
    menu.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); window.removeEventListener('resize', off); window.removeEventListener('scroll', off, true); };
  }, [open]);

  const onKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const items = [...(menu.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(items.length - 1, i + 1)]?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(0, i - 1)]?.focus(); }
  };

  return (
    <>
      <button ref={btn} type="button" className="select" aria-haspopup="listbox" aria-expanded={open} aria-label="Сколько строк показывать" onClick={toggle}>
        {value}<IconChevronDown width={16} height={16} className={open ? 'select__chev select__chev--open' : 'select__chev'} />
      </button>
      {open && (
        <ul ref={menu} className="menu" role="listbox" style={{ left: pos.left, bottom: pos.bottom }} onKeyDown={onKey}>
          {PAGE_SIZES.map((n) => (
            <li key={n} role="option" tabIndex={0} aria-selected={n === value} className="menu__item"
              onClick={() => { onChange(n); setOpen(false); btn.current?.focus(); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(n); setOpen(false); btn.current?.focus(); } }}>
              {n}
              {n === value && <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function Pagination({ page, onPage, total, perPage, onPerPage }: { page: number; onPage: (p: number) => void; total: number; perPage: number; onPerPage: (n: number) => void }) {
  const last = Math.max(1, Math.ceil(total / perPage));
  const from = (page - 1) * perPage + 1;
  const to = Math.min(total, page * perPage);
  return (
    <div className="pager">
      <div className="pager__left">
        <span>Показывать по</span>
        <PageSizeSelect value={perPage} onChange={onPerPage} />
        <span>{from}–{to} из {total}</span>
      </div>
      <div className="pager__pages">
        <button className="page page--arrow" disabled={page === 1} aria-label="Назад" onClick={() => onPage(page - 1)}><IconChevronLeft width={16} height={16} /></button>
        {pageList(page, last).map((p, i) => typeof p === 'number'
          ? <button key={i} className="page" aria-current={p === page ? 'page' : undefined} onClick={() => onPage(p)}>{p}</button>
          : <span key={i} className="page" style={{ color: 'var(--muted)' }}>{p}</span>)}
        <button className="page page--arrow" disabled={page === last} aria-label="Вперёд" onClick={() => onPage(page + 1)}><IconChevronRight width={16} height={16} /></button>
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
