import { styles } from './styles';
import { Wrapper } from './Wrapper';

export interface InviteUserEmailProps {
  url: string;
  title: string;
}

export const InviteUserEmail = ({
  url,
  title,
}: InviteUserEmailProps): JSX.Element => (
  <Wrapper>
    <h2 style={styles.header}>
      {title}
    </h2>
    <p style={styles.description}>
      Click the button below to accept the invitation and set your password on Combat Command.
    </p>
    <a style={styles.callToAction} href={url}>
      Accept Invitation
    </a>
  </Wrapper >
);
