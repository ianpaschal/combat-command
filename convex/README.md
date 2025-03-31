# Combat Command Backend

The CC backend is built with Convex.
This allows for better server side filtering and data processing.

In February 2025 it was migrated from Supabase.
Although Supabase's Postgres DB was ideal for a highly relational project such as CC, the heavy limitations on filtering via the Supabase API meant that a significant portion of the app's functionality had to be written in SQL functions (leading to a backend with no version control or tests), custom views (breaking type generation), etc.


## Nomenclature

> **NOTE:** Not all files conform to this.
> Adapting this structure will be an on-going project as the Combat Command team becomes more familiar with Convex.

For each resource a few basic queries are standard:

### Basic Queries
- `get[Resource]()`
- `get[Resource]List()`

### Complex Queries
- `get[Resource]ListBy[Attribute]()`

### Basic Mutations
- `create[Resource]()`
- `update[Resource]()`
- `delete[Resource]()`

### Complex Mutations
- `add[Attribute]To[Resource]()`

## Helper Functions
- `getDeep[Resource]()`

See: https://docs.convex.dev/understanding/best-practices#use-helper-functions-to-write-shared-code
