/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _fixtures_fowV4_createMockFowV4MatchResultData from "../_fixtures/fowV4/createMockFowV4MatchResultData.js";
import type * as _model_common__helpers_checkAuth from "../_model/common/_helpers/checkAuth.js";
import type * as _model_common__helpers_clamp from "../_model/common/_helpers/clamp.js";
import type * as _model_common__helpers_filterWithSearchTerm from "../_model/common/_helpers/filterWithSearchTerm.js";
import type * as _model_common__helpers_getRange from "../_model/common/_helpers/getRange.js";
import type * as _model_common__helpers_getStaticEnumConvexValidator from "../_model/common/_helpers/getStaticEnumConvexValidator.js";
import type * as _model_common__helpers_getStorageUrl from "../_model/common/_helpers/getStorageUrl.js";
import type * as _model_common__helpers_intersectArrays from "../_model/common/_helpers/intersectArrays.js";
import type * as _model_common__helpers_notNullOrUndefined from "../_model/common/_helpers/notNullOrUndefined.js";
import type * as _model_files_index from "../_model/files/index.js";
import type * as _model_files_queries_getFileUrl from "../_model/files/queries/getFileUrl.js";
import type * as _model_fowV4_aggregateFowV4TournamentData from "../_model/fowV4/aggregateFowV4TournamentData.js";
import type * as _model_fowV4_calculateFowV4MatchResultScore from "../_model/fowV4/calculateFowV4MatchResultScore.js";
import type * as _model_fowV4_calculateFowV4TournamentRankings from "../_model/fowV4/calculateFowV4TournamentRankings.js";
import type * as _model_fowV4_createFowV4TournamentExtendedStatMap from "../_model/fowV4/createFowV4TournamentExtendedStatMap.js";
import type * as _model_fowV4_createTournamentCompetitorMetaMap from "../_model/fowV4/createTournamentCompetitorMetaMap.js";
import type * as _model_fowV4_divideFowV4BaseStats from "../_model/fowV4/divideFowV4BaseStats.js";
import type * as _model_fowV4_extractFowV4MatchResultBaseStats from "../_model/fowV4/extractFowV4MatchResultBaseStats.js";
import type * as _model_fowV4_flattenFowV4StatMap from "../_model/fowV4/flattenFowV4StatMap.js";
import type * as _model_fowV4_fowV4GameSystemConfig from "../_model/fowV4/fowV4GameSystemConfig.js";
import type * as _model_fowV4_fowV4ListData from "../_model/fowV4/fowV4ListData.js";
import type * as _model_fowV4_fowV4MatchResultDetails from "../_model/fowV4/fowV4MatchResultDetails.js";
import type * as _model_fowV4_sumFowV4BaseStats from "../_model/fowV4/sumFowV4BaseStats.js";
import type * as _model_fowV4_types from "../_model/fowV4/types.js";
import type * as _model_lists_fields from "../_model/lists/fields.js";
import type * as _model_lists_index from "../_model/lists/index.js";
import type * as _model_lists_mutations_importListData from "../_model/lists/mutations/importListData.js";
import type * as _model_matchResultComments__helpers_deepenMatchResultComment from "../_model/matchResultComments/_helpers/deepenMatchResultComment.js";
import type * as _model_matchResultComments_fields from "../_model/matchResultComments/fields.js";
import type * as _model_matchResultComments_index from "../_model/matchResultComments/index.js";
import type * as _model_matchResultComments_mutations_addMatchResultComment from "../_model/matchResultComments/mutations/addMatchResultComment.js";
import type * as _model_matchResultComments_queries_getMatchResultComment from "../_model/matchResultComments/queries/getMatchResultComment.js";
import type * as _model_matchResultComments_queries_getMatchResultCommentsByMatchResult from "../_model/matchResultComments/queries/getMatchResultCommentsByMatchResult.js";
import type * as _model_matchResultComments_queries_getMatchResultCommentsByUser from "../_model/matchResultComments/queries/getMatchResultCommentsByUser.js";
import type * as _model_matchResultLikes__helpers_deepenMatchResultLike from "../_model/matchResultLikes/_helpers/deepenMatchResultLike.js";
import type * as _model_matchResultLikes_fields from "../_model/matchResultLikes/fields.js";
import type * as _model_matchResultLikes_index from "../_model/matchResultLikes/index.js";
import type * as _model_matchResultLikes_mutations_toggleMatchResultLike from "../_model/matchResultLikes/mutations/toggleMatchResultLike.js";
import type * as _model_matchResultLikes_queries_getMatchResultLike from "../_model/matchResultLikes/queries/getMatchResultLike.js";
import type * as _model_matchResultLikes_queries_getMatchResultLikesByMatchResult from "../_model/matchResultLikes/queries/getMatchResultLikesByMatchResult.js";
import type * as _model_matchResultLikes_queries_getMatchResultLikesByUser from "../_model/matchResultLikes/queries/getMatchResultLikesByUser.js";
import type * as _model_matchResults__helpers_checkMatchResultAuth from "../_model/matchResults/_helpers/checkMatchResultAuth.js";
import type * as _model_matchResults__helpers_checkMatchResultBattlePlanVisibility from "../_model/matchResults/_helpers/checkMatchResultBattlePlanVisibility.js";
import type * as _model_matchResults__helpers_deepenMatchResult from "../_model/matchResults/_helpers/deepenMatchResult.js";
import type * as _model_matchResults__helpers_getShallowMatchResult from "../_model/matchResults/_helpers/getShallowMatchResult.js";
import type * as _model_matchResults_fields from "../_model/matchResults/fields.js";
import type * as _model_matchResults_index from "../_model/matchResults/index.js";
import type * as _model_matchResults_mutations_addPhotoToMatchResult from "../_model/matchResults/mutations/addPhotoToMatchResult.js";
import type * as _model_matchResults_mutations_createMatchResult from "../_model/matchResults/mutations/createMatchResult.js";
import type * as _model_matchResults_mutations_deleteMatchResult from "../_model/matchResults/mutations/deleteMatchResult.js";
import type * as _model_matchResults_mutations_updateMatchResult from "../_model/matchResults/mutations/updateMatchResult.js";
import type * as _model_matchResults_queries_getMatchResult from "../_model/matchResults/queries/getMatchResult.js";
import type * as _model_matchResults_queries_getMatchResults from "../_model/matchResults/queries/getMatchResults.js";
import type * as _model_matchResults_queries_getMatchResultsByTournament from "../_model/matchResults/queries/getMatchResultsByTournament.js";
import type * as _model_matchResults_queries_getMatchResultsByTournamentPairing from "../_model/matchResults/queries/getMatchResultsByTournamentPairing.js";
import type * as _model_matchResults_queries_getMatchResultsByTournamentRound from "../_model/matchResults/queries/getMatchResultsByTournamentRound.js";
import type * as _model_matchResults_queries_getMatchResultsByUser from "../_model/matchResults/queries/getMatchResultsByUser.js";
import type * as _model_tournamentCompetitors__helpers_deepenTournamentCompetitor from "../_model/tournamentCompetitors/_helpers/deepenTournamentCompetitor.js";
import type * as _model_tournamentCompetitors__helpers_sortTournamentCompetitorsByName from "../_model/tournamentCompetitors/_helpers/sortTournamentCompetitorsByName.js";
import type * as _model_tournamentCompetitors_fields from "../_model/tournamentCompetitors/fields.js";
import type * as _model_tournamentCompetitors_index from "../_model/tournamentCompetitors/index.js";
import type * as _model_tournamentCompetitors_mutations_addTournamentCompetitorPlayer from "../_model/tournamentCompetitors/mutations/addTournamentCompetitorPlayer.js";
import type * as _model_tournamentCompetitors_mutations_createTournamentCompetitor from "../_model/tournamentCompetitors/mutations/createTournamentCompetitor.js";
import type * as _model_tournamentCompetitors_mutations_deleteTournamentCompetitor from "../_model/tournamentCompetitors/mutations/deleteTournamentCompetitor.js";
import type * as _model_tournamentCompetitors_mutations_removeTournamentCompetitorPlayer from "../_model/tournamentCompetitors/mutations/removeTournamentCompetitorPlayer.js";
import type * as _model_tournamentCompetitors_mutations_toggleTournamentCompetitorActive from "../_model/tournamentCompetitors/mutations/toggleTournamentCompetitorActive.js";
import type * as _model_tournamentCompetitors_mutations_updateTournamentCompetitor from "../_model/tournamentCompetitors/mutations/updateTournamentCompetitor.js";
import type * as _model_tournamentCompetitors_queries_getTournamentCompetitor from "../_model/tournamentCompetitors/queries/getTournamentCompetitor.js";
import type * as _model_tournamentCompetitors_queries_getTournamentCompetitors from "../_model/tournamentCompetitors/queries/getTournamentCompetitors.js";
import type * as _model_tournamentCompetitors_queries_getTournamentCompetitorsByTournament from "../_model/tournamentCompetitors/queries/getTournamentCompetitorsByTournament.js";
import type * as _model_tournamentPairings__helpers_assignBye from "../_model/tournamentPairings/_helpers/assignBye.js";
import type * as _model_tournamentPairings__helpers_deepenTournamentPairing from "../_model/tournamentPairings/_helpers/deepenTournamentPairing.js";
import type * as _model_tournamentPairings__helpers_generateDraftPairings from "../_model/tournamentPairings/_helpers/generateDraftPairings.js";
import type * as _model_tournamentPairings__helpers_getTournamentPairingDeep from "../_model/tournamentPairings/_helpers/getTournamentPairingDeep.js";
import type * as _model_tournamentPairings__helpers_getTournamentPairingShallow from "../_model/tournamentPairings/_helpers/getTournamentPairingShallow.js";
import type * as _model_tournamentPairings__helpers_shuffle from "../_model/tournamentPairings/_helpers/shuffle.js";
import type * as _model_tournamentPairings__helpers_sortByRank from "../_model/tournamentPairings/_helpers/sortByRank.js";
import type * as _model_tournamentPairings__helpers_sortCompetitorPairs from "../_model/tournamentPairings/_helpers/sortCompetitorPairs.js";
import type * as _model_tournamentPairings__helpers_sortPairingsByTable from "../_model/tournamentPairings/_helpers/sortPairingsByTable.js";
import type * as _model_tournamentPairings_fields from "../_model/tournamentPairings/fields.js";
import type * as _model_tournamentPairings_index from "../_model/tournamentPairings/index.js";
import type * as _model_tournamentPairings_mutations_createTournamentPairings from "../_model/tournamentPairings/mutations/createTournamentPairings.js";
import type * as _model_tournamentPairings_queries_getActiveTournamentPairingsByUser from "../_model/tournamentPairings/queries/getActiveTournamentPairingsByUser.js";
import type * as _model_tournamentPairings_queries_getDraftTournamentPairings from "../_model/tournamentPairings/queries/getDraftTournamentPairings.js";
import type * as _model_tournamentPairings_queries_getTournamentPairing from "../_model/tournamentPairings/queries/getTournamentPairing.js";
import type * as _model_tournamentPairings_queries_getTournamentPairings from "../_model/tournamentPairings/queries/getTournamentPairings.js";
import type * as _model_tournamentPairings_queries_getTournamentPairingsByTournament from "../_model/tournamentPairings/queries/getTournamentPairingsByTournament.js";
import type * as _model_tournamentTimers__helpers_convertRoundStructureToMs from "../_model/tournamentTimers/_helpers/convertRoundStructureToMs.js";
import type * as _model_tournamentTimers__helpers_deepenTournamentTimer from "../_model/tournamentTimers/_helpers/deepenTournamentTimer.js";
import type * as _model_tournamentTimers__helpers_getTournamentTimerShallow from "../_model/tournamentTimers/_helpers/getTournamentTimerShallow.js";
import type * as _model_tournamentTimers_fields from "../_model/tournamentTimers/fields.js";
import type * as _model_tournamentTimers_index from "../_model/tournamentTimers/index.js";
import type * as _model_tournamentTimers_mutations_createTournamentTimer from "../_model/tournamentTimers/mutations/createTournamentTimer.js";
import type * as _model_tournamentTimers_mutations_deleteTournamentTimerByTournament from "../_model/tournamentTimers/mutations/deleteTournamentTimerByTournament.js";
import type * as _model_tournamentTimers_mutations_resetTournamentTimer from "../_model/tournamentTimers/mutations/resetTournamentTimer.js";
import type * as _model_tournamentTimers_mutations_setTournamentTimerPhase from "../_model/tournamentTimers/mutations/setTournamentTimerPhase.js";
import type * as _model_tournamentTimers_mutations_toggleTournamentTimer from "../_model/tournamentTimers/mutations/toggleTournamentTimer.js";
import type * as _model_tournamentTimers_queries_getTournamentTimer from "../_model/tournamentTimers/queries/getTournamentTimer.js";
import type * as _model_tournamentTimers_queries_getTournamentTimerByTournament from "../_model/tournamentTimers/queries/getTournamentTimerByTournament.js";
import type * as _model_tournaments__helpers_checkTournamentAuth from "../_model/tournaments/_helpers/checkTournamentAuth.js";
import type * as _model_tournaments__helpers_checkTournamentVisibility from "../_model/tournaments/_helpers/checkTournamentVisibility.js";
import type * as _model_tournaments__helpers_deepenTournament from "../_model/tournaments/_helpers/deepenTournament.js";
import type * as _model_tournaments__helpers_getTournamentDeep from "../_model/tournaments/_helpers/getTournamentDeep.js";
import type * as _model_tournaments__helpers_getTournamentNextRound from "../_model/tournaments/_helpers/getTournamentNextRound.js";
import type * as _model_tournaments__helpers_getTournamentPlayerUserIds from "../_model/tournaments/_helpers/getTournamentPlayerUserIds.js";
import type * as _model_tournaments__helpers_getTournamentShallow from "../_model/tournaments/_helpers/getTournamentShallow.js";
import type * as _model_tournaments__helpers_getTournamentUserIds from "../_model/tournaments/_helpers/getTournamentUserIds.js";
import type * as _model_tournaments_fields from "../_model/tournaments/fields.js";
import type * as _model_tournaments_index from "../_model/tournaments/index.js";
import type * as _model_tournaments_mutations_createTournament from "../_model/tournaments/mutations/createTournament.js";
import type * as _model_tournaments_mutations_deleteTournament from "../_model/tournaments/mutations/deleteTournament.js";
import type * as _model_tournaments_mutations_endTournament from "../_model/tournaments/mutations/endTournament.js";
import type * as _model_tournaments_mutations_endTournamentRound from "../_model/tournaments/mutations/endTournamentRound.js";
import type * as _model_tournaments_mutations_publishTournament from "../_model/tournaments/mutations/publishTournament.js";
import type * as _model_tournaments_mutations_startTournament from "../_model/tournaments/mutations/startTournament.js";
import type * as _model_tournaments_mutations_startTournamentRound from "../_model/tournaments/mutations/startTournamentRound.js";
import type * as _model_tournaments_mutations_updateTournament from "../_model/tournaments/mutations/updateTournament.js";
import type * as _model_tournaments_queries_getAvailableTournamentActions from "../_model/tournaments/queries/getAvailableTournamentActions.js";
import type * as _model_tournaments_queries_getTournament from "../_model/tournaments/queries/getTournament.js";
import type * as _model_tournaments_queries_getTournamentOpenRound from "../_model/tournaments/queries/getTournamentOpenRound.js";
import type * as _model_tournaments_queries_getTournamentRankings from "../_model/tournaments/queries/getTournamentRankings.js";
import type * as _model_tournaments_queries_getTournaments from "../_model/tournaments/queries/getTournaments.js";
import type * as _model_tournaments_queries_getTournamentsByStatus from "../_model/tournaments/queries/getTournamentsByStatus.js";
import type * as _model_tournaments_queries_getTournamentsByUser from "../_model/tournaments/queries/getTournamentsByUser.js";
import type * as _model_userPreferences_fields from "../_model/userPreferences/fields.js";
import type * as _model_userPreferences_index from "../_model/userPreferences/index.js";
import type * as _model_userPreferences_mutations from "../_model/userPreferences/mutations.js";
import type * as _model_userPreferences_queries from "../_model/userPreferences/queries.js";
import type * as _model_users__helpers_checkUserAuth from "../_model/users/_helpers/checkUserAuth.js";
import type * as _model_users__helpers_checkUserRelationshipLevel from "../_model/users/_helpers/checkUserRelationshipLevel.js";
import type * as _model_users__helpers_checkUserTournamentRelationship from "../_model/users/_helpers/checkUserTournamentRelationship.js";
import type * as _model_users__helpers_compareVisibilityLevels from "../_model/users/_helpers/compareVisibilityLevels.js";
import type * as _model_users__helpers_formatUserRealName from "../_model/users/_helpers/formatUserRealName.js";
import type * as _model_users__helpers_getShallowUser from "../_model/users/_helpers/getShallowUser.js";
import type * as _model_users__helpers_redactUser from "../_model/users/_helpers/redactUser.js";
import type * as _model_users_actions_setUserDefaultAvatar from "../_model/users/actions/setUserDefaultAvatar.js";
import type * as _model_users_fields from "../_model/users/fields.js";
import type * as _model_users_index from "../_model/users/index.js";
import type * as _model_users_mutations_updateUser from "../_model/users/mutations/updateUser.js";
import type * as _model_users_mutations_updateUserAvatarNoAuth from "../_model/users/mutations/updateUserAvatarNoAuth.js";
import type * as _model_users_queries_getCurrentUser from "../_model/users/queries/getCurrentUser.js";
import type * as _model_users_queries_getUser from "../_model/users/queries/getUser.js";
import type * as _model_users_queries_getUsers from "../_model/users/queries/getUsers.js";
import type * as _model_utils__helpers_mockData from "../_model/utils/_helpers/mockData.js";
import type * as _model_utils__helpers_testUsers from "../_model/utils/_helpers/testUsers.js";
import type * as _model_utils_createTestTournament from "../_model/utils/createTestTournament.js";
import type * as _model_utils_createTestTournamentMatchResults from "../_model/utils/createTestTournamentMatchResults.js";
import type * as _model_utils_deleteTestTournament from "../_model/utils/deleteTestTournament.js";
import type * as _model_utils_index from "../_model/utils/index.js";
import type * as _model_utils_mergeUser from "../_model/utils/mergeUser.js";
import type * as auth_ResendOtpPasswordReset from "../auth/ResendOtpPasswordReset.js";
import type * as auth_ResendOtpVerification from "../auth/ResendOtpVerification.js";
import type * as auth from "../auth.js";
import type * as common_errors from "../common/errors.js";
import type * as common_location from "../common/location.js";
import type * as common_tournamentStatus from "../common/tournamentStatus.js";
import type * as common_userDataVisibilityLevel from "../common/userDataVisibilityLevel.js";
import type * as crons from "../crons.js";
import type * as files from "../files.js";
import type * as friendships_confirmFriendship from "../friendships/confirmFriendship.js";
import type * as friendships_createFriendship from "../friendships/createFriendship.js";
import type * as friendships_deleteFriendship from "../friendships/deleteFriendship.js";
import type * as friendships_fetchFriendship from "../friendships/fetchFriendship.js";
import type * as friendships_fetchFriendshipRequests from "../friendships/fetchFriendshipRequests.js";
import type * as friendships_fetchFriendshipUserIdsByUserId from "../friendships/fetchFriendshipUserIdsByUserId.js";
import type * as friendships_index from "../friendships/index.js";
import type * as generateFileUploadUrl from "../generateFileUploadUrl.js";
import type * as http from "../http.js";
import type * as lists from "../lists.js";
import type * as matchResultComments from "../matchResultComments.js";
import type * as matchResultLikes from "../matchResultLikes.js";
import type * as matchResults from "../matchResults.js";
import type * as photos_index from "../photos/index.js";
import type * as photos_mutations from "../photos/mutations.js";
import type * as photos_queries from "../photos/queries.js";
import type * as scheduledTasks from "../scheduledTasks.js";
import type * as static_themes from "../static/themes.js";
import type * as tournamentCompetitors from "../tournamentCompetitors.js";
import type * as tournamentPairings from "../tournamentPairings.js";
import type * as tournamentTimers from "../tournamentTimers.js";
import type * as tournaments from "../tournaments.js";
import type * as userPreferences from "../userPreferences.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "_fixtures/fowV4/createMockFowV4MatchResultData": typeof _fixtures_fowV4_createMockFowV4MatchResultData;
  "_model/common/_helpers/checkAuth": typeof _model_common__helpers_checkAuth;
  "_model/common/_helpers/clamp": typeof _model_common__helpers_clamp;
  "_model/common/_helpers/filterWithSearchTerm": typeof _model_common__helpers_filterWithSearchTerm;
  "_model/common/_helpers/getRange": typeof _model_common__helpers_getRange;
  "_model/common/_helpers/getStaticEnumConvexValidator": typeof _model_common__helpers_getStaticEnumConvexValidator;
  "_model/common/_helpers/getStorageUrl": typeof _model_common__helpers_getStorageUrl;
  "_model/common/_helpers/intersectArrays": typeof _model_common__helpers_intersectArrays;
  "_model/common/_helpers/notNullOrUndefined": typeof _model_common__helpers_notNullOrUndefined;
  "_model/files/index": typeof _model_files_index;
  "_model/files/queries/getFileUrl": typeof _model_files_queries_getFileUrl;
  "_model/fowV4/aggregateFowV4TournamentData": typeof _model_fowV4_aggregateFowV4TournamentData;
  "_model/fowV4/calculateFowV4MatchResultScore": typeof _model_fowV4_calculateFowV4MatchResultScore;
  "_model/fowV4/calculateFowV4TournamentRankings": typeof _model_fowV4_calculateFowV4TournamentRankings;
  "_model/fowV4/createFowV4TournamentExtendedStatMap": typeof _model_fowV4_createFowV4TournamentExtendedStatMap;
  "_model/fowV4/createTournamentCompetitorMetaMap": typeof _model_fowV4_createTournamentCompetitorMetaMap;
  "_model/fowV4/divideFowV4BaseStats": typeof _model_fowV4_divideFowV4BaseStats;
  "_model/fowV4/extractFowV4MatchResultBaseStats": typeof _model_fowV4_extractFowV4MatchResultBaseStats;
  "_model/fowV4/flattenFowV4StatMap": typeof _model_fowV4_flattenFowV4StatMap;
  "_model/fowV4/fowV4GameSystemConfig": typeof _model_fowV4_fowV4GameSystemConfig;
  "_model/fowV4/fowV4ListData": typeof _model_fowV4_fowV4ListData;
  "_model/fowV4/fowV4MatchResultDetails": typeof _model_fowV4_fowV4MatchResultDetails;
  "_model/fowV4/sumFowV4BaseStats": typeof _model_fowV4_sumFowV4BaseStats;
  "_model/fowV4/types": typeof _model_fowV4_types;
  "_model/lists/fields": typeof _model_lists_fields;
  "_model/lists/index": typeof _model_lists_index;
  "_model/lists/mutations/importListData": typeof _model_lists_mutations_importListData;
  "_model/matchResultComments/_helpers/deepenMatchResultComment": typeof _model_matchResultComments__helpers_deepenMatchResultComment;
  "_model/matchResultComments/fields": typeof _model_matchResultComments_fields;
  "_model/matchResultComments/index": typeof _model_matchResultComments_index;
  "_model/matchResultComments/mutations/addMatchResultComment": typeof _model_matchResultComments_mutations_addMatchResultComment;
  "_model/matchResultComments/queries/getMatchResultComment": typeof _model_matchResultComments_queries_getMatchResultComment;
  "_model/matchResultComments/queries/getMatchResultCommentsByMatchResult": typeof _model_matchResultComments_queries_getMatchResultCommentsByMatchResult;
  "_model/matchResultComments/queries/getMatchResultCommentsByUser": typeof _model_matchResultComments_queries_getMatchResultCommentsByUser;
  "_model/matchResultLikes/_helpers/deepenMatchResultLike": typeof _model_matchResultLikes__helpers_deepenMatchResultLike;
  "_model/matchResultLikes/fields": typeof _model_matchResultLikes_fields;
  "_model/matchResultLikes/index": typeof _model_matchResultLikes_index;
  "_model/matchResultLikes/mutations/toggleMatchResultLike": typeof _model_matchResultLikes_mutations_toggleMatchResultLike;
  "_model/matchResultLikes/queries/getMatchResultLike": typeof _model_matchResultLikes_queries_getMatchResultLike;
  "_model/matchResultLikes/queries/getMatchResultLikesByMatchResult": typeof _model_matchResultLikes_queries_getMatchResultLikesByMatchResult;
  "_model/matchResultLikes/queries/getMatchResultLikesByUser": typeof _model_matchResultLikes_queries_getMatchResultLikesByUser;
  "_model/matchResults/_helpers/checkMatchResultAuth": typeof _model_matchResults__helpers_checkMatchResultAuth;
  "_model/matchResults/_helpers/checkMatchResultBattlePlanVisibility": typeof _model_matchResults__helpers_checkMatchResultBattlePlanVisibility;
  "_model/matchResults/_helpers/deepenMatchResult": typeof _model_matchResults__helpers_deepenMatchResult;
  "_model/matchResults/_helpers/getShallowMatchResult": typeof _model_matchResults__helpers_getShallowMatchResult;
  "_model/matchResults/fields": typeof _model_matchResults_fields;
  "_model/matchResults/index": typeof _model_matchResults_index;
  "_model/matchResults/mutations/addPhotoToMatchResult": typeof _model_matchResults_mutations_addPhotoToMatchResult;
  "_model/matchResults/mutations/createMatchResult": typeof _model_matchResults_mutations_createMatchResult;
  "_model/matchResults/mutations/deleteMatchResult": typeof _model_matchResults_mutations_deleteMatchResult;
  "_model/matchResults/mutations/updateMatchResult": typeof _model_matchResults_mutations_updateMatchResult;
  "_model/matchResults/queries/getMatchResult": typeof _model_matchResults_queries_getMatchResult;
  "_model/matchResults/queries/getMatchResults": typeof _model_matchResults_queries_getMatchResults;
  "_model/matchResults/queries/getMatchResultsByTournament": typeof _model_matchResults_queries_getMatchResultsByTournament;
  "_model/matchResults/queries/getMatchResultsByTournamentPairing": typeof _model_matchResults_queries_getMatchResultsByTournamentPairing;
  "_model/matchResults/queries/getMatchResultsByTournamentRound": typeof _model_matchResults_queries_getMatchResultsByTournamentRound;
  "_model/matchResults/queries/getMatchResultsByUser": typeof _model_matchResults_queries_getMatchResultsByUser;
  "_model/tournamentCompetitors/_helpers/deepenTournamentCompetitor": typeof _model_tournamentCompetitors__helpers_deepenTournamentCompetitor;
  "_model/tournamentCompetitors/_helpers/sortTournamentCompetitorsByName": typeof _model_tournamentCompetitors__helpers_sortTournamentCompetitorsByName;
  "_model/tournamentCompetitors/fields": typeof _model_tournamentCompetitors_fields;
  "_model/tournamentCompetitors/index": typeof _model_tournamentCompetitors_index;
  "_model/tournamentCompetitors/mutations/addTournamentCompetitorPlayer": typeof _model_tournamentCompetitors_mutations_addTournamentCompetitorPlayer;
  "_model/tournamentCompetitors/mutations/createTournamentCompetitor": typeof _model_tournamentCompetitors_mutations_createTournamentCompetitor;
  "_model/tournamentCompetitors/mutations/deleteTournamentCompetitor": typeof _model_tournamentCompetitors_mutations_deleteTournamentCompetitor;
  "_model/tournamentCompetitors/mutations/removeTournamentCompetitorPlayer": typeof _model_tournamentCompetitors_mutations_removeTournamentCompetitorPlayer;
  "_model/tournamentCompetitors/mutations/toggleTournamentCompetitorActive": typeof _model_tournamentCompetitors_mutations_toggleTournamentCompetitorActive;
  "_model/tournamentCompetitors/mutations/updateTournamentCompetitor": typeof _model_tournamentCompetitors_mutations_updateTournamentCompetitor;
  "_model/tournamentCompetitors/queries/getTournamentCompetitor": typeof _model_tournamentCompetitors_queries_getTournamentCompetitor;
  "_model/tournamentCompetitors/queries/getTournamentCompetitors": typeof _model_tournamentCompetitors_queries_getTournamentCompetitors;
  "_model/tournamentCompetitors/queries/getTournamentCompetitorsByTournament": typeof _model_tournamentCompetitors_queries_getTournamentCompetitorsByTournament;
  "_model/tournamentPairings/_helpers/assignBye": typeof _model_tournamentPairings__helpers_assignBye;
  "_model/tournamentPairings/_helpers/deepenTournamentPairing": typeof _model_tournamentPairings__helpers_deepenTournamentPairing;
  "_model/tournamentPairings/_helpers/generateDraftPairings": typeof _model_tournamentPairings__helpers_generateDraftPairings;
  "_model/tournamentPairings/_helpers/getTournamentPairingDeep": typeof _model_tournamentPairings__helpers_getTournamentPairingDeep;
  "_model/tournamentPairings/_helpers/getTournamentPairingShallow": typeof _model_tournamentPairings__helpers_getTournamentPairingShallow;
  "_model/tournamentPairings/_helpers/shuffle": typeof _model_tournamentPairings__helpers_shuffle;
  "_model/tournamentPairings/_helpers/sortByRank": typeof _model_tournamentPairings__helpers_sortByRank;
  "_model/tournamentPairings/_helpers/sortCompetitorPairs": typeof _model_tournamentPairings__helpers_sortCompetitorPairs;
  "_model/tournamentPairings/_helpers/sortPairingsByTable": typeof _model_tournamentPairings__helpers_sortPairingsByTable;
  "_model/tournamentPairings/fields": typeof _model_tournamentPairings_fields;
  "_model/tournamentPairings/index": typeof _model_tournamentPairings_index;
  "_model/tournamentPairings/mutations/createTournamentPairings": typeof _model_tournamentPairings_mutations_createTournamentPairings;
  "_model/tournamentPairings/queries/getActiveTournamentPairingsByUser": typeof _model_tournamentPairings_queries_getActiveTournamentPairingsByUser;
  "_model/tournamentPairings/queries/getDraftTournamentPairings": typeof _model_tournamentPairings_queries_getDraftTournamentPairings;
  "_model/tournamentPairings/queries/getTournamentPairing": typeof _model_tournamentPairings_queries_getTournamentPairing;
  "_model/tournamentPairings/queries/getTournamentPairings": typeof _model_tournamentPairings_queries_getTournamentPairings;
  "_model/tournamentPairings/queries/getTournamentPairingsByTournament": typeof _model_tournamentPairings_queries_getTournamentPairingsByTournament;
  "_model/tournamentTimers/_helpers/convertRoundStructureToMs": typeof _model_tournamentTimers__helpers_convertRoundStructureToMs;
  "_model/tournamentTimers/_helpers/deepenTournamentTimer": typeof _model_tournamentTimers__helpers_deepenTournamentTimer;
  "_model/tournamentTimers/_helpers/getTournamentTimerShallow": typeof _model_tournamentTimers__helpers_getTournamentTimerShallow;
  "_model/tournamentTimers/fields": typeof _model_tournamentTimers_fields;
  "_model/tournamentTimers/index": typeof _model_tournamentTimers_index;
  "_model/tournamentTimers/mutations/createTournamentTimer": typeof _model_tournamentTimers_mutations_createTournamentTimer;
  "_model/tournamentTimers/mutations/deleteTournamentTimerByTournament": typeof _model_tournamentTimers_mutations_deleteTournamentTimerByTournament;
  "_model/tournamentTimers/mutations/resetTournamentTimer": typeof _model_tournamentTimers_mutations_resetTournamentTimer;
  "_model/tournamentTimers/mutations/setTournamentTimerPhase": typeof _model_tournamentTimers_mutations_setTournamentTimerPhase;
  "_model/tournamentTimers/mutations/toggleTournamentTimer": typeof _model_tournamentTimers_mutations_toggleTournamentTimer;
  "_model/tournamentTimers/queries/getTournamentTimer": typeof _model_tournamentTimers_queries_getTournamentTimer;
  "_model/tournamentTimers/queries/getTournamentTimerByTournament": typeof _model_tournamentTimers_queries_getTournamentTimerByTournament;
  "_model/tournaments/_helpers/checkTournamentAuth": typeof _model_tournaments__helpers_checkTournamentAuth;
  "_model/tournaments/_helpers/checkTournamentVisibility": typeof _model_tournaments__helpers_checkTournamentVisibility;
  "_model/tournaments/_helpers/deepenTournament": typeof _model_tournaments__helpers_deepenTournament;
  "_model/tournaments/_helpers/getTournamentDeep": typeof _model_tournaments__helpers_getTournamentDeep;
  "_model/tournaments/_helpers/getTournamentNextRound": typeof _model_tournaments__helpers_getTournamentNextRound;
  "_model/tournaments/_helpers/getTournamentPlayerUserIds": typeof _model_tournaments__helpers_getTournamentPlayerUserIds;
  "_model/tournaments/_helpers/getTournamentShallow": typeof _model_tournaments__helpers_getTournamentShallow;
  "_model/tournaments/_helpers/getTournamentUserIds": typeof _model_tournaments__helpers_getTournamentUserIds;
  "_model/tournaments/fields": typeof _model_tournaments_fields;
  "_model/tournaments/index": typeof _model_tournaments_index;
  "_model/tournaments/mutations/createTournament": typeof _model_tournaments_mutations_createTournament;
  "_model/tournaments/mutations/deleteTournament": typeof _model_tournaments_mutations_deleteTournament;
  "_model/tournaments/mutations/endTournament": typeof _model_tournaments_mutations_endTournament;
  "_model/tournaments/mutations/endTournamentRound": typeof _model_tournaments_mutations_endTournamentRound;
  "_model/tournaments/mutations/publishTournament": typeof _model_tournaments_mutations_publishTournament;
  "_model/tournaments/mutations/startTournament": typeof _model_tournaments_mutations_startTournament;
  "_model/tournaments/mutations/startTournamentRound": typeof _model_tournaments_mutations_startTournamentRound;
  "_model/tournaments/mutations/updateTournament": typeof _model_tournaments_mutations_updateTournament;
  "_model/tournaments/queries/getAvailableTournamentActions": typeof _model_tournaments_queries_getAvailableTournamentActions;
  "_model/tournaments/queries/getTournament": typeof _model_tournaments_queries_getTournament;
  "_model/tournaments/queries/getTournamentOpenRound": typeof _model_tournaments_queries_getTournamentOpenRound;
  "_model/tournaments/queries/getTournamentRankings": typeof _model_tournaments_queries_getTournamentRankings;
  "_model/tournaments/queries/getTournaments": typeof _model_tournaments_queries_getTournaments;
  "_model/tournaments/queries/getTournamentsByStatus": typeof _model_tournaments_queries_getTournamentsByStatus;
  "_model/tournaments/queries/getTournamentsByUser": typeof _model_tournaments_queries_getTournamentsByUser;
  "_model/userPreferences/fields": typeof _model_userPreferences_fields;
  "_model/userPreferences/index": typeof _model_userPreferences_index;
  "_model/userPreferences/mutations": typeof _model_userPreferences_mutations;
  "_model/userPreferences/queries": typeof _model_userPreferences_queries;
  "_model/users/_helpers/checkUserAuth": typeof _model_users__helpers_checkUserAuth;
  "_model/users/_helpers/checkUserRelationshipLevel": typeof _model_users__helpers_checkUserRelationshipLevel;
  "_model/users/_helpers/checkUserTournamentRelationship": typeof _model_users__helpers_checkUserTournamentRelationship;
  "_model/users/_helpers/compareVisibilityLevels": typeof _model_users__helpers_compareVisibilityLevels;
  "_model/users/_helpers/formatUserRealName": typeof _model_users__helpers_formatUserRealName;
  "_model/users/_helpers/getShallowUser": typeof _model_users__helpers_getShallowUser;
  "_model/users/_helpers/redactUser": typeof _model_users__helpers_redactUser;
  "_model/users/actions/setUserDefaultAvatar": typeof _model_users_actions_setUserDefaultAvatar;
  "_model/users/fields": typeof _model_users_fields;
  "_model/users/index": typeof _model_users_index;
  "_model/users/mutations/updateUser": typeof _model_users_mutations_updateUser;
  "_model/users/mutations/updateUserAvatarNoAuth": typeof _model_users_mutations_updateUserAvatarNoAuth;
  "_model/users/queries/getCurrentUser": typeof _model_users_queries_getCurrentUser;
  "_model/users/queries/getUser": typeof _model_users_queries_getUser;
  "_model/users/queries/getUsers": typeof _model_users_queries_getUsers;
  "_model/utils/_helpers/mockData": typeof _model_utils__helpers_mockData;
  "_model/utils/_helpers/testUsers": typeof _model_utils__helpers_testUsers;
  "_model/utils/createTestTournament": typeof _model_utils_createTestTournament;
  "_model/utils/createTestTournamentMatchResults": typeof _model_utils_createTestTournamentMatchResults;
  "_model/utils/deleteTestTournament": typeof _model_utils_deleteTestTournament;
  "_model/utils/index": typeof _model_utils_index;
  "_model/utils/mergeUser": typeof _model_utils_mergeUser;
  "auth/ResendOtpPasswordReset": typeof auth_ResendOtpPasswordReset;
  "auth/ResendOtpVerification": typeof auth_ResendOtpVerification;
  auth: typeof auth;
  "common/errors": typeof common_errors;
  "common/location": typeof common_location;
  "common/tournamentStatus": typeof common_tournamentStatus;
  "common/userDataVisibilityLevel": typeof common_userDataVisibilityLevel;
  crons: typeof crons;
  files: typeof files;
  "friendships/confirmFriendship": typeof friendships_confirmFriendship;
  "friendships/createFriendship": typeof friendships_createFriendship;
  "friendships/deleteFriendship": typeof friendships_deleteFriendship;
  "friendships/fetchFriendship": typeof friendships_fetchFriendship;
  "friendships/fetchFriendshipRequests": typeof friendships_fetchFriendshipRequests;
  "friendships/fetchFriendshipUserIdsByUserId": typeof friendships_fetchFriendshipUserIdsByUserId;
  "friendships/index": typeof friendships_index;
  generateFileUploadUrl: typeof generateFileUploadUrl;
  http: typeof http;
  lists: typeof lists;
  matchResultComments: typeof matchResultComments;
  matchResultLikes: typeof matchResultLikes;
  matchResults: typeof matchResults;
  "photos/index": typeof photos_index;
  "photos/mutations": typeof photos_mutations;
  "photos/queries": typeof photos_queries;
  scheduledTasks: typeof scheduledTasks;
  "static/themes": typeof static_themes;
  tournamentCompetitors: typeof tournamentCompetitors;
  tournamentPairings: typeof tournamentPairings;
  tournamentTimers: typeof tournamentTimers;
  tournaments: typeof tournaments;
  userPreferences: typeof userPreferences;
  users: typeof users;
  utils: typeof utils;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  migrations: {
    lib: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
      cancelAll: FunctionReference<
        "mutation",
        "internal",
        { sinceTs?: number },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { limit?: number; names?: Array<string> },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      migrate: FunctionReference<
        "mutation",
        "internal",
        {
          batchSize?: number;
          cursor?: string | null;
          dryRun: boolean;
          fnHandle: string;
          name: string;
          next?: Array<{ fnHandle: string; name: string }>;
        },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
    };
  };
};
