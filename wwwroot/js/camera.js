// Module JavaScript để điều khiển camera
let videoElement = null;
let canvasElement = null;
let stream = null;

export async function startCamera(dotNetRef) {
    try {
        videoElement = document.getElementById('cameraVideo');
        canvasElement = document.getElementById('cameraCanvas');

        // Yêu cầu quyền truy cập camera
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'environment' // Ưu tiên camera sau
            }
        });

        videoElement.srcObject = stream;

        return true;
    } catch (error) {
        console.error('Lỗi khi khởi động camera:', error);
        throw error;
    }
}

export async function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    if (videoElement) {
        videoElement.srcObject = null;
    }
}

export async function captureImage() {
    if (!videoElement || !canvasElement) {
        throw new Error('Camera chưa được khởi động');
    }

    const context = canvasElement.getContext('2d');

    // Đặt kích thước canvas bằng với video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Vẽ frame hiện tại từ video lên canvas
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Chuyển đổi thành base64
    return canvasElement.toDataURL('image/jpeg', 0.8);
}

export async function cropImage(imageData, bbox) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = bbox[2];
            canvas.height = bbox[3];

            ctx.drawImage(img, bbox[0], bbox[1], bbox[2], bbox[3], 0, 0, bbox[2], bbox[3]);

            // 👉 debug: hiển thị ảnh crop để kiểm tra
            const preview = new Image();
            preview.src = canvas.toDataURL();
            document.body.appendChild(preview);

            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = imageData;
    });
}
