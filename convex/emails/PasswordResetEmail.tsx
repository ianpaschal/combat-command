export interface PasswordResetEmailProps {
  token: string;
  expires: Date;
}

export const PasswordResetEmail = ({
  token,
  expires,
}: PasswordResetEmailProps): JSX.Element => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f9f9f9',
    }}
  >
    <h2 style={{ color: '#333' }}>
      Password Reset
    </h2>
    <p style={{ fontSize: '14px', color: '#555' }}>
      {`Your code is ${token}. It will expire at ${expires.toDateString()}.`}
    </p>
    <p style={{ fontSize: '12px', color: '#999', marginTop: '20px' }}>
      If you didn’t expect this message, you can ignore this email.
    </p>
  </div>
);
