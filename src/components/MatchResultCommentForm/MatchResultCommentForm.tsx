import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { SendHorizonal } from 'lucide-react';

import { MatchResultId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { InputTextArea } from '~/components/generic/InputTextArea';
import { useAddMatchResultComment } from '~/services/matchResultComments/useAddMatchResultComment';
import { MatchResultCommentFormData, matchResultCommentFormSchema } from './MatchResultCommentForm.schema';

import styles from './MatchResultCommentForm.module.scss';

export interface MatchResultCommentFormProps {
  className?: string;
  matchResultId: MatchResultId;
  onSuccess?: () => void;
}

export const MatchResultCommentForm = ({
  className,
  matchResultId,
  onSuccess,
}: MatchResultCommentFormProps): JSX.Element | null => {
  const user = useAuth();
  const { addMatchResultComment } = useAddMatchResultComment({
    onSuccess: () => {
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    },
  });
  const form = useForm<MatchResultCommentFormData>({
    resolver: zodResolver(matchResultCommentFormSchema),
    defaultValues: {
      body: '',
    },
  });
  const onSubmit: SubmitHandler<MatchResultCommentFormData> = (data) => {
    console.log(data);
    addMatchResultComment({
      matchResultId,
      ...data,
    });
  };
  if (!user) {
    return null;
  }
  return (
    <form className={clsx(styles.MatchResultCommentForm, className)} onSubmit={form.handleSubmit(onSubmit)}>
      <Avatar url={user.avatarUrl} className={styles.Avatar} />
      <InputTextArea className={styles.TextArea} {...form.register('body')} />
      <Button type="submit">
        <SendHorizonal />
      </Button>
    </form>
  );
};
