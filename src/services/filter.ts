import { IActionData } from '../utils/interfaces';

const ACCEPTED_TYPES = [
  'addMemberToCard',
  'removeMemberFromCard',
  'updateCard',
  'deleteCard',
];

// Filter the desired action types.
function filterActions(actionLog: IActionData[]): IActionData[] {
  const results: IActionData[] = [];

  actionLog.forEach((actionData: IActionData) => {
    if (!ACCEPTED_TYPES.includes(actionData.type)) {
      return;
    }

    // Check if the action is a list change or archiving.
    const isUpdate = actionData.type === 'updateCard'; 
    const isArchived = actionData.data?.card?.closed;
    const hasBeforeList = actionData.data.listBefore;
    const isSameList = actionData.data?.listBefore?.id === actionData.data?.listAfter?.id;
    const isListChange = hasBeforeList && !isSameList;
    if (isUpdate && !isArchived && !isListChange) {
      return;
    }

    results.push(actionData);
  });

  return results;
}

// --------------------------------------------------------------------------------------

export { filterActions };
