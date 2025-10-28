export type Input<TGeneric extends object> = TGeneric | undefined;

/**
 * 
 * 
 * @example
 * ```
 * 1. The generic type
 * 2. The narrowed type
 * 3. The determination if the output is the narrowed type or undefined
 * Output<GameSystemConfig, TeamYankeeV2GameSystemConfig, TGameSystemConfig>
 * ```
 */
export type Output<
  TGeneric extends object,
  TOutput extends object,
  TInput extends Input<TGeneric> = undefined,
> = TInput extends undefined ? undefined : TOutput;
