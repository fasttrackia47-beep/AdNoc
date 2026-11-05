import { useMemo, useState } from 'react';
import { CITY, COUNTERS, DEVICES, connectorsOf, type Connector, type Device, type DeviceStatus } from '../data';
import { IconClose, IconLock } from '../icons';
import { BackLink, ColumnHeader, ConfirmDialog, Fact, FilterChip, Pagination, SearchField, Sidebar, StatusBadge, TypeTag } from './parts';
import './web.css';

type SortKey = 'name' | 'type' | 'connectors' | 'status' | 'session' | 'power';
type Sort = { key: SortKey; dir: 'asc' | 'desc' } | null;
const LABELS: [SortKey, string][] = [['name', 'Устройство'], ['type', 'Тип'], ['connectors', 'Разъёмы'], ['status', 'Статус'], ['session', 'Сессия'], ['power', 'Мощность']];
// Значение для сортировки: пустые («—») всегда в конце
const sortValue = (d: Device, k: SortKey): string | number | null => {
  switch (k) {
    case 'name': return d.name;
    case 'type': return `${d.type} ${d.plug}`;
    case 'connectors': return d.connectors;
    case 'status': return d.status;
    case 'session': return d.session ?? null;
    case 'power': return d.power ? parseFloat(d.power) : null;
  }
};

type Filter = 'Все' | DeviceStatus;
const FILTERS: Filter[] = ['Все', 'Свободно', 'Работает', 'Нет связи', 'Неисправно'];
const count = (f: Filter) => (f === 'Все' ? COUNTERS.all : COUNTERS[f]);

type Pending = { kind: 'end' | 'block'; connector: Connector } | null;

