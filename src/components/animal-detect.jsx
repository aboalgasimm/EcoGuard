import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

function AnimalDetector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');

  useEffect(() => {
    async function getVideo() {
      try {
        // Get available video devices first
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);

        // Request webcam with specific constraints to prefer desktop cameras
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: { ideal: 'environment' }, // Prefer back camera, but fallback to any
            deviceId: selectedCamera ? { exact: selectedCamera } : undefined
          }
        };

        // If no camera selected, try to find a webcam automatically
        if (!selectedCamera) {
          const webcam = videoDevices.find(device => 
            device.label.toLowerCase().includes('webcam') ||
            device.label.toLowerCase().includes('usb') ||
            device.label.toLowerCase().includes('integrated') ||
            (!device.label.toLowerCase().includes('front') &&
             !device.label.toLowerCase().includes('back') &&
             !device.label.toLowerCase().includes('selfie'))
          );

          if (webcam) {
            constraints.video.deviceId = { exact: webcam.deviceId };
            setSelectedCamera(webcam.deviceId);
          }
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      } catch (error) {
        console.error('Error accessing webcam:', error);
        // Fallback to basic video request
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreaming(true);
        } catch (fallbackError) {
          console.error('Fallback camera access failed:', fallbackError);
        }
      }
    }
    getVideo();
  }, [selectedCamera]);

  const captureFrame = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'frame.jpg');

      const res = await axios.post('http://localhost:5000/detect', formData);
      drawBoxes(res.data.results);
    }, 'image/jpeg');
  };

  const drawBoxes = (boxes) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.font = '14px Arial';
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    boxes.forEach(box => {
      const [x1, y1, x2, y2] = box.box;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.fillText(`Class: ${box.class} (${(box.score * 100).toFixed(1)}%)`, x1, y1 - 5);
    });
  };

  useEffect(() => {
    if (!streaming) return;
    const interval = setInterval(captureFrame, 1000); // 1 frame per second
    return () => clearInterval(interval);
  }, [streaming]);

  return (
    <div>
      {cameras.length > 1 && (
        <div style={{ marginBottom: '10px' }}>
          <label>Select Camera: </label>
          <select 
            value={selectedCamera} 
            onChange={(e) => setSelectedCamera(e.target.value)}
            style={{ padding: '5px', marginLeft: '10px' }}
          >
            <option value="">Auto Select (Webcam Preferred)</option>
            {cameras.map((camera, index) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc', maxWidth: '100%' }} />
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        {streaming ? 'Camera active - Animal detection running' : 'Loading camera...'}
      </div>
    </div>
  );
}

export default AnimalDetector;
