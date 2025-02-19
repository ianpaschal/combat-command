export function mapSupabaseErrorToHttpStatus(errorCode?: string): number {
  const clientErrors = [
    'PGRST100', // Bad request
    '23502', // NOT NULL violation
    '23503', // Foreign key violation
    '23505', // Unique constraint violation
    '22P02', // Invalid text representation (e.g., invalid UUID)
  ];

  const notFoundErrors = ['PGRST116']; // No rows found for single()

  if (!errorCode) return 500; // Default to server error if no code is provided
  if (clientErrors.includes(errorCode)) return 400;
  if (notFoundErrors.includes(errorCode)) return 404;
  return 500; // Treat other unknown errors as server issues
}
