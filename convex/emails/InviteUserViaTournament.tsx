export interface InviteUserViaTournamentProps {
  url: string;
  title: string;
}

export const InviteUserViaTournament = ({
  url,
  title,
}: InviteUserViaTournamentProps): JSX.Element => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f9f9f9',
    }}
  >
    <h2 style={{ color: '#333' }}>
      {title}
    </h2>
    <p style={{ fontSize: '14px', color: '#555' }}>
      Click the button below to accept your invitation and set your password.
    </p>
    <a
      href={url}
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: '#fff',
        borderRadius: '4px',
        textDecoration: 'none',
        marginTop: '10px',
      }}
    >
      Accept Invitation
    </a>
    <p style={{ fontSize: '12px', color: '#999', marginTop: '20px' }}>
      If you didn’t expect this invitation, you can ignore this email.
    </p>
  </div>
);
