import { useCallback } from 'react';
import { Nullable } from 'src/types';

export type UseInfiniteCursorPaginationReturnValues = ReturnType<typeof useInfiniteCursorPagination>;

export interface UseInfiniteCursorPaginationParams {
  /**
   * additional data fetching function
   * @param after cursor pagination last element id
   */
  onFetchMore?: (after: Nullable<string>) => void;
  /**
   * cursor pagination element id
   */
  after?: Nullable<string>;
  /**
   * current or visible element id
   */
  currentId?: Nullable<string>;
  /**
   * loading indicator
   */
  isLoading?: boolean;
}

function useInfiniteCursorPagination({ onFetchMore, after, isLoading, currentId }: UseInfiniteCursorPaginationParams) {
  const handlePostLoading = useCallback(
    (id: string) => {
      if (!isLoading && id == currentId && after && onFetchMore) {
        onFetchMore(after);
      }
    },
    [isLoading, currentId, after, onFetchMore]
  );

  const handleChange = useCallback(
    (id: string) => (isVisible: boolean) => {
      if (isVisible) {
        handlePostLoading(id);
      }
    },
    [handlePostLoading]
  );

  return { handleChange };
}
export default useInfiniteCursorPagination;
