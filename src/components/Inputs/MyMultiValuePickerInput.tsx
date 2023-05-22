import { useSnackbarService } from '@/lib/contexts';
import { Typography, Chip, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
  memo,
} from 'react';
import { NewValueChip } from '../Manage/modals/forms/components';
import { optimizeFonts } from '../../../next.config';

interface MyMultiValuePickerInputProps {
  label: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const MyMultiValuePickerInput = (
  props: MyMultiValuePickerInputProps,
  ref?: ForwardedRef<string>,
) => {
  //#region States

  const [currentValue, setCurrentValue] = useState<string>(
    props.value ?? props.options[0],
  );

  // #endregion

  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  //#endregion

  // #regin refs

  useImperativeHandle(ref, () => currentValue, [currentValue]);

  // #endregion

  //#region useEffects

  useEffect(() => {
    props.onChange(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (!props.value) setCurrentValue(() => props.options[0]);
  }, [props.options]);

  useEffect(() => {
    if (props.value) setCurrentValue(() => props.value ?? props.options[0]);
  }, [props.value]);

  //#endregion

  //#region Handlers

  const handleChipClick = (value: string) => {
    if (props.readOnly) {
      handleSnackbarAlert('error', 'Không thể thay đổi ở chế độ xem');
      return;
    }

    setCurrentValue(() => value);
  };

  //#endregion

  return (
    <Stack spacing={1}>
      <Typography
        sx={{ color: theme.palette.common.black }}
        variant="body1"
        fontWeight="bold"
      >
        {props.label}
      </Typography>
      <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
        {props.options.map((value) => (
          <Chip
            key={value}
            label={value}
            sx={{
              color: theme.palette.common.black,
              border:
                currentValue === value
                  ? `1px solid ${theme.palette.secondary.main}`
                  : '',
            }}
            onClick={() => handleChipClick(value)}
          />
        ))}

        {props.options.length === 0 && (
          <Typography variant="body2">Không có lựa chọn</Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default memo(forwardRef(MyMultiValuePickerInput));
