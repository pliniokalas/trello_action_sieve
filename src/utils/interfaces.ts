// Partial object because I'm lazy and the objects are really big.
export interface IActionData {
  id: string;
  type: string;
  date: string;
  data: {
    board: { id: string; name: string; };
    card: { id: string; name: string; };
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
  organizations: string[];
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

