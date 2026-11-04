import { useEffect, useState } from 'react';
import { DRIVER_DEVICES, SESSION_KW, SESSION_START_SEC, STATION, TARIFF } from '../data';
import { IconBolt, IconCard, IconChevronLeft, IconChevronRight, IconNavigation, IconPlug, IconWifiOff } from '../icons';
import './mobile.css';

type Step = 'map' | 'select' | 'cable' | 'session';
const STEPS: { id: Step; label: string }[] = [
  { id: 'map', label: '1. Карта и станция' },
  { id: 'select', label: '2. Выбор устройства' },
  { id: 'cable', label: '3. Подключите кабель' },
  { id: 'session', label: '4. Зарядка' },
];
const pad = (n: number) => String(n).padStart(2, '0');
const hms = (s: number) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
const num = (v: number) => v.toFixed(1).replace('.', ',');

export function MobileDemo() {
  const [step, setStep] = useState<Step>('map');
  const [deviceId, setDeviceId] = useState(3);
  const [cableOk, setCableOk] = useState(false);
  const [offline, setOffline] = useState(false);
  const [elapsed, setElapsed] = useState(SESSION_START_SEC);
  const [frozenAt, setFrozenAt] = useState('12:38:10');

  // Время идёт только пока есть связь: без неё показываем последние данные.
  useEffect(() => {
    if (step !== 'session' || offline) return;
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(t);
  }, [step, offline]);

  const go = (s: Step) => {
    setStep(s);
    if (s !== 'cable') setCableOk(s === 'session');
    if (s !== 'session') setOffline(false);
    if (s === 'session') setElapsed(SESSION_START_SEC);
  };
  const goOffline = () => {
    const d = new Date();
    setFrozenAt(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    setOffline(true);
  };

  const dev = DRIVER_DEVICES.find((d) => d.id === deviceId)!;
  return (
    <div className="demo">
      <aside className="panel">
        <a href="#/">← К списку</a>
        <h1>Приложение водителя</h1>
        <p>Кликабельный прототип. Данные условные. Можно пройти путь целиком или перейти на нужный экран.</p>
        <div className="panel__steps">
          {STEPS.map((s) => <button key={s.id} aria-current={step === s.id} onClick={() => go(s.id)}>{s.label}</button>)}
        </div>
        <div className="panel__sim">
          <b>Имитация</b>
          {step === 'cable' && <button onClick={() => setCableOk(true)} disabled={cableOk}>Станция подтвердила кабель</button>}
          {step === 'session' && (offline ? <button onClick={() => setOffline(false)}>Вернуть связь</button> : <button onClick={goOffline}>Пропала связь со станцией</button>)}
          {step !== 'cable' && step !== 'session' && <span className="secondary">Дальше шаги «Кабель» и «Зарядка»</span>}
        </div>
      </aside>
      <Phone>
        {step === 'map' && <MapScreen onCharge={() => go('select')} />}
        {step === 'select' && <SelectScreen deviceId={deviceId} onPick={setDeviceId} onBack={() => go('map')} onNext={() => go('cable')} />}
        {step === 'cable' && <CableScreen dev={dev} ok={cableOk} onBack={() => go('select')} onStart={() => go('session')} />}
        {step === 'session' && <SessionScreen dev={dev} elapsed={elapsed} offline={offline} frozenAt={frozenAt} onStop={() => go('map')} />}
      </Phone>
    </div>
  );
}

function Phone({ children }: { children: React.ReactNode }) {
  // На узком экране сжимаем телефон по ширине, чтобы он не обрезался
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const fit = () => setZoom(Math.min(1, window.innerWidth / 440));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div className="phone-wrap" style={{ zoom }}>
    <div className="phone">
      <div className="statusbar"><span>9:41</span><span className="statusbar__island" /><span className="statusbar__icons" aria-hidden><span className="sig"><i /><i /><i /><i /></span><span className="batt"><i /></span></span></div>
      {children}
      <div className="home-ind" />
    </div>
    </div>
  );
}

function Cta({ kind = 'primary', children, onClick }: { kind?: 'primary' | 'danger' | 'disabled' | 'dark'; children: React.ReactNode; onClick?: () => void }) {
  return <button className={`cta cta--${kind}`} disabled={kind === 'disabled'} onClick={onClick}>{children}</button>;
}

