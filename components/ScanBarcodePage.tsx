import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from '../hooks/useTranslations';

const ScanBarcodePage: React.FC = () => {
  const { t } = useTranslations();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const streamRef = useRef<MediaStream | null>(null);
  const scanFrameRef = useRef<number | null>(null);

  // Check if BarcodeDetector is supported
  const isBarcodeDetectorSupported = 'BarcodeDetector' in window;

  // Function to stop the camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scanFrameRef.current) {
        cancelAnimationFrame(scanFrameRef.current);
        scanFrameRef.current = null;
    }
  }, []);

  // Function to start scanning process
  const startScan = useCallback(async () => {
    stopCamera(); // Stop any existing streams
    setError(null);
    setScannedData(null);
    setIsScanning(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(t('scanBarcode.noCamera'));
      setIsScanning(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        if (isBarcodeDetectorSupported) {
          // @ts-ignore - BarcodeDetector might not be in default TS lib
          const barcodeDetector = new window.BarcodeDetector({
            formats: ['qr_code', 'ean_13', 'code_128', 'upc_a', 'upc_e']
          });

          const detectCode = async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || !streamRef.current) {
                return;
            }
            try {
              // @ts-ignore
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                setScannedData(barcodes[0].rawValue);
                setIsScanning(false);
                stopCamera();
              } else {
                scanFrameRef.current = requestAnimationFrame(detectCode);
              }
            } catch (err) {
              console.error("Detection error:", err);
              scanFrameRef.current = requestAnimationFrame(detectCode);
            }
          };
          scanFrameRef.current = requestAnimationFrame(detectCode);
        } else {
            setError("Barcode Detector API not supported in this browser.");
            setIsScanning(false);
        }
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError(t('scanBarcode.noCamera'));
      setIsScanning(false);
    }
  }, [t, isBarcodeDetectorSupported, stopCamera]);

  useEffect(() => {
    startScan();
    // Cleanup function
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isBarcodeDetectorSupported) {
        setError("Barcode Detector API not supported in this browser.");
        return;
    }

    stopCamera();
    setIsScanning(false);
    setError(null);
    setScannedData(null);

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = imageUrl;
    image.onload = async () => {
        try {
            // @ts-ignore
            const barcodeDetector = new window.BarcodeDetector();
            // @ts-ignore
            const barcodes = await barcodeDetector.detect(image);
            if (barcodes.length > 0) {
                setScannedData(barcodes[0].rawValue);
            } else {
                setError(t('scanBarcode.noCodeFound'));
            }
        } catch(err) {
            console.error(err);
            setError(t('scanBarcode.noCodeFound'));
        } finally {
            URL.revokeObjectURL(imageUrl);
        }
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green">{t('scanBarcode.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('scanBarcode.subtitle')}</p>
      </div>
      
      <div className="max-w-md mx-auto bg-gray-900 rounded-2xl shadow-xl overflow-hidden aspect-square flex flex-col items-center justify-center p-2">
        <div className="relative w-full h-full rounded-lg flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isScanning ? 'opacity-100' : 'opacity-0'}`}
              playsInline
              muted
            />

            {isScanning && (
                <>
                    <div className="absolute inset-0 border-8 border-dashed border-gray-600/50 rounded-lg"></div>
                    <div className="absolute left-0 right-0 h-1 bg-red-500 animate-scan-line" style={{ boxShadow: '0 0 10px 2px rgba(239, 68, 68, 0.7)' }}></div>
                </>
            )}

            {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    {error && (
                        <div className="text-center text-white p-4 bg-black/50 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {scannedData && (
                        <div className="text-center text-white p-4 bg-black/70 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">{t('scanBarcode.scanResult')}</h3>
                            <p className="font-mono break-all">{scannedData}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

       <div className="text-center mt-8">
            {scannedData || error ? (
                <button 
                    onClick={startScan}
                    className="px-6 py-3 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                >
                    {t('scanBarcode.scanAgain')}
                </button>
            ) : (
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!isBarcodeDetectorSupported}
                    className="px-6 py-3 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>{t('scanBarcode.uploadButton')}</span>
                </button>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    </div>
  );
};

export default ScanBarcodePage;