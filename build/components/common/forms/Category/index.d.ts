import React from 'react';
import { Category } from 'src/types/forms';
declare type Props = {
    options: Category[];
    value: Category | null;
    onChange: (value: Category) => void;
    label?: string;
    required?: boolean;
};
declare const CategoryField: React.FC<Props>;
export default CategoryField;
