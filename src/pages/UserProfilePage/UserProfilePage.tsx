import { useNavigate, useParams } from 'react-router-dom';
import { Pencil } from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { PageWrapper } from '~/components/PageWrapper';
import { UserProfileSecureRow } from '~/types/db';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

export const UserProfilePage = (): JSX.Element => {
  const navigate = useNavigate();
  const id = useParams().id!;
  const userProfile: UserProfileSecureRow = {
    avatar_url: null,
    country_code: 'NL',
    created_at: new Date().toISOString(),
    family_name: 'Bar',
    given_name: 'Foo',
    id,
    updated_at: null,
    user_id: '',
    username: 'Foober',
  };
  const displayName = getUserDisplayNameString(userProfile);
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
