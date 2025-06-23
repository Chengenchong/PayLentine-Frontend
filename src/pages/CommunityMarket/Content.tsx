'use client';
import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Typography,
  Paper,
  Chip,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

interface MarketPair {
  id: string;
  from: string;
  to: string;
  provider: string;
  type: 'P2P' | 'Licensed';
  rate: number;
  change: number;
  isFavorite?: boolean;
}

const mockPairs: MarketPair[] = [
    { id: '1', from: 'MYR', to: 'USD', provider: 'CommunityBank', type: 'Licensed', rate: 0.21, change: -1.25, isFavorite: true },
    { id: '2', from: 'USD', to: 'MYR', provider: 'HSBC', type: 'Licensed', rate: 4.75, change: 1.25 },
    { id: '3', from: 'SGD', to: 'USD', provider: 'Wise', type: 'Licensed', rate: 0.74, change: 0.5 },
    { id: '4', from: 'USD', to: 'SGD', provider: 'CommunityUser1', type: 'P2P', rate: 1.35, change: -0.5, isFavorite: true },
    { id: '5', from: 'EUR', to: 'USD', provider: 'Revolut', type: 'Licensed', rate: 1.08, change: -0.2 },
    { id: '6', from: 'USD', to: 'EUR', provider: 'CommunityUser2', type: 'P2P', rate: 0.92, change: 0.2 },
    { id: '7', from: 'GBP', to: 'USD', provider: 'CommunityUser3', type: 'P2P', rate: 1.22, change: 0.35, isFavorite: false },
    { id: '8', from: 'AUD', to: 'USD', provider: 'CommBank', type: 'Licensed', rate: 0.66, change: -0.15 },
    { id: '9', from: 'JPY', to: 'USD', provider: 'CommunityUser4', type: 'P2P', rate: 0.0067, change: -0.89, isFavorite: true },
    { id: '10', from: 'CAD', to: 'USD', provider: 'TD Bank', type: 'Licensed', rate: 0.73, change: 0.05 },
];


