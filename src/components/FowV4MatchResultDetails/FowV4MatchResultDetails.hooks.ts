import { useQuery } from 'convex/react';

import { api } from '~/api';
import { Identity } from '~/components/IdentityBadge';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';
import { FowV4MatchResultDetailsData } from './FowV4MatchResultDetails.types';

type UserPlayerNameResult = {
  displayName?: string;
  loading: boolean; // TODO: Needed?
};

// TODO: Possibly combine with <IdentityBadge />
export const usePlayerName = (
  identity: Identity,
  loading?: boolean,
): UserPlayerNameResult => {
  const { user, userId, placeholder } = identity;

  // TODO: Replace with a service hook
  const queryUser = useQuery(api.users.getUser, userId ? {
    id: userId,
  } : 'skip');

  if (loading || (userId && !queryUser)) {
    return {
      loading: true,
    };
  }
  
  if (user) {
    return {
      loading: false,
      displayName: getUserDisplayNameString(user),
    };
  }
  
  if (userId && queryUser) {
    return {
      loading: false,
      displayName: getUserDisplayNameString(queryUser),
    };  
  }

  if (placeholder) {
    return {
      loading: false,
      displayName: placeholder.displayName,
    };
  }

  return {
    loading: false,
  };
};

type UserPlayerNamesResult = [string, string] | undefined;

export const usePlayerNames = (
  matchResult: FowV4MatchResultDetailsData,
  loading?: boolean,
): UserPlayerNamesResult => {
  const { displayName: player0DisplayName, loading: player0Loading } = usePlayerName({
    user: matchResult.player0User,
    userId: matchResult.player0UserId,
    placeholder: matchResult.player0Placeholder ? {
      displayName: matchResult.player0Placeholder,
    } : undefined,
  });
  const { displayName: player1DisplayName, loading: player1Loading } = usePlayerName({
    user: matchResult.player1User,
    userId: matchResult.player1UserId,
    placeholder: matchResult.player1Placeholder ? {
      displayName: matchResult.player1Placeholder,
    } : undefined,
  });
  if (loading || player0Loading || player1Loading) {
    return undefined;
  }
  if (player0DisplayName && player1DisplayName) {
    return [player0DisplayName, player1DisplayName];
  }
  return;
};
