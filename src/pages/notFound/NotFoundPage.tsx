import { Box, Button, Typography } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Box>
      <Typography variant='h4' sx={{ textAlign: 'center', mt: 8 }}>
        Not Found
      </Typography>
      <Typography variant='body1' sx={{ textAlign: 'center', mt: 2 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button
        href='/'
        sx={{
          display: 'block',
          width: 'max-content',
          mx: 'auto',
          mt: 4,
        }}
      >
        Back to home
      </Button>
    </Box>
  );
}
