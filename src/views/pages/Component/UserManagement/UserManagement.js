// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   TablePagination,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Box,
//   Switch,
//   Stack,
//   Divider
// } from '@mui/material';

// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import * as Yup from 'yup';
// import CreateUsers from './CreateUsers';
// import MainCard from 'ui-component/cards/MainCard';

// const YourComponent = () => {
//   const [loading, setLoading] = useState(false);
//   const [usersDatas, setusersDatas] = useState([]);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editFields, setEditFields] = useState({});
//   const [message, setMessage] = useState('');
//   const [status, setStatus] = useState('');
//   const [openModal, setOpenModal] = useState(false);
//   const [rowDataToEdit, setRowDataToEdit] = useState(null);

//   const baseUrl = 'http://localhost:6060/Service.svc';
//   const endpoint = '/insertUpdateSecurityMasterService';
//   const viewEndpoint = '/showLoadedDataServivce';

//   const validationSchema = Yup.object().shape({
//     cusip: Yup.string().required('CUSIP is required'),
//     description: Yup.string().required('Description is required')
//     // sessionID: Yup.string().required("Session ID is required"),
//   });

//   useEffect(() => {
//     const fetchusersDatas = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           'http://localhost:6060/Service.svc/showLoadedDataServivce',
//           { flag: 'SECURITYMASTER' },
//           { headers: { 'Content-Type': 'application/json' } }
//         );
//         console.log('View Data Response:', response.data);
//         setusersDatas(response.data.response.usersDatas || []);
//         setError(null);
//       } catch (error) {
//         console.error('Error fetching datas:', error);
//         setError('Failed to fetch datas');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchusersDatas();
//   }, []);

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setRowDataToEdit(null);
//   };

//   // Handle Create
//   const handleCreate = async (values, { setSubmitting }) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(`${baseUrl}${endpoint}`, {
//         id: '',
//         ...values,
//         flag: 'I'
//       });
//       setusersDatas([...usersDatas, response.data]); // Update state with the new data
//       setOpenModal(false); // Close the modal after successful creation
//       Swal.fire('Success', 'New record created successfully', 'success');
//     } catch (error) {
//       setError('Failed to create');
//       Swal.fire('Error', 'Failed to create new record', 'error');
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//   // Handle edit
//   const handleEdit = (rowData) => {
//     setEditFields({
//       id: rowData.id
//     });
//     setEditDialogOpen(true);
//     setRowDataToEdit(rowData);
//   };

//   const handleEditDialogClose = () => {
//     setEditDialogOpen(false);
//     setEditFields({});
//   };

//   const handleEditFieldChange = (e) => {
//     const { name, value } = e.target;
//     setEditFields((prevFields) => ({ ...prevFields, [name]: value }));
//   };

//   const handleEditSubmit = async (editData) => {
//     try {
//       setLoading(true);
//       const requestData = {
//         id: editData.id,
//         cusip: editData.cusip,
//         description: editData.description,
//         flag: 'u'
//       };
//       const response = await axios.post('http://localhost:6060/Service.svc/insertUpdateSecurityMasterService', requestData, {
//         headers: { 'Content-Type': 'application/json' }
//       });
//       console.log('Update Data Response:', response.data);
//       setMessage(response.data.response.message);
//       setStatus(response.data.status);
//       if (response.data.status === 'Fail') {
//         Swal.fire('Error', response.data.response.message, 'error');
//       } else {
//         const updatedDatas = usersDatas.map((row) => {
//           if (row.id === editData.id && row.CUSIP === editData.cusip) {
//             return { ...row, ...editData };
//           }
//           return row;
//         });
//         setusersDatas(updatedDatas);
//         handleEditDialogClose();
//       }
//     } catch (error) {
//       console.error('Error updating security data:', error);
//       Swal.fire('Error', 'Failed to update security data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = (rowData) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: 'You will not be able to recover this data!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         updateData(rowData, 'd');
//         Swal.fire('Deleted!', 'Your data has been deleted.', 'success');
//       }
//     });
//   };

//   const updateData = async (rowData, flag) => {
//     try {
//       setLoading(true);
//       const requestData = {
//         id: rowData.id,
//         cusip: rowData.CUSIP,
//         description: rowData.DESCRIPTION,
//         sessionID: rowData.sessionID,
//         flag
//       };

//       // Check if both id and cusip match the condition
//       if (rowData.id === '@id' && rowData.CUSIP === '@cusip') {
//         // Update the cusip field
//         requestData.cusip = '@newCusip'; // Replace "@newCusip" with the new cusip value
//       }

