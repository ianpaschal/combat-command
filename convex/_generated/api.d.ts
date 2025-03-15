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
import type * as auth_ResendOtpPasswordReset from "../auth/ResendOtpPasswordReset.js";
import type * as auth_ResendOtpVerification from "../auth/ResendOtpVerification.js";
import type * as auth from "../auth.js";
import type * as common_faction from "../common/faction.js";
import type * as common_fowV4_fowV4Alignment from "../common/fowV4/fowV4Alignment.js";
import type * as common_fowV4_fowV4BattlePlan from "../common/fowV4/fowV4BattlePlan.js";
import type * as common_fowV4_fowV4Era from "../common/fowV4/fowV4Era.js";
import type * as common_fowV4_fowV4Faction from "../common/fowV4/fowV4Faction.js";
import type * as common_fowV4_fowV4GameSystemConfig from "../common/fowV4/fowV4GameSystemConfig.js";
import type * as common_fowV4_fowV4LessonsFromTheFrontVersion from "../common/fowV4/fowV4LessonsFromTheFrontVersion.js";
import type * as common_fowV4_fowV4MatchOutcomeType from "../common/fowV4/fowV4MatchOutcomeType.js";
import type * as common_fowV4_fowV4MatchResultDetails from "../common/fowV4/fowV4MatchResultDetails.js";
import type * as common_fowV4_fowV4MissionId from "../common/fowV4/fowV4MissionId.js";
import type * as common_fowV4_fowV4MissionMatrixId from "../common/fowV4/fowV4MissionMatrixId.js";
import type * as common_fowV4_fowV4MissionPackId from "../common/fowV4/fowV4MissionPackId.js";
import type * as common_fowV4_fowV4MissionPackVersion from "../common/fowV4/fowV4MissionPackVersion.js";
import type * as common_fowV4_fowV4RankingFactor from "../common/fowV4/fowV4RankingFactor.js";
import type * as common_fowV4_getMission from "../common/fowV4/getMission.js";
import type * as common_fowV4_getMissionPack from "../common/fowV4/getMissionPack.js";
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
import type * as friendships_index from "../friendships/index.js";
import type * as generateFileUploadUrl from "../generateFileUploadUrl.js";
import type * as http from "../http.js";
import type * as matchResultComments_index from "../matchResultComments/index.js";
import type * as matchResultComments_mutations from "../matchResultComments/mutations.js";
import type * as matchResultComments_queries from "../matchResultComments/queries.js";
import type * as matchResultLikes_index from "../matchResultLikes/index.js";
import type * as matchResultLikes_mutations from "../matchResultLikes/mutations.js";
import type * as matchResultLikes_queries from "../matchResultLikes/queries.js";
import type * as matchResults_createMatchResult from "../matchResults/createMatchResult.js";
import type * as matchResults_fetchMatchResult from "../matchResults/fetchMatchResult.js";
import type * as matchResults_fetchMatchResultList from "../matchResults/fetchMatchResultList.js";
import type * as matchResults_index from "../matchResults/index.js";
import type * as matchResults_mutations from "../matchResults/mutations.js";
import type * as matchResults_updateMatchResult from "../matchResults/updateMatchResult.js";
import type * as photos_index from "../photos/index.js";
import type * as photos_mutations from "../photos/mutations.js";
import type * as static_fowV4_missionPacks from "../static/fowV4/missionPacks.js";
import type * as tournamentCompetitors_createTournamentCompetitor from "../tournamentCompetitors/createTournamentCompetitor.js";
import type * as tournamentCompetitors_fetchTournamentCompetitor from "../tournamentCompetitors/fetchTournamentCompetitor.js";
import type * as tournamentCompetitors_index from "../tournamentCompetitors/index.js";
import type * as tournamentCompetitors_updateTournamentCompetitor from "../tournamentCompetitors/updateTournamentCompetitor.js";
import type * as tournamentPairings_fetchTournamentPairing from "../tournamentPairings/fetchTournamentPairing.js";
import type * as tournamentPairings_fetchTournamentPairingList from "../tournamentPairings/fetchTournamentPairingList.js";
import type * as tournamentPairings_index from "../tournamentPairings/index.js";
import type * as tournaments_createTournament from "../tournaments/createTournament.js";
import type * as tournaments_fetchTournament from "../tournaments/fetchTournament.js";
import type * as tournaments_fetchTournamentList from "../tournaments/fetchTournamentList.js";
import type * as tournaments_fetchTournamentUserIds from "../tournaments/fetchTournamentUserIds.js";
import type * as tournaments_index from "../tournaments/index.js";
import type * as tournaments_updateTournament from "../tournaments/updateTournament.js";
import type * as users_checkUsernameExists from "../users/checkUsernameExists.js";
import type * as users_fetchCurrentUser from "../users/fetchCurrentUser.js";
import type * as users_fetchUser from "../users/fetchUser.js";
import type * as users_fetchUserList from "../users/fetchUserList.js";
import type * as users_index from "../users/index.js";
import type * as users_updateAvatar from "../users/updateAvatar.js";
import type * as users_updateUser from "../users/updateUser.js";
import type * as users_utils_checkUserTournamentRelationship from "../users/utils/checkUserTournamentRelationship.js";
import type * as users_utils_getAvatarUrl from "../users/utils/getAvatarUrl.js";
import type * as users_utils_getLimitedUser from "../users/utils/getLimitedUser.js";
import type * as users_utils_redactUserInfo from "../users/utils/redactUserInfo.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/ResendOtpPasswordReset": typeof auth_ResendOtpPasswordReset;
  "auth/ResendOtpVerification": typeof auth_ResendOtpVerification;
  auth: typeof auth;
  "common/faction": typeof common_faction;
  "common/fowV4/fowV4Alignment": typeof common_fowV4_fowV4Alignment;
  "common/fowV4/fowV4BattlePlan": typeof common_fowV4_fowV4BattlePlan;
  "common/fowV4/fowV4Era": typeof common_fowV4_fowV4Era;
  "common/fowV4/fowV4Faction": typeof common_fowV4_fowV4Faction;
  "common/fowV4/fowV4GameSystemConfig": typeof common_fowV4_fowV4GameSystemConfig;
  "common/fowV4/fowV4LessonsFromTheFrontVersion": typeof common_fowV4_fowV4LessonsFromTheFrontVersion;
  "common/fowV4/fowV4MatchOutcomeType": typeof common_fowV4_fowV4MatchOutcomeType;
  "common/fowV4/fowV4MatchResultDetails": typeof common_fowV4_fowV4MatchResultDetails;
  "common/fowV4/fowV4MissionId": typeof common_fowV4_fowV4MissionId;
  "common/fowV4/fowV4MissionMatrixId": typeof common_fowV4_fowV4MissionMatrixId;
  "common/fowV4/fowV4MissionPackId": typeof common_fowV4_fowV4MissionPackId;
  "common/fowV4/fowV4MissionPackVersion": typeof common_fowV4_fowV4MissionPackVersion;
  "common/fowV4/fowV4RankingFactor": typeof common_fowV4_fowV4RankingFactor;
  "common/fowV4/getMission": typeof common_fowV4_getMission;
  "common/fowV4/getMissionPack": typeof common_fowV4_getMissionPack;
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
  "friendships/index": typeof friendships_index;
  generateFileUploadUrl: typeof generateFileUploadUrl;
  http: typeof http;
  "matchResultComments/index": typeof matchResultComments_index;
  "matchResultComments/mutations": typeof matchResultComments_mutations;
  "matchResultComments/queries": typeof matchResultComments_queries;
  "matchResultLikes/index": typeof matchResultLikes_index;
  "matchResultLikes/mutations": typeof matchResultLikes_mutations;
  "matchResultLikes/queries": typeof matchResultLikes_queries;
  "matchResults/createMatchResult": typeof matchResults_createMatchResult;
  "matchResults/fetchMatchResult": typeof matchResults_fetchMatchResult;
  "matchResults/fetchMatchResultList": typeof matchResults_fetchMatchResultList;
  "matchResults/index": typeof matchResults_index;
  "matchResults/mutations": typeof matchResults_mutations;
  "matchResults/updateMatchResult": typeof matchResults_updateMatchResult;
  "photos/index": typeof photos_index;
  "photos/mutations": typeof photos_mutations;
  "static/fowV4/missionPacks": typeof static_fowV4_missionPacks;
  "tournamentCompetitors/createTournamentCompetitor": typeof tournamentCompetitors_createTournamentCompetitor;
  "tournamentCompetitors/fetchTournamentCompetitor": typeof tournamentCompetitors_fetchTournamentCompetitor;
  "tournamentCompetitors/index": typeof tournamentCompetitors_index;
  "tournamentCompetitors/updateTournamentCompetitor": typeof tournamentCompetitors_updateTournamentCompetitor;
  "tournamentPairings/fetchTournamentPairing": typeof tournamentPairings_fetchTournamentPairing;
  "tournamentPairings/fetchTournamentPairingList": typeof tournamentPairings_fetchTournamentPairingList;
  "tournamentPairings/index": typeof tournamentPairings_index;
  "tournaments/createTournament": typeof tournaments_createTournament;
  "tournaments/fetchTournament": typeof tournaments_fetchTournament;
  "tournaments/fetchTournamentList": typeof tournaments_fetchTournamentList;
  "tournaments/fetchTournamentUserIds": typeof tournaments_fetchTournamentUserIds;
  "tournaments/index": typeof tournaments_index;
  "tournaments/updateTournament": typeof tournaments_updateTournament;
  "users/checkUsernameExists": typeof users_checkUsernameExists;
  "users/fetchCurrentUser": typeof users_fetchCurrentUser;
  "users/fetchUser": typeof users_fetchUser;
  "users/fetchUserList": typeof users_fetchUserList;
  "users/index": typeof users_index;
  "users/updateAvatar": typeof users_updateAvatar;
  "users/updateUser": typeof users_updateUser;
  "users/utils/checkUserTournamentRelationship": typeof users_utils_checkUserTournamentRelationship;
  "users/utils/getAvatarUrl": typeof users_utils_getAvatarUrl;
  "users/utils/getLimitedUser": typeof users_utils_getLimitedUser;
  "users/utils/redactUserInfo": typeof users_utils_redactUserInfo;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