function Pin({ x, y, color }: { x: number; y: number; color: 'green' | 'orange' | 'red' }) {
  return <span className={`pin pin--${color}`} style={{ left: x, top: y - 62 }}><IconBolt /></span>;
}

function MapScreen({ onCharge }: { onCharge: () => void }) {
  return (
    <>
      <div className="map" style={{ top: -62 }}>
        <svg viewBox="0 0 440 956" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <rect width="440" height="956" fill="#ECE9E1" />
          <path d="M0 300 C120 330 240 270 440 330 L440 360 C240 310 120 372 0 346Z" fill="#B9D6EE" />
          <rect x="300" y="140" width="130" height="90" rx="8" fill="#CFE6C3" /><rect x="20" y="420" width="130" height="90" rx="8" fill="#CFE6C3" /><rect x="320" y="520" width="100" height="70" rx="8" fill="#CFE6C3" />
          <g stroke="#fff" strokeWidth="14" fill="none"><path d="M0 380 L440 290" /><path d="M120 120 L130 700" /><path d="M230 100 L240 700" /><path d="M330 120 L350 700" /><path d="M0 200 L440 180" /><path d="M0 640 L440 610" /></g>
          <path d="M0 560 L440 535" stroke="#F4D58A" strokeWidth="14" fill="none" />
        </svg>
        <Pin x={68} y={298} color="green" /><Pin x={52} y={410} color="orange" /><Pin x={375} y={262} color="orange" /><Pin x={112} y={475} color="red" /><Pin x={349} y={466} color="green" />
        <span className="halo" style={{ left: 227, top: 390 }} />
        <span className="pin pin--green pin--sel" style={{ left: 227, top: 390 }}><IconBolt /></span>
        <span className="tooltip" style={{ left: 227, top: 352 }}>{STATION.name}<b>2 из 3</b></span>
      </div>
      <div className="map__search" style={{ top: 74 }}>Поиск станции или адреса</div>
      <div className="sheet">
        <span className="grabber" />
        <div className="sheet__title"><h2 className="t-title2">{STATION.name}</h2><span className="badge-free"><i className="dot" />Свободно</span></div>
        <div className="sheet__addr secondary t-sub"><span>{STATION.address}</span><span><IconNavigation width={16} height={16} />{STATION.distance}</span></div>
        <div className="sheet__types">
          <div className="typerow"><div><div className="t-body-em">Type 2 · до 22 кВт</div><div className="t-sub secondary">{TARIFF.AC} ₽/кВт·ч</div></div><div><div className="t-body-em">2 из 2</div><div className="t-cap secondary">свободно</div></div></div>
          <div className="typerow"><div><div className="t-body-em">CCS2 · до 120 кВт</div><div className="t-sub secondary">{TARIFF.DC} ₽/кВт·ч</div></div><div><div className="t-body-em secondary">0 из 1</div><div className="t-cap secondary">свободно</div></div></div>
        </div>
        <Cta onClick={onCharge}>Зарядиться</Cta>
      </div>
    </>
  );
}

function Header({ onBack, title }: { onBack: () => void; title?: string }) {
  return <div className="header"><button className="back-btn" onClick={onBack} aria-label="Назад"><IconChevronLeft width={24} height={24} /></button>{title && <h2 className="t-body-em">{title}</h2>}</div>;
}

function SelectScreen({ deviceId, onPick, onBack, onNext }: { deviceId: number; onPick: (n: number) => void; onBack: () => void; onNext: () => void }) {
  return (
    <div className="screen">
      <div className="mcontent">
        <Header onBack={onBack} title={STATION.name} />
        <section className="section">
          <h2 className="t-title2">Выберите устройство</h2>
          <div className="cards">
            {DRIVER_DEVICES.map((d) => (
              <button key={d.id} className="devcard" disabled={!d.free} aria-pressed={deviceId === d.id && d.free} onClick={() => onPick(d.id)}>
                <span className={`devcard__type${d.type === 'DC' ? ' devcard__type--dc' : ''}`}>{d.type}</span>
                <span className="devcard__text"><span className="t-body-em">Устройство {d.id}</span><span className="t-sub secondary">{d.plug} · до {d.upTo} кВт</span></span>
                <span className="devcard__price"><span className="t-body-em">{d.price} ₽/кВт·ч</span><span className="t-foot secondary"><i className={`dot${d.free ? '' : ' dot--red'}`} /> {d.free ? 'Свободно' : 'Занято'}</span></span>
              </button>
            ))}
          </div>
        </section>
        <section className="section">
          <h2 className="t-title2">Оплата</h2>
          <div className="payrow"><IconCard width={22} height={22} /><span className="t-body-em">Карта {STATION.card}</span><IconChevronRight width={20} height={20} style={{ color: 'var(--label-3)' }} /></div>
          <p className="t-foot secondary" style={{ margin: 0 }}>Списание по факту сессии</p>
        </section>
      </div>
      <Cta onClick={onNext}>Продолжить</Cta>
    </div>
  );
}

