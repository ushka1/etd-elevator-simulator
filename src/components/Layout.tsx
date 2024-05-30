import { Box } from '@mui/material';
import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Box>
      <Navbar />
      <Box
        component='main'
        sx={{
          // display: 'flex',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
