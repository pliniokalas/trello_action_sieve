import axios from 'axios';
import { IConfigProps } from '../utils/interfaces';

// --------------------------------------------------------------------------------------

async function fetchData(config: IConfigProps) {
  const { apiKey, token, organizations } = config;
  
  const baseUrl = 'https://api.trello.com';
  const auth = `key=${apiKey}&token=${token}`

  // Get all the boards from the organizations. 
  const idResult: string[][] = await Promise.all(
    organizations.map(async (org: string) => {
      const boardUrl = `${baseUrl}/1/organizations/${org}/boards?${auth}`;
      const boardResp = await axios.get(boardUrl);

      return boardResp.data.map((entry: any) => {
        console.info(' ➤ ' + entry.name);
        return entry.id
      });
    })
  );

  // [[a, b]] -> [a, b]
  const boardIds: string[] = idResult.flat();

  // Get all the actions for each board.
  const actionsResult = await Promise.all(
    boardIds.map(async (boardId: string) => {
      const actionUrl = `${baseUrl}/1/boards/${boardId}/actions?${auth}`;
      const actionResp = await axios.get(actionUrl);
      const actionData = await actionResp.data;
      return actionData; 
    })
  );

  // [[a, b]] -> [a, b]
  return actionsResult.flat(1);
}

// --------------------------------------------------------------------------------------

export default fetchData;
