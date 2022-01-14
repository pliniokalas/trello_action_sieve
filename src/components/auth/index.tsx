import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as SendIcon } from 'assets/send_icon.svg';
import './styles.css';

function Auth({ auth }: { auth: () => void}) {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  async function requestAuth() {
    const baseUrl = 'https://api.trello.com';

    const params = new URLSearchParams([
      ['scope', 'read'],
      ['expiration', '30days'],
      ['name', 'TrelloExtractor'],
      ['key', process.env.REACT_APP_API_KEY as string],
      ['response_type', 'token'],
    ]);

    window.open(`${baseUrl}/1/authorize?${params}`);
  }

  function handleSaveToken() {
    if (token) {
      localStorage.setItem('token', token);
      auth();
      navigate('/');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setToken(e.target.value);
  }

  return (
    <main>
      <section>
        <p>Antes de poder usar o Trello Extractor é preciso conceder autorização para que ele possa ler seus quadros.</p>

        <button onClick={requestAuth}>
          Autorizar
        </button>
      </section>

      <section>
        <p>Assim que a autorização for concedida, o Trello vai lhe entregar um token. Cole ele aqui para prosseguir.</p>

        <form className='tokenForm' action='#'>
          <input
            type='password'
            name='token'
            value={token}
            onChange={handleChange}
            placeholder='************'
            required
          />

          <button onClick={handleSaveToken}>
            <SendIcon className='btnIcon' />
          </button>
        </form>
      </section>
    </main>
  );
}

export default Auth;
