import React, { useCallback, useEffect, useMemo, Dispatch } from 'react';
import { QUESTION_TYPE } from 'src/constants';
import { QuestionCardType } from './types';
import { getTabId } from '../../utils/session-storage';

type Parameters = Pick<
  QuestionCardType,
  'onClick' | 'url' | 'answers' | 'type' | '_id' | 'playing' | 'setPlaying' | 'submit' | 'labels'
> & {
  setAnswer: Dispatch<React.SetStateAction<string>>;
  setSubmitted: Dispatch<React.SetStateAction<boolean>>;
  answer: string;
  interactAskSomeone: (params: any) => void;
};

const UseQuestionCard = ({
  onClick,
  setSubmitted,
  setAnswer,
  url,
  answers,
  answer,
  type,
  _id,
  labels,
  setPlaying,
  submit,
  interactAskSomeone,
}: Parameters) => {
  const handleClick = useCallback(() => {
    onClick && onClick();
  }, [onClick]);

  const videoUrl = useMemo(() => {
    if (url && url.includes('https://www.youtube.com')) {
      const queryString = url.replace('https://www.youtube.com/watch', '');
      const urlParams = new URLSearchParams(queryString);
      const embedId = urlParams.get('v');
      return `https://www.youtube.com/embed/${embedId}`;
    }
    return null;
  }, [url]);

  const handleRangeChange = (e: React.ChangeEvent<Record<string, unknown>>, value: number | number[]) => {
    setAnswer(`${value as number}`);
  };

  const handleAgree = (data: string) => {
    setAnswer(data);
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswer(answer);
  };

  const handleSubmit = useCallback(() => {
    const answerIndex = answers?.findIndex(item => item.text === answer);
    const data = { answer_id: answerIndex, question_id: _id };
    if (type === QUESTION_TYPE.RANGE || type === QUESTION_TYPE.AGREE) {
      data['opinion'] = answer;
    }

    submit({
      interaction_type: 'user_answered_question',
      entity_id: _id,
      tab_id: getTabId(),
      extra_data: data,
    });

    interactAskSomeone({
      interaction_type: 'user_accepted_answer',
      entity_id: _id,
      tab_id: getTabId(),
      extra_data: data,
    });

    setSubmitted(true);
  }, [answers, type, _id, submit, setSubmitted, answer, interactAskSomeone]);

  useEffect(() => {
    setAnswer('');
    setSubmitted(false);
  }, [_id, setAnswer, setSubmitted]);

  const marks = useMemo(
    () => [
      {
        value: 0,
        label: labels?.[0],
      },
      {
        value: 10,
        label: labels?.[1],
      },
    ],
    [labels]
  );

  const onStartPlaying = useCallback(
    (id?: string | number) => () => {
      setPlaying && setPlaying(id as string);
    },
    [setPlaying]
  );
  return {
    handleClick,
    videoUrl,
    onStartPlaying,
    marks,
    handleRangeChange,
    handleAgree,
    handleAnswerSelect,
    handleSubmit,
  };
};

export default UseQuestionCard;
