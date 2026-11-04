// Канонические данные: мобилка = веб. Всё условно (Санкт-Петербург).
export type DeviceStatus = 'Работает' | 'Свободно' | 'Нет связи' | 'Неисправно';
export type ConnectorStatus = 'Заряжает' | 'Свободен';
export type PowerType = 'AC' | 'DC';

export interface Connector {
  id: number;
  status: ConnectorStatus;
  session?: string;
  power?: string;
  energy?: string;
}

export interface Device {
  id: string; // 001…
  name: string;
  station: string;
  type: PowerType;
  plug: 'Type 2' | 'CCS2';
  connectors: number;
  status: DeviceStatus;
  session?: string;
  power?: string;
  maxKw: number;
}

const d = (
  n: number, station: number, type: PowerType, connectors: number, status: DeviceStatus,
  session?: string, power?: string,
): Device => ({
  id: String(n).padStart(3, '0'), name: `Устройство ${n}`, station: `Станция №${station}`,
  type, plug: type === 'DC' ? 'CCS2' : 'Type 2', connectors, status, session, power,
  maxKw: type === 'DC' ? 120 : 22,
});

export const DEVICES: Device[] = [
  d(1, 144, 'DC', 6, 'Работает', '00:41:14', '51 кВт'),
  d(2, 144, 'AC', 6, 'Работает', '00:32:16', '11 кВт'),
  d(3, 144, 'AC', 8, 'Свободно'),
  d(4, 145, 'AC', 6, 'Свободно'),
  d(5, 145, 'AC', 8, 'Свободно'),
  d(6, 145, 'DC', 6, 'Свободно'),
  d(7, 146, 'AC', 6, 'Свободно'),
  d(8, 146, 'AC', 8, 'Нет связи'),
  d(9, 146, 'DC', 6, 'Свободно'),
  d(10, 147, 'AC', 8, 'Свободно'),
];

// Остальные устройства до 123: условные данные, чтобы работала пагинация (по три устройства на станцию).
for (let n = 11; n <= 123; n++) {
  const type: PowerType = n % 4 === 0 ? 'DC' : 'AC';
  DEVICES.push(d(n, 144 + Math.floor((n - 1) / 3), type, n % 3 === 0 ? 8 : 6, 'Свободно'));
}

const countBy = (s: DeviceStatus) => DEVICES.filter((x) => x.status === s).length;
export const COUNTERS = { all: DEVICES.length, 'Свободно': countBy('Свободно'), 'Работает': countBy('Работает'), 'Нет связи': countBy('Нет связи'), 'Неисправно': countBy('Неисправно') } as const;

export function connectorsOf(dev: Device): Connector[] {
  const list: Connector[] = Array.from({ length: dev.connectors }, (_, i) => ({ id: i + 1, status: 'Свободен' as const }));
  if (dev.id === '002') {
    list[0] = { id: 1, status: 'Заряжает', session: '00:32:16', power: '7,2 кВт', energy: '3,9 кВт·ч' };
    list[2] = { id: 3, status: 'Заряжает', session: '00:18:40', power: '3,8 кВт', energy: '1,2 кВт·ч' };
  }
  if (dev.id === '001') list[0] = { id: 1, status: 'Заряжает', session: '00:41:14', power: '51 кВт', energy: '35,0 кВт·ч' };
  return list;
}

// Приложение водителя: станция №144, три устройства.
export const STATION = { name: 'Станция №144', address: 'ул. Невская, 12', distance: '400 м', card: '•• 4242' };
export const TARIFF = { AC: 14, DC: 28 } as const; // ₽/кВт·ч, условно

export interface DriverDevice {
  id: number; type: PowerType; plug: string; upTo: number; price: number; free: boolean;
}
export const DRIVER_DEVICES: DriverDevice[] = [
  { id: 1, type: 'DC', plug: 'CCS2', upTo: 120, price: TARIFF.DC, free: false },
  { id: 2, type: 'AC', plug: 'Type 2', upTo: 22, price: TARIFF.AC, free: true },
  { id: 3, type: 'AC', plug: 'Type 2', upTo: 22, price: TARIFF.AC, free: true },
];

export const SESSION_KW = 11;
export const SESSION_START_SEC = 14 * 60 + 36; // 00:14:36 как на макете
