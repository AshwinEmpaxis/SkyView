// material-ui
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| Welcome to Dashboard PAGE ||============================== //

const Dashboard = () => (
  <MainCard title="Welcome to Dashboard">
    <Typography variant="body2">
      SkyView, a leading investment bank and specialty lender dedicated to supporting the M&A goals of independent registered investment
      advisors (RIAs), today announced the launch of SKYVIEW 1, Inc., a white-label digital banking platform. SKYVIEW 1 partners with RIAs
      and broker-dealers to provide a bespoke digital banking service for consumers, including a cutting-edge mobile experience. This new
      banking as a service (BaaS) platform enables advisors to provide end-to-end service and advice, grounded in a foundational
      understanding of their clients’ complete financial picture, that can steer high-net-worth investors toward greater financial momentum.
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button component={Link} to="/13F-exporter" variant="contained" color="primary">
        13F Exporter
      </Button>
    </Box>
  </MainCard>
);

export default Dashboard;

// /wp-content/themes/yootheme/cache/da/homepage-banner-da8a8138.webp 768w, /wp-content/themes/yootheme/cache/f6/homepage-banner-f6e53010.webp 1024w, /wp-content/themes/yootheme/cache/7b/homepage-banner-7bb84be4.webp 1366w, /wp-content/themes/yootheme/cache/04/homepage-banner-04903e6b.webp 1600w, /wp-content/themes/yootheme/cache/21/homepage-banner-219d1954.webp 1920w

