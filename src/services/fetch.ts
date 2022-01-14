import axios from 'axios';
import { IConfigProps } from '../utils/interfaces';

// --------------------------------------------------------------------------------------

async function fetchData(config: IConfigProps) {
  const { apiKey, token, organizations } = config;
  
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const auth = `key=${apiKey}&token=${token}`

  // Get all the boards from the organizations. 
  console.info('Quadros encontrados:');

  const idResult: string[][] = await Promise.all(
    organizations.map(async (org: string) => {
      try {
        const boardUrl = `${baseUrl}/1/organizations/${org}/boards?${auth}`;
        const boardResp = await axios.get(boardUrl);

        return boardResp.data.map((entry: any) => {
          console.info(' ➤ ' + entry.name);
          return entry.id
        });
      } catch (error: any) {
        console.error(`Erro ao acessar workspace [${org}]`);
      }
    })
  );

  // [[a, b, null]] -> [a, b]
  const boardIds: string[] = idResult.flat().filter(id => id);

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
  const actions = actionsResult.flat(1);
  console.info(`Atividades encontradas: ${actions.length}.`);

  return actions;
}

// --------------------------------------------------------------------------------------

export default fetchData;
