import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import { Modal } from '~/components/generic/Dialog';
import { PageWrapper } from '~/components/PageWrapper';
import { Tournament } from '~/types/Tournament';
import { TournamentRegistration } from '~/types/TournamentRegistration';

export const TournamentDetailPage = (): JSX.Element => {

  const { id } = useParams();

  const tournament: Tournament = {
    registration_open: true,
    match_results_open: true,
    title: 'ETC 2024',
    round_count: 6,
    active_round_index: 1,
    id: '',
    created_at: '',
    modified_at: '',
    visibility: 'hidden',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    team_size_limit: null,
    game_system_id: '',
    organizer_ids: [],
  };

  const registrations: TournamentRegistration[] = [];

  console.log(id);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isMatchResultModalOpen, setIsMatchResultModalOpen] = useState<boolean>(false);

  return (
    <PageWrapper title={tournament.title}>
      Tournament Detail

      <div>
        {tournament.registration_open && (
          <>
            <button onClick={() => setIsRegisterModalOpen(!isRegisterModalOpen)}>
              Register
            </button>
            <Modal open={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}>
              Hello world
            </Modal>
          </>
        )}
        {tournament.match_results_open && (
          <>
            <button onClick={() => setIsMatchResultModalOpen(!isMatchResultModalOpen)}>
              Submit Match Result
            </button>
            <Modal
              open={isMatchResultModalOpen}
              onClose={() => setIsMatchResultModalOpen(false)}
            >
              <h2>Submit Match Result</h2>
              <FowV4MatchResultForm tournamentId="659ab3ec-1de5-4b34-a7ea-e9f052c669b4" />
            </Modal>
          </>
        )}
      </div>

      <div>
        <button onClick={() => { }}>
          Close Registration
        </button>
        <button onClick={() => { }}>
          Open Match Result Submission
        </button>
        <button onClick={() => { }}>
          Create Pairings
        </button>
      </div>

    </PageWrapper>
  );
};