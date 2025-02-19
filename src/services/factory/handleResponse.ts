export async function handleResponse<T extends object | null>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data = await response.json();
  return data;
}
