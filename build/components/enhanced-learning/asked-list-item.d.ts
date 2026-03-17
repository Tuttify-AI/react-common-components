import { FC } from 'react';
import { UserModel } from 'src/types/users';
interface Props {
    userId: string;
    getUser: (userId: string) => Promise<void>;
    user: UserModel | null;
    title: string | null | undefined;
    selected: boolean;
    onClick?: () => void;
}
declare const AskedListItem: FC<Props>;
export default AskedListItem;
