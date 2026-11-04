import { FilterChip, Logo, StatusBadge, TypeTag, Fact, ColumnHeader } from '../web/parts';
import { IconBack, IconBolt, IconCard, IconChevronRight, IconClose, IconDevices, IconLock, IconLog, IconNavigation, IconPlug, IconSearch, IconSessions, IconSort, IconStations, IconWifiOff } from '../icons';
import '../web/web.css';
import '../mobile/mobile.css';
import './kit.css';

const SPACING = [0, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64];
const RADIUS = [0, 2, 4, 8, 12, 16, 20, 24, 28, 32, 40];
const COLORS: [string, string][] = [
  ['--brand-lime', 'Brand/Lime'], ['--ink', 'Ink'], ['--bg', 'Фон контента'], ['--muted', 'Текст вторичный'], ['--faint', 'Прочерк'],
  ['--dot-green', 'Статус · зелёный'], ['--dot-blue', 'Статус · синий'], ['--dot-orange', 'Статус · оранжевый'], ['--dot-red', 'Статус · красный'],
  ['--ios-green', 'iOS · Green'], ['--ios-red', 'iOS · Red'], ['--ios-orange', 'iOS · Orange'], ['--fill-4', 'iOS · Fills/Quaternary'], ['--label-2', 'iOS · Labels/Secondary'],
];
const ICONS = { IconStations, IconDevices, IconSessions, IconLog, IconSearch, IconBack, IconChevronRight, IconLock, IconClose, IconSort, IconCard, IconPlug, IconWifiOff, IconNavigation, IconBolt };

export function Kit() {
  return (
    <main className="kit">
      <a href="#/">← К списку</a>
      <h1>Компоненты и токены</h1>
      <p className="kit__lead">Минимальный набор, из которого собраны оба интерфейса. Полная дизайн-система не нужна, поэтому здесь только то, что реально используется на экранах.</p>

      <Section title="Отступы (Spacing)"><div className="kit__row">{SPACING.map((n) => <div key={n} className="kit__sp"><i style={{ width: n || 1, height: 24 }} /><code>{n}</code></div>)}</div></Section>
      <Section title="Радиусы (Radius)"><div className="kit__row">{RADIUS.map((n) => <div key={n} className="kit__rad"><i style={{ borderRadius: n }} /><code>{n}</code></div>)}<div className="kit__rad"><i style={{ borderRadius: 999 }} /><code>full</code></div></div></Section>
      <Section title="Цвета"><div className="kit__row">{COLORS.map(([v, n]) => <div key={v} className="kit__col"><i style={{ background: `var(${v})` }} /><span>{n}</span><code>{v}</code></div>)}</div></Section>

      <Section title="Веб · теги и статусы">
        <div className="kit__row"><TypeTag type="AC" /><TypeTag type="DC" />
          {(['Работает', 'Свободно', 'Нет связи', 'Неисправно', 'Заряжает', 'Свободен'] as const).map((s) => <StatusBadge key={s} status={s} />)}</div>
      </Section>
      <Section title="Веб · фильтры, кнопки, факты">
        <div className="kit__row">
          <FilterChip label="Все" count={123} pressed onClick={() => {}} /><FilterChip label="Свободно" count={120} pressed={false} onClick={() => {}} /><FilterChip label="Нет связи" count={1} pressed={false} onClick={() => {}} />
          <button className="btn-icon btn-icon--danger"><IconClose width={18} height={18} /></button><button className="btn-icon"><IconLock width={18} height={18} /></button><button className="btn-icon" disabled><IconClose width={18} height={18} /></button>
        </div>
        <div className="kit__row" style={{ background: '#fff', borderRadius: 24, padding: 12 }}><Fact label="ID устройства">002</Fact><Fact label="Тип">AC · Type 2</Fact><Fact label="Мощность сейчас, кВт">11 <small>из 22</small></Fact><ColumnHeader sort="asc" onSort={() => {}}>Устройство</ColumnHeader></div>
        <div className="kit__dark"><Logo /></div>
      </Section>
      <Section title="Мобилка · кнопки">
        <div className="kit__row kit__row--btn">
          <button className="cta cta--primary">Основная</button><button className="cta cta--danger">Опасная</button><button className="cta cta--disabled" disabled>Отключённая</button><button className="cta cta--dark">Тёмная</button>
        </div>
      </Section>
      <Section title="Мобилка · типографика iOS">
        <div className="kit__type">
          <p className="t-large">Large Title / Title1 Emphasized 28/34</p><p className="t-title2">Title2 Emphasized 22/28</p><p className="t-body-em">Body Emphasized 17/22</p><p className="t-body">Body 17/22</p>
          <p className="t-sub">Subheadline 15/20</p><p className="t-foot">Footnote 13/18</p><p className="t-cap">Caption1 12/16</p>
        </div>
      </Section>
      <Section title="Иконки"><div className="kit__row">{Object.entries(ICONS).map(([n, I]) => <div key={n} className="kit__ic"><I width={24} height={24} /><code>{n.replace('Icon', '')}</code></div>)}</div></Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="kit__sec"><h2>{title}</h2>{children}</section>;
}
