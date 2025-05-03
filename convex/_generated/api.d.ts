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
import type * as _fixtures_createFakeMatchResultData from "../_fixtures/createFakeMatchResultData.js";
import type * as _fixtures_createFakeUserData from "../_fixtures/createFakeUserData.js";
import type * as _fixtures_defaultSinglesTournament from "../_fixtures/defaultSinglesTournament.js";
import type * as _fixtures_defaultTeamTournament from "../_fixtures/defaultTeamTournament.js";
import type * as _model__helpers_getStorageUrl from "../_model/_helpers/getStorageUrl.js";
import type * as _model__helpers_notNullOrUndefined from "../_model/_helpers/notNullOrUndefined.js";
import type * as _model_fowV4_calculateMatchScore from "../_model/fowV4/calculateMatchScore.js";
import type * as _model_matchResults_getDeepMatchResult from "../_model/matchResults/getDeepMatchResult.js";
import type * as _model_matchResults_getMatchResultsByTournament from "../_model/matchResults/getMatchResultsByTournament.js";
import type * as _model_matchResults_getMatchResultsByTournamentPairing from "../_model/matchResults/getMatchResultsByTournamentPairing.js";
import type * as _model_matchResults_getMatchResultsByTournamentRound from "../_model/matchResults/getMatchResultsByTournamentRound.js";
import type * as _model_matchResults_helpers from "../_model/matchResults/helpers.js";
import type * as _model_tournamentCompetitors_fields from "../_model/tournamentCompetitors/fields.js";
import type * as _model_tournamentCompetitors_helpers from "../_model/tournamentCompetitors/helpers.js";
import type * as _model_tournamentCompetitors_index from "../_model/tournamentCompetitors/index.js";
import type * as _model_tournamentCompetitors_mutations from "../_model/tournamentCompetitors/mutations.js";
import type * as _model_tournamentCompetitors_queries from "../_model/tournamentCompetitors/queries.js";
import type * as _model_tournamentPairings_actions_generateDraftAdjacentPairings from "../_model/tournamentPairings/actions/generateDraftAdjacentPairings.js";
import type * as _model_tournamentPairings_actions_generateDraftRandomPairings from "../_model/tournamentPairings/actions/generateDraftRandomPairings.js";
import type * as _model_tournamentPairings_fields from "../_model/tournamentPairings/fields.js";
import type * as _model_tournamentPairings_helpers_checkPairingIsValid from "../_model/tournamentPairings/helpers/checkPairingIsValid.js";
import type * as _model_tournamentPairings_helpers_isValidOpponent from "../_model/tournamentPairings/helpers/isValidOpponent.js";
import type * as _model_tournamentPairings_helpers_old_generateDraftPairings from "../_model/tournamentPairings/helpers/old/generateDraftPairings.js";
import type * as _model_tournamentPairings_helpers_pairingTypes from "../_model/tournamentPairings/helpers/pairingTypes.js";
import type * as _model_tournamentPairings_helpers_shuffle from "../_model/tournamentPairings/helpers/shuffle.js";
import type * as _model_tournamentPairings_helpers_testHelpers from "../_model/tournamentPairings/helpers/testHelpers.js";
import type * as _model_tournamentPairings_helpers from "../_model/tournamentPairings/helpers.js";
import type * as _model_tournamentPairings_index from "../_model/tournamentPairings/index.js";
import type * as _model_tournamentPairings_mutations_createTournamentPairings from "../_model/tournamentPairings/mutations/createTournamentPairings.js";
import type * as _model_tournamentPairings_queries from "../_model/tournamentPairings/queries.js";
import type * as _model_tournamentRankings_helpers_aggregateResults from "../_model/tournamentRankings/helpers/aggregateResults.js";
import type * as _model_tournamentRankings_helpers_averageResults from "../_model/tournamentRankings/helpers/averageResults.js";
import type * as _model_tournamentRankings_helpers_compareResults from "../_model/tournamentRankings/helpers/compareResults.js";
import type * as _model_tournamentRankings_helpers_extendResults from "../_model/tournamentRankings/helpers/extendResults.js";
import type * as _model_tournamentRankings_helpers_sumResults from "../_model/tournamentRankings/helpers/sumResults.js";
import type * as _model_tournamentRankings_index from "../_model/tournamentRankings/index.js";
import type * as _model_tournamentRankings_queries from "../_model/tournamentRankings/queries.js";
import type * as _model_tournamentRankings_types from "../_model/tournamentRankings/types.js";
import type * as _model_tournaments_actions_checkInPlayer from "../_model/tournaments/actions/checkInPlayer.js";
import type * as _model_tournaments_actions_startTournament from "../_model/tournaments/actions/startTournament.js";
import type * as _model_tournaments_fields from "../_model/tournaments/fields.js";
import type * as _model_tournaments_helpers from "../_model/tournaments/helpers.js";
import type * as _model_tournaments_index from "../_model/tournaments/index.js";
import type * as _model_tournaments_mutations from "../_model/tournaments/mutations.js";
import type * as _model_tournaments_queries from "../_model/tournaments/queries.js";
import type * as auth_ResendOtpPasswordReset from "../auth/ResendOtpPasswordReset.js";
import type * as auth_ResendOtpVerification from "../auth/ResendOtpVerification.js";
import type * as auth from "../auth.js";
import type * as common_errors from "../common/errors.js";
import type * as common_fowV4_fowV4GameSystemConfig from "../common/fowV4/fowV4GameSystemConfig.js";
import type * as common_fowV4_fowV4MatchOutcomeType from "../common/fowV4/fowV4MatchOutcomeType.js";
import type * as common_fowV4_fowV4MatchResultDetails from "../common/fowV4/fowV4MatchResultDetails.js";
import type * as common_fowV4_getMission from "../common/fowV4/getMission.js";
import type * as common_fowV4_getMissionPack from "../common/fowV4/getMissionPack.js";
import type * as common_location from "../common/location.js";
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
import type * as matchResults_fetchMatchResult from "../matchResults/fetchMatchResult.js";
import type * as matchResults_fetchMatchResultList from "../matchResults/fetchMatchResultList.js";
import type * as matchResults_index from "../matchResults/index.js";
import type * as matchResults_mutations from "../matchResults/mutations.js";
import type * as photos_index from "../photos/index.js";
import type * as photos_mutations from "../photos/mutations.js";
import type * as photos_queries from "../photos/queries.js";
import type * as static_currencyCodes from "../static/currencyCodes.js";
import type * as static_fowV4_dynamicPointsVersions from "../static/fowV4/dynamicPointsVersions.js";
import type * as static_fowV4_eras from "../static/fowV4/eras.js";
import type * as static_fowV4_factions from "../static/fowV4/factions.js";
import type * as static_fowV4_fowV4BattlePlan from "../static/fowV4/fowV4BattlePlan.js";
import type * as static_fowV4_fowV4RankingFactors from "../static/fowV4/fowV4RankingFactors.js";
import type * as static_fowV4_lessonsFromTheFrontVersions from "../static/fowV4/lessonsFromTheFrontVersions.js";
import type * as static_fowV4_missionPacks from "../static/fowV4/missionPacks.js";
import type * as static_gameSystems from "../static/gameSystems.js";
import type * as static_tournamentPairingMethods from "../static/tournamentPairingMethods.js";
import type * as tournamentCompetitors from "../tournamentCompetitors.js";
import type * as tournamentPairings from "../tournamentPairings.js";
import type * as tournamentRankings from "../tournamentRankings.js";
import type * as tournaments from "../tournaments.js";
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
  "_fixtures/createFakeMatchResultData": typeof _fixtures_createFakeMatchResultData;
  "_fixtures/createFakeUserData": typeof _fixtures_createFakeUserData;
  "_fixtures/defaultSinglesTournament": typeof _fixtures_defaultSinglesTournament;
  "_fixtures/defaultTeamTournament": typeof _fixtures_defaultTeamTournament;
  "_model/_helpers/getStorageUrl": typeof _model__helpers_getStorageUrl;
  "_model/_helpers/notNullOrUndefined": typeof _model__helpers_notNullOrUndefined;
  "_model/fowV4/calculateMatchScore": typeof _model_fowV4_calculateMatchScore;
  "_model/matchResults/getDeepMatchResult": typeof _model_matchResults_getDeepMatchResult;
  "_model/matchResults/getMatchResultsByTournament": typeof _model_matchResults_getMatchResultsByTournament;
  "_model/matchResults/getMatchResultsByTournamentPairing": typeof _model_matchResults_getMatchResultsByTournamentPairing;
  "_model/matchResults/getMatchResultsByTournamentRound": typeof _model_matchResults_getMatchResultsByTournamentRound;
  "_model/matchResults/helpers": typeof _model_matchResults_helpers;
  "_model/tournamentCompetitors/fields": typeof _model_tournamentCompetitors_fields;
  "_model/tournamentCompetitors/helpers": typeof _model_tournamentCompetitors_helpers;
  "_model/tournamentCompetitors/index": typeof _model_tournamentCompetitors_index;
  "_model/tournamentCompetitors/mutations": typeof _model_tournamentCompetitors_mutations;
  "_model/tournamentCompetitors/queries": typeof _model_tournamentCompetitors_queries;
  "_model/tournamentPairings/actions/generateDraftAdjacentPairings": typeof _model_tournamentPairings_actions_generateDraftAdjacentPairings;
  "_model/tournamentPairings/actions/generateDraftRandomPairings": typeof _model_tournamentPairings_actions_generateDraftRandomPairings;
  "_model/tournamentPairings/fields": typeof _model_tournamentPairings_fields;
  "_model/tournamentPairings/helpers/checkPairingIsValid": typeof _model_tournamentPairings_helpers_checkPairingIsValid;
  "_model/tournamentPairings/helpers/isValidOpponent": typeof _model_tournamentPairings_helpers_isValidOpponent;
  "_model/tournamentPairings/helpers/old/generateDraftPairings": typeof _model_tournamentPairings_helpers_old_generateDraftPairings;
  "_model/tournamentPairings/helpers/pairingTypes": typeof _model_tournamentPairings_helpers_pairingTypes;
  "_model/tournamentPairings/helpers/shuffle": typeof _model_tournamentPairings_helpers_shuffle;
  "_model/tournamentPairings/helpers/testHelpers": typeof _model_tournamentPairings_helpers_testHelpers;
  "_model/tournamentPairings/helpers": typeof _model_tournamentPairings_helpers;
  "_model/tournamentPairings/index": typeof _model_tournamentPairings_index;
  "_model/tournamentPairings/mutations/createTournamentPairings": typeof _model_tournamentPairings_mutations_createTournamentPairings;
  "_model/tournamentPairings/queries": typeof _model_tournamentPairings_queries;
  "_model/tournamentRankings/helpers/aggregateResults": typeof _model_tournamentRankings_helpers_aggregateResults;
  "_model/tournamentRankings/helpers/averageResults": typeof _model_tournamentRankings_helpers_averageResults;
  "_model/tournamentRankings/helpers/compareResults": typeof _model_tournamentRankings_helpers_compareResults;
  "_model/tournamentRankings/helpers/extendResults": typeof _model_tournamentRankings_helpers_extendResults;
  "_model/tournamentRankings/helpers/sumResults": typeof _model_tournamentRankings_helpers_sumResults;
  "_model/tournamentRankings/index": typeof _model_tournamentRankings_index;
  "_model/tournamentRankings/queries": typeof _model_tournamentRankings_queries;
  "_model/tournamentRankings/types": typeof _model_tournamentRankings_types;
  "_model/tournaments/actions/checkInPlayer": typeof _model_tournaments_actions_checkInPlayer;
  "_model/tournaments/actions/startTournament": typeof _model_tournaments_actions_startTournament;
  "_model/tournaments/fields": typeof _model_tournaments_fields;
  "_model/tournaments/helpers": typeof _model_tournaments_helpers;
  "_model/tournaments/index": typeof _model_tournaments_index;
  "_model/tournaments/mutations": typeof _model_tournaments_mutations;
  "_model/tournaments/queries": typeof _model_tournaments_queries;
  "auth/ResendOtpPasswordReset": typeof auth_ResendOtpPasswordReset;
  "auth/ResendOtpVerification": typeof auth_ResendOtpVerification;
  auth: typeof auth;
  "common/errors": typeof common_errors;
  "common/fowV4/fowV4GameSystemConfig": typeof common_fowV4_fowV4GameSystemConfig;
  "common/fowV4/fowV4MatchOutcomeType": typeof common_fowV4_fowV4MatchOutcomeType;
  "common/fowV4/fowV4MatchResultDetails": typeof common_fowV4_fowV4MatchResultDetails;
  "common/fowV4/getMission": typeof common_fowV4_getMission;
  "common/fowV4/getMissionPack": typeof common_fowV4_getMissionPack;
  "common/location": typeof common_location;
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
  "matchResults/fetchMatchResult": typeof matchResults_fetchMatchResult;
  "matchResults/fetchMatchResultList": typeof matchResults_fetchMatchResultList;
  "matchResults/index": typeof matchResults_index;
  "matchResults/mutations": typeof matchResults_mutations;
  "photos/index": typeof photos_index;
  "photos/mutations": typeof photos_mutations;
  "photos/queries": typeof photos_queries;
  "static/currencyCodes": typeof static_currencyCodes;
  "static/fowV4/dynamicPointsVersions": typeof static_fowV4_dynamicPointsVersions;
  "static/fowV4/eras": typeof static_fowV4_eras;
  "static/fowV4/factions": typeof static_fowV4_factions;
  "static/fowV4/fowV4BattlePlan": typeof static_fowV4_fowV4BattlePlan;
  "static/fowV4/fowV4RankingFactors": typeof static_fowV4_fowV4RankingFactors;
  "static/fowV4/lessonsFromTheFrontVersions": typeof static_fowV4_lessonsFromTheFrontVersions;
  "static/fowV4/missionPacks": typeof static_fowV4_missionPacks;
  "static/gameSystems": typeof static_gameSystems;
  "static/tournamentPairingMethods": typeof static_tournamentPairingMethods;
  tournamentCompetitors: typeof tournamentCompetitors;
  tournamentPairings: typeof tournamentPairings;
  tournamentRankings: typeof tournamentRankings;
  tournaments: typeof tournaments;
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
