import { db } from '@/firebase/config';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DocumentData, doc, deleteDoc } from 'firebase/firestore';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Add } from '@mui/icons-material';
import { CollectionName } from '@/lib/models/utilities';
import { getCollection } from '@/lib/firestore/firestoreLib';
import RowModal from '@/components/Manage/modals/rowModals/RowModal';
import { CustomDataTable } from '@/components/Manage/tables';
import { TableActionButton } from '@/components/Manage/tables/TableActionButton';
import {
  manageReducer,
  ManageActionType,
  crudTargets,
  ManageState,
  generateDefaultRow,
} from '@/lib/localLib/manage';
import { MyMultiValuePickerInput } from '@/components/Inputs';
import { useSnackbarService } from '@/lib/contexts';
import { ManageContext } from '@/lib/contexts/manageContext';

//#region Constants

const LOADING_TEXT = 'Loading...';
const PATH = '/manager/manage';

const initManageState: ManageState = {
  mainDocs: [],
  searchText: '',
  mainCollectionName: CollectionName.None,
  selectedTarget: crudTargets[0],
  displayingData: null,
  loading: false,
  dialogOpen: false,
  crudModalOpen: false,
  crudModalMode: 'none',
  deletingId: '',
  isDisplayActiveOnly: true,
};

//#endregion

