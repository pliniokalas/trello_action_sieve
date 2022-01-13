import { IActionData } from '../utils/interfaces';

const ACCEPTED_TYPES = [
  'addMemberToCard',
  'removeMemberFromCard',
  'updateCard'
];

// Filter the desired action types.
function filterActions(actionLog: IActionData[]): IActionData[] {
  const results: IActionData[] = [];

  actionLog.forEach((actionData: IActionData) => {
    if (!ACCEPTED_TYPES.includes(actionData.type)) {
      return;
    }

    // Check if the action is a list change.
    if (actionData.type === 'updateCard' 
      && (!actionData.data.listBefore
        || actionData.data.listBefore.id === actionData.data.listAfter!.id)) {
      return;
    }

    results.push(actionData);
  });

  return results;
}

// --------------------------------------------------------------------------------------

export { filterActions };
