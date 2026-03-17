import React, { FC } from 'react';
import { UserModel } from 'src/types/users';
import { AskedQuestionType } from 'src/types/enhanced-learning-types';
interface Props {
    questions: any[];
    isGetUserIdFromAskedBy: boolean;
    getUser: (userId: string) => Promise<void>;
    user: UserModel | null;
    questionItem: AskedQuestionType | undefined;
    setQuestionItem: (value: React.SetStateAction<AskedQuestionType | undefined>) => void;
}
declare const AskedList: FC<Props>;
export default AskedList;
