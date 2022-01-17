import { useState, useEffect } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Dash from 'components/dash';
import Help from 'components/help';
import Auth from 'components/auth';

import { ReactComponent as HouseIcon } from './assets/house_icon.svg';
import { ReactComponent as QuestionIcon } from './assets/question_icon.svg';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuth(true);
    }

    setIsLoading(false);
  }, []);

  return (
    <div className="App">
      <header>
        <h3>Trello Action Extractor</h3>
        <nav>
          <NavLink to='/' className={({ isActive }) => (isActive ? 'on' : 'off')}> 
            <HouseIcon className='btnIcon' />
            Início
          </NavLink>
          <NavLink to='/ajuda' className={({ isActive }) => (isActive ? 'on' : 'off')}>
            <QuestionIcon className='btnIcon' />
            Ajuda
          </NavLink>
        </nav>
      </header>

      {isLoading
        ? <></>
        : (
        <Routes>
          <Route path='/' element={isAuth ? <Dash /> : <Navigate to={'/autorizar'} />} />
          <Route path='autorizar' element={<Auth auth={() => setIsAuth(true)} />} />
          <Route path='ajuda' element={<Help />} />
        </Routes> )
      }
    </div>
  );
}

export default App;
