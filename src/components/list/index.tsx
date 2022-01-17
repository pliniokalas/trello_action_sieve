import { IListProps } from 'utils/interfaces';
import { actionType } from 'utils/interfaces';
import './styles.css';

// --------------------------------------------------------------------------------------

function List(props: IListProps) {
  const { items, select, selected } = props;

  function getLable(item: any) {
    if (item.name) {
      return `${item.displayName || item.name}${item.closed ? ' [FECHADO]' : ''}`;
    }

    const type = actionType[item.type];
    const date = (new Date(item.date)).toLocaleDateString('pt-br');
    const board = item.data.board?.name || '';
    const archived = item.data.card?.closed ? ' [ARQUIVADO]' : '';
    const card = item.data.card?.name || '';
    const member = item.member?.fullName || item.memberCreator.fullName;

    return [date, board, member, type, card + archived].filter(val => val).join(' | ');
  }

  return (
    <ul className='list'>
      {!!items.length ? items.map((item, i: number) => (
        <li style={{'--index': i} as React.CSSProperties} key={item.id}>
          <label className={selected.some((id) => id === item.id) ? 'selected' : ''}>

            <input
              type='checkbox'
              name='item'
              value={item.id}
              onChange={(e) => select(e.target.value)}
              checked={selected.some((id) => id === item.id)}
              disabled={!!item.type}
            />

            <p>{getLable(item)}</p>

            {item.url && <a href={item.url}>Trello</a>}
          </label>
        </li> ))
        : <li><label><p>Zero resultados encontrados.</p></label></li>
      }
    </ul>
  );
}

export default List;
