import { ButtonProps } from '@material-ui/core/Button';

export interface ButtonType extends ButtonProps {
  //eslint-disable-next-line
  children: any;
  icon?: string;
  plain?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  submitted?: boolean;
  width?: number | 'initial';
  height?: number;
  onClick?: () => void;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  key?: string | number;
}
