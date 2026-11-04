import { useEffect, useState } from 'react';
import { WebApp } from './web/WebApp';
import { MobileDemo } from './mobile/MobileDemo';
import { Kit } from './kit/Kit';
import './home.css';

type Route = '' | 'mobile' | 'web' | 'kit';
const read = (): Route => {
  const h = window.location.hash.replace(/^#\/?/, '');
  return h === 'mobile' || h === 'web' || h === 'kit' ? h : '';
};

export function App() {
  const [route, setRoute] = useState<Route>(read());
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  if (route === 'web') return <WebApp />;
  if (route === 'mobile') return <MobileDemo />;
  if (route === 'kit') return <Kit />;
  return (
    <main className="home">
      <h1>AdNoc</h1>
      <p>Сервис зарядки электромобилей. Тестовое задание: два интерфейса одного сервиса, собранные в коде по макетам из Figma.</p>
      <nav className="home__cards">
        <a href="#/mobile"><b>Приложение водителя</b><span>iOS · карта → выбор устройства → кабель → зарядка → потеря связи</span></a>
        <a href="#/web"><b>Веб-панель оператора</b><span>список устройств, фильтры, карточка устройства, действия над разъёмом</span></a>
        <a href="#/kit"><b>Компоненты и токены</b><span>всё, из чего собраны экраны</span></a>
      </nav>
      <small>Прототип: данные условные, бэкенда нет.</small>
    </main>
  );
}
