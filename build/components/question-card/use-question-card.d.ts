import React, { Dispatch } from 'react';
import { QuestionCardType } from './types';
declare type Parameters = Pick<QuestionCardType, 'onClick' | 'url' | 'answers' | 'type' | '_id' | 'playing' | 'setPlaying' | 'submit' | 'labels'> & {
    setAnswer: Dispatch<React.SetStateAction<string>>;
    setSubmitted: Dispatch<React.SetStateAction<boolean>>;
    answer: string;
    interactAskSomeone: (params: any) => void;
};
declare const UseQuestionCard: ({ onClick, setSubmitted, setAnswer, url, answers, answer, type, _id, labels, setPlaying, submit, interactAskSomeone, }: Parameters) => {
    handleClick: () => void;
    videoUrl: string | null;
    onStartPlaying: (id?: string | number) => () => void;
    marks: {
        value: number;
        label: string | undefined;
    }[];
    handleRangeChange: (e: React.ChangeEvent<Record<string, unknown>>, value: number | number[]) => void;
    handleAgree: (data: string) => void;
    handleAnswerSelect: (answer: string) => void;
    handleSubmit: () => void;
};
export default UseQuestionCard;
