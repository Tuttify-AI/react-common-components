import React, { FC, useCallback, useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Grid, Button } from '@material-ui/core';
import { Toggle } from 'src/components/common';
import { Cancel } from '@material-ui/icons';
import { AskedQuestionType, InteractQuestionPayload } from 'src/types/enhanced-learning-types';
import HelpSubmit from './help-submit';
import ViewQuestion from './view-question';
import { getTabId } from 'src/utils/session-storage';
import { makeStyles } from '@material-ui/core/styles';
import { UserModel } from 'src/types/users';
import AskedList from './asked-list';

const useStyles = makeStyles(() => ({
  dialogContent: {
    minHeight: 600,
    overflowY: 'hidden',
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  tabsContent: {
    height: 600,
    overflowY: 'auto',
    '& div:first-child': {
      paddingRight: 20,
    },
  },
}));

type ToggleItemsType = {
  label: string;
  value: number;
};

type FetchAskedQuestionsParams = {
  room_id: string;
  page_num: number;
  page_size: number;
};

interface Props {
  isOpen: boolean;
  sessionId: string;
  roomId: string;
  questionId?: string;
  userId: string;
  onClose: () => void;
  fetchAskedQuestions: (params: FetchAskedQuestionsParams) => void;
  askedQuestions: any;
  interactAskSomeone: (params: any) => void;
  interactQuestion: (params: any) => void;
  toggleItems: ToggleItemsType[];
  getUser: (userId: string) => Promise<void>;
  user: UserModel | null;
}

const EnhancedLearning: FC<Props> = ({
  isOpen,
  sessionId,
  roomId,
  questionId,
  userId,
  onClose,
  fetchAskedQuestions,
  askedQuestions,
  interactAskSomeone,
  interactQuestion,
  toggleItems,
  getUser,
  user,
}) => {
  const classes = useStyles();
  const [questionType, setQuestionType] = useState(1);
  const [questionItem, setQuestionItem] = useState<AskedQuestionType | undefined>(undefined);

  const myQuestions = askedQuestions?.filter(item => item.asked_by.includes(userId)) || [];
  const otherQuestions = askedQuestions?.filter(item => !item.asked_by.includes(userId)) || [];

  const handleQuestionTypeChange = useCallback(
    item => {
      setQuestionType(item);
      setQuestionItem(undefined);
      fetchAskedQuestions({ room_id: roomId, page_num: 1, page_size: 40 });
    },
    [setQuestionType, roomId, fetchAskedQuestions]
  );

  const handleSubmit = useCallback(
    (question: { answer_id: number | string | undefined; reason: string }) => {
      const payload = {
        interaction_type: 'user_answered_someone',
        entity_id: '',
        tab_id: getTabId(),
        extra_data: {
          question_id: questionItem?.question._id,
          session_id: sessionId,
          answer_id: question?.answer_id,
          reason: question.reason,
        },
      };
      interactAskSomeone(payload);
      fetchAskedQuestions({ room_id: roomId, page_num: 1, page_size: 40 });
    },
    [questionItem?.question._id, sessionId, interactAskSomeone, fetchAskedQuestions, roomId]
  );

  useEffect(() => {
    fetchAskedQuestions({ room_id: roomId, page_num: 1, page_size: 40 });
  }, [fetchAskedQuestions, roomId]);

  useEffect(() => {
    if (askedQuestions && questionId) {
      const selected = askedQuestions.find(item => item.question._id === questionId);
      setQuestionItem(selected);
      setQuestionType(1);
    }
  }, [questionId]);

  const handleQuestionSubmit = async (payload: InteractQuestionPayload) => {
    await interactQuestion({ data: payload });
  };

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>
        <Button onClick={onClose} id="question_help_close">
          <Cancel fontSize="large" />
        </Button>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={4}>
          <Grid item container justifyContent="center" xs={12}>
            <Toggle items={toggleItems} value={questionType} onChange={handleQuestionTypeChange} />
          </Grid>

          <Grid item container justifyContent="center" xs={12} className={classes.tabsContent}>
            {questionType === 2 && (
              <>
                <Grid item xs={5}>
                  <Box py={2}>Try to help answer your friends questions</Box>

                  <AskedList
                    questions={otherQuestions}
                    isGetUserIdFromAskedBy
                    getUser={getUser}
                    user={user}
                    questionItem={questionItem}
                    setQuestionItem={setQuestionItem}
                  />
                </Grid>

                <Grid item xs={6}>
                  {questionItem && (
                    <HelpSubmit {...questionItem.question} key={questionItem.question._id} submit={handleSubmit} />
                  )}
                </Grid>
              </>
            )}

            {questionType === 1 && (
              <>
                <Grid item xs={5}>
                  <Box py={2}>Here are your questions waiting for answers.</Box>

                  <AskedList
                    questions={myQuestions}
                    isGetUserIdFromAskedBy={false}
                    getUser={getUser}
                    user={user}
                    questionItem={questionItem}
                    setQuestionItem={setQuestionItem}
                  />
                </Grid>

                <Grid item xs={6}>
                  {questionItem && (
                    <ViewQuestion
                      {...questionItem.question}
                      key={questionItem.question._id}
                      answeredBy={questionItem.answered_by[0]}
                      submit={handleQuestionSubmit}
                      interactAskSomeone={interactAskSomeone}
                    />
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedLearning;
