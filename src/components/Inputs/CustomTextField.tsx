import { TextField, alpha, useTheme } from '@mui/material';
import React from 'react';

export default function CustomTextField(props: any) {
  const theme = useTheme();
  return (
    <>
      <TextField
        {...props}
        placeholder={props.placeholder ? props.placeholder : ''}
        type={props.type ? props.type : 'text'}
        InputProps={{ disableUnderline: true }}
        variant="filled"
        maxRows="1"
        style={{
          border: `3px solid ${
            props.borderColor ? props.borderColor : theme.palette.secondary.main
          }`,
          borderRadius: '8px',
          borderColor: props.borderColor
            ? props.borderColor
            : theme.palette.secondary.main,
          borderStyle: 'solid',
          overflow: 'hidden',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.boxShadow = `0px 0px 5px 2px ${alpha(
            theme.palette.secondary.main,
            0.3,
          )}`)
        }
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
        inputProps={{
          sx: {
            fontSize: theme.typography.body2.fontSize,
            color: theme.palette.common.black,
            fontWeight: theme.typography.body2.fontWeight,
            fontFamily: theme.typography.body2.fontFamily,
            padding: '11.5px',
            backgroundColor: theme.palette.common.white,
          },
        }}
      />
    </>
  );
}
