# Combat Command Backend

The CC backend is built with Convex.
This allows for better server side filtering and data processing.

In February 2025 it was migrated from Supabase.
Although Supabase's Postgres DB was ideal for a highly relational project such as CC, the heavy limitations on filtering via the Supabase API meant that a significant portion of the app's functionality had to be written in SQL functions (leading to a backend with no version control or tests), custom views (breaking type generation), etc.