document.addEventListener('DOMContentLoaded', (event) => {
    const videoElement = document.getElementById('inputVideo');
    const canvasElement = document.getElementById('outputCanvas');
    const canvasCtx = canvasElement.getContext('2d');
    const startButton = document.getElementById('startButton');

    function resizeCanvas() {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
    }

    function calculateAngle(A, B, C) {
        const BA = Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
        const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
        const AC = Math.sqrt(Math.pow(A.x - C.x, 2) + Math.pow(A.y - C.y, 2));
        return Math.acos((BA * BA + BC * BC - AC * AC) / (2 * BA * BC)) * (180 / Math.PI);
    }

    function onResults(results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (results.poseLandmarks) {
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
            drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

            const ombro = results.poseLandmarks[12];
            const cotovelo = results.poseLandmarks[14];
            const pulso = results.poseLandmarks[16];

            const anguloCotovelo = calculateAngle(ombro, cotovelo, pulso);

            canvasCtx.fillStyle = 'black';
            canvasCtx.font = '20px Arial';
            canvasCtx.fillText(`Ângulo do Cotovelo: ${anguloCotovelo.toFixed(2)}°`, 10, 30);
        }

        canvasCtx.restore();
    }

    const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);

    function onCameraStart() {
        resizeCanvas();
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await pose.send({ image: videoElement });
            },
            width: 1200,
            height: 720
        });
        camera.start();
    }

    startButton.addEventListener('click', () => {
        console.log("Botão Iniciar Câmera clicado!");
        videoElement.style.display = 'block';
        canvasElement.style.display = 'block';
        startButton.style.display = 'none';
        onCameraStart();
    });
    

    window.addEventListener('resize', resizeCanvas);
});
