// import { z } from 'zod';

import { CreateTournamentForm } from '~/components/CreateTournamentForm';
import { PageWrapper } from '~/components/PageWrapper';

// const FormSchema = z.object({
//   title: z.string().min(5, {
//     message: 'Title must be at least 5 characters.',
//   }),
//   description: z.string().min(20, {
//     message: 'Description must be at least 20 characters.',
//   }),
//   rulesPackUrl: z.string().optional(),
//   location: z.string().min(10, {
//     message: 'Location must be at least 10 characters.',
//   }),
//   startDate: z.date(),
//   endDate: z.date(),
//   maxPlayers: z.number().min(2, {
//     message: 'Max. players must be at least 2.',
//   }),
//   teamSize: z.number().min(1, {
//     message: 'Team size must be at least 1.',
//   }),

//   // FIXME: This doesn't work
// }).refine((data) => data.maxPlayers % data.teamSize !== 0, {
//   message: 'Wrong team size or wrong max player size',
//   path: ['maxPlayers', 'teamSize'],

//   // FIXME: This doesn't work
// }).refine((data) => !(data.maxPlayers / data.teamSize >= 2), {
//   message: 'Need at least two teams worth of players',
//   path: ['maxPlayers', 'teamSize'],
// });

export const CreateTournamentPage = (): JSX.Element => (
  <PageWrapper title="Create Tournament" showBackButton maxWidth={960}>
    <CreateTournamentForm />
  </PageWrapper>
);

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