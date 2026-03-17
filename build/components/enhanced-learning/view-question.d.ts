import React from 'react';
import { QuestionModel, InteractQuestionPayload, InteractResponse } from '../../types/enhanced-learning-types';
declare type AnsweredByType = {
    user_id: string;
    answer_id: string;
    reason: string;
};
declare type ViewQuestionType = QuestionModel & {
    answerResult?: InteractResponse | null;
    answeredBy: AnsweredByType;
    submit: (data: InteractQuestionPayload) => void;
    last_updated_at?: Pick<QuestionModel, 'last_updated_at'>;
    interactAskSomeone: (params: any) => void;
};
declare const ViewQuestion: React.FC<ViewQuestionType>;
export default ViewQuestion;