//       const response = await axios.post('http://localhost:6060/Service.svc/insertUpdateSecurityMasterService', requestData, {
//         headers: { 'Content-Type': 'application/json' }
//       });
//       console.log('Update Data Response:', response.data);
//       setMessage(response.data.response.message);
//       setStatus(response.data.status);
//       if (flag === 'd') {
//         setusersDatas(usersDatas.filter((item) => item.id !== rowData.id));
//       }
//       setError(null);
//     } catch (error) {
//       console.error('Error updating/deleting Users  data:', error);
//       setError('Failed to update/delete Users data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSwitchChange = (rowData) => {
//     // Implement your logic for handling switch change
//     console.log('Switch changed for:', rowData);
//   };

//   const columns = [
//     { accessorKey: 'Username', header: 'Username', minWidth: 100 },
//     { accessorKey: 'Firstname', header: 'First Name', minWidth: 150 },
//     { accessorKey: 'lastnme', header: 'Last Name', minWidth: 120 },
//     { accessorKey: 'emailid', header: 'E-mail', minWidth: 120 },
//     { accessorKey: 'Ststus', header: 'Status', minWidth: 120 },
//     { accessorKey: 'updatedby', header: 'Updated by', minWidth: 130 },
//     {
//       accessorKey: 'actions',
//       header: 'Actions',
//       align: 'center',
//       minWidth: 120,
//       renderCell: (rowData) => (
//         <>
//           <IconButton aria-label="edit" onClick={() => handleEdit(rowData)}>
//             <EditIcon fontSize="small" color="primary" />
//           </IconButton>
//           <IconButton aria-label="delete" onClick={() => confirmDelete(rowData)}>
//             <DeleteIcon fontSize="small" color="error" />
//           </IconButton>
//         </>
//       )
//     },
//     {
//       accessorKey: 'switch',
//       header: 'Status',
//       align: 'center',
//       minWidth: 120,
//       renderCell: (rowData) => <Switch checked={rowData.status === 'active'} onChange={() => handleSwitchChange(rowData)} />
//     }
//   ];

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <>
//       <Box>
//         <MainCard title=" User Management">
//           <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
//             <Button variant="contained" onClick={() => setOpenModal(true)}>
//               Create
//             </Button>
//           </Stack>
//           {/* <Divider /> */}
//           <TableContainer>
//             <Table aria-label="Users Datas table">
//               <TableHead>
//                 <TableRow>
//                   {columns.map((column, index) => (
//                     <TableCell key={index} align={column.align} sx={{ minWidth: column.minWidth }}>
//                       {column.header}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {(rowsPerPage > 0 ? usersDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : usersDatas).map(
//                   (row, rowIndex) => (
//                     <TableRow key={rowIndex}>
//                       {columns.map((column, colIndex) => (
//                         <TableCell key={colIndex} align={column.align}>
//                           {column.renderCell ? column.renderCell(row) : row[column.accessorKey]}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   )
//                 )}
//                 {loading || error ? (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} align="center" sx={{ color: error ? 'red' : 'inherit' }}>
//                       {loading ? <CircularProgress /> : `Error: ${error}`}
//                     </TableCell>
//                   </TableRow>
//                 ) : null}
//               </TableBody>
//             </Table>
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={usersDatas.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </TableContainer>
//         </MainCard>

//         <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
//           <DialogTitle>Edit Data</DialogTitle>
//           <DialogContent>
//             <TextField
//               label="CUSIP"
//               name="cusip"
//               value={editFields.cusip || ''}
//               onChange={handleEditFieldChange}
//               fullWidth
//               sx={{ mb: 2, mt: 1 }} // Adding margin bottom
//             />
//             <TextField
//               label="Description"
//               name="description"
//               value={editFields.description || ''}
//               onChange={handleEditFieldChange}
//               fullWidth
//               sx={{ mb: 2 }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleEditDialogClose} variant="outlined">
//               Cancel
//             </Button>
//             <Button onClick={() => handleEditSubmit(editFields)} color="primary" variant="contained">
//               Submit
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog open={openModal} onClose={handleCloseModal}>
//           <DialogTitle>{rowDataToEdit ? 'Edit Security' : 'Add New Security'}</DialogTitle>
//           <DialogContent>
//             <CreateUsers onClose={handleCloseModal} />
//           </DialogContent>
//         </Dialog>
//       </Box>
//     </>
//   );
// };

// export default YourComponent;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  Stack,
  Divider
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup';
import CreateUsers from './CreateUsers';
import MainCard from 'ui-component/cards/MainCard';

const YourComponent = () => {
  const [loading, setLoading] = useState(false);
  const [usersDatas, setusersDatas] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetFields, setResetFields] = useState({
    userId: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);

  const baseUrl = 'http://localhost:6060/Service.svc';
  const endpoint = '/insertUpdateSecurityMasterService';
  const viewEndpoint = '/showLoadedDataServivce';

  const validationSchema = Yup.object().shape({
    cusip: Yup.string().required('CUSIP is required'),
    description: Yup.string().required('Description is required')
  });

  useEffect(() => {
    const fetchusersDatas = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:6060/Service.svc/showLoadedDataServivce',
          { flag: 'SECURITYMASTER' },
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('View Data Response:', response.data);
        setusersDatas(response.data.response.usersDatas || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching datas:', error);
        setError('Failed to fetch datas');
      } finally {
        setLoading(false);
      }
    };

    fetchusersDatas();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setRowDataToEdit(null);
  };

  // Handle Create
  const handleCreate = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${baseUrl}${endpoint}`, {
        id: '',
        ...values,
        flag: 'I'
      });
      setusersDatas([...usersDatas, response.data]); // Update state with the new data
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

  // Handle edit
  const handleEdit = (rowData) => {
    setEditFields({
      id: rowData.id
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
        const updatedDatas = usersDatas.map((row) => {
          if (row.id === editData.id && row.CUSIP === editData.cusip) {
            return { ...row, ...editData };
          }
          return row;
        });
        setusersDatas(updatedDatas);
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
        setusersDatas(usersDatas.filter((item) => item.id !== rowData.id));
      }
      setError(null);
    } catch (error) {
      console.error('Error updating/deleting Users  data:', error);
      setError('Failed to update/delete Users data');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = (rowData) => {
    // Implement your logic for handling switch change
    console.log('Switch changed for:', rowData);
  };

  const columns = [
    { accessorKey: 'Username', header: 'Username', minWidth: 100 },
    { accessorKey: 'Firstname', header: 'First Name', minWidth: 150 },
    { accessorKey: 'lastnme', header: 'Last Name', minWidth: 120 },
    { accessorKey: 'emailid', header: 'E-mail', minWidth: 120 },
    { accessorKey: 'Ststus', header: 'Status', minWidth: 120 },
    { accessorKey: 'updatedby', header: 'Updated by', minWidth: 130 },
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
    },
    {
      accessorKey: 'switch',
      header: 'Status',
      align: 'center',
      minWidth: 120,
      renderCell: (rowData) => <Switch checked={rowData.status === 'active'} onChange={() => handleSwitchChange(rowData)} />
    }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReset = () => {
    setResetFields({
      userId: rowDataToEdit.Username, // Assuming Username is the ID field
      password: '',
      confirmPassword: ''
    });
    setResetDialogOpen(true);
  };

  const handleResetFieldChange = (e) => {
    const { name, value } = e.target;
    setResetFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleResetSubmit = () => {
    // Implement logic to handle password reset
    console.log('Reset Fields:', resetFields);
    setResetDialogOpen(false);
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
    setResetFields({
      userId: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <>
      <Box>
        <MainCard title=" User Management">
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Button variant="contained" onClick={() => setOpenModal(true)}>
              Create
            </Button>
          </Stack>
          <TableContainer>
            <Table aria-label="Users Datas table">
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
                {(rowsPerPage > 0 ? usersDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : usersDatas).map(
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
              count={usersDatas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </MainCard>

        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>Edit Data</DialogTitle>
          <DialogContent>
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
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleReset} variant="outlined">
              Reset
            </Button>
            <Button onClick={() => handleEditSubmit(editFields)} color="primary" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={resetDialogOpen} onClose={handleCloseResetDialog}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              label="User ID"
              name="userId"
              value={resetFields.userId}
              onChange={handleResetFieldChange}
              fullWidth
              sx={{ mb: 2, mt: 1 }} // Adding margin bottom
              disabled
            />
            <TextField
              type="password"
              label="Password"
              name="password"
              value={resetFields.password}
              onChange={handleResetFieldChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={resetFields.confirmPassword}
              onChange={handleResetFieldChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResetDialog} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleResetSubmit} color="primary" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>{rowDataToEdit ? 'Edit Security' : 'Add New Security'}</DialogTitle>
          <DialogContent>
            <CreateUsers onClose={handleCloseModal} />
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default YourComponent;
