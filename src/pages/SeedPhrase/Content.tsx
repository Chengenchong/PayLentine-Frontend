'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Chip,
  TextField,
  FormHelperText,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Security,
  Warning,
  CheckCircle,
  ContentCopy,
  Quiz,
  ArrowBack,
} from '@mui/icons-material';

// BIP39 word list (first 100 words for demo - in production you'd use the full 2048 word list)
const BIP39_WORDS = [
  'abandon',
  'ability',
  'able',
  'about',
  'above',
  'absent',
  'absorb',
  'abstract',
  'absurd',
  'abuse',
  'access',
  'accident',
  'account',
  'accuse',
  'achieve',
  'acid',
  'acoustic',
  'acquire',
  'across',
  'act',
  'action',
  'actor',
  'actress',
  'actual',
  'adapt',
  'add',
  'addict',
  'address',
  'adjust',
  'admit',
  'adult',
  'advance',
  'advice',
  'aerobic',
  'affair',
  'afford',
  'afraid',
  'again',
  'against',
  'age',
  'agent',
  'agree',
  'ahead',
  'aim',
  'air',
  'airport',
  'aisle',
  'alarm',
  'album',
  'alcohol',
  'alert',
  'alien',
  'all',
  'alley',
  'allow',
  'almost',
  'alone',
  'alpha',
  'already',
  'also',
  'alter',
  'always',
  'amateur',
  'amazing',
  'among',
  'amount',
  'amused',
  'analyst',
  'anchor',
  'ancient',
  'anger',
  'angle',
  'angry',
  'animal',
  'ankle',
  'announce',
  'annual',
  'another',
  'answer',
  'antenna',
  'antique',
  'anxiety',
  'any',
  'apart',
  'apology',
  'appear',
  'apple',
  'approve',
  'april',
  'arcade',
  'arch',
  'arctic',
  'area',
  'arena',
  'argue',
  'arm',
  'armed',
  'armor',
  'army',
  'around',
  'arrange',
  'arrest',
  'arrive',
  'arrow',
  'art',
  'article',
  'artist',
  'artwork',
  'ask',
  'aspect',
  'assault',
  'asset',
  'assist',
  'assume',
  'asthma',
  'athlete',
  'atom',
  'attack',
  'attend',
  'attitude',
];

// Generate 12 random words from BIP39 word list
const generateSeedPhrase = (): string[] => {
  const seedPhrase: string[] = [];
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * BIP39_WORDS.length);
    seedPhrase.push(BIP39_WORDS[randomIndex]);
  }
  return seedPhrase;
};

