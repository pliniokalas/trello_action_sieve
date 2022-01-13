import { Link, Routes, Route } from 'react-router-dom';
import Form from './components/form';
import Help from './components/help';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav>
        <Link to='/'>Início</Link>
        <Link to='/ajuda'>Ajuda</Link>
      </nav>

      <header>
        <h1>Trello Extractor</h1>
      </header>

      <Routes>
        <Route path='/' element={<Form />} />
        <Route path='/ajuda' element={<Help />} />
      </Routes>
    </div>
  );
}

export default App;
