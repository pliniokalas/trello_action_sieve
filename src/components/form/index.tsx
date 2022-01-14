import { useState, useEffect } from 'react';
import { CSVLink } from "react-csv";
import extract from 'services/extractor';
import { IActivity } from 'utils/interfaces';

import { ReactComponent as SendIcon } from 'assets/send_icon.svg';
import './styles.css';

// -------------------------------------------------------------------------------------- 

const FILENAME = `trello_${(new Date()).toISOString().split('T')[0]}.csv`;

// -------------------------------------------------------------------------------------- 

function Form() {
  const [orgs, setOrgs] = useState('');
  const [file, setFile] = useState([] as IActivity[]) 

  const headers = [
  { label: 'Membro', key: 'member' },
  { label: 'Quadro', key: 'board' },
  { label: 'Data', key: 'date' },
  { label: 'Dia da sem', key: 'weekDay' },
  { label: 'Tarefa', key: 'card' },
  { label: 'Situação', key: 'status' },
  ];

  // Attempt to perform the extraction.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const apiKey = process.env.REACT_APP_API_KEY as string; 
    const token = localStorage.getItem('token') as string; 

    const csv = await extract({ apiKey, token, organizations: [orgs] });

    if (!csv) {
      alert('Desculpe, mas não foi possível concluir sua solicitação.');
      return;
    }

    setFile(csv);
  }

  // Update the localStorage object with new data.
  function updateConfig(field: { name: string, value: string }) {
    const configJson = localStorage.getItem('config');

    let config: { [k: string]: string } = configJson
      ? JSON.parse(configJson)
      : {};

    config[field.name] = field.value;
    localStorage.setItem('config', JSON.stringify(config))
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

  if (file.length) {
    return (
      <main className='downloadScreen' key={1}>
        <p>Extração concluída!</p>

        <menu>
          <button onClick={() => setFile([])} className='backBtn'>
            Voltar 
          </button>

          <CSVLink
            headers={headers}
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
