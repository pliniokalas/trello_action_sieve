interface ISidePanelProps {
  tab: string;
  changeTab: (i: number, trail: string) => void;
  save: () => void;
  canExport: boolean;
  selectAll: () => void;
  unselectAll: () => void;
  hasSelected: boolean; 
}

function SidePanel(props: ISidePanelProps) {
  const {
    tab,
    changeTab,
    save,
    canExport,
    selectAll,
    unselectAll,
    hasSelected
  } = props;

  return (
    <menu className='dashMenu'>
      <button 
        className={`dashBtn ${tab === 'workspaces' ? 'on' : ''}`}
        onClick={() => changeTab(0, 'workspaces')}
      >
        Workspaces
      </button>

      <button
        className={`dashBtn ${tab === 'quadros' ? 'on' : ''}`}
        onClick={() => changeTab(1, 'quadros')}
      >
        Quadros 
      </button>

      <button
        className={`dashBtn ${tab === 'actions' ? 'on' : ''}`}
        onClick={() => changeTab(2, 'actions')}
      >
        Actions 
      </button>

      <hr />

      <button
        className='dashBtn'
        onClick={selectAll}
      >
        Selecionar todos
      </button>

      <button
        className='dashBtn'
        onClick={unselectAll}
        disabled={!hasSelected}
      >
        Limpar seleção
      </button>

      <button
        className='exportBtn ctaBtn'
        onClick={save}
        disabled={canExport}
      >
        Exportar para CSV
      </button>
    </menu>

  );
}

export default SidePanel;
