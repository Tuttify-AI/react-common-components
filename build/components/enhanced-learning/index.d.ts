import { FC } from 'react';
import { UserModel } from 'src/types/users';
declare type ToggleItemsType = {
    label: string;
    value: number;
};
declare type FetchAskedQuestionsParams = {
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
declare const EnhancedLearning: FC<Props>;
export default EnhancedLearning;
