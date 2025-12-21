import { generatePath, useNavigate } from 'react-router-dom';

import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { PATHS } from '~/settings';

const LABEL = 'Edit';
const KEY = TournamentActionKey.Edit;

export const useEditAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const navigate = useNavigate();
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      handler: () => navigate(generatePath(PATHS.tournamentEdit, { id: subject._id })),
    };
  }
  return null;
};
