import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from "react-csv";
import axios from 'axios';
import extract from 'services/extractor';
import { updateConfig } from 'utils/localStorage';
import { IActivity } from 'utils/interfaces';

import { ReactComponent as SendIcon } from 'assets/send_icon.svg';
import './styles.css';

// -------------------------------------------------------------------------------------- 

const FILENAME = `trello_${(new Date()).toISOString().split('T')[0]}.csv`;

const CSV_HEADERS = [
  { label: 'Membro', key: 'member' },
  { label: 'Quadro', key: 'board' },
  { label: 'Dia da sem', key: 'weekDay' },
  { label: 'Data', key: 'date' },
  { label: 'Tarefa', key: 'card' },
  { label: 'Situação', key: 'status' },
];

// Request the token data to check it's validity. Status 401/404 responses throw.
async function verifyToken(token: string) {
  try {
    const resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/1/tokens/${token}`);
    return +(new Date(resp.data?.dateExpires)) >= +(new Date());
  } catch (error) {
    return false;
  }
}

// -------------------------------------------------------------------------------------- 

function Form() {
  const [orgs, setOrgs] = useState('');
  const [file, setFile] = useState([] as IActivity[]) 

  const navigate = useNavigate();

  // Attempt to perform the extraction.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const apiKey = process.env.REACT_APP_API_KEY as string; 
    const token = localStorage.getItem('token') as string; 

    // If the token is invalid, delete it and redirect to /autorizar.
    if (!await verifyToken(token)) {
      alert('O seu token expirou. Por favor autorize o app novamente.');
      localStorage.removeItem('token');
      navigate('/autorizar');
    }

    const csv = await extract({ apiKey, token, organizations: [orgs] });

    // If something weird happened, stop.
    if (!csv) {
      alert('Desculpe, mas não foi possível concluir sua solicitação.');
      return;
    }

    setFile(csv);
  }

  // Update input fields.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOrgs(e.target.value);
    updateConfig(e.target);
  }

  // Grab previous input values from the localStorage.
  useEffect(() => {
    const configJson = localStorage.getItem('config');

    if (configJson) {
      const config = JSON.parse(configJson);
      setOrgs(config.orgs || '');
    }
  }, []);

  // Download pannel.
  if (file.length) {
    return (
      <main className='downloadScreen' key={1}>
        <p>Extração concluída!</p>

        <menu>
          <button onClick={() => setFile([])} className='backBtn'>
            Voltar 
          </button>

          <CSVLink
            headers={CSV_HEADERS}
            data={file}
            filename={FILENAME}
            className='button'
          >
            Baixar arquivo .csv 
          </CSVLink>
        </menu>
      </main>
    );
  }

  // Extraction pannel.
  return (
    <main key={2}>
      <form className='extractorForm' onSubmit={handleSubmit}>
        <h3>Organizações (workspaces)</h3>

        <details>
          <summary>Dica</summary>
          <article>
            <p>Abaixo insira uma lista separada por vírgulas de "shortnames" das workspaces das quais deseja extrair dados.</p>
            <p>O shortname é o que aparece no final da URL quando você acessa o painel de uma workspace.</p>
            <blockquote>https://trello.com/<strong>shortname</strong></blockquote>
          </article>
        </details>

        <input
          value={orgs}
          onChange={handleChange}
          name='orgs'
          type='text'
          placeholder='workspace1,workspace2,workspace3'
        />

        <button>
          <SendIcon className='btnIcon' />
          Enviar
        </button>
      </form>
    </main>
  );
}

// -------------------------------------------------------------------------------------- 

export default Form;
