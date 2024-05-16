// import React, { useState } from 'react';
// import {
//   Button,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Box,
//   Container,
//   TablePagination,
//   Grid
// } from '@mui/material';
// import axios from 'axios';

// function Cusip() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   async function fetchData(flag) {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         'http://localhost:6060/Service.svc/showLoadedDataServivce',
//         {
//           flag: flag
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       console.log(response.data);
//       setData(response.data.response.CUSIPDUPLICATEs);
//       console.log('response', response.data.response.CUSIPDUPLICATEs);
//     } catch (error) {
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Box>
//       <Container>
//         <Box>
//           <Button
//             color="success"
//             variant="contained"
//             onClick={() => fetchData('CUSIPDUPLICATE')}
//             disabled={loading}
//             startIcon={loading && <CircularProgress size={20} />}
//             sx={{ mb: 2, width: '100%' }}
//           >
//             {loading ? 'Loading...' : 'Show Duplicate Cusips'}
//           </Button>

//           {error && <div>Error: {error.message}</div>}

//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Cusip</TableCell>
//                   <TableCell>Duplicate Count</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map((row, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{row.CUSIP}</TableCell>
//                     <TableCell>{row.DuplicateCount}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={data.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </TableContainer>
//         </Box>
//       </Container>
//     </Box>
//   );
// }

// export default Cusip;

import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Container,
  TablePagination,
  Stack
} from '@mui/material';
import axios from 'axios';

const columns = [
  { accessorKey: 'CUSIP', header: 'Cusip', minWidth: 100, align: 'left' },
  { accessorKey: 'DuplicateCount', header: 'Duplicate Count', minWidth: 100, align: 'left' }
];

function Cusip() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = async (flag) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:6060/Service.svc/showLoadedDataServivce',
        { flag: flag },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      setData(response.data.response.CUSIPDUPLICATEs);
      console.log('response', response.data.response.CUSIPDUPLICATEs);
      setError(null);
    } catch (error) {
      setError(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} p={2}>
          <Button
            variant="contained"
            onClick={() => fetchData('CUSIPDUPLICATE')}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Loading...' : 'Show Duplicate Cusips'}
          </Button>
        </Stack>

        <Table>
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
            {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} align={column.align}>
                    {row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

export default Cusip;
