CREATE OR REPLACE FUNCTION apply_common_table_setup(table_name TEXT)
RETURNS VOID LANGUAGE plpgsql AS
$$
BEGIN
  -- Revoke update permissions for created_at and updated_at
  EXECUTE format('REVOKE UPDATE (created_at, updated_at) ON TABLE %I FROM authenticated, anon;', table_name);

  -- Drop existing trigger for updated_at
  EXECUTE format('DROP TRIGGER IF EXISTS %I_update_dates ON %I;', table_name, table_name);

  -- Create trigger for auto-updating updated_at
  EXECUTE format('CREATE TRIGGER %I_update_dates BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_dates();', table_name, table_name);

  -- Drop existing trigger for created_at
  EXECUTE format('DROP TRIGGER IF EXISTS %I_insert_dates ON %I;', table_name, table_name);

  -- Create trigger for auto-updating created_at
  EXECUTE format('CREATE TRIGGER %I_insert_dates BEFORE INSERT ON %I FOR EACH ROW EXECUTE FUNCTION insert_dates();', table_name, table_name);
END;
$$;
