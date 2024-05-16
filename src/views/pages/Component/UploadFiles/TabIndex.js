import React, { useState } from 'react';
import { Tabs, Tab, Divider } from '@mui/material';
import UploadCard from './UploadRps';
import Alphadesk from './UploadAlphadesk';
import SecurityMaster from './SecurityMaster';
import UploadTRN from './UploadTRN';

// project imports
import MainCard from 'ui-component/cards/MainCard';

export default function TabIndex() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <MainCard
        title=" Upload Data"
        sx={{
          '& .MuiCardContent-root': {
            p: '0rem 0rem 1.5rem 0rem'
          }
        }}
      >
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Upload RPS DATA" />
          <Tab label="Upload ALPHADESK" />
          <Tab label="Upload Security Master " />
          <Tab label="Upload TRN DATA " />
        </Tabs>
        <Divider />
        {tabValue === 0 && <UploadCard />}
        {tabValue === 1 && <Alphadesk />}
        {tabValue === 2 && <SecurityMaster />}
        {tabValue === 3 && <UploadTRN />}
      </MainCard>
    </div>
  );
}
