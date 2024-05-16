// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="body1" component={Link} href="https://skyviewadv.com" target="_blank" underline="hover">
      skyviewadv.com
    </Typography>
    <Typography variant="body1" component={Link} href="https://skyviewadv.com" target="_blank" underline="hover">
      &copy; skyviewadv
    </Typography>
  </Stack>
);

export default AuthFooter;
