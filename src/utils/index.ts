export type TokenBulk = {
  accessToken: string;
  refreshToken: string;
};

export function getTokens(): TokenBulk {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  return {
    accessToken: accessToken || '',
    refreshToken: refreshToken || '',
  };
}

export function setTokens(tokens: TokenBulk): void {
  const { accessToken, refreshToken } = tokens;

  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function getErrorMessage(error: unknown) {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'Something went wrong';
  }

  return message;
}