export default function SeedPhraseContent() {
  const router = useRouter();
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [hintIndices, setHintIndices] = useState<number[]>([]);
  const [userInputs, setUserInputs] = useState<{ [key: number]: string }>({});
  const [inputErrors, setInputErrors] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [quizValidated, setQuizValidated] = useState(false);

  useEffect(() => {
    // Generate seed phrase on component mount
    setSeedPhrase(generateSeedPhrase());
  }, []);

  // Generate random hint indices when quiz starts
  useEffect(() => {
    if (showQuiz && seedPhrase.length > 0) {
      const indices: number[] = [];
      while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * 12);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      setHintIndices(indices.sort((a, b) => a - b));

      // Initialize user inputs for non-hint positions
      const inputs: { [key: number]: string } = {};
      for (let i = 0; i < 12; i++) {
        if (!indices.includes(i)) {
          inputs[i] = '';
        }
      }
      setUserInputs(inputs);
    }
  }, [showQuiz, seedPhrase]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleBackToPhrase = () => {
    setShowQuiz(false);
    setQuizValidated(false);
    setUserInputs({});
    setInputErrors({});
  };

  const handleInputChange = (index: number, value: string) => {
    // Check if the pasted value contains multiple words (full seed phrase)
    const words = value.trim().split(/\s+/);

    if (words.length === 12) {
      // This looks like a full seed phrase being pasted
      const newInputs: { [key: number]: string } = {};

      // Fill all non-hint positions with the corresponding words
      for (let i = 0; i < 12; i++) {
        if (!hintIndices.includes(i)) {
          newInputs[i] = words[i].toLowerCase().trim();
        }
      }

      setUserInputs((prev) => ({
        ...prev,
        ...newInputs,
      }));

      // Clear any existing errors
      setInputErrors({});
    } else {
      // Single word input, handle normally
      setUserInputs((prev) => ({
        ...prev,
        [index]: value.toLowerCase().trim(),
      }));

      // Clear error when user starts typing
      if (inputErrors[index]) {
        setInputErrors((prev) => ({
          ...prev,
          [index]: false,
        }));
      }
    }
  };

  const validateQuiz = () => {
    const errors: { [key: number]: boolean } = {};
    let hasErrors = false;

    // Check each user input against the correct word
    Object.keys(userInputs).forEach((indexStr) => {
      const index = parseInt(indexStr);
      const userWord = userInputs[index];
      const correctWord = seedPhrase[index];

      if (userWord !== correctWord) {
        errors[index] = true;
        hasErrors = true;
      }
    });

    setInputErrors(errors);

    if (!hasErrors) {
      setQuizValidated(true);
      // Auto proceed to dashboard after successful validation
      setTimeout(() => {
        router.push('/pre-dashboard');
      }, 1500);
    }

    return !hasErrors;
  };

  if (showQuiz) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          background:
            'linear-gradient(135deg, rgba(156, 137, 184, 0.8) 40%, rgba(77, 161, 169, 0.8) 86%)',
          position: 'relative',
        }}
      >
        {/* Background overlay for dimming */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 1,
          }}
        />

        {/* Quiz Content */}
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              maxWidth: 900,
              width: '100%',
              background: '#F8F6F6',
              boxShadow: 'none',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
            }}
          >
            {/* Quiz Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Quiz sx={{ fontSize: 48, color: '#4DA1A9', mb: 2 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#171635',
                  mb: 2,
                  fontSize: { xs: '1.8rem', md: '2.125rem' },
                }}
              >
                Verify Your Recovery Phrase
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  mb: 3,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                To confirm you've saved your recovery phrase, please fill in the
                missing words below.
              </Typography>
            </Box>

            {quizValidated && (
              <Alert severity="success" sx={{ mb: 4 }}>
                <AlertTitle sx={{ fontWeight: 700 }}>
                  <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Verification Successful!
                </AlertTitle>
                <Typography variant="body2">
                  You've successfully verified your recovery phrase. Redirecting
                  to dashboard...
                </Typography>
              </Alert>
            )}

            {/* Quiz Grid */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                  },
                  gap: 2,
                  mb: 3,
                }}
              >
                {Array.from({ length: 12 }, (_, index) => {
                  const isHint = hintIndices.includes(index);
                  const hasError = inputErrors[index];

                  return (
                    <Box key={index}>
                      {isHint ? (
                        // Show hint word
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            background: '#171635',
                            color: '#F8F6F6',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mb: 0.5,
                              fontSize: { xs: '0.7rem', md: '0.75rem' },
                              opacity: 0.9,
                            }}
                          >
                            {index + 1}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: '0.9rem', md: '1rem' },
                            }}
                          >
                            {seedPhrase[index]}
                          </Typography>
                        </Paper>
                      ) : (
                        // Show input field
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1,
                            background: 'white',
                            border: hasError
                              ? '2px solid #f44336'
                              : '1px solid #e0e0e0',
                            borderRadius: '8px',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#999',
                              display: 'block',
                              mb: 0.5,
                              fontSize: { xs: '0.7rem', md: '0.75rem' },
                              textAlign: 'center',
                            }}
                          >
                            {index + 1}
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter phrase"
                            value={userInputs[index] || ''}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                            error={hasError}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                fontSize: { xs: '0.8rem', md: '0.9rem' },
                                textAlign: 'center',
                                '& input': {
                                  textAlign: 'center',
                                  py: 0.5,
                                },
                                '& fieldset': {
                                  border: 'none',
                                },
                              },
                            }}
                          />
                          {hasError && (
                            <FormHelperText
                              error
                              sx={{
                                textAlign: 'center',
                                fontSize: { xs: '0.65rem', md: '0.75rem' },
                                mt: 0.5,
                              }}
                            >
                              Incorrect
                            </FormHelperText>
                          )}
                        </Paper>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                borderTop: '1px solid #e0e0e0',
                pt: 4,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBackToPhrase}
                disabled={quizValidated}
                sx={{
                  color: '#666',
                  borderColor: '#666',
                  order: { xs: 2, sm: 1 },
                  '&:hover': {
                    borderColor: '#444',
                    background: 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                Back to Phrase
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={validateQuiz}
                disabled={quizValidated}
                sx={{
                  py: 1.5,
                  px: 4,
                  background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  textTransform: 'none',
                  order: { xs: 1, sm: 2 },
                  '&:hover': {
                    background: 'linear-gradient(90deg, #856DA9, #41898F)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  },
                }}
              >
                {quizValidated ? 'Verified!' : 'Verify & Continue'}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background:
          'linear-gradient(135deg, rgba(156, 137, 184, 0.8) 40%, rgba(77, 161, 169, 0.8) 86%)',
        position: 'relative',
      }}
    >
      {/* Background overlay for dimming */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.1)',
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            maxWidth: 800,
            width: '100%',
            background: '#F8F6F6',
            boxShadow: 'none',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Security sx={{ fontSize: 48, color: '#4DA1A9', mb: 2 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#171635',
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.125rem' },
              }}
            >
              Secret Recovery Phrase
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 3,
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              This phrase is the ONLY way to recover your wallet. DO NOT share
              it with anyone!
            </Typography>
          </Box>

          {/* Warning Alert */}
          <Alert
            severity="warning"
            sx={{
              mb: 4,
              '& .MuiAlert-icon': {
                color: '#FFA630',
              },
            }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>
              <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
              CRITICAL: Save Your Recovery Phrase
            </AlertTitle>
            <Typography variant="body2" sx={{ mt: 1 }}>
              • Write down these 12 words in the exact order shown
              <br />
              • Store them in a secure location offline
              <br />
              • Take a photo as backup (store securely)
              <br />• Never share with anyone or enter on suspicious websites
            </Typography>
          </Alert>

          {/* Seed Phrase Grid */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: '#171635',
                fontWeight: 600,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Your 12-Word Recovery Phrase:
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 2,
                mb: 3,
              }}
            >
              {seedPhrase.map((word, index) => (
                <Box key={index}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#999',
                        display: 'block',
                        mb: 0.5,
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: '#171635',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}
                    >
                      {word}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>

            {/* Copy Button */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopyToClipboard}
                sx={{
                  color: '#4DA1A9',
                  borderColor: '#4DA1A9',
                  '&:hover': {
                    borderColor: '#41898F',
                    background: 'rgba(77, 161, 169, 0.1)',
                  },
                }}
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
            </Box>
          </Box>

          {/* Acknowledgment Section */}
          <Box
            sx={{
              textAlign: 'center',
              borderTop: '1px solid #e0e0e0',
              pt: 4,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: '#171635',
                fontWeight: 500,
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              I have safely stored my recovery phrase and understand that losing
              it means losing access to my wallet.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartQuiz}
              sx={{
                py: 1.5,
                px: 4,
                background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, #856DA9, #41898F)',
                },
              }}
            >
              I Have Saved My Recovery Phrase
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
