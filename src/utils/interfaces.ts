// Partial object because I'm lazy and the objects are really big.
export interface IActionData {
  id: string;
  type: string;
  date: string;
  data: {
    board: { id: string; name: string; closed?: boolean; };
    card: { id: string; name: string; closed?: boolean; };
    member?: any;
    list?: { id: string; name: string; };
    listBefore?: { id: string; name: string; };
    listAfter?: { id: string; name: string; };
  }
  memberCreator: {
    username: string;
    fullName: string;
  };
}

export interface IConfigProps {
  apiKey: string;
  token: string;
  targetIds: string[];
  // Currently, these are the lables used in the interface. I need to find a better way to
  // define these types.
  targetType: 'workspaces' | 'quadros'; 
}

export interface IActivity {
  status: string;
  board: string;
  card: string;
  date: string;
  member: string;
  weekDay: string;
}

export interface IActivityLog {
  [member: string]: IActivity[];
}

export interface IListProps {
  items: any[];
  select: (id: string) => void;
  selected: string[];
}

export const actionType: { [k: string]: string } = {
  'addMemberToCard': 'Entrou no card',
  'removeMemberFromCard': 'Saiu do card',
  'updateCard': 'Moveu o card',
  'addAttachmentToCard': 'Anexou no card',
  'createCard': 'Criou o card',
  'commentCard': 'Comentou no card',
  'updateCheckItemStateOnCard': 'Atualizou checklist',
  'addToOrganizationBoard': 'Adicionou na workspace',
  'createOrganization': 'Criou workspace',
  'deleteCard': 'Deletou o card',
}
