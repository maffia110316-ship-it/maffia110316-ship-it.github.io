import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertTriangle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  title: string;
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
  aspectRatio?: 'square' | 'banner';
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  title,
  onCapture,
  onClose,
  aspectRatio = 'square',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhoto(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera toegang niet beschikbaar of geweigerd:', err);
      setCameraError(
        'Geen camera toegang verleend of webcam niet gevonden. Je kunt ook direct een bestand uploaden.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    if (aspectRatio === 'square') {
      const size = Math.min(width, height);
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Center crop
        const startX = (width - size) / 2;
        const startY = (height - size) / 2;
        ctx.drawImage(video, startX, startY, size, size, 0, 0, 512, 512);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
      }
    } else {
      // Banner ratio ~ 3:1
      canvas.width = 1200;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height, 0, 0, 1200, 400);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
      }
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-[#2b2d31] border border-[#232428] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#35373c]">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-[#5865f2]" />
            <h3 className="text-base font-black text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#35373c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cameraError ? (
          <div className="p-6 bg-red-950/40 border border-red-500/30 rounded-2xl text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-xs text-red-300">{cameraError}</p>
            <button
              onClick={onClose}
              className="bg-[#35373c] hover:bg-[#404249] text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Sluiten & Bestanden Gebruiken
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Camera View or Captured Photo */}
            <div
              className={`w-full overflow-hidden rounded-2xl bg-black border border-[#3f4147] flex items-center justify-center relative ${
                aspectRatio === 'square' ? 'aspect-square max-h-[340px]' : 'aspect-[16/7] max-h-[260px]'
              }`}
            >
              {capturedPhoto ? (
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              )}

              {/* Viewfinder crosshairs */}
              {!capturedPhoto && (
                <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2">
              {capturedPhoto ? (
                <>
                  <button
                    onClick={() => setCapturedPhoto(null)}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#1e1f22] hover:bg-[#35373c] text-slate-300 font-bold text-xs transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Opnieuw Maken</span>
                  </button>

                  <button
                    onClick={handleConfirmPhoto}
                    className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-[#23a55a] hover:bg-[#1f9350] text-white font-bold text-xs transition shadow-lg shadow-[#23a55a]/30"
                  >
                    <Check className="w-4 h-4" />
                    <span>Foto Toepassen</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-[#1e1f22] hover:bg-[#35373c] text-slate-300 font-bold text-xs transition"
                  >
                    Annuleren
                  </button>

                  <button
                    onClick={takeSnapshot}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold text-xs transition shadow-lg shadow-[#5865f2]/30 active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Foto Maken</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
