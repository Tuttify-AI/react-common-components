import { QuestionModel } from 'src/types/enhanced-learning-types';
export declare type InteractQuestionResponse = {
    detail?: string;
    is_correct?: boolean;
    correct_answer?: string;
    history?: any;
};
export declare type InteractQuestionPayload = {
    interaction_type: string;
    entity_id: string;
    tab_id: string | null;
    extra_data?: Record<string, unknown>;
};
export declare type InteractResponse = {
    detail: string;
    is_correct: boolean;
    correct_answer: string;
    history?: Record<string, unknown>;
};
export declare type QuestionCardType = QuestionModel & {
    answerResult?: InteractQuestionResponse | InteractResponse | null;
    hideAsk?: boolean;
    onClick?: () => void;
    onAsk?: () => void;
    submit: (data: InteractQuestionPayload) => void;
    _id: string;
    playing?: string | null | number;
    setPlaying?: (item: string | null) => void;
    cardNumber?: number;
};
