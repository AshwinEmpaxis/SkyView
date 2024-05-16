import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemText, ListItemIcon, Box, Divider, CircularProgress, Stack } from '@mui/material';
// import DownloadingOutlinedIcon from '@mui/icons-material/DownloadingOutlined';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { generateCsv, download, mkConfig } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import { CsvIcon, ExcelIcon, PdfIcon, JsonIcon, TxtIcon } from './MuiSvgIcon.js';

const ExportData = ({
  data,
  columns,
  exportTypes,
  ExportFileName = 'Export',
  isLoading,
  style,
  sx,

  ...others
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true
  });

  const handleExportCsv = () => {
    try {
      const csvHeaders = columns.map((column) => column.header);
      const csvData = data.map((item, index) => {
        const itemWithIndex = { ...item, index: index + 1 };
        return columns.map((column) => (itemWithIndex[column.accessorKey] ? itemWithIndex[column.accessorKey] : ''));
      });
      const csvContent = [csvHeaders, ...csvData];
      const csv = generateCsv(csvConfig)(csvContent);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      // link.download = fileName + ".csv";
      link.download = `${ExportFileName}.csv`;

      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      handleClose();
    }
  };

  const handleExportPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape' }); // Set orientation to landscape
      const pdfHeaders = columns.map((column) => column.header);
      const pdfData = data.map((item, index) => {
        const itemWithIndex = { ...item, index: index + 1 }; // Add "Sr. No" to each item
        return columns.map((column) => (itemWithIndex[column.accessorKey] ? itemWithIndex[column.accessorKey] : ''));
      });

      doc.autoTable({
        head: [pdfHeaders],
        body: pdfData
      });

      // doc.save("export.pdf");
      doc.save(`${ExportFileName}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      handleClose();
    }
  };

  const handleExportExcel = () => {
    try {
      const excelHeaders = columns.map((column) => column.header);
      const excelData = data.map((item, index) => {
        const itemWithIndex = { ...item, index: index + 1 }; // Add "Sr. No" to each item
        return columns.reduce((acc, column) => {
          acc[column.accessorKey] = itemWithIndex[column.accessorKey];
          return acc;
        }, {});
      });

      const worksheet = XLSX.utils.json_to_sheet([{}], {
        header: excelHeaders
      });

      if (data.length > 0) {
        XLSX.utils.sheet_add_json(worksheet, excelData, {
          skipHeader: true,
          origin: -1
        });
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      // XLSX.writeFile(workbook, "export.xlsx");
      XLSX.writeFile(workbook, `${ExportFileName}.xlsx`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    } finally {
      handleClose();
    }
  };

  const handleExportTxt = () => {
    try {
      const minColumnWidth = 19;
      const maxColumnWidth = 20;
      const spacingValue = 5; // Adjust the value based on your preference
      const spacing = ' '.repeat(spacingValue);

      const txtHeaders = columns.map(({ header }) => {
        const paddedHeader = header.padEnd(minColumnWidth, ' ');
        return paddedHeader.slice(0, maxColumnWidth);
      });

      const txtData = data.map((item, index) => {
        const itemWithIndex = { ...item, index: index + 1 };
        return columns
          .map(({ accessorKey }) => {
            const cellData = String(itemWithIndex[accessorKey]) || '';
            const paddedData = cellData.padEnd(minColumnWidth, ' ');
            return paddedData.slice(0, maxColumnWidth);
          })
          .join(spacing);
      });

      const txtContent = [txtHeaders.join(spacing), ...txtData].join('\n');

      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      // a.download = "export.txt";
      a.download = `${ExportFileName}.txt`;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting TXT:', error);
    } finally {
      handleClose();
    }
  };

  const handleExportJson = () => {
    try {
      const jsonHeaders = columns.map((column) => column.header);
      const jsonData = data.map((item, index) => {
        const itemWithIndex = { ...item, index: index + 1 };
        return columns.reduce((acc, column) => {
          acc[column.accessorKey] = itemWithIndex[column.accessorKey];
          return acc;
        }, {});
      });

      const exportData = {
        headers: jsonHeaders,
        data: jsonData
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonContent);

      const a = document.createElement('a');
      a.href = dataUri;
      // a.download = "export.json";
      a.download = `${ExportFileName}.json`;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting JSON:', error);
    } finally {
      handleClose();
    }
  };

  return (
    <Box align="right" style={style}>
      <Button
        // Disable the button if data is loading
        disabled={isLoading}
        sx={{ color: '#4b38b3' }}
        index="demo-positioned-button"
        aria-controls={anchorEl ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={handleClick}
        size="small"
        startIcon={
          // Show CircularProgress if loading, otherwise show SaveAltIcon
          isLoading ? <CircularProgress size={20} /> : <SaveAltIcon />
        }
      >
        {isLoading ? 'Please Wait Export File is Loading...' : 'Export File'}
      </Button>

      <Menu
        index="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Stack divider={<Divider />} disabled={isLoading}>
          {exportTypes.includes('csv') && (
            <MenuItem onClick={handleExportCsv}>
              <ListItemIcon>
                {/* <DownloadingOutlinedIcon fontSize="small" /> */}
                <CsvIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText>CSV Data</ListItemText>
            </MenuItem>
          )}

          {exportTypes.includes('pdf') && (
            <MenuItem onClick={handleExportPdf}>
              <ListItemIcon>
                {/* <DownloadingOutlinedIcon fontSize="small" /> */}
                <PdfIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText>PDF Data</ListItemText>
            </MenuItem>
          )}

          {exportTypes.includes('excel') && (
            <MenuItem onClick={handleExportExcel}>
              <ListItemIcon>
                {/* <DownloadingOutlinedIcon fontSize="small" /> */}
                <ExcelIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText>Excel Data</ListItemText>
            </MenuItem>
          )}

          {exportTypes.includes('txt') && (
            <MenuItem onClick={handleExportTxt}>
              <ListItemIcon>
                {/* <DownloadingOutlinedIcon fontSize="small" /> */}
                <TxtIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText>TXT Data</ListItemText>
            </MenuItem>
          )}

          {exportTypes.includes('json') && (
            <MenuItem onClick={handleExportJson}>
              <ListItemIcon>
                {/* <DownloadingOutlinedIcon fontSize="small" /> */}
                <JsonIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText>JSON Data</ListItemText>
            </MenuItem>
          )}
        </Stack>
      </Menu>
    </Box>
  );
};

export default ExportData;
