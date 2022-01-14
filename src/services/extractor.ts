import fetchData from './fetch';
import { filterActions } from './filter';
import { 
  IActivity,
  IActionData,
  IConfigProps,
} from '../utils/interfaces';

// -------------------------------------------------------------------------------------- 

enum Week {
  'dom' = 0,
  'seg' = 1,
  'ter' = 2,
  'qua' = 3,
  'qui' = 4,
  'sex' = 5,
  'sab' = 6,
}

// Action types.
const typeDictionary: { [k: string]: string } = {
  'addMemberToCard': 'Entrou',
  'removeMemberFromCard': 'Saiu'
}

// -------------------------------------------------------------------------------------- 

async function extract(config: IConfigProps) {
  try {
    // Get the data from Trello's API.
    const actionLog = await fetchData(config); 

    // Filter the desired action types.
    const relevantActions: IActionData[] = filterActions(actionLog); 

    // Build the activity array.
    const allActivities = relevantActions.map((actionData: IActionData) => {
      const status = actionData.type === 'updateCard'
        ? `➥ [${actionData.data.listAfter!.name}]`
        : typeDictionary[actionData.type];

      const activity: IActivity = {
        member: actionData.memberCreator.fullName,
        board: actionData.data.board.name,
        date: (new Date(actionData.date)).toLocaleString('pt-br'),
        weekDay: Week[new Date(actionData.date).getDay()],
        card: actionData.data.card.name,
        status,
      }

      return activity;
    });

    // Organize by member. 
/*
 *    const activityLog: IActivityLog = {};
 *
 *    allActivities.forEach((activity: IActivity) => {
 *      activityLog[activity.member] ??= [] as any;
 *      activityLog[activity.member].push(activity);
 *    });
 */

    return allActivities; 

  } catch (error: any) {
    alert('Desculpe, não foi possível concluir a sua solicitação.')
    console.error(error.message);
    return null;
  }
}

// --------------------------------------------------------------------------------------

export default extract;
