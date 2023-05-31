import { CaiKhungCoTitle } from '@/components/Layouts/components/CaiKhungCoTitle';
import ImageBackground from '@/components/imageBackground';
import { Box, Button, Grid, Link, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { createContext, memo, useEffect, useState } from 'react';

// #region Context
interface PaymentResultContextType {
  billInfor: any;
  productInfor: any;
}

const initSearchContext: PaymentResultContextType = {
  billInfor: [],
  productInfor: [],
};

const SearchContext =
  createContext<PaymentResultContextType>(initSearchContext);
// #endregion

const resolveResponseCode = (responseCode: string) => {
  switch (responseCode) {
    case '00':
      return 'Thanh toán thành công';
    case '07':
      return 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).';
    case '09':
      return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.';
    case '10':
      return 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';
    case '11':
      return 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '12':
      return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.';
    case '13':
      return 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '24':
      return 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
    case '51':
      return 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch. Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '65':
      return 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.';
    case '75':
      return 'Ngân hàng thanh toán đang bảo trì.';
    case '79':
      return 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '99':
      return 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)';
    default:
      return 'Lỗi không xác định';
  }
};

const PaymentResult = () => {
  const theme = useTheme();

  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [billId, setBillId] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const queryArgs: any = router.query;

    const { vnp_ResponseCode: responseCode, vnp_TxnRef: billId } = queryArgs;

    if (['00', '07'].includes(responseCode)) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }

    setBillId(() => billId);

    const responseMessage = resolveResponseCode(responseCode);

    setResponseMessage(() => responseMessage);
  });

  return (
    <Box sx={{ pb: 16 }}>
      <ImageBackground>
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          height={'100%'}
          sx={{ px: 6 }}
        >
          <Grid item xs={12}>
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              spacing={2}
            >
              <Grid item xs={12}>
                <Typography
                  align="center"
                  variant="h2"
                  color={theme.palette.primary.main}
                >
                  {responseMessage}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ImageBackground>

      <Box sx={{ pt: 4, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
        <Grid
          container
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={4}
        >
          <Grid item xs={12}>
            <CaiKhungCoTitle title={'Hóa đơn của bạn'}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
                spacing={2}
              >
                <Grid item xs={5}>
                  <Typography
                    align="left"
                    variant="h3"
                    color={theme.palette.common.black}
                  >
                    Mã hóa đơn:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography
                    align="right"
                    variant="body1"
                    color={theme.palette.common.black}
                  >
                    {billId}
                  </Typography>
                </Grid>
              </Grid>
            </CaiKhungCoTitle>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={() => router.push('/cart')}>
              Trở về giỏ hàng
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default memo(PaymentResult);
