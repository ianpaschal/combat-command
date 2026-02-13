import { useState } from 'react';
import { FileText, Plus } from 'lucide-react';

import { List, TournamentRegistration } from '~/api';
import { Button } from '~/components/generic/Button';
import { Drawer } from '~/components/generic/Drawer';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { ListDetails } from '~/components/ListDetails';
import { ListForm } from '~/components/ListForm';
import { SubmitData } from '~/components/ListForm/ListForm.schema';
import { useTournament } from '~/components/TournamentProvider';
import { useCreateList, useUpdateList } from '~/services/lists';

export interface ManageListButtonProps {
  className?: string;
  tournamentRegistration: TournamentRegistration;
  canManage?: boolean;
}

export const ManageListButton = ({
  className,
  tournamentRegistration,
  canManage,
}: ManageListButtonProps): JSX.Element => {
  const tournament = useTournament();
  const { mutation: createList } = useCreateList();
  const { mutation: updateList } = useUpdateList();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  const { lists } = tournamentRegistration;

  const handleOpenList = (list: List | null): void => {
    setSelectedList(list);
    setDrawerOpen(true);
  };

  const handleSubmit = (data: SubmitData): void => {
    if (selectedList) {
      updateList({
        ...selectedList,
        ...data,
      });
    } else {
      createList(data);
    }
  };

  const drawerTitle = selectedList ? 'List' : 'Submit List';

  const drawerContent = canManage ? (
    <ListForm
      forcedValues={{
        userId: tournamentRegistration.userId,
        tournamentRegistrationId: tournamentRegistration._id,
        gameSystem: tournament.gameSystem,
      }}
      existingValues={selectedList}
      onSubmit={handleSubmit}
    />
  ) : selectedList ? (
    <ListDetails list={selectedList} />
  ) : null;

  const triggerButton = (
    <Button
      className={className}
      icon={<FileText />}
      variant="ghost"
      size="small"
    />
  );

  if (lists.length <= 1) {
    return (
      <Drawer
        side="right"
        size="28rem"
        title={drawerTitle}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        trigger={triggerButton}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <>
      <PopoverMenu
        menuItems={[
          ...lists.map((list, i) => ({
            icon: <FileText />,
            label: `List ${i + 1}`,
            onClick: () => handleOpenList(list),
          })),
          ...(canManage ? [{
            icon: <Plus />,
            label: 'New List',
            onClick: () => handleOpenList(null),
          }] : []),
        ]}
      >
        {triggerButton}
      </PopoverMenu>
      <Drawer
        side="right"
        size="28rem"
        title={drawerTitle}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
