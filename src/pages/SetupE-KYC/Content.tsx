'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CameraAlt,
  CloudUpload,
  CheckCircle,
  Close,
  ArrowBack,
} from '@mui/icons-material';

interface FormData {
  frontIdImage: File | null;
  backIdImage: File | null;
  documentType: 'passport' | 'drivers_license' | 'national_id';
}

export default function SetupEKYCContent() {
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'face_recognition' | 'success'>(
    'upload'
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    frontIdImage: null,
    backIdImage: null,
    documentType: 'national_id',
  });
  const [previewUrls, setPreviewUrls] = useState<{
    front: string | null;
    back: string | null;
  }>({
    front: null,
    back: null,
  });
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Face Recognition States
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [livenessStep, setLivenessStep] = useState<
    'scan' | 'blink' | 'turn_left' | 'turn_right' | 'complete'
  >('scan');
  const [livenessProgress, setLivenessProgress] = useState(0);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  // Face Recognition Functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user',
        },
      });
      setCameraStream(stream);
      setCameraError(null);
    } catch (error) {
      console.error('Camera access failed:', error);
      setCameraError('Camera access denied. Please use photo upload instead.');
      setUseFallback(true);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = (videoElement: HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0);
      return canvas.toDataURL('image/jpeg');
    }
    return null;
  };

  const startLivenessDetection = async () => {
    setIsScanning(true);
    setLivenessStep('scan');
    setLivenessProgress(0);

    // Simulate face scanning
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLivenessProgress(25);

    // Blink detection
    setLivenessStep('blink');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLivenessProgress(50);

    // Turn left
    setLivenessStep('turn_left');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLivenessProgress(75);

    // Turn right
    setLivenessStep('turn_right');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLivenessProgress(100);

    // Complete
    setLivenessStep('complete');

    // Capture final photo if camera is available
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement && cameraStream) {
      const photo = capturePhoto(videoElement);
      setFaceImage(photo);
    }

    setIsScanning(false);

    // Auto proceed to success after 2 seconds
    setTimeout(() => {
      stopCamera();
      setStep('success');
    }, 2000);
  };

  const handleFaceImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const url = URL.createObjectURL(file);
      setFaceImage(url);

      // Simulate processing and proceed to success
      setTimeout(() => {
        setStep('success');
      }, 1000);
    }
  };

  // Cleanup camera on component unmount or step change
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Auto-start camera when entering face recognition step
  useEffect(() => {
    if (step === 'face_recognition' && !useFallback && !cameraStream) {
      startCamera();
    }
  }, [step, useFallback, cameraStream]);

  const handleFileUpload = (type: 'front' | 'back', file: File) => {
    if (type === 'front') {
      setFormData((prev) => ({ ...prev, frontIdImage: file }));
    } else {
      setFormData((prev) => ({ ...prev, backIdImage: file }));
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({ ...prev, [type]: url }));
  };

  const handleFileInputChange =
    (type: 'front' | 'back') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB');
          return;
        }

        handleFileUpload(type, file);
      }
    };

  const handlePreviewClick = (url: string) => {
    setPreviewImage(url);
    setShowPreviewDialog(true);
  };

  const handleRemoveFile = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFormData((prev) => ({ ...prev, frontIdImage: null }));
      if (previewUrls.front) {
        URL.revokeObjectURL(previewUrls.front);
      }
      setPreviewUrls((prev) => ({ ...prev, front: null }));
    } else {
      setFormData((prev) => ({ ...prev, backIdImage: null }));
      if (previewUrls.back) {
        URL.revokeObjectURL(previewUrls.back);
      }
      setPreviewUrls((prev) => ({ ...prev, back: null }));
    }
  };

  const handleSubmitKYC = async () => {
    if (!formData.frontIdImage || !formData.backIdImage) {
      alert('Please upload both front and back images of your ID');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Proceed to face recognition step
      setTimeout(() => {
        setStep('face_recognition');
      }, 500);
    } catch (error) {
      console.error('E-KYC upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinueToDashboard = () => {
    router.push('/pre-dashboard');
  };

  const handleBackToChoice = () => {
    router.push('/addverifiedkyc');
  };

  // Upload Step - Document upload interface
  if (step === 'upload') {
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
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 8, md: 12 },
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CameraAlt sx={{ fontSize: 48, color: '#4DA1A9', mb: 2 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#171635',
                  mb: 2,
                  fontSize: { xs: '1.8rem', md: '2.125rem' },
                }}
              >
                Upload ID Documents
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  mb: 3,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                Please upload clear photos of both the front and back of your
                government-issued ID.
              </Typography>
            </Box>

            {/* Document Type Selection */}
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel sx={{ color: '#171635' }}>Document Type</InputLabel>
              <Select
                value={formData.documentType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    documentType: e.target.value as any,
                  }))
                }
                label="Document Type"
              >
                <MenuItem value="national_id">National ID Card</MenuItem>
                <MenuItem value="drivers_license">Driver's License</MenuItem>
                <MenuItem value="passport">Passport</MenuItem>
              </Select>
            </FormControl>

            {/* Upload Areas */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                mb: 4,
              }}
            >
              {/* Front ID Upload */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#171635', mb: 2 }}
                >
                  Front of ID
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed #4DA1A9',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: previewUrls.front
                      ? '#f5f5f5'
                      : 'transparent',
                    position: 'relative',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {previewUrls.front ? (
                    <>
                      <img
                        src={previewUrls.front}
                        alt="Front ID Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 150,
                          objectFit: 'contain',
                          cursor: 'pointer',
                        }}
                        onClick={() => handlePreviewClick(previewUrls.front!)}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'white',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                        onClick={() => handleRemoveFile('front')}
                      >
                        <Close />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <CloudUpload
                        sx={{ fontSize: 48, color: '#4DA1A9', mb: 2 }}
                      />
                      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        Click to upload or drag and drop
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        PNG, JPG up to 5MB
                      </Typography>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange('front')}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              </Box>

              {/* Back ID Upload */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#171635', mb: 2 }}
                >
                  Back of ID
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed #4DA1A9',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: previewUrls.back
                      ? '#f5f5f5'
                      : 'transparent',
                    position: 'relative',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {previewUrls.back ? (
                    <>
                      <img
                        src={previewUrls.back}
                        alt="Back ID Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 150,
                          objectFit: 'contain',
                          cursor: 'pointer',
                        }}
                        onClick={() => handlePreviewClick(previewUrls.back!)}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'white',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                        onClick={() => handleRemoveFile('back')}
                      >
                        <Close />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <CloudUpload
                        sx={{ fontSize: 48, color: '#4DA1A9', mb: 2 }}
                      />
                      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        Click to upload or drag and drop
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        PNG, JPG up to 5MB
                      </Typography>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange('back')}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Upload Progress */}
            {isUploading && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Uploading documents... {uploadProgress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                    },
                  }}
                />
              </Box>
            )}

            {/* Guidelines */}
            <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Photo Guidelines:</strong>
              </Typography>
              <Typography variant="body2" component="div">
                • Ensure all text is clearly visible and readable
                <br />
                • Take photos in good lighting without shadows
                <br />
                • Make sure the entire document is in frame
                <br />• Avoid glare or reflections on the document
              </Typography>
            </Alert>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBackToChoice}
                disabled={isUploading}
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
                Back to Options
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmitKYC}
                disabled={
                  !formData.frontIdImage || !formData.backIdImage || isUploading
                }
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
                {isUploading ? 'Uploading...' : 'Submit for Verification'}
              </Button>
            </Box>
          </Paper>
        </Container>

        {/* Preview Dialog */}
        <Dialog
          open={showPreviewDialog}
          onClose={() => setShowPreviewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Document Preview
            <IconButton
              onClick={() => setShowPreviewDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {previewImage && (
              <img
                src={previewImage}
                alt="Document Preview"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Box>
    );
  }

  // Face Recognition Step
  if (step === 'face_recognition') {
    const getLivenessInstruction = () => {
      switch (livenessStep) {
        case 'scan':
          return 'Please look directly at the camera and keep your face in the frame';
        case 'blink':
          return 'Please blink your eyes slowly';
        case 'turn_left':
          return 'Please turn your head slowly to the left';
        case 'turn_right':
          return 'Please turn your head slowly to the right';
        case 'complete':
          return 'Liveness detection complete!';
        default:
          return 'Follow the instructions on screen';
      }
    };

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
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 8, md: 12 },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              maxWidth: 700,
              width: '100%',
              background: '#F8F6F6',
              boxShadow: 'none',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#171635',
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.125rem' },
              }}
            >
              Face Recognition & Liveness Detection
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 4,
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Please complete the face verification to ensure account security.
            </Typography>

            {/* Camera View or Fallback Upload */}
            <Box
              sx={{
                mb: 4,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {!useFallback ? (
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '3px solid #4DA1A9',
                    maxWidth: 480,
                    width: '100%',
                  }}
                >
                  {cameraStream ? (
                    <video
                      ref={(video) => {
                        if (video && cameraStream) {
                          video.srcObject = cameraStream;
                          video.play();
                        }
                      }}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                      muted
                      playsInline
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 360,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <CameraAlt sx={{ fontSize: 48, color: '#4DA1A9' }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Camera not started
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={startCamera}
                        sx={{
                          background:
                            'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                          '&:hover': {
                            background:
                              'linear-gradient(90deg, #856DA9, #41898F)',
                          },
                        }}
                      >
                        Start Camera
                      </Button>
                    </Box>
                  )}

                  {/* Face detection overlay */}
                  {cameraStream && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 200,
                        height: 250,
                        border: '2px solid #4DA1A9',
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        backgroundColor: 'transparent',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </Box>
              ) : (
                // Fallback image upload
                <Box
                  sx={{
                    border: '2px dashed #4DA1A9',
                    borderRadius: 2,
                    p: 4,
                    minHeight: 300,
                    width: '100%',
                    maxWidth: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {faceImage ? (
                    <img
                      src={faceImage}
                      alt="Face Upload"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 250,
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <>
                      <CloudUpload
                        sx={{ fontSize: 48, color: '#4DA1A9', mb: 2 }}
                      />
                      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        Upload your photo
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        PNG, JPG up to 5MB
                      </Typography>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFaceImageUpload}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Camera Error */}
            {cameraError && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">{cameraError}</Typography>
              </Alert>
            )}

            {/* Liveness Detection Instructions */}
            {cameraStream && !useFallback && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#171635',
                    mb: 2,
                  }}
                >
                  {getLivenessInstruction()}
                </Typography>

                {/* Progress Bar */}
                <LinearProgress
                  variant="determinate"
                  value={livenessProgress}
                  sx={{
                    mb: 3,
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                    },
                  }}
                />

                {/* Start Scanning Button */}
                {!isScanning && livenessStep === 'scan' && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={startLivenessDetection}
                    sx={{
                      py: 1.5,
                      px: 4,
                      background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #856DA9, #41898F)',
                      },
                    }}
                  >
                    Start Face Verification
                  </Button>
                )}

                {/* Scanning Status */}
                {isScanning && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={20} sx={{ color: '#4DA1A9' }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Scanning... Please follow the instructions
                    </Typography>
                  </Box>
                )}

                {/* Complete Status */}
                {livenessStep === 'complete' && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <CheckCircle sx={{ color: '#4CAF50' }} />
                    <Typography
                      variant="body2"
                      sx={{ color: '#4CAF50', fontWeight: 600 }}
                    >
                      Verification Complete!
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Fallback Upload Success */}
            {useFallback && faceImage && (
              <Box sx={{ mb: 4 }}>
                <Alert severity="success">
                  <Typography variant="body2">
                    Photo uploaded successfully! Processing verification...
                  </Typography>
                </Alert>
              </Box>
            )}

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => setStep('upload')}
                disabled={isScanning}
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
                Back to Upload
              </Button>

              {!cameraStream && !useFallback && (
                <Button
                  variant="outlined"
                  onClick={() => setUseFallback(true)}
                  sx={{
                    color: '#FFA630',
                    borderColor: '#FFA630',
                    order: { xs: 1, sm: 2 },
                    '&:hover': {
                      borderColor: '#FF8F00',
                      background: 'rgba(255, 166, 48, 0.05)',
                    },
                  }}
                >
                  Use Photo Upload Instead
                </Button>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Success Step - Confirmation
  if (step === 'success') {
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
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 8, md: 12 },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              maxWidth: 600,
              width: '100%',
              background: '#F8F6F6',
              boxShadow: 'none',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <CheckCircle sx={{ fontSize: 64, color: '#4CAF50', mb: 3 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#171635',
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.125rem' },
              }}
            >
              Documents Submitted!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 4,
                fontSize: { xs: '0.9rem', md: '1rem' },
                lineHeight: 1.6,
              }}
            >
              Thank you for submitting your ID documents. Our team will review
              your verification within 24-48 hours. You'll receive an email
              notification once the review is complete.
            </Typography>

            <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>What's next?</strong> You can now access your dashboard
                with basic features. Full features will be unlocked after
                verification approval.
              </Typography>
            </Alert>

            <Button
              variant="contained"
              size="large"
              onClick={handleContinueToDashboard}
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
              Continue to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return null;
}
