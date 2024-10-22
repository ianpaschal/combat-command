import { useNavigate, useParams } from 'react-router-dom';
import { Pencil } from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { PageWrapper } from '~/components/PageWrapper';
import { UserProfileRecord } from '~/types/UserProfile';
import { getUserDisplayName } from '~/utils/getUserDisplayName';

export const UserProfilePage = (): JSX.Element => {
  const navigate = useNavigate();
  const id = useParams().id!;
  const userProfile: UserProfileRecord = {
    id,
    created_at: new Date().toISOString(),
    username: 'Foober',
    country_code: 'NL',
    avatar_url: null,
    name_visibility: 'hidden',
  };
  const displayName = getUserDisplayName(userProfile);
  return (
    <PageWrapper>
      <Card>
        <Avatar />
        {displayName}

        Game Systems
        matches played
        tournaments

        Badges

        Clubs

        Ranking
        <Button onClick={() => navigate(`/profiles/${userProfile.id}/edit`)}>
          <Pencil /> Edit
        </Button>
      </Card>
    </PageWrapper>
  );
};