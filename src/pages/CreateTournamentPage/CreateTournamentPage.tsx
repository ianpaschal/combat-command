import {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '~/components/generic/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/generic/Card';
import { DatePicker } from '~/components/generic/DatePicker';
import { PageWrapper } from '~/components/PageWrapper';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import { TournamentFields } from '~/types/Tournament';

const FormSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  rulesPackUrl: z.string().optional(),
  location: z.string().min(10, {
    message: 'Location must be at least 10 characters.',
  }),
  startDate: z.date(),
  endDate: z.date(),
  maxPlayers: z.number().min(2, {
    message: 'Max. players must be at least 2.',
  }),
  teamSize: z.number().min(1, {
    message: 'Team size must be at least 1.',
  }),

  // FIXME: This doesn't work
}).refine((data) => data.maxPlayers % data.teamSize !== 0, {
  message: 'Wrong team size or wrong max player size',
  path: ['maxPlayers', 'teamSize'],

  // FIXME: This doesn't work
}).refine((data) => !(data.maxPlayers / data.teamSize >= 2), {
  message: 'Need at least two teams worth of players',
  path: ['maxPlayers', 'teamSize'],
});

export const CreateTournamentPage = (): JSX.Element => {

  const [isMultiDay, setIsMultiDay] = useState<boolean>(false);
  const [isTeam, setIsTeam] = useState<boolean>(false);
  const [splitOpponents, setSplitOpponents] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
      rulesPackUrl: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      maxPlayers: 2,
      teamSize: 1,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  };

  const submitHandler: SubmitHandler<TournamentFields> = (data) => {
    console.log(data);
  };

  const handleToggleIsMultiDay = (checked: boolean): void => {
    setIsMultiDay(checked);
  };
  const handleToggleIsTeam = (checked: boolean): void => {
    setIsTeam(checked);
  };
  const handleToggleSplitOpponents = (checked: boolean): void => {
    setSplitOpponents(checked);
  };

  return (
    <PageWrapper title="Create New Tournament">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            control={form.control}
            name="title"

            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tournament Description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rulesPackUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rules Pack URL</FormLabel>
                <FormControl>
                  <Input placeholder="Rules Pack URL" {...field} />
                </FormControl>
                <FormDescription>
                  URL where players can find the rules pack (For example on Dropbox or Google Drive). Optional.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2">
            <Switch id="isMultiDay" checked={isMultiDay} onCheckedChange={handleToggleIsMultiDay} />
            <Label htmlFor="isMultiDay">Multi-Day Tournament</Label>
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isMultiDay ? 'Start Date' : 'Date'}</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isMultiDay && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="isTeam" checked={isTeam} onCheckedChange={handleToggleIsTeam} />
            <Label htmlFor="isTeam">Team Tournament</Label>
          </div>
          <FormField
            control={form.control}
            name="maxPlayers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max. Total Players</FormLabel>
                <FormControl>
                  <Input placeholder="Max. Total Players" {...field} type="number" />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {isTeam && (
            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Size</FormLabel>
                  <FormControl>
                    <Input placeholder="Team Size" {...field} type="number" />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex items-center space-x-2">
            <Switch id="splitOpponents" checked={splitOpponents} onCheckedChange={handleToggleSplitOpponents} />
            <Label htmlFor="issplitOpponentsTeam">Split Opponents</Label>
          </div>
          {splitOpponents && (
            <>
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Team Size" {...field} type="number" />
                    </FormControl>
                    {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Team Size" {...field} type="number" />
                    </FormControl>
                    {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <Button type="submit" variant="secondary">Save as Draft</Button>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </PageWrapper>
  );
};

/*
<form onSubmit={handleSubmit(submitHandler)}>
  
        <div>
          <input
            id="is_multi_day"
            type="checkbox"
            onChange={handleToggleMultiDay}
            checked={isMultiDay}
            value="is_multi_day"
          />
          <label htmlFor="is_multi_day">Is a multi-day tournament?</label>
        </div>
        <div>
          <label htmlFor="start_date">{isMultiDay ? 'Start Date' : 'Date'}</label>
          <input id="start_date" type="datetime-local" {...register('start_date', { required: true })} />
        </div>
{
  isMultiDay && (
    <div>
      <label htmlFor="end_date">End Date</label>
      <input
        id="end_date"
        type="datetime-local"
        {...register('end_date', { required: isMultiDay })}
      />
    </div>
  )
}
        <div>
          <label htmlFor="location">Location</label>
          <input id="location" type="text" {...register('location', { required: true })} />
          {errors.location && (
            <span>This field is required</span>
          )}
        </div>
        <div>
          <input
            id="is_team_tournament"
            type="checkbox"
            onChange={handleToggleTeamTournament}
            checked={isTeamTournament}
          />
          <label htmlFor="is_team_tournament">Is a team tournament?</label>
        </div>
{
  isTeamTournament && (
    <div>
      <label htmlFor="team_size_limit">Team Size</label>
      <input
        id="team_size_limit"
        type="number"
        {...register('team_size_limit', { required: isTeamTournament })}
      />
    </div>
  )
}
<button type="submit">Save</button>
      </form >
      */