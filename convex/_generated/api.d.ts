/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as common_fowV4BattlePlan from "../common/fowV4BattlePlan.js";
import type * as common_fowV4GameSystemConfig from "../common/fowV4GameSystemConfig.js";
import type * as common_fowV4MatchResultDetails from "../common/fowV4MatchResultDetails.js";
import type * as common_fowV4RankingFactor from "../common/fowV4RankingFactor.js";
import type * as common_gameSystem from "../common/gameSystem.js";
import type * as common_tournamentPairingMethod from "../common/tournamentPairingMethod.js";
import type * as common_tournamentStatus from "../common/tournamentStatus.js";
import type * as common_userDataVisibilityLevel from "../common/userDataVisibilityLevel.js";
import type * as friendships_confirmFriendship from "../friendships/confirmFriendship.js";
import type * as friendships_createFriendship from "../friendships/createFriendship.js";
import type * as friendships_deleteFriendship from "../friendships/deleteFriendship.js";
import type * as friendships_fetchFriendship from "../friendships/fetchFriendship.js";
import type * as friendships_fetchFriendshipRequests from "../friendships/fetchFriendshipRequests.js";
import type * as friendships_fetchFriendshipUserIdsByUserId from "../friendships/fetchFriendshipUserIdsByUserId.js";
import type * as friendships_fields from "../friendships/fields.js";
import type * as generateFileUploadUrl from "../generateFileUploadUrl.js";
import type * as http from "../http.js";
import type * as matchResults_createMatchResult from "../matchResults/createMatchResult.js";
import type * as matchResults_fetchMatchResult from "../matchResults/fetchMatchResult.js";
import type * as matchResults_fields from "../matchResults/fields.js";
import type * as matchResults_updateMatchResult from "../matchResults/updateMatchResult.js";
import type * as tables from "../tables.js";
import type * as tournamentCompetitors_createTournamentCompetitor from "../tournamentCompetitors/createTournamentCompetitor.js";
import type * as tournamentCompetitors_fetchTournamentCompetitor from "../tournamentCompetitors/fetchTournamentCompetitor.js";
import type * as tournamentCompetitors_index from "../tournamentCompetitors/index.js";
import type * as tournamentCompetitors_updateTournamentCompetitor from "../tournamentCompetitors/updateTournamentCompetitor.js";
import type * as tournamentPairings_fields from "../tournamentPairings/fields.js";
import type * as tournaments_createTournament from "../tournaments/createTournament.js";
import type * as tournaments_fetchTournamentList from "../tournaments/fetchTournamentList.js";
import type * as tournaments_fetchTournamentUserIds from "../tournaments/fetchTournamentUserIds.js";
import type * as tournaments_fields from "../tournaments/fields.js";
import type * as tournaments_updateTournament from "../tournaments/updateTournament.js";
import type * as users_checkUsernameExists from "../users/checkUsernameExists.js";
import type * as users_fetchCurrentUser from "../users/fetchCurrentUser.js";
import type * as users_fetchUser from "../users/fetchUser.js";
import type * as users_fetchUserList from "../users/fetchUserList.js";
import type * as users_fields from "../users/fields.js";
import type * as users_updateAvatar from "../users/updateAvatar.js";
import type * as users_updateUser from "../users/updateUser.js";
import type * as users_utils_checkUserTournamentRelationship from "../users/utils/checkUserTournamentRelationship.js";
import type * as users_utils_getLimitedUser from "../users/utils/getLimitedUser.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "common/fowV4BattlePlan": typeof common_fowV4BattlePlan;
  "common/fowV4GameSystemConfig": typeof common_fowV4GameSystemConfig;
  "common/fowV4MatchResultDetails": typeof common_fowV4MatchResultDetails;
  "common/fowV4RankingFactor": typeof common_fowV4RankingFactor;
  "common/gameSystem": typeof common_gameSystem;
  "common/tournamentPairingMethod": typeof common_tournamentPairingMethod;
  "common/tournamentStatus": typeof common_tournamentStatus;
  "common/userDataVisibilityLevel": typeof common_userDataVisibilityLevel;
  "friendships/confirmFriendship": typeof friendships_confirmFriendship;
  "friendships/createFriendship": typeof friendships_createFriendship;
  "friendships/deleteFriendship": typeof friendships_deleteFriendship;
  "friendships/fetchFriendship": typeof friendships_fetchFriendship;
  "friendships/fetchFriendshipRequests": typeof friendships_fetchFriendshipRequests;
  "friendships/fetchFriendshipUserIdsByUserId": typeof friendships_fetchFriendshipUserIdsByUserId;
  "friendships/fields": typeof friendships_fields;
  generateFileUploadUrl: typeof generateFileUploadUrl;
  http: typeof http;
  "matchResults/createMatchResult": typeof matchResults_createMatchResult;
  "matchResults/fetchMatchResult": typeof matchResults_fetchMatchResult;
  "matchResults/fields": typeof matchResults_fields;
  "matchResults/updateMatchResult": typeof matchResults_updateMatchResult;
  tables: typeof tables;
  "tournamentCompetitors/createTournamentCompetitor": typeof tournamentCompetitors_createTournamentCompetitor;
  "tournamentCompetitors/fetchTournamentCompetitor": typeof tournamentCompetitors_fetchTournamentCompetitor;
  "tournamentCompetitors/index": typeof tournamentCompetitors_index;
  "tournamentCompetitors/updateTournamentCompetitor": typeof tournamentCompetitors_updateTournamentCompetitor;
  "tournamentPairings/fields": typeof tournamentPairings_fields;
  "tournaments/createTournament": typeof tournaments_createTournament;
  "tournaments/fetchTournamentList": typeof tournaments_fetchTournamentList;
  "tournaments/fetchTournamentUserIds": typeof tournaments_fetchTournamentUserIds;
  "tournaments/fields": typeof tournaments_fields;
  "tournaments/updateTournament": typeof tournaments_updateTournament;
  "users/checkUsernameExists": typeof users_checkUsernameExists;
  "users/fetchCurrentUser": typeof users_fetchCurrentUser;
  "users/fetchUser": typeof users_fetchUser;
  "users/fetchUserList": typeof users_fetchUserList;
  "users/fields": typeof users_fields;
  "users/updateAvatar": typeof users_updateAvatar;
  "users/updateUser": typeof users_updateUser;
  "users/utils/checkUserTournamentRelationship": typeof users_utils_checkUserTournamentRelationship;
  "users/utils/getLimitedUser": typeof users_utils_getLimitedUser;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
