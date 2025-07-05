import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, Box, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { LockOutlined } from '@material-ui/icons';
import classNames from 'classnames';
import { Image, Buttons } from 'src/components/common';
import { QUESTION_TYPE } from 'src/constants';
import { QuestionModel, QuestionType, InteractResponse } from 'src/types/enhanced-learning-types';
import AnswerSelect from '../answer-select';
import Slider from '@material-ui/core/Slider';
import theme from 'src/styles/theme';

type HelpSubmitType = QuestionModel & {
  answerResult?: InteractResponse | null;
  submit: (data: { answer_id: number | undefined; reason: string }) => void;
  last_updated_at?: Pick<QuestionModel, 'last_updated_at'>;
};

const useStyles = makeStyles(() => ({
  questionCard: {
    borderRadius: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    boxShadow: theme.palette.shadows.cardThin,
  },
  sourceWrapper: {
    height: 0,
    width: '100%',
    paddingBottom: '80%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.spacing(3),

    '& img, & iframe': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  text: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  title: {
    fontSize: 24,
    lineHeight: `${theme.spacing(4)}px`,
    fontWeight: 500,
    padding: theme.spacing(2),
  },
  cardBody: {
    padding: `0 ${theme.spacing(2)}px`,
    pointerEvents: 'auto',
  },
  tagsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1.25),
    fontSize: 12,
    color: theme.palette.secondary.main,
  },
  agreeDisagree: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: `calc(50% - ${theme.spacing(1.25)}px)`,
    borderRadius: theme.spacing(1),
    height: theme.spacing(6.25),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.fonts.grey_4,
    cursor: 'pointer',

    '&$active': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
  },
  active: {},
  description: {
    fontSize: 14,
    color: theme.palette.fonts.grey_1,
    marginBottom: theme.spacing(2.5),
  },
  cardFooter: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    pointerEvents: 'auto',
  },
  rangeSlider: {
    '& > div': {
      outline: 'none',
    },

    "& [data-testid='slider-thumb']": {
      marginTop: `-${theme.spacing(0.6)}px`,

      ' > div': {
        width: `-${theme.spacing(1.5)}px`,
        height: `-${theme.spacing(1.5)}px`,
      },
    },
  },
}));

const HelpSubmit: React.FC<HelpSubmitType> = ({
  _id,
  answers,
  tags,
  text,
  type,
  url,
  answerResult,
  submit,
  labels,
}) => {
  const classes = useStyles();
  const [answer, setAnswer] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReason(event?.target.value);
  };

  const handleSubmit = useCallback(() => {
    const answerIndex = answers?.findIndex(item => item.text === answer) || 0;
    const data = {
      answer_id: answerIndex >= 0 ? answerIndex + 1 : -1,
      reason,
    };

    if (type === QUESTION_TYPE.RANGE || type === QUESTION_TYPE.AGREE) {
      // handle different logic here.
    }

    submit(data);
    setSubmitted(true);
  }, [type, reason, answer, answers, submit]);

  useEffect(() => {
    setAnswer('');
    setSubmitted(false);
  }, [_id]);

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

  return (
    <Grid className={classes.questionCard}>
      <Grid>
        <Grid className={classes.sourceWrapper}>
          {videoUrl ? <iframe src={videoUrl} /> : <Image src={url || ''} />}
        </Grid>
        <Typography className={classes.title}>{text}</Typography>
      </Grid>

      <Grid className={classes.cardBody}>
        <Grid className={classes.tagsWrapper}>
          {tags?.map((tag, index) => (
            <Typography className={classes.tag} key={index}>
              ○ {tag}
            </Typography>
          ))}
        </Grid>

        {type === QuestionType.Range ? (
          <Grid className={classes.rangeSlider}>
            <Slider min={0} max={10} step={1} marks={marks} color="secondary" onChange={handleRangeChange} />
          </Grid>
        ) : type === QUESTION_TYPE.AGREE ? (
          <Grid className={classes.agreeDisagree}>
            <Grid
              className={classNames({ [`${classes.active}`]: answer === 'agree' }, classes.actionButton)}
              onClick={() => handleAgree('agree')}
              id="question_help_agree"
            >
              Agree
            </Grid>
            <Grid
              className={classNames({ [`${classes.active}`]: answer === 'disagree' }, classes.actionButton)}
              onClick={() => handleAgree('disagree')}
              id="question_help_disagree"
            >
              Disagree
            </Grid>
          </Grid>
        ) : (
          <AnswerSelect
            answerResult={answerResult}
            answer={answer}
            disable={submitted}
            answers={answers?.map(item => item.text)}
            onSelect={handleAnswerSelect}
          />
        )}

        <Box mt={2}>
          <TextField
            value={reason}
            onChange={handleReasonChange}
            fullWidth
            multiline
            placeholder="Explain your answer choice"
            variant="outlined"
            minRows={3}
          />
        </Box>
      </Grid>

      <Grid className={classes.cardFooter}>
        <Buttons.WithIcon
          rounded
          disabled={!reason || !answer || submitted}
          submitted={submitted}
          onClick={handleSubmit}
        >
          Submit
          {!answer || (submitted && <LockOutlined />)}
        </Buttons.WithIcon>
      </Grid>
    </Grid>
  );
};

export default HelpSubmit;
