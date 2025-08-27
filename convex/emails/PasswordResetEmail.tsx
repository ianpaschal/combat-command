import { styles } from './styles';
import { Wrapper } from './Wrapper';

export interface PasswordResetEmailProps {
  token: string;
  expires: Date;
}

export const PasswordResetEmail = ({
  token,
  expires,
}: PasswordResetEmailProps): JSX.Element => (
  <Wrapper>
    <h2 style={styles.header}>
      Password Reset
    </h2>
    <p style={styles.description}>
      {`Your log-in code is below. It will expire at ${expires.toDateString()}.`}
    </p>
    <div style={styles.token}>
      {token.split('').map((char, i) => (
        <span key={i} style={styles.tokenCharacter}>
          {char}
        </span>
      ))}
    </div>
    <p style={styles.footer}>
      If you didn’t expect this message, you can ignore this email.
    </p>
  </Wrapper>
);
