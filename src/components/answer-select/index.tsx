import React from 'react';
import classNames from 'classnames';
import { AnswerSelectType } from './types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useAnswerSelect from './use-answer-select';
import { Image } from '../common';
import theme from 'src/styles/theme';

const useStyles = makeStyles(() => ({
  questionSelect: {
    display: 'flex',
    flexDirection: 'column',
    '&$disable': {
      pointerEvents: 'none',
    },
  },
  disable: {},
  question: {
    minHeight: theme.spacing(6.125),
    padding: '8px 16px',
    borderRadius: theme.spacing(0.75),
    backgroundColor: '#eaeaea',
    boxSizing: 'border-box',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:last-child': {
      marginBottom: 0,
    },
    '&$active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    '&$correct': {
      borderStyle: 'solid',
      borderWidth: 2,
      borderColor: '#44d7b6',
    },
    '&$incorrect': {
      borderStyle: 'solid',
      borderWidth: 2,
      borderColor: '#d22a2a',
    },
  },
  active: {},
  incorrect: {},
  correct: {},
  question_txt: {},
}));
const AnswerSelect: React.FC<AnswerSelectType> = ({ answers, answer, answerResult, disable, onSelect }) => {
  const classes = useStyles();
  const { clickItem } = useAnswerSelect({ onSelect });
  return (
    <Grid
      className={classNames({
        [`${classes.questionSelect}`]: true,
        [`${classes.disable}`]: disable,
      })}
    >
      {answers?.map((item: string, index) => {
        const active = item === answer;
        const isCorrect = item === answerResult?.correct_answer;
        const isIncorrect = active && answerResult && item !== answerResult.correct_answer;

        return (
          <Grid
            key={index}
            className={classNames({
              [`${classes.question}`]: true,
              [`${classes.active}`]: active,
              [`${classes.incorrect}`]: isIncorrect,
              [`${classes.correct}`]: isCorrect,
            })}
            onClick={() => clickItem(item)}
          >
            <Typography className={classes.question_txt}>{item}</Typography>
            <Image src="/icons/circle-check.png" width="26" alt="" staticImage />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AnswerSelect;