export default function Manage({
  mainDocs: paramMainDocs,
  collectionName: paramCollectionName,
}: {
  mainDocs: string;
  collectionName: string;
}) {
  //#region States

  const [state, dispatch] = useReducer(manageReducer, {
    ...initManageState,
    selectedTarget:
      crudTargets.find((t) => t.collectionName === paramCollectionName) ??
      crudTargets[0],
  });

  const [justLoaded, setJustLoaded] = useState(true);

  //#endregion

  //#region Hooks

  const theme = useTheme();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region useEffects

  useEffect(() => {
    if (!state.crudModalOpen) return;

    resetDisplayingData();
  }, [state.selectedTarget]);

  useEffect(() => {
    const mainDocs = JSON.parse(paramMainDocs) as DocumentData[];

    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: mainDocs,
    });
  }, [paramMainDocs]);

  useEffect(() => {
    router.push(
      `${PATH}?collectionName=${state.selectedTarget.collectionName}`,
    );
  }, [state.selectedTarget]);

  useEffect(() => {
    if (!justLoaded) return;

    if (!paramCollectionName) return;

    dispatch({
      type: ManageActionType.SET_SELECTED_TARGET,
      payload: crudTargets.find(
        (t) => t.collectionName === paramCollectionName,
      ),
    });

    setJustLoaded(false);
  }, [paramCollectionName]);

  //#endregion

  //#region Functions

  const resetDisplayingData = () => {
    const collectionName = state.selectedTarget.collectionName;
    if (collectionName === CollectionName.None) return;

    dispatch({
      type: ManageActionType.SET_DISPLAYING_DATA,
      payload: generateDefaultRow(collectionName),
    });
  };

  //#endregion

  // #region useMemos

  const rowText = useMemo(() => {
    switch (state.selectedTarget?.collectionName) {
      case CollectionName.ProductTypes:
        return 'Thêm loại sản phẩm';
      case CollectionName.Products:
        return 'Thêm sản phẩm';
      case CollectionName.Batches:
        return 'Thêm lô hàng';
      default:
        return 'Lỗi khi load text';
    }
  }, [state.selectedTarget]);

  const isTableEmpty = useMemo(() => {
    return state.mainDocs.length === 0;
  }, [state.mainDocs]);

  const namesForSearchBar = useMemo(() => {
    return state.mainDocs.map((d: DocumentData) => d.name);
  }, [state.mainDocs]);

  // #endregion

  //#region Handlers

  /**
   * Updates the targets state when the value of the CRUD target selection has changed.
   *
   * @param {any} e - The event object passed from the target selection component.
   * @param {any} newValue - The new value selected in the target selection component.
   * @return {void} - This function does not return anything.
   */
  const handleCrudTargetChanged = (e: any, newValue: any) => {
    if (!newValue) return;

    dispatch({
      type: ManageActionType.SET_SELECTED_TARGET,
      payload: newValue,
    });
  };

  const handleClickOpen = () => {
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: true,
    });
  };

  const handleClose = () => {
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: false,
    });
  };

  const handleNewRow = () => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_MODE,
      payload: 'create',
    });

    resetDisplayingData();

    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: true,
    });
  };

  const handleCloseModal = () => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: false,
    });
  };

  const handleViewRow = (doc: DocumentData) => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_MODE,
      payload: 'view',
    });
    dispatch({
      type: ManageActionType.SET_DISPLAYING_DATA,
      payload: doc,
    });
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: true,
    });
  };

  const handleDeleteRowOnFirestore = (id: string) => {
    // Display modal
    dispatch({
      type: ManageActionType.SET_DELETING_ID,
      payload: id,
    });
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: true,
    });
  };

  const handleDeleteDocumentOnFirestore = async () => {
    dispatch({
      type: ManageActionType.SET_LOADING,
      payload: true,
    });

    const id = state.deletingId;

    try {
      await deleteDoc(doc(db, state.selectedTarget.collectionName, id));
      console.log('Document deleted successfully!');
      handleSnackbarAlert('success', 'Xóa thành công');
    } catch (error) {
      console.log('Error deleting document:', error);
    }

    dispatch({
      type: ManageActionType.SET_LOADING,
      payload: false,
    });

    // Remove row from table
    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: state.mainDocs.filter((doc: DocumentData) => doc.id !== id),
    });
    dispatch({
      type: ManageActionType.SET_DELETING_ID,
      payload: '',
    });
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: false,
    });
  };

  const handleSearch = (e: any, searchText: string) => {
    dispatch({
      type: ManageActionType.SET_SEARCH_TEXT,
      payload: searchText,
    });
  };

  const handleSearchFilter = (docs: DocumentData[]) => {
    if (
      !state.searchText ||
      state.searchText.length === 0 ||
      state.searchText === ''
    )
      return docs;

    return docs.filter((doc) => doc.name === state.searchText);
  };

  //#endregion

  // #region Logs

  // #endregion

  return (
    <ManageContext.Provider
      value={{
        state,
        dispatch,
        handleDeleteRowOnFirestore,
        handleViewRow,
        resetDisplayingData,
        handleSearchFilter,
      }}
    >
      <Container
        sx={{
          my: 2,
        }}
      >
        {/* Title */}
        <Typography sx={{ color: theme.palette.common.black }} variant="h4">
          Quản lý kho
        </Typography>
        <Divider
          sx={{
            mt: 2,
          }}
        />
        {/* CRUD target */}
        {/* <Autocomplete
          disablePortal
          id="crudtarget-select"
          inputValue={state.selectedTarget?.label || LOADING_TEXT}
          value={state.selectedTarget}
          onChange={handleCrudTargetChanged}
          options={crudTargets}
          sx={{ mt: 4, width: 300 }}
          renderInput={(params) => <TextField {...params} label="Kho" />}
        /> */}

        <MyMultiValuePickerInput
          label="Kho"
          options={crudTargets.map((target) => target.label)}
          value={state.selectedTarget.label}
          onChange={(value) =>
            dispatch({
              type: ManageActionType.SET_SELECTED_TARGET,
              payload: crudTargets.find((target) => target.label === value),
            })
          }
        />

        <Divider
          sx={{
            marginY: '1rem',
          }}
        />

        {/* Manage Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent:
              state.selectedTarget.collectionName !== 'batches'
                ? 'space-between'
                : 'end',
            alignItems: 'center',
            my: '1rem',
          }}
        >
          {state.selectedTarget.collectionName !== 'batches' && (
            <Autocomplete
              freeSolo
              sx={{
                width: 400,
              }}
              id="search-bar"
              disableClearable
              options={namesForSearchBar}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tìm kiếm"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
              onInputChange={handleSearch}
            />
          )}

          <FormControlLabel
            labelPlacement="start"
            control={
              <Switch
                color="secondary"
                checked={state.isDisplayActiveOnly}
                onChange={(e) => {
                  dispatch({
                    type: ManageActionType.SET_DISPLAY_ACTIVE_ONLY,
                    payload: e.target.checked,
                  });
                }}
              />
            }
            label={
              <Typography variant="body2">Chỉ hiện còn cung cấp</Typography>
            }
          />
          <Divider
            orientation="vertical"
            sx={{
              mx: 1,
            }}
          />

          <TableActionButton
            startIcon={<Add />}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.common.darkGray,
            }}
            onClick={handleNewRow}
          >
            <Typography variant="body2">{rowText}</Typography>
          </TableActionButton>
        </Box>

        <CustomDataTable />

        {isTableEmpty && (
          <Card
            sx={{
              width: '100%',
              padding: '1rem',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: (theme) => theme.palette.secondary.main,
              }}
            >
              Không dữ liệu
            </Typography>
          </Card>
        )}

        <Divider
          sx={{
            mt: 4,
          }}
        />
        {/* Dialogs */}
        <Dialog
          open={state.dialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          color="secondary"
        >
          <DialogTitle id="alert-dialog-title">{'Xóa đối tượng'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc muốn xóa?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Thoát
            </Button>
            <Button
              onClick={handleDeleteDocumentOnFirestore}
              autoFocus
              color="secondary"
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modals */}
        {state.crudModalOpen && <RowModal />}
      </Container>
    </ManageContext.Provider>
  );
}

/**
 * Returns server-side props for the page.
 *
 * @param {Object} context - The context object received from Next.js.
 * @returns {Object} The server-side props object.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59',
  );

  // Extract the collection name from the query parameter of the URL.
  const collectionName: string | null = context.query.collectionName as
    | string
    | null;

  // If the collection name is not present in the URL, redirect to the first collection.
  if (!collectionName || collectionName === 'undefined') {
    const firstCollection = crudTargets[0].collectionName;
    return {
      redirect: {
        destination: `${PATH}?collectionName=${firstCollection}`,
        permanent: false,
      },
    };
  }

  // Get the documents from the specified collection.
  const rawMainDocs = await getCollection<DocumentData>(collectionName);
  const mainDocs = JSON.stringify(rawMainDocs);

  console.group(rawMainDocs);

  // Return the main documents as props.
  return {
    props: {
      mainDocs,
      collectionName,
    },
  };
};
