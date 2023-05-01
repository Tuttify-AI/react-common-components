type Parameters = {
  onSelect?: (selected: string) => void;
};
const useAnswerSelect = ({ onSelect }: Parameters) => {
  const clickItem = (question: string) => {
    onSelect && onSelect(question);
  };

  return { clickItem };
};
export default useAnswerSelect;
