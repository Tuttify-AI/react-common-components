import React from 'react';
import { QuestionModel, InteractResponse } from 'src/types/enhanced-learning-types';
declare type HelpSubmitType = QuestionModel & {
    answerResult?: InteractResponse | null;
    submit: (data: {
        answer_id: number | undefined;
        reason: string;
    }) => void;
    last_updated_at?: Pick<QuestionModel, 'last_updated_at'>;
};
declare const HelpSubmit: React.FC<HelpSubmitType>;
export default HelpSubmit;
