import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { LockOutlined } from '@material-ui/icons';
import classNames from 'classnames';
import { Buttons, Image } from '../common';
import { QUESTION_TYPE } from 'src/constants';
import {
  QuestionModel,
  QuestionType,
  InteractQuestionPayload,
  InteractResponse,
} from '../../types/enhanced-learning-types';
import AnswerSelect from '../answer-select';
import Slider from '@material-ui/core/Slider';
import UseQuestionCard from '../question-card/use-question-card';
import theme from 'src/styles/theme';

type AnsweredByType = {
  user_id: string;
  answer_id: string;
  reason: string;
};

type ViewQuestionType = QuestionModel & {
  answerResult?: InteractResponse | null;
  answeredBy: AnsweredByType;
  submit: (data: InteractQuestionPayload) => void;
  last_updated_at?: Pick<QuestionModel, 'last_updated_at'>;
  interactAskSomeone: (params: any) => void;
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

const ViewQuestion: React.FC<ViewQuestionType> = ({
  _id,
  answers,
  tags,
  text,
  type,
  url,
  answerResult,
  answeredBy,
  labels,
  submit,
  interactAskSomeone,
}) => {
  const classes = useStyles();
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { videoUrl, marks, handleRangeChange, handleAgree, handleAnswerSelect, handleSubmit } = UseQuestionCard({
    setSubmitted,
    setAnswer,
    url,
    answers,
    answer,
    type,
    _id,
    labels,
    submit,
    interactAskSomeone,
  });

  useEffect(() => {
    if (answers && answeredBy) {
      const answerIndex = Number(answeredBy.answer_id) - 1;
      if (answerIndex >= 0) {
        setAnswer(answers[answerIndex].text);
      }
    }
    setSubmitted(false);
  }, [_id, answers, answeredBy]);

  return (
    <Grid className={classes.questionCard}>
      <Grid className="card-header">
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
              id="view_question_agree_btn"
            >
              Agree
            </Grid>
            <Grid
              className={classNames({ [`${classes.active}`]: answer === 'disagree' }, classes.actionButton)}
              onClick={() => handleAgree('disagree')}
              id="view_question_disagree_btn"
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

        {!!answeredBy && (
          <Box mt={2}>
            <TextField disabled fullWidth multiline variant="outlined" minRows={3} value={answeredBy?.reason} />
          </Box>
        )}
      </Grid>

      <Grid className={classes.cardFooter}>
        {!!answeredBy && (
          <Buttons.WithIcon rounded disabled={submitted} submitted={submitted} onClick={handleSubmit}>
            Save
            {submitted && <LockOutlined />}
          </Buttons.WithIcon>
        )}
      </Grid>
    </Grid>
  );
};

export default ViewQuestion;