function CableScreen({ dev, ok, onBack, onStart }: { dev: (typeof DRIVER_DEVICES)[number]; ok: boolean; onBack: () => void; onStart: () => void }) {
  return (
    <div className="screen">
      <div className="mcontent" style={{ gap: 0 }}>
        <Header onBack={onBack} />
        <div className="cable">
          <div className="stage"><div><IconPlug width={40} height={40} /></div></div>
          <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <span className="t-sub secondary">Устройство {dev.id} · {dev.plug} · до {dev.upTo} кВт</span>
            <h2 className="t-large">Подключите кабель</h2>
            <span className={`cable__status t-sub${ok ? ' cable__status--ok' : ''}`}><i className="dot" />{ok ? 'Кабель подключён' : 'Ждём подтверждения от станции'}</span>
          </div>
        </div>
      </div>
      <Cta kind={ok ? 'primary' : 'disabled'} onClick={onStart}>Начать зарядку</Cta>
    </div>
  );
}

function SessionScreen({ dev, elapsed, offline, frozenAt, onStop }: { dev: (typeof DRIVER_DEVICES)[number]; elapsed: number; offline: boolean; frozenAt: string; onStop: () => void }) {
  const [busy, setBusy] = useState(false);
  const energy = (SESSION_KW * elapsed) / 3600;
  const cost = Math.round(Math.round(energy * 10) / 10 * dev.price); // как на макете: 2,7 кВт·ч × 14 ₽ ≈ 38 ₽
  const bars = [48, 60, 68, 72, 72, 72, 72, 72, 72, 72, 72, 72, 72, 72];
  const refresh = () => { setBusy(true); window.setTimeout(() => setBusy(false), 900); };
  return (
    <div className={`screen${offline ? ' offline' : ''}`}>
      <div className="mcontent" style={{ gap: 16 }}>
        <div>
          <h1 className="t-large">{offline ? 'Зарядка' : 'Зарядка идёт'}</h1>
          {!offline && <div className="sub t-sub secondary"><i className="dot" />Устройство {dev.id} · {STATION.name}</div>}
        </div>
        {offline && (
          <div className="banner" role="alert">
            <div className="banner__title"><IconWifiOff />Нет связи со станцией</div>
            <p className="t-sub secondary" style={{ margin: 0 }}>Показываем данные на {frozenAt}. Станция может продолжать зарядку: итог посчитаем по её показаниям, когда связь вернётся.</p>
            <button className="cta cta--dark" onClick={refresh} disabled={busy}>{busy ? 'Обновляем…' : 'Обновить'}</button>
          </div>
        )}
        <div className="chart" aria-label="Мощность зарядки">{bars.map((h, i) => <i key={i} className={i >= 7 ? 'off' : ''} style={{ height: h }} />)}</div>
        <div className="metrics">
          <div className="metric"><span className="t-foot secondary">Мощность, кВт</span><b>{SESSION_KW} <small>из {dev.upTo}</small></b></div>
          <div className="metric"><span className="t-foot secondary">Время, ч</span><b>{hms(elapsed)}</b></div>
          <div className="metric"><span className="t-foot secondary">Энергия, кВт·ч</span><b>{num(energy)}</b></div>
          <div className="metric"><span className="t-foot secondary">Стоимость, ₽</span><b>{offline ? '≈ ' : ''}{cost}</b></div>
        </div>
        {offline
          ? <div className="hint t-sub">Остановить зарядку можно на станции или в автомобиле</div>
          : <div className="row-card t-sub"><span className="secondary">Тариф {dev.price} ₽/кВт·ч</span><b className="t-sub" style={{ fontWeight: 600 }}>Карта {STATION.card}</b></div>}
      </div>
      <Cta kind={offline ? 'disabled' : 'danger'} onClick={onStop}>Завершить зарядку</Cta>
    </div>
  );
}
