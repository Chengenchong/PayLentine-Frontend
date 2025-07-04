"use client";
import React, { useState, useRef } from 'react';
import {
  Box, Button, Typography, TextField, MenuItem, Paper, Avatar, IconButton, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { QRCodeCanvas } from 'qrcode.react';
import CheckIcon from '@mui/icons-material/Check';

const banks = [
  { name: 'Maybank2u', logo: '/maybank.png' },
  { name: 'CIMB Clicks', logo: '/cimb.png' },
  { name: 'Public Bank', logo: '/publicbank.png' },
  { name: 'RHB Now', logo: '/rhb.png' },
  { name: 'Hong Leong Connect', logo: '/hlb.png' },
  { name: 'Ambank', logo: '/ambank.png' },
  { name: 'MyBSN', logo: '/bsn.png' },
  { name: 'Bank Rakyat', logo: '/bankrakyat.png' },
  { name: 'UOB', logo: '/uob.png' },
  { name: 'Affin Bank', logo: '/affin.png' },
  { name: 'OCBC Online', logo: '/ocbc.png' },
];
const ewallets = [
  { name: "Touch 'n Go", logo: '/tng.png' },
  { name: 'Boost', logo: '/boost.png' },
  { name: 'GrabPay', logo: '/grabpay.png' },
];
const quickAmounts = [50, 100, 200, 300, 500];

const brandColor = '#7c3aed';
const accentColor = '#4DA1A9';
const logo = '/Paylentine_logo.jpg';

// Custom numeric keypad overlay (glassmorphic, modern, supports typing and keypad input)
function NumericKeypadOverlay({ value, onChange, onEnter, onClose, inputRef }: { value: string; onChange: (v: string) => void; onEnter: () => void; onClose: () => void; inputRef?: React.RefObject<HTMLInputElement> }) {
  React.useEffect(() => {
    // Auto-scroll the input to the top of the viewport so it's always visible above the keypad
    if (inputRef && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      if (rect.top > 80) {
        window.scrollBy({ top: rect.top - 80, behavior: 'smooth' });
      }
      inputRef.current.focus();
    }
  }, [inputRef]);
  // Prevent scrolling of background when keypad is open
  React.useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);
  const handleKey = (key: string) => {
    if (key === 'del') {
      onChange(value.slice(0, -1));
    } else if (key === '.' && value.includes('.')) {
      return;
    } else if (key === '.' && value === '') {
      onChange('0.');
    } else if (key === '0' && value === '0') {
      return;
    } else {
      onChange(value + key);
    }
  };
  return (
    <Box
      sx={{
        position: 'fixed', left: 0, right: 0, bottom: 0, top: 0, zIndex: 1400,
        background: 'rgba(60, 50, 100, 0.10)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          width: 310, maxWidth: '96vw',
          background: 'rgba(255,255,255,0.75)',
          borderRadius: 6,
          boxShadow: '0 8px 32px #a78bfa44',
          p: 3,
          mb: 3,
          animation: 'slideUpKeypadCard 0.32s cubic-bezier(.4,1.6,.6,1) 1',
          display: 'flex', flexDirection: 'column',
          backdropFilter: 'blur(18px)',
          border: '1.5px solid #ede9fe',
        }}
        onClick={e => e.stopPropagation()}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 1 }}>
          {[...'123456789'].map((k) => (
            <Button key={k} variant="outlined" sx={{
              borderRadius: '50%', fontWeight: 700, fontSize: 24, width: 64, height: 64, minWidth: 0, minHeight: 0,
              background: 'rgba(255,255,255,0.85)', color: '#2d2250',
              boxShadow: '0 1px 6px #ede9fe',
              border: 'none',
              transition: 'all 0.15s',
              '&:hover': { background: '#ede9fe', color: brandColor, boxShadow: '0 2px 12px #a78bfa22' },
            }} onClick={() => handleKey(k)}>{k}</Button>
          ))}
          <Button variant="outlined" sx={{
            borderRadius: '50%', fontWeight: 700, fontSize: 24, width: 64, height: 64, minWidth: 0, minHeight: 0,
            background: 'rgba(255,255,255,0.85)', color: '#2d2250',
            boxShadow: '0 1px 6px #ede9fe',
            border: 'none',
            transition: 'all 0.15s',
            '&:hover': { background: '#ede9fe', color: brandColor, boxShadow: '0 2px 12px #a78bfa22' },
          }} onClick={() => handleKey('.')}>.</Button>
          <Button variant="outlined" sx={{
            borderRadius: '50%', fontWeight: 700, fontSize: 24, width: 64, height: 64, minWidth: 0, minHeight: 0,
            background: 'rgba(255,255,255,0.85)', color: '#e53935',
            boxShadow: '0 1px 6px #ede9fe',
            border: 'none',
            transition: 'all 0.15s',
            '&:hover': { background: '#fdeaea', color: '#b71c1c', boxShadow: '0 2px 12px #e5737344' },
          }} onClick={() => handleKey('del')}>Del</Button>
          <Box />
        </Box>
      </Box>
      <style>{`
        @keyframes slideUpKeypadCard {
          0% { transform: translateY(100px) scale(0.98); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
}

const TopUpContent = () => {
  // Independent state for each method
  const [expandBank, setExpandBank] = useState(false);
  const [expandEwallet, setExpandEwallet] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [bankAmount, setBankAmount] = useState('');
  const [selectedEwallet, setSelectedEwallet] = useState<string | null>(null);
  const [ewalletAmount, setEwalletAmount] = useState('');
  const [qrAmount, setQrAmount] = useState('');
  const [step, setStep] = useState<'method' | 'qr' | 'pin' | 'success'>('method');
  const [pin, setPin] = useState('');
  const [summary, setSummary] = useState<{ method: string; option: string; amount: string } | null>(null);
  // Track which method is active for keypad
  const activeMethod = expandBank ? 'bank' : expandEwallet ? 'ewallet' : step === 'qr' ? 'qr' : null;
  // Keypad overlay state
  const [showKeypad, setShowKeypad] = useState<null | 'bank' | 'ewallet' | 'qr'>(null);
  // Refs for amount fields
  const bankAmountRef = useRef<HTMLInputElement>(null);
  const ewalletAmountRef = useRef<HTMLInputElement>(null);
  const qrAmountRef = useRef<HTMLInputElement>(null);

  // Quick amount handler
  const handleQuickAmount = (amt: number) => {
    if (activeMethod === 'bank') setBankAmount(String(amt));
    else if (activeMethod === 'ewallet') setEwalletAmount(String(amt));
    else if (activeMethod === 'qr') setQrAmount(String(amt));
  };

  // Keypad enter handler
  const handleKeypadEnter = () => {
    if (showKeypad === 'bank') {
      if (selectedBank && bankAmount && Number(bankAmount) > 0) {
        setSummary({ method: 'Online Banking', option: selectedBank, amount: bankAmount });
        setStep('pin');
        setShowKeypad(null);
      }
    } else if (showKeypad === 'ewallet') {
      if (selectedEwallet && ewalletAmount && Number(ewalletAmount) > 0) {
        setSummary({ method: 'E-Wallet', option: selectedEwallet, amount: ewalletAmount });
        setStep('pin');
        setShowKeypad(null);
      }
    } else if (showKeypad === 'qr') {
      if (qrAmount && Number(qrAmount) > 0) {
        setSummary({ method: 'QR Payment', option: 'QR', amount: qrAmount });
        setStep('pin');
        setShowKeypad(null);
      }
    }
  };

  // Reset all state
  const resetAll = () => {
    setExpandBank(false);
    setExpandEwallet(false);
    setSelectedBank(null);
    setBankAmount('');
    setSelectedEwallet(null);
    setEwalletAmount('');
    setQrAmount('');
    setStep('method');
    setPin('');
    setSummary(null);
    setShowKeypad(null);
  };

  // --- Main Payment Method Selection ---
  if (step === 'method') {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f7f7fa 0%, #e9e6ff 100%)', py: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 540, maxWidth: '98vw', boxShadow: '0 8px 32px #a78bfa22', borderRadius: 3, background: '#fff', overflow: 'hidden', p: 0 }}>
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={logo} sx={{ width: 56, height: 56, mb: 1 }} />
            <Typography variant="h4" fontWeight={900} color={brandColor} mb={1} textAlign="center">
              Top Up
            </Typography>
            <Typography sx={{ color: accentColor, fontWeight: 600, fontSize: 16, textAlign: 'center' }}>
              Fast, secure, and flexible top up for your PayLentine account
            </Typography>
            {/* Online Banking */}
            <Box sx={{ border: '1.5px solid #e0e0e0', borderRadius: 2, mb: 2, background: expandBank ? '#f8f7fc' : '#fff', transition: 'background 0.2s', width: '100%' }}>
              <Button
                fullWidth
                variant="text"
                sx={{ borderRadius: 2, justifyContent: 'space-between', height: 64, px: 2, fontWeight: 700, color: brandColor, fontSize: 18 }}
                onClick={() => { setExpandBank((prev) => !prev); setExpandEwallet(false); }}
                endIcon={expandBank ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              >
                <Box display="flex" alignItems="center"><AccountBalanceIcon sx={{ mr: 1 }} />Online Banking</Box>
              </Button>
              {expandBank && (
                <Box sx={{ px: 2, pb: 2, pt: 1 }}>
                  <TextField
                    select
                    label="Bank"
                    value={selectedBank || ''}
                    onChange={e => setSelectedBank(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {banks.map(bank => <MenuItem key={bank.name} value={bank.name}><Avatar src={bank.logo} sx={{ width: 24, height: 24, mr: 1 }} />{bank.name}</MenuItem>)}
                  </TextField>
                  <Typography sx={{ fontWeight: 600, color: brandColor, mb: 1 }}>Amount</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 22, color: accentColor, mr: 1 }}>RM</Typography>
                    <TextField
                      value={bankAmount}
                      inputRef={bankAmountRef}
                      onFocus={() => setShowKeypad('bank')}
                      onChange={e => { if (/^\d*\.?\d*$/.test(e.target.value) && Number(e.target.value) >= 0) setBankAmount(e.target.value); }}
                      inputProps={{ style: { fontSize: 22, fontWeight: 700, width: 120 } }}
                      sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                    />
                  </Box>
                  {/* Quick Amount Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {quickAmounts.map((amt) => (
                      <Button key={amt} variant="outlined" sx={{ borderRadius: 2, minWidth: 80, fontWeight: 700 }} onClick={() => handleQuickAmount(amt)}>
                        RM {amt}
                      </Button>
                    ))}
                    <Button variant="outlined" sx={{ borderRadius: 2, minWidth: 80, fontWeight: 700 }} onClick={() => handleQuickAmount(0)}>
                      Other
                    </Button>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ borderRadius: 1, fontWeight: 700, fontSize: 18, bgcolor: brandColor, mt: 1 }}
                    disabled={!selectedBank || !bankAmount || Number(bankAmount) <= 0}
                    onClick={() => { setSummary({ method: 'Online Banking', option: selectedBank!, amount: bankAmount }); setStep('pin'); }}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </Box>
            {/* QR Payment */}
            <Box sx={{ border: '1.5px solid #e0e0e0', borderRadius: 2, mb: 2, background: '#fff', transition: 'background 0.2s', width: '100%' }}>
              <Button
                fullWidth
                variant="text"
                sx={{ borderRadius: 2, justifyContent: 'space-between', height: 64, px: 2, fontWeight: 700, color: accentColor, fontSize: 18 }}
                onClick={() => { setStep('qr'); setExpandBank(false); setExpandEwallet(false); }}
                endIcon={<QrCodeIcon />}
              >
                <Box display="flex" alignItems="center"><QrCodeIcon sx={{ mr: 1 }} />QR Payment</Box>
              </Button>
            </Box>
            {/* E-Wallet */}
            <Box sx={{ border: '1.5px solid #e0e0e0', borderRadius: 2, mb: 2, background: expandEwallet ? '#f8f7fc' : '#fff', transition: 'background 0.2s', width: '100%' }}>
              <Button
                fullWidth
                variant="text"
                sx={{ borderRadius: 2, justifyContent: 'space-between', height: 64, px: 2, fontWeight: 700, color: '#a78bfa', fontSize: 18 }}
                onClick={() => { setExpandEwallet((prev) => !prev); setExpandBank(false); }}
                endIcon={expandEwallet ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              >
                <Box display="flex" alignItems="center"><PaymentIcon sx={{ mr: 1 }} />E-Wallet</Box>
              </Button>
              {expandEwallet && (
                <Box sx={{ px: 2, pb: 2, pt: 1 }}>
                  <TextField
                    select
                    label="E-Wallet"
                    value={selectedEwallet || ''}
                    onChange={e => setSelectedEwallet(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {ewallets.map(w => <MenuItem key={w.name} value={w.name}><Avatar src={w.logo} sx={{ width: 24, height: 24, mr: 1 }} />{w.name}</MenuItem>)}
                  </TextField>
                  <Typography sx={{ fontWeight: 600, color: brandColor, mb: 1 }}>Amount</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 22, color: accentColor, mr: 1 }}>RM</Typography>
                    <TextField
                      value={ewalletAmount}
                      inputRef={ewalletAmountRef}
                      onFocus={() => setShowKeypad('ewallet')}
                      onChange={e => { if (/^\d*\.?\d*$/.test(e.target.value) && Number(e.target.value) >= 0) setEwalletAmount(e.target.value); }}
                      inputProps={{ style: { fontSize: 22, fontWeight: 700, width: 120 } }}
                      sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                    />
                  </Box>
                  {/* Quick Amount Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {quickAmounts.map((amt) => (
                      <Button key={amt} variant="outlined" sx={{ borderRadius: 2, minWidth: 80, fontWeight: 700 }} onClick={() => handleQuickAmount(amt)}>
                        RM {amt}
                      </Button>
                    ))}
                    <Button variant="outlined" sx={{ borderRadius: 2, minWidth: 80, fontWeight: 700 }} onClick={() => handleQuickAmount(0)}>
                      Other
                    </Button>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ borderRadius: 1, fontWeight: 700, fontSize: 18, bgcolor: brandColor, mt: 1 }}
                    disabled={!selectedEwallet || !ewalletAmount || Number(ewalletAmount) <= 0}
                    onClick={() => { setSummary({ method: 'E-Wallet', option: selectedEwallet!, amount: ewalletAmount }); setStep('pin'); }}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </Box>
            {/* Recap/Summary Section */}
            <Divider sx={{ my: 3, width: '100%' }} />
            <Box sx={{ textAlign: 'center', color: '#bdbdbd', fontSize: 15, fontWeight: 500 }}>
              <Typography sx={{ mb: 1 }}>PayLentine - Your trusted global payment partner</Typography>
              <img src={logo} alt="PayLentine Logo" style={{ width: 48, opacity: 0.5 }} />
            </Box>
          </Box>
          {/* Keypad overlay, only appears when amount is focused */}
          {showKeypad && (
            <NumericKeypadOverlay
              value={showKeypad === 'bank' ? bankAmount : showKeypad === 'ewallet' ? ewalletAmount : qrAmount}
              onChange={v => {
                if (showKeypad === 'bank') setBankAmount(v);
                else if (showKeypad === 'ewallet') setEwalletAmount(v);
                else if (showKeypad === 'qr') setQrAmount(v);
              }}
              onEnter={handleKeypadEnter}
              onClose={() => setShowKeypad(null)}
              inputRef={(showKeypad === 'bank' ? bankAmountRef : showKeypad === 'ewallet' ? ewalletAmountRef : qrAmountRef) as React.RefObject<HTMLInputElement>}
            />
          )}
        </Box>
      </Box>
    );
  }

  // QR Payment Step
  if (step === 'qr') {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f7f7fa 0%, #e9e6ff 100%)', py: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 540, maxWidth: '98vw', boxShadow: '0 8px 32px #a78bfa22', borderRadius: 3, background: '#fff', overflow: 'hidden', p: 0 }}>
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <IconButton onClick={resetAll} sx={{ mr: 1, color: brandColor }}><ArrowBackIcon /></IconButton>
              <Typography variant="h5" fontWeight={800} color={brandColor}>QR Payment</Typography>
            </Box>
            <Divider sx={{ mb: 2, width: '100%' }} />
            <Typography sx={{ fontWeight: 600, color: brandColor, mb: 1 }}>Amount</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 22, color: accentColor, mr: 1 }}>RM</Typography>
              <TextField
                value={qrAmount}
                inputRef={qrAmountRef}
                onFocus={() => setShowKeypad('qr')}
                onChange={e => { if (/^\d*\.?\d*$/.test(e.target.value) && Number(e.target.value) >= 0) setQrAmount(e.target.value); }}
                inputProps={{ style: { fontSize: 22, fontWeight: 700, width: 120 } }}
                sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
              />
            </Box>
            {/* Quick Amount Buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              {quickAmounts.map((amt) => (
                <Button key={amt} variant="outlined" sx={{ borderRadius: 2, minWidth: 80, fontWeight: 700 }} onClick={() => handleQuickAmount(amt)}>
                  RM {amt}
                </Button>
              ))}
              <Button variant="outlined" sx={{ borderRadius: 2, minWidth: 80, fontWeight: 700 }} onClick={() => handleQuickAmount(0)}>
                Other
              </Button>
            </Box>
            <Button
              fullWidth
              variant="contained"
              sx={{ borderRadius: 1, fontWeight: 700, fontSize: 18, bgcolor: brandColor, mt: 2 }}
              onClick={() => { setSummary({ method: 'QR Payment', option: 'QR', amount: qrAmount }); setStep('pin'); }}
              disabled={!qrAmount || Number(qrAmount) <= 0}
            >
              Next
            </Button>
            {qrAmount && Number(qrAmount) > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
                <Typography sx={{ mb: 1, color: accentColor, fontWeight: 600 }}>Scan this QR to pay</Typography>
                <QRCodeCanvas value={`paylentine://topup?amount=${qrAmount}`} size={180} />
              </Box>
            )}
          </Box>
          {/* Keypad overlay, only appears when amount is focused */}
          {showKeypad && (
            <NumericKeypadOverlay
              value={qrAmount}
              onChange={setQrAmount}
              onEnter={handleKeypadEnter}
              onClose={() => setShowKeypad(null)}
              inputRef={(qrAmountRef as React.RefObject<HTMLInputElement>)}
            />
          )}
        </Box>
      </Box>
    );
  }

  // PIN Entry Step
  if (step === 'pin') {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f7f7fa 0%, #e9e6ff 100%)', py: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 500, maxWidth: '98vw', boxShadow: '0 8px 32px #a78bfa22', borderRadius: 3, background: '#fff', overflow: 'hidden', p: 0 }}>
          <Box sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <IconButton onClick={resetAll} sx={{ mr: 1, color: brandColor }}><ArrowBackIcon /></IconButton>
              <Typography variant="h5" fontWeight={800} color={brandColor}>Enter PIN</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography sx={{ fontWeight: 600, color: brandColor, mb: 1 }}>Enter your 6-digit PIN to confirm</Typography>
            <TextField
              label="PIN"
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              fullWidth
              inputProps={{ maxLength: 6, style: { letterSpacing: 6, fontSize: 24, textAlign: 'center' } }}
              sx={{ mb: 2, '& .MuiInputBase-root': { borderRadius: 1 } }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ borderRadius: 1, fontWeight: 700, fontSize: 18, bgcolor: brandColor, mt: 2 }}
              onClick={() => setStep('success')}
              disabled={pin.length !== 6}
            >
              Confirm
            </Button>
            {/* Recap/Summary Section */}
            {summary && (
              <Box sx={{ mt: 4, p: 2, background: '#f8f7fc', borderRadius: 2, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, color: brandColor, mb: 1 }}>Summary</Typography>
                <Typography>Method: <b>{summary.method}</b></Typography>
                <Typography>Option: <b>{summary.option}</b></Typography>
                <Typography>Amount: <b>RM{summary.amount}</b></Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Success Step
  if (step === 'success') {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f7f7fa 0%, #e9e6ff 100%)', py: 6, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 500, maxWidth: '98vw', boxShadow: '0 8px 32px #4DA1A922', borderRadius: 3, background: '#fff', overflow: 'hidden', p: 0 }}>
          <Box sx={{ p: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: accentColor, mb: 2 }} />
            <Typography variant="h4" fontWeight={900} color={brandColor} mb={2}>Top Up Successful!</Typography>
            {summary && (
              <Box sx={{ mt: 2, p: 2, background: '#f8f7fc', borderRadius: 2, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, color: brandColor, mb: 1 }}>Summary</Typography>
                <Typography>Method: <b>{summary.method}</b></Typography>
                <Typography>Option: <b>{summary.option}</b></Typography>
                <Typography>Amount: <b>RM{summary.amount}</b></Typography>
              </Box>
            )}
            <Button variant="outlined" sx={{ borderRadius: 1, fontWeight: 700, fontSize: 18, color: brandColor, borderColor: brandColor, mt: 4 }} onClick={resetAll}>Top Up Again</Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
};

export default TopUpContent; 