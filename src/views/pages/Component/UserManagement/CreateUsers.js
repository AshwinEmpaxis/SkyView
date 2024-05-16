//create user
import React, { useState } from 'react';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Stack,
  Button,
  Typography,
  Grid,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  Divider,
  Badge
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15)
}));

const StyledSmallAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  border: `2px solid pink`,
  color: 'black'
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
];

const AddUserDialog = ({ onClose, data }) => {
  const [model, setModel] = useState({
    first_name: '',
    last_name: '',
    email_id: '',
    userID: '',
    password: '',
    phone_number: '',
    CompanyLogo: '',
    uploadedImage: null
  });
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModel((prevModel) => ({ ...prevModel, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setModel((prevModel) => ({ ...prevModel, uploadedImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateUpdateUser = (isEdit) => {
    console.log('Creating or updating user:', model, personName, isEdit);
    onClose(); // Close the dialog
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle id="scroll-dialog-title" variant="h4">
        {data ? 'Edit' : 'Add'} User Profile
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* <Stack direction="column" spacing={1} alignItems="center">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                    badgeContent={
                      <StyledSmallAvatar>
                        <input accept="image/*" id="icon-button-file" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                        <label htmlFor="icon-button-file">
                          <PhotoCamera />
                        </label>
                      </StyledSmallAvatar>
                    }
                  >
                    <StyledAvatar alt="Uploaded Image" src={model.uploadedImage} />
                  </Badge>
                </Stack> */}
              </Grid>
              <Divider />
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" name="first_name" value={model.first_name} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" name="last_name" value={model.last_name} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email ID" name="email_id" value={model.email_id} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="UserID" name="userID" value={model.userID} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="password" label="Password" name="password" value={model.password} onChange={handleInputChange} />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField fullWidth label="Mobile Number" name="phone_number" value={model.phone_number} onChange={handleInputChange} />
              </Grid> */}
              <Grid item xs={12}>
                {/* <FormControl fullWidth>
                  <InputLabel id="menu-option">Menu Option</InputLabel>
                  <Select
                    labelId="menu-option"
                    id="menu-option"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Menu Option" />}
                    // renderValue={(selected) => selected.join(', ')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {names.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={personName.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => handleCreateUpdateUser(data ? 1 : 0)} color="success" variant="contained">
          {data ? 'Update' : 'Create'} Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
