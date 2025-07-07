'use client';
import React, { useState, useEffect, type ReactElement } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  TextField,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PublicIcon from '@mui/icons-material/Public';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import Avatar from '@mui/material/Avatar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SecurityIcon from '@mui/icons-material/Security';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LockIcon from '@mui/icons-material/Lock';
import GavelIcon from '@mui/icons-material/Gavel';
import Modal from '@mui/material/Modal';

// --- Types ---
interface MarketPair {
  id: number;
  from: string;
  to: string;
  provider: string;
  rate: number;
  isFavorite?: boolean;
  verified?: boolean;
  type?: 'P2P' | 'Licensed';
  volume?: number;
}

// --- Data ---
const topCurrencies = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
];
const allCurrencies = [
  ...topCurrencies,
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
];
const features = [
  {
    icon: <LockIcon sx={{ fontSize: 32, color: '#4DA1A9', mr: 2 }} />,
    title: 'Trusted by millions',
    desc: 'Millions of users globally move funds every month.',
  },
  {
    icon: <GavelIcon sx={{ fontSize: 32, color: '#FFD600', mr: 2 }} />,
    title: 'Regulated',
    desc: 'Paylentine is regulated by top authorities.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 32, color: '#7c3aed', mr: 2 }} />,
    title: '24/7 support',
    desc: 'Get help from our team any time.',
  },
];
const bubbleColors = ['#9C89B8', '#4DA1A9', '#E573C0', '#FFD600', '#7FC7FF'];
const bubbles: {
  size: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  opacity: number;
  color: string;
}[] = Array.from({ length: 10 }).map((_, i) => ({
  size: 80 + Math.random() * 80,
  left: `${5 + Math.random() * 90}%`,
  top: `${5 + Math.random() * 80}%`,
  delay: `${Math.random() * 2}s`,
  duration: `${2.5 + Math.random() * 2}s`,
  opacity: 0.13 + Math.random() * 0.09,
  color: bubbleColors[i % bubbleColors.length],
}));
const allOffers: MarketPair[] = [
  {
    id: 1,
    provider: 'HSBC',
    from: 'USD',
    to: 'MYR',
    rate: 4.75,
    verified: true,
    isFavorite: true,
    type: 'Licensed',
    volume: 12000,
  },
  {
    id: 2,
    provider: 'Wise',
    from: 'USD',
    to: 'EUR',
    rate: 0.92,
    verified: false,
    isFavorite: false,
    type: 'P2P',
    volume: 8100,
  },
  {
    id: 3,
    provider: 'Revolut',
    from: 'EUR',
    to: 'USD',
    rate: 1.08,
    verified: true,
    isFavorite: false,
    type: 'Licensed',
    volume: 9700,
  },
  {
    id: 4,
    provider: 'CommunityUser1',
    from: 'USD',
    to: 'SGD',
    rate: 1.35,
    verified: false,
    isFavorite: true,
    type: 'P2P',
    volume: 5200,
  },
  {
    id: 5,
    provider: 'CommunityUser2',
    from: 'USD',
    to: 'MYR',
    rate: 4.7,
    verified: false,
    isFavorite: false,
    type: 'P2P',
    volume: 4300,
  },
  {
    id: 6,
    provider: 'CommunityUser3',
    from: 'MYR',
    to: 'USD',
    rate: 0.21,
    verified: false,
    isFavorite: false,
    type: 'P2P',
    volume: 2100,
  },
  {
    id: 7,
    provider: 'Maybank',
    from: 'MYR',
    to: 'USD',
    rate: 0.22,
    verified: true,
    isFavorite: true,
    type: 'Licensed',
    volume: 15000,
  },
  {
    id: 8,
    provider: 'OCBC',
    from: 'SGD',
    to: 'USD',
    rate: 0.74,
    verified: true,
    isFavorite: false,
    type: 'Licensed',
    volume: 9000,
  },
  {
    id: 9,
    provider: 'CommunityUser4',
    from: 'EUR',
    to: 'GBP',
    rate: 0.86,
    verified: false,
    isFavorite: false,
    type: 'P2P',
    volume: 3000,
  },
  {
    id: 10,
    provider: 'CommunityUser5',
    from: 'USD',
    to: 'JPY',
    rate: 150.2,
    verified: false,
    isFavorite: true,
    type: 'P2P',
    volume: 7000,
  },
];
const flagList = [
  { code: 'USD', flag: '🇺🇸' },
  { code: 'MYR', flag: '🇲🇾' },
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'INR', flag: '🇮🇳' },
  { code: 'AED', flag: '🇦🇪' },
  { code: 'AUD', flag: '🇦🇺' },
  { code: 'NZD', flag: '🇳🇿' },
  { code: 'CNY', flag: '🇨🇳' },
  { code: 'JPY', flag: '🇯🇵' },
  { code: 'CAD', flag: '🇨🇦' },
  { code: 'CHF', flag: '🇨🇭' },
];
const mockFilterOffers = async (
  offers: MarketPair[],
  {
    tab,
    currency,
    verified,
    favorites,
  }: {
    tab: 'buy' | 'sell';
    currency: string;
    verified: boolean;
    favorites: boolean;
  }
): Promise<MarketPair[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = offers.filter((o) =>
        tab === 'buy' ? o.to === currency : o.from === currency
      );
      if (verified) filtered = filtered.filter((o) => o.verified);
      if (favorites) filtered = filtered.filter((o) => o.isFavorite);
      resolve(filtered);
    }, 400);
  });
};
const getTrendingOffers = (offers: MarketPair[]) => {
  return offers
    .slice()
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 2)
    .map((o) => o.id);
};
const summaryBuyOffers = [
  {
    id: 1,
    provider: 'HSBC',
    avatar: '🇬🇧',
    rate: 4.75,
    volume: '$12.3k',
    trending: true,
  },
  {
    id: 2,
    provider: 'Wise',
    avatar: '🇪🇺',
    rate: 0.92,
    volume: '$8.1k',
    trending: false,
  },
];
const summarySellOffers = [
  {
    id: 3,
    provider: 'Revolut',
    avatar: '🇺🇸',
    rate: 1.08,
    volume: '$9.7k',
    trending: true,
  },
  {
    id: 4,
    provider: 'CommunityUser1',
    avatar: '🧑‍💻',
    rate: 1.35,
    volume: '$5.2k',
    trending: false,
  },
];
const featuresList = [
  {
    icon: <SecurityIcon sx={{ fontSize: 36, color: '#4DA1A9' }} />,
    title: 'Secure Escrow',
    desc: 'All trades are protected by our secure escrow system.',
  },
  {
    icon: <FlashOnIcon sx={{ fontSize: 36, color: '#FFD600' }} />,
    title: 'Instant Settlement',
    desc: 'Funds are released instantly upon trade completion.',
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 36, color: '#a78bfa' }} />,
    title: 'Top Community Traders',
    desc: 'Trade with the best-rated users worldwide.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 36, color: '#7c3aed' }} />,
    title: '24/7 Support',
    desc: 'Our team is here to help you anytime, anywhere.',
  },
];

