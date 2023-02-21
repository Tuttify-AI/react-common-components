import React, { useCallback } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Category } from 'src/types/forms';
import { InputLabel, TextField } from '@material-ui/core';

type Props = {
  options: Category[];
  value: Category | null;
  onChange: (value: Category) => void;
  label?: string;
  required?: boolean;
};

const CategoryField: React.FC<Props> = ({ options, value, onChange, label = '', required = false }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = options.find(o => o.name === e.target.value);
      if (selected) {
        onChange(selected);
      }
    },
    [onChange, options]
  );

  return (
    <>
      <InputLabel required={required}>{label}</InputLabel>
      <TextField
        required={required}
        select
        size="medium"
        fullWidth
        variant="outlined"
        onChange={handleChange}
        value={value?.name ?? ''}
      >
        {options.map(option => (
          <MenuItem key={option.name} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};

export default CategoryField;
