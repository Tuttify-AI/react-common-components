declare type Parameters = {
    onSelect?: (selected: string) => void;
};
declare const useAnswerSelect: ({ onSelect }: Parameters) => {
    clickItem: (question: string) => void;
};
export default useAnswerSelect;
