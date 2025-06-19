import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { PreventAuth } from '~/components/PreventAuth';
import { PATHS } from '~/settings';

import styles from './LandingPage.module.scss';

export const LandingPage = (): JSX.Element => {
  const navigate = useNavigate();
  const handleSignUp = (): void => {
    navigate(PATHS.authSignUp);
  };
  return (
    <PreventAuth>
      <ScrollArea className={styles.LandingPage}>
        <div className={styles.LandingPage_Content}>
          <div className={styles.LandingPage_Hero}>
            <div className={styles.LandingPage_HeroContent}>
              <h1>Combat Command</h1>
              <p>Elevate your historical war-gaming experience.</p>
              <p>Whether you're a casual player or the organizer of a highly competitive tournament, Combat Command is the digital half of your dice box.</p>
              <Button onClick={handleSignUp} className={styles.LandingPage_HeroCta}>
                Sign Up
              </Button>
            </div>
          </div>
          <div className={styles.LandingPage_Normal}>
            <div className={styles.LandingPage_TripleBlock}>
              <div className={styles.LandingPage_Block}>
                <h2>Organize Tournaments</h2>
                <p>Born out of the European Team Championships for Battlefront’s classic WWII game: Flames of War, CombatCommand offers all the tools organizers need and is battle tested at the highest levels of competition.</p>
              </div>
              <div className={styles.LandingPage_Block}>
                <h2>Check In Matches</h2>
                <p>Tournaments aren’t everything! Check in your single matches with friends, attach photos, and save notes with the game results.</p>
              </div>
              <div className={styles.LandingPage_Block}>
                <h2>Statistics</h2>
                <p>What is your most-valuable unit? Do you have an edge playing a certain stance? Which missions do you struggle with the most? The CombatCommand statistics panel gives you insight into all of these topics.</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </PreventAuth>
  );
};