export function WebApp() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('Все');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>({ key: 'name', dir: 'asc' });
  // Клик по столбцу: сначала по возрастанию, повторный клик меняет направление
  const toggleSort = (key: SortKey) => { setSort((s) => (!s || s.key !== key ? { key, dir: 'asc' } : { key, dir: s.dir === 'asc' ? 'desc' : 'asc' })); setPage(1); };
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // Состояние разъёмов хранится по устройству: завершённые сессии и блокировки.
  const [ended, setEnded] = useState<Record<string, number[]>>({});
  const [blocked, setBlocked] = useState<Record<string, number[]>>({});
  const [pending, setPending] = useState<Pending>(null);
  const [toast, setToast] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = DEVICES.filter((d) => (filter === 'Все' || d.status === filter) && (!q || `${d.name} ${d.id} ${d.station}`.toLowerCase().includes(q)));
    if (sort) {
      const m = sort.dir === 'asc' ? 1 : -1;
      r = [...r].sort((a, b) => {
        const x = sortValue(a, sort.key), y = sortValue(b, sort.key);
        if (x === null && y === null) return 0;
        if (x === null) return 1;
        if (y === null) return -1;
        const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ru', { numeric: true });
        return c * m;
      });
    }
    return r;
  }, [filter, query, sort]);

  const pageRows = rows.slice((page - 1) * perPage, page * perPage);
  // Пагинация нужна, только если записей больше, чем помещается на одну страницу
  const showPager = rows.length > 10;

  const device = DEVICES.find((d) => d.id === openId) ?? null;

  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 2200); };
  const apply = () => {
    if (!pending || !device) return;
    const key = device.id, n = pending.connector.id;
    if (pending.kind === 'end') { setEnded((s) => ({ ...s, [key]: [...(s[key] ?? []), n] })); flash(`Сессия на разъёме ${n} завершена. Запись добавлена в журнал.`); }
    else {
      const was = (blocked[key] ?? []).includes(n);
      setBlocked((s) => ({ ...s, [key]: was ? s[key].filter((x) => x !== n) : [...(s[key] ?? []), n] }));
      flash(was ? `Разъём ${n} разблокирован.` : pending.connector.status === 'Заряжает' && !(ended[key] ?? []).includes(n) ? `Разъём ${n} будет заблокирован после окончания сессии.` : `Разъём ${n} заблокирован.`);
    }
    setPending(null);
  };

  return (
    <div className="web">
      <Sidebar onNavigate={(id) => { if (id === 'devices') setOpenId(null); }} />
      <main className="content">
        <div className="view" key={device ? `d${device.id}` : 'list'}>
        {device ? (
          <DeviceCard device={device} ended={ended[device.id] ?? []} blocked={blocked[device.id] ?? []} onBack={() => setOpenId(null)} onAction={(kind, connector) => setPending({ kind, connector })} />
        ) : (
          <>
            <div className="head">
              <h1 className="title">Устройства</h1>
              <SearchField value={query} onChange={(v) => { setQuery(v); setPage(1); }} />
            </div>
            <div className="filters" role="group" aria-label="Фильтр по статусу">
              {FILTERS.map((f) => <FilterChip key={f} label={f} count={count(f)} pressed={filter === f} onClick={() => { setFilter(f); setPage(1); }} />)}
            </div>
            <section className="table" aria-label="Список устройств">
              <div className="row row--devices row--head">
                {LABELS.map(([k, l]) => <ColumnHeader key={k} sort={sort?.key === k ? sort.dir : undefined} onSort={() => toggleSort(k)}>{l}</ColumnHeader>)}
              </div>
              {rows.length === 0 && <div className="empty">Ничего не найдено. Сбросьте фильтр или измените запрос.</div>}
              {pageRows.map((d) => <DeviceRow key={d.id} d={d} onOpen={() => setOpenId(d.id)} />)}
              {showPager && <Pagination page={page} onPage={setPage} total={rows.length} perPage={perPage} onPerPage={(n) => { setPerPage(n); setPage(1); }} />}
            </section>
            <small style={{ color: 'var(--muted)' }}>Прототип: данные условные.</small>
          </>
        )}
        </div>
      </main>
      {pending && device && (
        <ConfirmDialog
          title={pending.kind === 'end' ? `Завершить сессию на разъёме ${pending.connector.id}?` : (blocked[device.id] ?? []).includes(pending.connector.id) ? `Разблокировать разъём ${pending.connector.id}?` : `Заблокировать разъём ${pending.connector.id}?`}
          text={pending.kind === 'end' ? 'Зарядка остановится, водитель увидит итог сессии.' : pending.connector.status === 'Заряжает' ? 'Идёт зарядка: блокировка сработает после окончания сессии.' : 'Разъём перестанет принимать новые сессии.'}
          confirm={pending.kind === 'end' ? 'Завершить' : 'Подтвердить'} danger={pending.kind === 'end'}
          onConfirm={apply} onCancel={() => setPending(null)}
        />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function DeviceRow({ d, onOpen }: { d: Device; onOpen: () => void }) {
  return (
    <div className="row row--devices row--body" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}>
      <div><div>{d.name}</div><div className="cell-sub">{CITY} · Станция №{d.station.replace(/\D/g, '')} · ID {d.id}</div></div>
      <div className="tag-cell"><TypeTag type={d.type} /><span>{d.plug}</span></div>
      <div>{d.connectors}</div>
      <div><StatusBadge status={d.status} /></div>
      <div className={d.session ? '' : 'dash'}>{d.session ?? '—'}</div>
      <div className={d.power ? '' : 'dash'}>{d.power ?? '—'}</div>
    </div>
  );
}

function DeviceCard({ device, ended, blocked, onBack, onAction }: { device: Device; ended: number[]; blocked: number[]; onBack: () => void; onAction: (k: 'end' | 'block', c: Connector) => void }) {
  const list = connectorsOf(device).map((c) => (ended.includes(c.id) ? { id: c.id, status: 'Свободен' as const } : c));
  const charging = list.filter((c) => c.status === 'Заряжает');
  const kw = device.id === '002' ? charging.reduce((s, c) => s + parseFloat((c.power ?? '0').replace(',', '.')), 0) : device.power ? parseFloat(device.power) : 0;
  const status: DeviceStatus = device.status === 'Работает' && charging.length === 0 ? 'Свободно' : device.status;
  return (
    <>
      <BackLink onClick={onBack} />
      <div className="title-row"><h1 className="title title--inner">{device.name}</h1><StatusBadge status={status} /></div>
      <div className="facts">
        <Fact label="Станция">№{device.station.replace(/\D/g, '')}, {CITY}, ул. Невская, 12</Fact>
        <Fact label="ID">{device.id}</Fact>
        <Fact label="Разъёмы">{device.connectors}</Fact>
        <Fact label="Мощность, кВт">{String(kw).replace('.', ',')} <small>из {device.maxKw}</small></Fact>
      </div>
      <section className="table" aria-label="Разъёмы">
        <div className="row row--connectors row--head">
          <ColumnHeader>Разъём</ColumnHeader><div>Тип</div><div>Статус</div><div>Сессия</div><div>Мощность</div><div>Энергия</div><div />
        </div>
        {list.map((c) => {
          const isBlocked = blocked.includes(c.id);
          return (
            <div key={c.id} className="row row--connectors row--body">
              <div>Разъём {c.id}</div>
              <div className="tag-cell"><TypeTag type={device.type} /><span>{device.plug}</span></div>
              <div><StatusBadge status={c.status} /></div>
              <div className={c.session ? '' : 'dash'}>{c.session ?? '—'}</div>
              <div className={c.power ? '' : 'dash'}>{c.power ?? '—'}</div>
              <div className={c.energy ? '' : 'dash'}>{c.energy ?? '—'}</div>
              <div className="actions">
                <button className={`btn-icon${c.status === 'Заряжает' ? ' btn-icon--danger' : ''}`} disabled={c.status !== 'Заряжает'} aria-label={`Завершить сессию на разъёме ${c.id}`} title="Завершить сессию (только при активной сессии)" onClick={() => onAction('end', c)}><IconClose width={18} height={18} /></button>
                <button className="btn-icon" aria-pressed={isBlocked} aria-label={`${isBlocked ? 'Разблокировать' : 'Заблокировать'} разъём ${c.id}`} title={isBlocked ? 'Разблокировать' : 'Заблокировать'} onClick={() => onAction('block', c)}><IconLock width={18} height={18} /></button>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
