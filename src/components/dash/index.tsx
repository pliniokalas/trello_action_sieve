import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSVDownload } from 'react-csv';
import axios from 'axios';

import { IActivity } from 'utils/interfaces';
import SidePanel from './sidePanel';
import List from 'components/list';
import extract from 'services/extractor';
import './styles.css';

// -------------------------------------------------------------------------------------- 

const baseUrl = process.env.REACT_APP_BASE_URL;

enum endpointRouteMap {
  '/1/members/{id}/organizations',
  '/1/members/{id}/boards',
  '/1/members/{id}/actions',
  '/1/organizations/{id}/members',
}

function getEndpoint(index: number, id: string) {
  return endpointRouteMap[index].replace('{id}', id);
}

// const FILENAME = `trello_${(new Date()).toISOString().split('T')[0]}.csv`;

const CSV_HEADERS = [
  { label: 'Membro', key: 'member' },
  { label: 'Quadro', key: 'board' },
  { label: 'Dia da sem', key: 'weekDay' },
  { label: 'Data', key: 'date' },
  { label: 'Tarefa', key: 'card' },
  { label: 'Situação', key: 'status' },
];

// -------------------------------------------------------------------------------------- 

function Dash() {
  const [member, setMember] = useState({} as any);
  const [items, setItems] = useState([] as any);
  const [selected, setSelected] = useState([] as string[]);
  const [tab, setTab] = useState('workspaces');
  const [file, setFile] = useState([] as IActivity[]);

  const navigate = useNavigate();

  // Returns data from Trello API to populate the List.
  async function getData(endpoint: string) {
    const token = localStorage.getItem('token');
    const auth = `key=${process.env.REACT_APP_API_KEY}&token=${token}`;
    const resp = await axios.get(`${baseUrl}${endpoint.replace('{id}', member.id)}?${auth}`);

    setItems(resp.data);
  }

  /*
   * Receives an endpoint index, requests it's data and displays the current tab. 
   * Selections are losting when navigating.
   */
  function handleNavigate(index: number, toTab: string) {
    setItems([]);
    getData(getEndpoint(index, member.id))
    setSelected([]);
    setTab(toTab);
  }

  // Exports the selected data to a CSV file.
  async function handleExport() {
    setFile([]); // Trigger the download if file already exists.

    const csv = await extract({
      apiKey: process.env.REACT_APP_API_KEY as string,
      token: localStorage.getItem('token') as string,
      targetIds: selected,
      targetType: tab as 'workspaces' | 'quadros',
    });

    if (!csv) {
      alert('Desculpe, mas não foi possível concluir sua solicitação.');
      return;
    }

    setFile(csv);
  }

  // Selected list items for exporting.
  function handleSelecting(id: string) {
    if (selected.some((entry) => entry === id)) {
      setSelected(prev => prev.filter((entry) => entry !== id));
    } else {
      setSelected(prev => [...prev, id]);
    }
  }

  function handleSelectAll() {
    // Actions are not selectable.
    if (!items[0].type) {
      setSelected(items.map((entry: { id: string }) => entry.id));
    }
  }

  // Fetch member data onload.
  useEffect(() => {
    let isSubscribed = true;

    (async function() {
      const token = localStorage.getItem('token');
      const url = `${baseUrl}/1/tokens/${token}/member?key=${process.env.REACT_APP_API_KEY}`;

      try {
        const resp = await axios.get(url);
        if (isSubscribed) {
          setMember(resp.data);
        }
      } catch (error) {
        alert('Seu token expirou. Por favor autorize o app novamente.');
        localStorage.removeItem('token');
        navigate('/autorizar');
      }
    }());

    return () => { isSubscribed = false };
  }, []); // eslint-disable-line

  // Auto populate workspace data.
  useEffect(() => {
    let isSubscribed = true;

    if (member.id && isSubscribed) {
      getData(getEndpoint(0, member.id));
    }

    return () => { isSubscribed = false; };
  }, [member]); // eslint-disable-line

  // Reset the file whenever the selected items change.
  useEffect(() => {
    setFile([]);
  }, [selected]);

  return (
    <main className='dash'>
      <h3>{member.fullName} / {tab}</h3>

      <SidePanel
        tab={tab}
        changeTab={handleNavigate}
        save={handleExport}
        canExport={!selected.length}
        selectAll={handleSelectAll}
        unselectAll={() => setSelected([])}
        hasSelected={!!selected.length}
      />
  
      {items.length 
        ? <List 
          items={items} 
          select={handleSelecting} 
          selected={selected}
        />
        : <p className='loading'>Carregando...</p>
      }

      {!!file.length
          && <CSVDownload 
            headers={CSV_HEADERS}
            data={file}
            target='_blank'
          />
      }
    </main>
  );
}

export default Dash;
