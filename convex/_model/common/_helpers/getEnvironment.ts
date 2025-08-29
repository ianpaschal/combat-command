export const getEnvironment = (): { env: 'prod' | 'dev'; name: string } | void => {
  const key = process.env.CONVEX_DEPLOY_KEY;
  if (!key) {
    return;
  }
  const match = key.match(/^(prod|dev):(.*)$/);
  if (!match) {
    return;
  }
  const [, env, name] = match;
  return {
    env: env as 'prod' | 'dev',
    name,
  };
};
