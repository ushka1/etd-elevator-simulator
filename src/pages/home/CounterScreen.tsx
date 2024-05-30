import { useCounterStore } from '@/stores/useCounterStore';
import { Box, Button, Typography } from '@mui/material';

export default function CounterScreen() {
  const { count, increase } = useCounterStore();

  const increaseCount = () => {
    increase(1);
  };

  return (
    <Box>
      <Typography sx={{ mt: 4 }} variant='h6'>
        Counter: {count}
      </Typography>
      <Button onClick={increaseCount} sx={{ mt: 2 }} variant='contained'>
        Increase
      </Button>
    </Box>
  );
}
