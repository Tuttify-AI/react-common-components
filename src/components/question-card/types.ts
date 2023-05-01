import { QuestionModel } from 'src/types/enhanced-learning-types';

export type InteractQuestionResponse = {
  detail?: string;
  is_correct?: boolean;
  correct_answer?: string;
  //eslint-disable-next-line
  history?: any;
};

export type InteractQuestionPayload = {
  interaction_type: string;
  entity_id: string;
  tab_id: string | null;
  extra_data?: Record<string, unknown>;
};

export type InteractResponse = {
  detail: string;
  is_correct: boolean;
  correct_answer: string;
  history?: Record<string, unknown>;
};

export type QuestionCardType = QuestionModel & {
  answerResult?: InteractQuestionResponse | InteractResponse | null;
  hideAsk?: boolean;
  onClick?: () => void;
  onAsk?: () => void;
  submit: (data: InteractQuestionPayload) => void;
  //last_updated_at?: Pick<IBaseModel, 'last_updated_at'>;
  _id: string;
  playing?: string | null | number;
  setPlaying?: (item: string | null) => void;
  cardNumber?: number;
};
