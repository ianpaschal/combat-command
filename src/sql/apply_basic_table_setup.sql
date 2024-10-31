-- Set created_at timestamp
CREATE OR REPLACE FUNCTION public.set_created_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.apply_common_table_setup(table_name TEXT)
RETURNS VOID AS $$
BEGIN
  -- Revoke update permissions for id, created_at and updated_at
  EXECUTE format('REVOKE UPDATE (id, created_at, updated_at) ON TABLE %I FROM authenticated, anon;', table_name);

  -- Drop existing trigger for updated_at
  EXECUTE format('DROP TRIGGER IF EXISTS %I_update_dates ON %I;', table_name, table_name);

  -- Create trigger for auto-updating updated_at
  EXECUTE format('CREATE TRIGGER %I_update_dates BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();', table_name, table_name);

  -- Drop existing trigger for created_at
  EXECUTE format('DROP TRIGGER IF EXISTS %I_set_created_at ON %I;', table_name, table_name);

  -- Create trigger for auto-updating created_at
  EXECUTE format('CREATE TRIGGER %I_set_created_at BEFORE INSERT ON %I FOR EACH ROW EXECUTE FUNCTION public.set_created_at();', table_name, table_name);
END;
$$ LANGUAGE plpgsql;
