import '@/styles/nprogress.scss';
import { Alert, CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
import NProgress from 'nprogress';
import React, { useReducer } from 'react';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// import createEmotionCache from '@/utilities/createEmotionCache';

// const clientSideEmotionCache = createEmotionCache();

import MainLayout from '@/components/layouts/MainLayout';
import { TransitionUp } from '@/components/Transitions';
import { SnackbarService } from '@/lib/contexts';
import {
  AppContext,
  appReducer,
  initialState,
} from '@/lib/contexts/appContext';
import useSnackbar from '@/lib/hooks/useSnackbar';
import theme from '@/styles/themes/lightTheme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';

const MyApp = (props: AppProps) => {
  // #region States

  // For the cart and payment page
  const [state, dispatch] = useReducer(appReducer, initialState);

  // #endregion

  //#region Hooks

  const { Component, pageProps } = props;

  const {
    snackbarOpen,
    snackbarText,
    snackbarSeverity,
    handleSnackbarAlert,
    handleSnackbarClose,
  } = useSnackbar();

  //#endregion

  return (
    <>
      <Head>
        <title>H&H Bakery</title>
      </Head>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <CacheProvider value={emotionCache}> */}
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={{ state, dispatch }}>
            <SnackbarService.Provider value={{ handleSnackbarAlert }}>
              <CssBaseline />
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                TransitionComponent={TransitionUp}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity={snackbarSeverity}
                  sx={{ width: '100%' }}
                >
                  {snackbarText}
                </Alert>
              </Snackbar>
            </SnackbarService.Provider>
          </AppContext.Provider>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
};

export default MyApp;
