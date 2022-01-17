import axios from 'axios';
import { IConfigProps } from '../utils/interfaces';

// --------------------------------------------------------------------------------------

const baseUrl = process.env.REACT_APP_BASE_URL;

// --------------------------------------------------------------------------------------

// Fetch boardIds from list of workspace shortnames. 
async function fetchFromWorkspace(auth: string, organizations: string[]) {
  const boardIds: string[][] = await Promise.all(
    organizations.map(async (org: string) => {
      try {
        const boardUrl = `${baseUrl}/1/organizations/${org}/boards?${auth}`;
        const boardResp = await axios.get(boardUrl);

        return boardResp.data.map((entry: any) => entry.id);
      } catch (error: any) {
        console.error(`Erro ao acessar workspace [${org}]`);
      }
    })
  );

  // [[a, b, null]] -> [a, b]
  return boardIds.flat().filter(id => id);
}

// --------------------------------------------------------------------------------------

// Fetch actions from list of board ids.
async function fetchFromBoards(auth: string, boardIds: string[]) {
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

async function fetchData(config: IConfigProps) {
  const { apiKey, token, targetIds, targetType } = config;
  const auth = `key=${apiKey}&token=${token}`

  // Get a list of board ids from the list of workspace ids. 
  const boardIds = targetType === 'workspaces'
    ? await fetchFromWorkspace(auth, targetIds)
    : targetIds;

  // Get all the actions for each board.
  const actions = await fetchFromBoards(auth, boardIds);

  console.info(`Atividades encontradas: ${actions.length}.`);
  return actions;
}

// --------------------------------------------------------------------------------------

export default fetchData;
