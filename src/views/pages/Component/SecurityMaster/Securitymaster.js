import React, { useState, useEffect } from 'react';
import ExportData from 'views/Export/ExportData';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Container,
  Stack,
  Divider
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup';

import { Formik, Form, Field } from 'formik';

const YourComponent = () => {
  const [loading, setLoading] = useState(false);
  const [securityDatas, setSecurityDatas] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);

  const baseUrl = 'http://localhost:6060/Service.svc';
  const endpoint = '/insertUpdateSecurityMasterService';
  const showLoadedData = '/showLoadedDataServivce';

  const validationSchema = Yup.object().shape({
    cusip: Yup.string().required('CUSIP is required'),
    description: Yup.string().required('Description is required')
    // sessionID: Yup.string().required("Session ID is required"),
  });

  useEffect(() => {
    const fetchSecurityDatas = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}${showLoadedData}`,
          { flag: 'SECURITYMASTER' },
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('View Data Response:', response.data);
        setSecurityDatas(response.data.response.securityDatas || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching security datas:', error);
        setError('Failed to fetch security datas');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityDatas();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setRowDataToEdit(null);
  };

  const handleCreate = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${baseUrl}${endpoint}`, {
        id: '',
        ...values,
        flag: 'I'
      });
      setSecurityDatas([...securityDatas, response.data]); // Update state with the new data
      setOpenModal(false); // Close the modal after successful creation
      Swal.fire('Success', 'New record created successfully', 'success');
    } catch (error) {
      setError('Failed to create');
      Swal.fire('Error', 'Failed to create new record', 'error');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const updateData = async (rowData, flag) => {
    try {
      setLoading(true);
      const requestData = {
        id: rowData.id,
        cusip: rowData.CUSIP,
        description: rowData.DESCRIPTION,
        sessionID: rowData.sessionID,
        flag
      };

      // Check if both id and cusip match the condition
      if (rowData.id === '@id' && rowData.CUSIP === '@cusip') {
        // Update the cusip field
        requestData.cusip = '@newCusip'; // Replace "@newCusip" with the new cusip value
      }

      const response = await axios.post('http://localhost:6060/Service.svc/insertUpdateSecurityMasterService', requestData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Update Data Response:', response.data);
      setMessage(response.data.response.message);
      setStatus(response.data.status);
      if (flag === 'd') {
        setSecurityDatas(securityDatas.filter((item) => item.id !== rowData.id));
      }
      setError(null);
    } catch (error) {
      console.error('Error updating/deleting security data:', error);
      setError('Failed to update/delete security data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rowData) => {
    setEditFields({
      id: rowData.id,
      cusip: rowData.CUSIP,
      description: rowData.DESCRIPTION
    });
    setEditDialogOpen(true);
    setRowDataToEdit(rowData);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditFields({});
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleEditSubmit = async (editData) => {
    try {
      setLoading(true);
      const requestData = {
        id: editData.id,
        cusip: editData.cusip,
        description: editData.description,
        flag: 'u'
      };
      const response = await axios.post('http://localhost:6060/Service.svc/insertUpdateSecurityMasterService', requestData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Update Data Response:', response.data);
      setMessage(response.data.response.message);
      setStatus(response.data.status);
      if (response.data.status === 'Fail') {
        Swal.fire('Error', response.data.response.message, 'error');
      } else {
        const updatedDatas = securityDatas.map((row) => {
          if (row.id === editData.id && row.CUSIP === editData.cusip) {
            return { ...row, ...editData };
          }
          return row;
        });
        setSecurityDatas(updatedDatas);
        handleEditDialogClose();
      }
    } catch (error) {
      console.error('Error updating security data:', error);
      Swal.fire('Error', 'Failed to update security data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (rowData) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        updateData(rowData, 'd');
        Swal.fire('Deleted!', 'Your data has been deleted.', 'success');
      }
    });
  };

  const columns = [
    { accessorKey: 'CUSIP', header: 'Description', minWidth: 100 },
    { accessorKey: 'DESCRIPTION', header: 'Cusip', minWidth: 150 },
    { accessorKey: 'createdon', header: 'Created On', minWidth: 120 },
    { accessorKey: 'createdby', header: 'Created by', minWidth: 120 },
    { accessorKey: 'updatedon', header: 'Updated On', minWidth: 120 },
    { accessorKey: 'updatedby', header: 'Updated by', minWidth: 100 },
    {
      accessorKey: 'actions',
      header: 'Actions',
      align: 'center',
      minWidth: 120,
      renderCell: (rowData) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleEdit(rowData)}>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => confirmDelete(rowData)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </>
      )
    }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Stack
          p={1}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          // divider={<Divider orientation="vertical" flexItem />}
        >
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Create
          </Button>
          <ExportData
            data={securityDatas}
            columns={columns}
            exportTypes={['csv', 'excel']}
            ExportFileName="Security_Master"
            isLoading={loading}
          />
        </Stack>
        <Table aria-label="Security Datas table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? securityDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : securityDatas).map(
              (row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} align={column.align}>
                      {column.renderCell ? column.renderCell(row) : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              )
            )}
            {loading || error ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ color: error ? 'red' : 'inherit' }}>
                  {loading ? <CircularProgress /> : `Error: ${error}`}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={securityDatas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} sx={{ maxWidth: 'xs' }}>
        <DialogTitle>Edit Data</DialogTitle>
        <DialogContent sx={{}}>
          <TextField
            label="CUSIP"
            name="cusip"
            value={editFields.cusip || ''}
            onChange={handleEditFieldChange}
            fullWidth
            sx={{ mb: 2, mt: 1 }} // Adding margin bottom
          />
          <TextField
            label="Description"
            name="description"
            value={editFields.description || ''}
            onChange={handleEditFieldChange}
            fullWidth
            sx={{ mb: 2 }} // Adding margin bottom
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => handleEditSubmit(editFields)} // Pass editFields as argument
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{rowDataToEdit ? 'Edit Security' : 'Add New Security'}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              id: '', // Set initial values here
              cusip: '',
              description: '',
              // sessionID: "",
              flag: ''
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);
                await handleCreate(values, { setSubmitting });
                handleCloseModal();
              } catch (error) {
                console.error('Error:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} mt={1}>
                    <TextField fullWidth name="cusip" label="CUSIP" variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth name="description" label="Description" variant="outlined" />
                  </Grid>
                  {/* <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="sessionID"
                          label="Session ID"
                          variant="outlined"
                        />
                      </Grid> */}
                </Grid>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="secondary" disabled={isSubmitting} variant="outlined">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" disabled={isSubmitting} variant="contained">
                    {rowDataToEdit ? 'Update' : 'Create'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default YourComponent;
