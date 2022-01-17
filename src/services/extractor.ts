import fetchData from './fetch';
import { filterActions } from './filter';
import { 
  IActivity,
  IActionData,
  IConfigProps,
  actionType,
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

// -------------------------------------------------------------------------------------- 

async function extract(config: IConfigProps) {
  try {
    // Get the data from Trello's API.
    const actionLog = await fetchData(config); 

    // Filter the desired action types.
    const relevantActions: IActionData[] = filterActions(actionLog); 

    // Build the activity array.
    const allActivities = relevantActions.map((actionData: IActionData) => {
      let status = '' 
      const isUpdate = actionData.type === 'updateCard';
      const isArchived = actionData.data?.card?.closed;

      if (isUpdate) {
        status = isArchived 
          ? 'Arquivou o card'
          : `Moveu para [${actionData.data.listAfter!.name}]`;
      } else {
        status = actionType[actionData.type];
      }

      const activity: IActivity = {
        member: actionData.memberCreator.fullName,
        board: actionData.data.board.name,
        weekDay: Week[new Date(actionData.date).getDay()],
        date: (new Date(actionData.date)).toLocaleString('pt-br'),
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
    let errorMessage = 'Desculpe, não foi possível concluir a sua solicitação.';

    if (error.code === 401) {
      errorMessage = 'Você não tem autorização para ver essas workspaces.';
    }

    if (error.code === 404) {
      errorMessage = 'Workspaces não encontradas.';
    }

    alert(errorMessage)
    console.error(error.message);
    return null;
  }
}

// --------------------------------------------------------------------------------------

export default extract;
