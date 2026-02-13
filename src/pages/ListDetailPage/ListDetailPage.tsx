import { useParams } from 'react-router-dom';

import { ListId } from '~/api';
import { Card } from '~/components/generic/Card';
import { ListDetails } from '~/components/ListDetails';
import { PageWrapper } from '~/components/PageWrapper';
import { useGetList } from '~/services/lists';

export const ListDetailPage = (): JSX.Element => {
  const params = useParams();
  const listId = params.id! as ListId;

  const { data: list } = useGetList({ id: listId });

  return (
    <PageWrapper showBackButton maxWidth={688} title="List">
      {list && (
        <Card>
          <ListDetails list={list} />
        </Card>
      )}
    </PageWrapper>
  );
};
