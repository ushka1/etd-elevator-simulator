import PublicIcon from '@mui/icons-material/Public';
import { Box, Typography } from '@mui/material';
import CatList from './CatList';
import CounterScreen from './CounterScreen';

export default function HomePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant='h3' sx={{ mt: 4 }}>
        Hello, world! <PublicIcon sx={{ fontSize: 32 }} />
      </Typography>
      <CounterScreen />
      <Box sx={{ mt: 4 }} />
      <CatList />
    </Box>
  );
}
