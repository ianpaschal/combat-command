import {
  Fragment,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import {
  generatePath,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { rectSwappingStrategy, SortableContext } from '@dnd-kit/sortable';
import { TournamentPairingMethod, tournamentPairingMethodOptions } from '@ianpaschal/combat-command-static-data/common';

import { DraftTournamentPairing, TournamentId } from '~/api';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { Button } from '~/components/generic/Button';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { Pulsar } from '~/components/generic/Pulsar';
import { Separator } from '~/components/generic/Separator';
import { PageWrapper } from '~/components/PageWrapper';
import { toast } from '~/components/ToastProvider';
import { TournamentCompetitorsProvider } from '~/components/TournamentCompetitorsProvider';
import { TournamentProvider } from '~/components/TournamentProvider';
import { ConfirmPairingsDialog } from '~/pages/TournamentPairingsPage/components/ConfirmPairingsDialog';
import { Draggable } from '~/pages/TournamentPairingsPageAlt/components/Draggable/Draggable';
import { Droppable } from '~/pages/TournamentPairingsPageAlt/components/Droppable/Droppable';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { useCreateTournamentPairings, useGetTournamentPairings } from '~/services/tournamentPairings';
import { useGetTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';
import {
  createDraftPairings,
  getPairingsStatuses,
  getSourceSlot,
  getTargetSlot,
} from './TournamentPairingsPage.utils';

import styles from './TournamentPairingsPage.module.scss';

const WIDTH = 800;

export const TournamentPairingsPage = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?

  // ---- DIALOGS ----
  const {
    id: confirmChangePairingMethodDialogId,
  } = useConfirmationDialog();
  const {
    id: confirmResetPairingsDialogId,
  } = useConfirmationDialog();
  const {
    id: confirmPairingsDialogId,
    open: openConfirmPairingsDialog,
  } = useConfirmationDialog();

  // ---- DATA FETCHING ----
  const { data: tournament } = useGetTournament({ id: tournamentId });
  const lastRound = tournament?.lastRound ?? -1;
  const nextRound = tournament?.nextRound ?? 0;

  if (tournament?.currentRound !== undefined) {
    throw new Error('Cannot modify pairings during round.');
  }
  const tableCount = Math.ceil((tournament?.maxCompetitors ?? 2) / 2);

  // ---- BACK-END ----
  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournament({
    tournamentId,
    includeRankings: lastRound,
  });
  const { data: existingPairings } = useGetTournamentPairings(tournament ? {
    tournamentId,
    round: nextRound,
  } : 'skip');
  const { mutation: createTournamentPairings } = useCreateTournamentPairings({
    onSuccess: (): void => {
      toast.success(`Round ${nextRound + 1} pairings created!`);
      navigate(`${generatePath(PATHS.tournamentDetails, { id: tournamentId })}?tab=pairings`);
    },
  });

  // ---- STATE ----
  const [pairingMethod, setPairingMethod] = useState<TournamentPairingMethod | 'manual'>(nextRound === 0 ? (
    TournamentPairingMethod.Random
  ) : (
    TournamentPairingMethod.Adjacent
  ));
  useEffect(() => {
    if (tournament?.pairingMethod && nextRound > 1) {
      setPairingMethod(tournament.pairingMethod);
    }
  }, [tournament, setPairingMethod, nextRound]);

  const [pairings, setPairings] = useState<DraftTournamentPairing[]>(createDraftPairings(tableCount, tournamentCompetitors ?? [], existingPairings ?? []));
  const pairingStatuses = tournamentCompetitors ? getPairingsStatuses(tournamentCompetitors, pairings) : [];
  useEffect(() => {
    if (existingPairings?.length) {
      setPairings(createDraftPairings(tableCount, tournamentCompetitors ?? [], existingPairings)); // Pad to full size
    }
  }, [
    existingPairings,
    setPairings,
    tableCount,
    tournamentCompetitors,
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDropping, setIsDropping] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
    }),
  );

  // Get all competitor IDs for sortable context
  const competitorIds = pairings.flatMap((pairing) => [
    pairing.tournamentCompetitor0Id,
    pairing.tournamentCompetitor1Id,
  ]).filter(Boolean) as UniqueIdentifier[];

  const handleDragStart = ({ active }: DragStartEvent): void => {
    setActiveId(active.id);
    setIsDropping(false);
  };

  const handleDragEnd = (e: DragEndEvent): void => {
    const { over, active } = e;

    if (!over) {
      setActiveId(null);
      setIsDropping(false);
      return;
    }

    const source = getSourceSlot(pairings, active.id);
    const target = getTargetSlot(over);
    if (!source || !target) {
      setActiveId(null);
      setIsDropping(false);
      return;
    }

    // Set dropping state to keep original hidden during animation
    setIsDropping(true);

    // clone each row object so we don't mutate existing state objects
    const updated = pairings.map((row) => ({ ...row }));

    // capture original values before writing anything
    const sourceValue = pairings[source.row][source.field];
    const targetValue = pairings[target.row][target.field];

    // perform swap on the cloned rows
    updated[source.row][source.field] = targetValue;
    updated[target.row][target.field] = sourceValue;

    setPairings(updated);

    // Delay clearing both states to allow drop animation to complete
    setTimeout(() => {
      setActiveId(null);
      setIsDropping(false);
    }, 200);
  };

  const handleDragCancel = (): void => {
    setActiveId(null);
    setIsDropping(false);
  };

  if (!tournament || !tournamentCompetitors) {
    return <div>Loading...</div>;
  }

  const tableOptions = [
    ...Array.from({ length: tableCount }).map((_, i) => ({
      label: String(i + 1),
      value: i,
    })),
    { label: 'Auto', value: -1 },
  ];

  const handleChangeTable = (index: number, table: number): void => {
    setPairings([
      ...pairings.map((v, i) => i === index ? {
        ...v, table,
      } : v),
    ]);
  };

  // const handleChange = (items: UniqueIdentifier[]): void => {
  //   updatePairings(items, form.reset);
  //   setPairingMethod('manual');
  // };

  // const changePairingMethod = async (method: TournamentPairingMethod | 'manual'): Promise<void> => {
  //   if (method !== 'manual') {
  //     const generatedPairings = await generateDraftPairings({
  //       round: nextRound,
  //       tournamentId,
  //       method,
  //     });
  //     if (generatedPairings) {
  //       form.reset({ pairings: setPairings(tournamentCompetitors, tableCount, generatedPairings) }, { keepDefaultValues: true });
  //       setPairingMethod(method);
  //     }
  //   }
  // };

  // const reset = (): void => {
  //   if (existingPairings) {
  //     form.reset({ pairings: setPairings(tournamentCompetitors, tableCount, existingPairings) });
  //     setPairingMethod('manual');
  //   } else {
  //     if (pairingMethod !== 'manual') {
  //       changePairingMethod(pairingMethod);
  //     }
  //   }
  // };

  // const handleReset = (): void => {
  //   if (form.formState.isDirty) {
  //     openConfirmResetPairingsDialog({
  //       onConfirm: () => reset(),
  //     });
  //   } else {
  //     reset();
  //   }
  // };

  const handleChangePairingMethod = (_method: TournamentPairingMethod | 'manual'): void => {
    // if (pairingMethod === 'manual' && form.formState.isDirty) {
    //   openConfirmChangePairingMethodDialog({
    //     onConfirm: () => changePairingMethod(method),
    //   });
    // } else {
    //   changePairingMethod(method);
    // }
  };

  const handleCancel = (_e: MouseEvent): void => {
    // TODO: If dirty, open confirmation dialog
    navigate(-1);
  };

  const handleProceed = (_e: MouseEvent): void => {
    openConfirmPairingsDialog();
  };

  const handleConfirm = async (pairings: DraftTournamentPairing[]): Promise<void> => {
    await createTournamentPairings({ tournamentId, round: nextRound, pairings });
  };

  return (
    <PageWrapper
      title={`Configure Round ${nextRound + 1}`}
      maxWidth={WIDTH}
      showBackButton
      footer={
        <>
          <Button variant="secondary" onClick={handleCancel} key="cancel">Cancel</Button>
          <Button key="proceed" onClick={handleProceed}>{existingPairings ? 'Update' : 'Create'}</Button>
        </>
      }
    >
      <TournamentProvider tournament={tournament}>
        <TournamentCompetitorsProvider tournamentCompetitors={tournamentCompetitors}>
          <div className={styles.TournamentPairingsPage}>
            <div className={styles.TournamentPairingsPage_Header}>
              <Label>Pairing Method</Label>
              <InputSelect
                //@ts-expect-error InputSelect doesn't know type
                onChange={handleChangePairingMethod}
                options={[...tournamentPairingMethodOptions, {
                  label: 'Manual',
                  value: 'manual',
                }]}
                value={pairingMethod}
                disabled={nextRound === 0}
              />
              <Button
                className={styles.TournamentPairingsPage_ResetButton}
                // onClick={handleReset}
                variant="secondary"
              >
                Reset
              </Button>
            </div>
            <Separator />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={competitorIds} strategy={rectSwappingStrategy}>
                <div className={styles.TournamentPairingsPage_Grid}>

                  {/* HEADER */}
                  <div className={styles.TournamentPairingsPage_Grid_StatusHeader}></div>
                  <Label className={styles.TournamentPairingsPage_Grid_TableHeader}>Table</Label>
                  <Label className={styles.TournamentPairingsPage_Grid_CompetitorsHeader}>Opponents</Label>

                  {/* ROWS */}

                  {pairings.map((pairing, i) => {
                    const { status, message } = pairingStatuses[i];
                    const statusColors: Record<typeof status, 'red' | 'yellow' | 'green'> = {
                      'error': 'red',
                      'warning': 'yellow',
                      'ok': 'green',
                    };
                    return (
                      <Fragment key={i}>
                        <div>
                          <InfoPopover content={message} orientation="horizontal">
                            <Pulsar pulse={status !== 'ok'} color={statusColors[status]} size={12} />
                          </InfoPopover>
                        </div>
                        <div>
                          <InputSelect
                            options={tableOptions}
                            value={pairings[i].table ?? -1}
                            onChange={(table) => handleChangeTable(i, table as number)}
                          />
                        </div>
                        <Droppable id={`${i}_tournamentCompetitor0Id`}>
                          {pairings[i].tournamentCompetitor0Id && (
                            <Draggable
                              id={pairings[i].tournamentCompetitor0Id}
                              isDropping={isDropping && activeId === pairings[i].tournamentCompetitor0Id}
                            />
                          )}
                        </Droppable>
                        <Droppable id={`${i}_tournamentCompetitor1Id`}>
                          {pairings[i].tournamentCompetitor1Id && (
                            <Draggable
                              id={pairings[i].tournamentCompetitor1Id}
                              isDropping={isDropping && activeId === pairings[i].tournamentCompetitor1Id}
                            />
                          )}
                        </Droppable>
                      </Fragment>
                    );
                  })}
                </div>
              </SortableContext>
              <DragOverlay
                adjustScale
                dropAnimation={{
                  sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                      active: {
                        opacity: '0.5',
                      },
                    },
                  }),
                }}
              >
                {activeId ? (
                  <Draggable id={activeId} overlay />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
          <ConfirmationDialog
            id={confirmChangePairingMethodDialogId}
            title="Confirm Change Pairing Method"
            description="Are you sure you want to change the pairing method? The existing pairings will be replaced."
          />
          <ConfirmationDialog
            id={confirmResetPairingsDialogId}
            title="Confirm Reset Pairings"
            description="Are you sure you want to reset? The existing pairings will be replaced."
          />
          <ConfirmPairingsDialog
            id={confirmPairingsDialogId}
            pairings={pairings}
            competitors={tournamentCompetitors}
            onConfirm={handleConfirm}
          />
        </TournamentCompetitorsProvider>
      </TournamentProvider>
    </PageWrapper>
  );
};

/*

     <div className={styles.TournamentPairingsPage_Form_Alerts}>
                {fields.map((field, i) => {
                  const { status, message } = pairingStatuses[i];
                  const statusColors: Record<typeof status, 'red' | 'yellow' | 'green'> = {
                    'error': 'red',
                    'warning': 'yellow',
                    'ok': 'green',
                  };
                  return (
                    <InfoPopover key={field.id} content={message} orientation="horizontal">
                      <Pulsar pulse={status !== 'ok'} color={statusColors[status]} size={12} />
                    </InfoPopover>
                  );
                })}
              </div>

               <div className={styles.TournamentPairingsPage_Form_TableInputs}>
                {fields.map((field, i) => (
                  <div key={field.id} className={styles.TournamentPairingsPage_Form_TableInput}>
                    
                  </div>
                ))}
              </div>

                <SortableGrid
                className={styles.TournamentPairingsPage_Form_CompetitorsGrid}
                items={flattenPairings(pairings)}
                columns={2}
                onChange={handleChange}
                renderItem={(id, state) => renderCompetitorCard(id, state, tournamentCompetitors)}
              />

              */