const Content = () => {
    const [tabValue, setTabValue] = useState('all');
    const [pairs, setPairs] = useState(mockPairs);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('MYR');
    const [amount, setAmount] = useState('1000');

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        if (newValue !== null) {
          setTabValue(newValue);
        }
    };

    const toggleFavorite = (id: string) => {
        setPairs(pairs.map(p => p.id === id ? {...p, isFavorite: !p.isFavorite} : p))
    }
    
    const filteredPairs = pairs.filter(p => {
        if (tabValue === 'favorites') return p.isFavorite;
        if (tabValue === 'p2p') return p.type === 'P2P';
        if (tabValue === 'licensed') return p.type === 'Licensed';
        return true;
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4, pt: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Community Market
        </Typography>
        <Typography variant="body1" sx={{color: "text.primary"}}>
          Find the best peer-to-peer and licensed exchange rates.
        </Typography>
      </Box>

        <Paper elevation={0} sx={{ p: {xs: 2, md: 4}, mb: 4, borderRadius: '16px', backgroundColor: 'background.paper', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 2, alignItems: 'center', width: '100%' }}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="amount-input" sx={{color: "text.primary"}}>Amount</InputLabel>
                    <OutlinedInput id="amount-input" value={amount} onChange={(e) => setAmount(e.target.value)} label="Amount" startAdornment={<InputAdornment position="start">$</InputAdornment>} />
                </FormControl>
                
                <FormControl fullWidth>
                    <InputLabel id="from-currency-label" sx={{color: "text.primary"}}>From</InputLabel>
                    <Select labelId="from-currency-label" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} label="From">
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="MYR">MYR</MenuItem>
                        <MenuItem value="SGD">SGD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="text" sx={{minWidth: 'auto', padding: 1}}>
                    <SwapHorizIcon />
                </Button>

                <FormControl fullWidth>
                    <InputLabel id="to-currency-label" sx={{color: "text.primary"}}>To</InputLabel>
                    <Select labelId="to-currency-label" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} label="To">
                        <MenuItem value="MYR">MYR</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="SGD">SGD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" sx={{py: 1.5, px: 4, width: {xs: '100%', md: 'auto'} }}>Find Rate</Button>
            </Box>
        </Paper>

      <Box>
        <ToggleButtonGroup
            color="primary"
            value={tabValue}
            exclusive
            onChange={handleTabChange}
            aria-label="Market tabs"
            >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="favorites">Favorites</ToggleButton>
            <ToggleButton value="p2p">P2P</ToggleButton>
            <ToggleButton value="licensed">Licensed</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mt: 2 }}>
        {/* Desktop Header */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          p: 2, 
          color: 'text.primary', 
          borderBottom: '1px solid #e2e8f0',
          alignItems: 'center'
        }}>
          <Box sx={{ width: '5%' }}></Box>
          <Box sx={{ width: '25%' }}>Trading Pair</Box>
          <Box sx={{ width: '25%' }}>Provider</Box>
          <Box sx={{ width: '15%', textAlign: 'right' }}>Rate</Box>
          <Box sx={{ width: '15%', textAlign: 'right' }}>24h Change</Box>
          <Box sx={{ width: '15%', textAlign: 'right' }}></Box>
        </Box>

        {/* Table Rows */}
        {filteredPairs.map((pair) => (
          <Paper key={pair.id} sx={{ 
            mb: 1.5, 
            p: { xs: 2, md: 2.5 }, 
            borderRadius: '12px', 
            transition: 'box-shadow 0.3s', 
            '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }, 
            border: '1px solid #e2e8f0' 
          }}>
            {/* Desktop Layout */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center'
            }}>
              <Box sx={{ width: '5%', textAlign: 'center', cursor: 'pointer' }} onClick={() => toggleFavorite(pair.id)}>
                {pair.isFavorite ? <StarIcon sx={{color: 'secondary.main'}} /> : <StarBorderIcon sx={{color: 'text.disabled'}} />}
              </Box>
              <Box sx={{ width: '25%' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {pair.from}/{pair.to}
                </Typography>
                <Chip label={pair.type} size="small" color={pair.type === 'P2P' ? 'secondary' : 'primary'} sx={{opacity: 0.8}} />
              </Box>
              <Box sx={{ width: '25%' }}>
                <Typography variant="body1">{pair.provider}</Typography>
              </Box>
              <Box sx={{ width: '15%', textAlign: 'right' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {pair.rate.toFixed(4)}
                </Typography>
              </Box>
              <Box sx={{ width: '15%', textAlign: 'right' }}>
                <Chip 
                  label={`${pair.change.toFixed(2)}%`}
                  color={pair.change >= 0 ? 'success' : 'error'}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              <Box sx={{ width: '15%', textAlign: 'right' }}>
                <Button variant='contained' size='medium'>Trade</Button>
              </Box>
            </Box>

            {/* Mobile Layout */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {pair.from}/{pair.to}
                  </Typography>
                  <Chip label={pair.type} size="small" color={pair.type === 'P2P' ? 'secondary' : 'primary'} sx={{opacity: 0.8}} />
                </Box>
                <Box sx={{ cursor: 'pointer' }} onClick={() => toggleFavorite(pair.id)}>
                  {pair.isFavorite ? <StarIcon sx={{color: 'secondary.main'}} /> : <StarBorderIcon sx={{color: 'text.disabled'}} />}
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                Provider: <Typography component="span" variant="body1" sx={{ fontWeight: 500 }}>{pair.provider}</Typography>
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.primary">Rate</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {pair.rate.toFixed(4)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.primary">24h Change</Typography>
                  <Chip 
                    label={`${pair.change.toFixed(2)}%`}
                    color={pair.change >= 0 ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Box>
              
              <Button variant='contained' size='medium' fullWidth>Trade</Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default Content;
