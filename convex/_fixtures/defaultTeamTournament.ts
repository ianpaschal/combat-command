import { Doc } from '../_generated/dataModel';

export const defaultTeamTournament: Omit<Doc<'tournaments'>, '_id'|'_creationTime'|'organizerUserIds'|'status'> = {
  competitorSize: 3,
  description: 'An basic Flames of War tournament.',
  endsAt: '2025-01-01T00:00:00',
  gameSystemConfig: {
    eraId: 'lw',
    lessonsFromTheFrontVersionId: '',
    missionMatrixId: '',
    missionPackId: '',
    points: 100,
  },
  gameSystemId: 'flames_of_war_v4',
  location: {
    name: 'Local Venue',
    placeFormatted: 'Gaming District, Hometown, USA',
    timeZone: '',
    countryCode: 'us',
    coordinates: { lat: 0, lon: 0 },
  },
  maxCompetitors: 8,
  pairingMethod: 'swiss',
  rankingFactors: ['total_wins', 'total_points', 'total_units_destroyed'],
  registrationClosesAt: '2025-01-01T00:00:00',
  requireRealNames: false,
  roundCount: 3,
  roundStructure: {
    pairingTime: 0,
    setUpTime: 30,
    playingTime: 120,
  },
  rulesPackUrl: 'http://www.tournament.net/rules',
  startsAt: '2025-01-01T00:00:00',
  title: 'Basic Singles Tournament',
  useNationalTeams: false,
};
