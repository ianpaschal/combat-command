import { applySupabaseFilters, SupabaseQuery } from './applySupabaseFilters';

const createMockQuery = () => ({
  eq: jest.fn(),
  in: jest.fn(),
  or: jest.fn(),
} as unknown as jest.Mocked<SupabaseQuery>);

describe('applySupabaseFilters', () => {
  let mockQuery: jest.Mocked<SupabaseQuery>;

  beforeEach(() => {
    mockQuery = createMockQuery();
  });

  it('applies EQ filter for a single value on a single column', () => {
    const filters = { status: 'active' };
    const mapping = { status: 'status_column' };

    applySupabaseFilters(mockQuery, mapping, filters);

    expect(mockQuery.eq).toHaveBeenCalledWith('status_column', 'active');
  });

  it('applies IN filter for an array of values on a single column', () => {
    const filters = { status: ['active', 'inactive'] };
    const mapping = { status: 'status_column' };

    applySupabaseFilters(mockQuery, mapping, filters);

    expect(mockQuery.in).toHaveBeenCalledWith('status_column', ['active', 'inactive']);
  });

  it('applies OR filter for a single value across multiple columns', () => {
    const filters = { name: 'John' };
    const mapping = { name: ['first_name', 'last_name'] };

    applySupabaseFilters(mockQuery, mapping, filters);

    expect(mockQuery.or).toHaveBeenCalledWith('first_name.eq.John,last_name.eq.John');
  });

  it('does not apply filters for undefined values', () => {
    const filters = { status: undefined };
    const mapping = { status: 'status_column' };

    applySupabaseFilters(mockQuery, mapping, filters);

    expect(mockQuery.eq).not.toHaveBeenCalled();
    expect(mockQuery.in).not.toHaveBeenCalled();
    expect(mockQuery.or).not.toHaveBeenCalled();
  });

  it('handles an empty filter object', () => {
    applySupabaseFilters(mockQuery, {}, {});

    expect(mockQuery.eq).not.toHaveBeenCalled();
    expect(mockQuery.in).not.toHaveBeenCalled();
    expect(mockQuery.or).not.toHaveBeenCalled();
  });

  it('handles a missing filter object', () => {
    applySupabaseFilters(mockQuery, {});

    expect(mockQuery.eq).not.toHaveBeenCalled();
    expect(mockQuery.in).not.toHaveBeenCalled();
    expect(mockQuery.or).not.toHaveBeenCalled();
  });
});
