import { useState, useEffect } from 'react';
import { CSVLink } from "react-csv";
import extract from '../services/extractor';
import { IActivity } from '../utils/interfaces';
import './form.css';

// -------------------------------------------------------------------------------------- 

const FILENAME = `trello_${(new Date()).toISOString().split('T')[0]}.csv`;

// -------------------------------------------------------------------------------------- 

function Form() {
  const [fields, setFields] = useState({ apiKey: '', token: '', orgs: '' });
  const [file, setFile] = useState([] as IActivity[]) 

  // Attempt to perform the extraction.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { apiKey, token, orgs } = fields;
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
    const field = e.target;
    setFields(prev => ({ ...prev, [field.name]: field.value }));
    updateConfig(field);
  }

  // Grab previous input values from the localStorage.
  useEffect(() => {
    const configJson = localStorage.getItem('config');

    if (configJson) {
      const config = JSON.parse(configJson);

      setFields({
        apiKey: config.apiKey || '',
        token: config.token || '',
        orgs: config.orgs || '',
      });
    }
  }, []);

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label>App-key</label>
        <input
          value={fields['apiKey']}
          onChange={handleChange}
          name='apiKey'
          type='password'
        />

        <label>Token</label>
        <input
          value={fields['token']}
          onChange={handleChange}
          name='token'
          type='password'
        />

        <label>Organizações (workspaces)</label>
        <input
          value={fields['orgs']}
          onChange={handleChange}
          name='orgs'
          type='text'
        />

        <button>
          Enviar
        </button>
      </form>

      {!!file.length &&
        <CSVLink data={file} filename={FILENAME}>
          Baixar
        </CSVLink>
      }
    </main>
  );
}

// -------------------------------------------------------------------------------------- 

export default Form;
