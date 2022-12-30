import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { UserModel } from 'src/types/users';
import AskedListItem from './asked-list-item';
import { AskedQuestionType } from 'src/types/enhanced-learning-types';
import { useCustomScroll } from 'src/styles/theme/customScroll';

const useStyles = makeStyles(() => ({
  questionsList: {
    overflowY: 'auto',
    height: 500,
    paddingRight: 5,
  },
}));

interface Props {
  questions: any[];
  isGetUserIdFromAskedBy: boolean;
  getUser: (userId: string) => Promise<void>;
  user: UserModel | null;
  questionItem: AskedQuestionType | undefined;
  setQuestionItem: (value: React.SetStateAction<AskedQuestionType | undefined>) => void;
}

const AskedList: FC<Props> = ({ questions, isGetUserIdFromAskedBy, getUser, user, questionItem, setQuestionItem }) => {
  const classes = useStyles();
  const scrollClasses = useCustomScroll();

  return (
    <Grid className={classNames(classes.questionsList, scrollClasses.scroll)}>
      {questions.map((item, index) => (
        <AskedListItem
          key={index}
          userId={isGetUserIdFromAskedBy ? item.asked_by[0] : item.answered_by[0]?.user_id}
          getUser={getUser}
          user={user}
          title={item?.question?.text}
          selected={questionItem?.question._id === item.question._id}
          onClick={() => setQuestionItem(item)}
        />
      ))}
    </Grid>
  );
};

export default AskedList;
