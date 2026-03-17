import { Nullable } from 'src/types';
export declare type UseInfiniteCursorPaginationReturnValues = ReturnType<typeof useInfiniteCursorPagination>;
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
declare function useInfiniteCursorPagination({ onFetchMore, after, isLoading, currentId }: UseInfiniteCursorPaginationParams): {
    handleChange: (id: string) => (isVisible: boolean) => void;
};
export default useInfiniteCursorPagination;
