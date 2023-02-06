import { QuestionModel } from 'src/types/enhanced-learning-types';

export interface AnswerSelectType {
  answers?: string[];
  answer?: string;
  answerResult?: any;
  onSelect?: (selected: string) => void;
  disable?: boolean;
  last_updated_at?: Pick<QuestionModel, 'last_updated_at'>;
}