const Content = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [currencySearch, setCurrencySearch] = useState('');
  const [showVerified, setShowVerified] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currencyAnchorEl, setCurrencyAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [buyOffers, setBuyOffers] = useState<MarketPair[]>([]);
  const [sellOffers, setSellOffers] = useState<MarketPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOffer, setModalOffer] = useState<MarketPair | null>(null);
  const [modalType, setModalType] = useState<'buy' | 'sell'>('buy');
  const [modalAmount, setModalAmount] = useState('');
  const [offers, setOffers] = useState(allOffers);

  // Filtering logic (mock async)
  useEffect(() => {
    setLoading(true);
    mockFilterOffers(offers, {
      tab,
      currency: selectedCurrency,
      verified: showVerified,
      favorites: showFavorites,
    }).then((filtered) => {
      if (tab === 'buy') setBuyOffers(filtered);
      else setSellOffers(filtered);
      setLoading(false);
    });
  }, [tab, selectedCurrency, showVerified, showFavorites, offers]);

  const filteredCurrencies = currencySearch
    ? allCurrencies.filter(
        (c) =>
          c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
          c.name.toLowerCase().includes(currencySearch.toLowerCase())
      )
    : topCurrencies;

  const openModal = (offer: MarketPair, type: 'buy' | 'sell') => {
    setModalOffer(offer);
    setModalType(type);
    setModalAmount('');
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // Currency popover handlers
  const handleCurrencyClick = (event: React.MouseEvent<HTMLElement>) => {
    setCurrencyAnchorEl(event.currentTarget);
  };
  const handleCurrencyClose = () => {
    setCurrencyAnchorEl(null);
    setCurrencySearch('');
  };
  const handleCurrencySelect = (code: string) => {
    setSelectedCurrency(code);
    handleCurrencyClose();
  };

  const trendingBuyIds = getTrendingOffers(buyOffers);
  const trendingSellIds = getTrendingOffers(sellOffers);

  // Toggle favorite in the main offers state
  const toggleFavorite = (id: number) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isFavorite: !o.isFavorite } : o))
    );
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        fontFamily: 'Inter, Arial, sans-serif',
        background: '#fff',
      }}
    >
      {/* 1. HERO SECTION */}
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: 420, md: 520 },
          background:
            'linear-gradient(120deg, #bbaaff 0%, #c7bfff 40%, #a7bfff 70%, #b6e0fe 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          mb: { xs: 4, md: 8 },
        }}
      >
        {/* Animated floating bubbles */}
        {bubbles.map((b, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: b.size,
              height: b.size,
              left: b.left,
              top: b.top,
              borderRadius: '50%',
              background: b.color,
              opacity: b.opacity,
              filter: 'blur(2.5px)',
              animation: `bubbleFloat ${b.duration} linear infinite`,
              animationDelay: b.delay,
              zIndex: 1,
            }}
          />
        ))}
        <Box
          sx={{
            zIndex: 2,
            width: '100%',
            maxWidth: 1400,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          {/* Left: Description */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              pl: { xs: 2, md: 8 },
              pt: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              textAlign: 'left',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: 38, md: 56 },
                color: '#fff',
                letterSpacing: '-2px',
                mb: 1,
                lineHeight: 1.1,
                fontFamily: 'Inter, Arial, sans-serif',
                textShadow: '0 2px 8px #a78bfa44',
              }}
            >
              Community Market
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 22, md: 32 },
                color: '#fff',
                mb: 3,
                mt: 1,
                fontFamily: 'Inter, Arial, sans-serif',
                textShadow: '0 2px 8px #9C89B833',
              }}
            >
              The world's most creative peer-to-peer currency exchange
            </Typography>
            <Typography
              sx={{
                color: '#f3f0ff',
                fontSize: { xs: 16, md: 20 },
                mb: 4,
                fontWeight: 500,
                maxWidth: 540,
                fontFamily: 'Inter, Arial, sans-serif',
              }}
            >
              Trade globally, instantly, and securely with rates set by the
              community. No banks, no borders, just people helping people.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SwapHorizIcon sx={{ fontSize: 22 }} />}
              sx={{
                borderRadius: '999px',
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: 18,
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '2px solid #fff',
                boxShadow: '0 2px 8px #a78bfa33',
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  background: '#fff',
                  color: '#7c3aed',
                  borderColor: '#fff',
                  transform: 'scale(1.05)',
                },
                mb: 2,
              }}
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            >
              Explore Offers
            </Button>
          </Box>
          {/* Right: Feature Cards (rectangular, longer, left-aligned) */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              mt: { xs: 4, md: 0 },
              pl: { xs: 2, md: 8 },
            }}
          >
            {features.map((f, i) => (
              <Paper
                key={f.title}
                elevation={8}
                sx={{
                  width: 540,
                  minWidth: 540,
                  maxWidth: 540,
                  p: 3,
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.22)',
                  boxShadow: '0 2px 16px #4DA1A922',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 2,
                  fontFamily: 'Inter, Arial, sans-serif',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 32px #4DA1A944',
                  },
                }}
              >
                {f.icon}
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 22,
                      color: '#fff',
                      textAlign: 'left',
                    }}
                  >
                    {f.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 17,
                      color: '#f3f0ff',
                      textAlign: 'left',
                      mt: 0.5,
                    }}
                  >
                    {f.desc}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
        <style>{`
          @keyframes bubbleFloat {
            0% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-60px) scale(1.12); }
            100% { transform: translateY(0px) scale(1); }
          }
        `}</style>
      </Box>

      {/* 2. GREY BORDERED SECTION WITH TWO SUMMARY TABLES */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          mb: 6,
          border: '2px solid #e0e0e0',
          borderRadius: '24px',
          background: '#f7f7f7',
          p: { xs: 3, md: 6 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            fontSize: 28,
            mb: 2,
            color: '#2d2250',
            letterSpacing: '-1px',
            textAlign: 'center',
          }}
        >
          Do more with Paylentine
        </Typography>
        <Typography
          sx={{ fontSize: 18, color: '#4DA1A9', mb: 4, textAlign: 'center' }}
        >
          Discover the best offers and connect with top traders in our global
          community. Enjoy instant, secure, and transparent exchanges.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {/* Top Buy Offers */}
          <Paper
            elevation={2}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: '18px',
              background: '#fff',
              mb: { xs: 3, md: 0 },
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, mb: 2, color: '#7c3aed' }}
            >
              Top Buy Offers
            </Typography>
            {offers
              .filter((o) => o.to === selectedCurrency)
              .slice(0, 3)
              .map((offer) => (
                <Box
                  key={offer.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    p: 2,
                    borderRadius: '12px',
                    background: offer.isFavorite
                      ? 'rgba(255, 214, 0, 0.08)'
                      : 'transparent',
                  }}
                >
                  <IconButton
                    onClick={() => toggleFavorite(offer.id)}
                    sx={{
                      color: offer.isFavorite ? '#FFD600' : '#bdbdbd',
                      p: 0.5,
                    }}
                  >
                    <StarIcon />
                  </IconButton>
                  <Avatar sx={{ width: 36, height: 36 }}>
                    {offer.provider[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                      {offer.provider}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#4DA1A9' }}>
                      Rate: {offer.rate}
                    </Typography>
                  </Box>
                  <Chip
                    label={offer.verified ? 'Verified' : 'P2P'}
                    size="small"
                    color={offer.verified ? 'secondary' : 'primary'}
                  />
                </Box>
              ))}
          </Paper>
          {/* Top Sell Offers */}
          <Paper
            elevation={2}
            sx={{ flex: 1, p: 3, borderRadius: '18px', background: '#fff' }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, mb: 2, color: '#4DA1A9' }}
            >
              Top Sell Offers
            </Typography>
            {offers
              .filter((o) => o.from === selectedCurrency)
              .slice(0, 3)
              .map((offer) => (
                <Box
                  key={offer.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    p: 2,
                    borderRadius: '12px',
                    background: offer.isFavorite
                      ? 'rgba(255, 214, 0, 0.08)'
                      : 'transparent',
                  }}
                >
                  <IconButton
                    onClick={() => toggleFavorite(offer.id)}
                    sx={{
                      color: offer.isFavorite ? '#FFD600' : '#bdbdbd',
                      p: 0.5,
                    }}
                  >
                    <StarIcon />
                  </IconButton>
                  <Avatar sx={{ width: 36, height: 36 }}>
                    {offer.provider[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                      {offer.provider}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#4DA1A9' }}>
                      Rate: {offer.rate}
                    </Typography>
                  </Box>
                  <Chip
                    label={offer.verified ? 'Verified' : 'P2P'}
                    size="small"
                    color={offer.verified ? 'secondary' : 'primary'}
                  />
                </Box>
              ))}
          </Paper>
        </Box>
      </Paper>

      {/* 4. DESCRIPTION, FILTER BAR, AND MAIN TABBED TABLE */}
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, mb: 2, color: '#2d2250' }}
        >
          Find the best offers for your next exchange
        </Typography>
        <Typography sx={{ fontSize: 17, color: '#4DA1A9', mb: 3 }}>
          Filter by currency, verified status, or your favorite traders to get
          the best deals.
        </Typography>
      </Box>
      {/* FILTER BAR (full width, after description) */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          mb: 4,
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <Paper
          elevation={16}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.98)',
            border: '2px solid',
            borderImage: 'linear-gradient(90deg, #9C89B8 0%, #4DA1A9 100%) 1',
            boxShadow: '0 8px 32px 0 rgba(60, 60, 120, 0.10)',
            width: '100%',
            mx: 0,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'flex-start',
            position: 'relative',
            transition: 'box-shadow 0.3s',
          }}
        >
          {/* Currency Button with Popover */}
          <Box>
            <Button
              variant="outlined"
              sx={{
                borderRadius: '10px',
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: 18,
                background: '#f3f0ff',
                color: '#6b5ca5',
                minWidth: 220,
                textAlign: 'left',
                justifyContent: 'flex-start',
              }}
              onClick={handleCurrencyClick}
            >
              {(() => {
                const c = allCurrencies.find(
                  (c) => c.code === selectedCurrency
                );
                return c ? (
                  <span style={{ fontWeight: 700, fontSize: 18 }}>
                    {c.flag} {c.code} - {c.name}
                  </span>
                ) : (
                  selectedCurrency
                );
              })()}
            </Button>
            <Popover
              open={Boolean(currencyAnchorEl)}
              anchorEl={currencyAnchorEl}
              onClose={handleCurrencyClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              PaperProps={{ sx: { borderRadius: '16px', minWidth: 320, p: 2 } }}
            >
              <TextField
                placeholder="Search currency..."
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SwapHorizIcon sx={{ color: '#a78bfa', mr: 1 }} />
                  ),
                  sx: {
                    borderRadius: '10px',
                    background: '#f3f0ff',
                    fontWeight: 700,
                    fontSize: 18,
                    height: 48,
                    mb: 2,
                  },
                }}
                sx={{ mb: 2 }}
                autoFocus
              />
              <List dense>
                {filteredCurrencies.map((c) => (
                  <ListItem key={c.code} disablePadding>
                    <ListItemButton
                      onClick={() => handleCurrencySelect(c.code)}
                    >
                      <ListItemText
                        primary={
                          <span style={{ fontWeight: 700, fontSize: 18 }}>
                            {c.flag} {c.code} - {c.name}
                          </span>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Popover>
          </Box>
          <Button
            variant={showVerified ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<VerifiedUserIcon sx={{ fontSize: 22 }} />}
            onClick={() => setShowVerified((v) => !v)}
            sx={{
              borderRadius: '10px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: showVerified
                ? '0 2px 8px #a78bfa33'
                : '0 2px 8px #e0e7ff',
              transition: 'all 0.2s',
              background: showVerified ? '#a78bfa' : '#fff',
              color: showVerified ? '#fff' : '#6b5ca5',
              '&:hover': {
                background: '#7c3aed',
                color: '#fff',
                transform: 'scale(1.05)',
              },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            Verified Only
          </Button>
          <Button
            variant={showFavorites ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<StarIcon sx={{ fontSize: 22 }} />}
            onClick={() => setShowFavorites((v) => !v)}
            sx={{
              borderRadius: '10px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: showFavorites
                ? '0 2px 8px #a78bfa33'
                : '0 2px 8px #e0e7ff',
              transition: 'all 0.2s',
              background: showFavorites ? '#a78bfa' : '#fff',
              color: showFavorites ? '#fff' : '#6b5ca5',
              '&:hover': {
                background: '#7c3aed',
                color: '#fff',
                transform: 'scale(1.05)',
              },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            Favorites
          </Button>
        </Paper>
      </Box>

      {/* 5. TABLE (Tabs, full width, after filter) */}
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mb: 4 }}>
        <Paper
          elevation={16}
          sx={{
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.99)',
            border: '2px solid',
            borderImage: 'linear-gradient(90deg, #9C89B8 0%, #4DA1A9 100%) 1',
            boxShadow: '0 8px 32px 0 rgba(60, 60, 120, 0.10)',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            mx: 0,
            overflow: 'hidden',
            animation: 'fadeInUp 1.5s',
            p: 3,
          }}
        >
          <Tabs
            value={tab === 'buy' ? 0 : 1}
            onChange={(_, v) => setTab(v === 0 ? 'buy' : 'sell')}
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: 20,
                textTransform: 'none',
                minWidth: 180,
              },
              '& .Mui-selected': { color: '#7c3aed' },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '2px',
                background: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)',
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span role="img" aria-label="buy">
                    📥
                  </span>{' '}
                  Buy Offers
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span role="img" aria-label="sell">
                    📤
                  </span>{' '}
                  Sell Offers
                </Box>
              }
            />
          </Tabs>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '24% 18% 18% 18% 22%',
              fontWeight: 700,
              mb: 2,
              color: '#6b5ca5',
              fontSize: 20,
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box>User</Box>
            <Box>Amount</Box>
            <Box>Rate</Box>
            <Box>Tags</Box>
            <Box></Box>
          </Box>
          {(tab === 'buy' ? buyOffers : sellOffers).map((offer) => (
            <Paper
              key={offer.id}
              elevation={4}
              sx={{
                display: 'grid',
                gridTemplateColumns: '24% 18% 18% 18% 22%',
                alignItems: 'center',
                mb: 2.5,
                p: 2,
                px: { xs: 2, md: 3 },
                py: 2,
                borderRadius: '14px',
                border: '1.5px solid #ede9fe',
                boxShadow: '0 2px 12px 0 #a78bfa11',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 32px 0 #a78bfa22',
                  transform: 'scale(1.02)',
                  zIndex: 2,
                },
                background: '#f8f7fc',
                minHeight: 56,
                position: 'relative',
                cursor: 'pointer',
                gap: 2,
                fontSize: 18,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                  minWidth: 0,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  fontSize: 18,
                }}
              >
                <IconButton
                  onClick={() => toggleFavorite(offer.id)}
                  sx={{
                    color: offer.isFavorite ? '#FFD600' : '#bdbdbd',
                    p: 0.5,
                  }}
                >
                  <StarIcon />
                </IconButton>
                <span style={{ fontSize: 18 }}>
                  {
                    topCurrencies.find(
                      (c) => c.code === (tab === 'buy' ? offer.to : offer.from)
                    )?.flag
                  }
                </span>
                <Typography
                  fontWeight={700}
                  sx={{
                    color: '#2d2250',
                    fontSize: 18,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {offer.provider}
                </Typography>
                {offer.verified && <VerifiedUserIcon fontSize="small" />}
              </Box>
              <Box
                sx={{
                  color: '#6b5ca5',
                  fontWeight: 600,
                  fontSize: 18,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                1000 {tab === 'buy' ? offer.to : offer.from}
              </Box>
              <Box
                sx={{
                  color: '#2d2250',
                  fontWeight: 600,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  justifyContent: 'flex-start',
                }}
              >
                {offer.rate.toFixed(4)}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  justifyContent: 'flex-start',
                }}
              >
                <Chip
                  label={offer.verified ? 'Verified' : 'P2P'}
                  size="small"
                  color={offer.verified ? 'secondary' : 'primary'}
                  sx={{
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: 15,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                />
                {offer.isFavorite && (
                  <Chip
                    label="Favorite"
                    size="small"
                    color="secondary"
                    sx={{
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: 15,
                      bgcolor: '#a78bfa22',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                )}
              </Box>
              <Box
                sx={{
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => openModal(offer, tab)}
                  sx={{
                    borderRadius: '14px',
                    px: 2,
                    py: 0.5,
                    fontWeight: 700,
                    fontSize: 18,
                    bgcolor: tab === 'buy' ? '#a78bfa' : '#4DA1A9',
                    color: '#fff',
                    minWidth: 64,
                    boxShadow: '0 2px 8px #a78bfa33',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: tab === 'buy' ? '#7c3aed' : '#00796b',
                      transform: 'scale(1.08)',
                    },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {tab === 'buy' ? 'Buy' : 'Sell'}
                </Button>
              </Box>
            </Paper>
          ))}
        </Paper>
      </Box>

      {/* MODAL: Buy/Sell Offer (glassy, rounded, blurred background, center input) */}
      {modalOffer && (
        <Modal open={modalOpen} onClose={closeModal}>
          <Box
            sx={{
              minWidth: 420,
              maxWidth: 540,
              mx: 'auto',
              my: '10vh',
              borderRadius: '24px',
              background: '#fff',
              boxShadow: '0 12px 48px 0 #a78bfa44',
              p: 0,
              overflow: 'hidden',
              position: 'relative',
              backdropFilter: 'blur(16px)',
              border: '2.5px solid #f3eaff',
              outline: 'none',
            }}
          >
            <Box
              sx={{
                px: 5,
                py: 4,
                bgcolor: 'rgba(243,234,255,0.18)',
                borderBottom: '1px solid #ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#3a2066',
                  fontSize: 36,
                  letterSpacing: '-1px',
                  fontFamily: 'Fredoka, Inter, Arial, sans-serif',
                }}
              >
                {modalType === 'buy' ? 'Buy Offer' : 'Sell Offer'}
              </Typography>
              <IconButton
                onClick={closeModal}
                sx={{ color: '#a78bfa', fontSize: 32 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ px: 5, py: 4, bgcolor: 'rgba(255,255,255,0.25)' }}>
              <Typography
                sx={{ mb: 2, fontSize: 22, fontWeight: 700, color: '#3a2066' }}
              >
                Provider:{' '}
                <span style={{ fontWeight: 900 }}>{modalOffer?.provider}</span>{' '}
                {modalOffer?.verified && <VerifiedUserIcon fontSize="small" />}
              </Typography>
              <Typography
                sx={{ mb: 2, fontSize: 20, fontWeight: 700, color: '#3a2066' }}
              >
                Pair:{' '}
                <span style={{ fontWeight: 900 }}>
                  {modalOffer?.from} / {modalOffer?.to}
                </span>
              </Typography>
              <Typography
                sx={{ mb: 3, fontSize: 20, fontWeight: 700, color: '#3a2066' }}
              >
                Rate:{' '}
                <span style={{ fontWeight: 900 }}>
                  {modalOffer?.rate?.toFixed(4)} USD
                </span>
              </Typography>
              <TextField
                label="Amount"
                fullWidth
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
                variant="outlined"
                sx={{
                  mb: 3,
                  borderRadius: '16px',
                  background: '#f3eaff',
                  '& .MuiInputBase-root': {
                    borderRadius: '16px',
                    fontWeight: 700,
                    fontSize: 22,
                    color: '#3a2066',
                    background: '#f3eaff',
                    boxShadow: '0 2px 8px #a78bfa22',
                    alignItems: 'center',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b39ddb',
                    fontWeight: 700,
                    fontSize: 20,
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    px: 0.5,
                    transition: 'all 0.2s',
                  },
                  '& .MuiInputLabel-shrink': {
                    top: '-18px',
                    left: '0px',
                    color: '#7c3aed',
                    fontSize: 18,
                    background: 'transparent',
                    px: 0.5,
                    transform: 'none',
                  },
                }}
                InputLabelProps={{
                  shrink: !!modalAmount || undefined,
                }}
                placeholder=""
              />
              <Typography
                sx={{ mb: 4, fontSize: 22, fontWeight: 700, color: '#3a2066' }}
              >
                Total:{' '}
                <span style={{ fontWeight: 900 }}>
                  {modalAmount && !isNaN(Number(modalAmount))
                    ? (Number(modalAmount) * (modalOffer?.rate || 0)).toFixed(2)
                    : '0.00'}{' '}
                  USD
                </span>
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: '24px',
                  py: 2.5,
                  fontWeight: 900,
                  fontSize: 24,
                  bgcolor: '#a78bfa',
                  color: '#fff',
                  boxShadow: '0 2px 16px #a78bfa33',
                  textTransform: 'none',
                  fontFamily: 'Fredoka, Inter, Arial, sans-serif',
                  letterSpacing: '1px',
                  '&:hover': { bgcolor: '#7c3aed', transform: 'scale(1.04)' },
                }}
              >
                {modalType === 'buy' ? 'Confirm Buy' : 'Confirm Sell'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default Content;
