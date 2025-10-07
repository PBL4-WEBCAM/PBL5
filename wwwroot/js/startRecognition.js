
window.startRecognitionAnimation = () => {
    const micBtn = document.getElementById("mic-btn");
    if (micBtn) {
        micBtn.classList.add("recording");
    }
};

window.endRecognitionAnimation = () => {
    const micBtn = document.getElementById("mic-btn");
    if (micBtn) {
        micBtn.classList.remove("recording");
    }
};

window.startRecognition = async (dotnetHelper, lang) => {
    // Kiểm tra xem trình duyệt có hỗ trợ Speech Recognition không
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        alert("Trình duyệt không hỗ trợ Speech Recognition");
        return;
    }

    // Kiểm tra HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        alert("Speech Recognition chỉ hoạt động trên HTTPS hoặc localhost");
        return;
    }

    try {
        // Yêu cầu quyền truy cập microphone trước
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Dừng stream sau khi kiểm tra

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        // Cấu hình recognition
        recognition.lang = lang || 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        // Bắt đầu animation và thông báo
        window.startRecognitionAnimation();

        // Xử lý kết quả
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            console.log("Speech result:", text);

            if (dotnetHelper) {
                dotnetHelper.invokeMethodAsync("OnSpeechResult", text)
                    .catch(error => {
                        console.error("Error calling .NET method:", error);
                    });
            }

            window.endRecognitionAnimation();
        };

        // Xử lý lỗi với thông báo cụ thể
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);

            let errorMessage = "Lỗi nhận dạng giọng nói: ";
            switch (event.error) {
                case 'not-allowed':
                    errorMessage += "Vui lòng cấp quyền truy cập microphone cho trang web này";
                    break;
                case 'no-speech':
                    errorMessage += "Không phát hiện giọng nói. Vui lòng thử lại";
                    break;
                case 'audio-capture':
                    errorMessage += "Không thể truy cập microphone";
                    break;
                case 'network':
                    errorMessage += "Lỗi kết nối mạng";
                    break;
                case 'aborted':
                    errorMessage += "Nhận dạng giọng nói bị hủy";
                    break;
                default:
                    errorMessage += event.error;
            }

            alert(errorMessage);
            window.endRecognitionAnimation();
        };

        // Xử lý khi kết thúc
        recognition.onend = () => {
            console.log("Speech recognition ended");
            window.endRecognitionAnimation();
        };

        // Xử lý khi bắt đầu
        recognition.onstart = () => {
            console.log("Speech recognition started");
            alert("Đang lắng nghe... Hãy nói gì đó!");
        };

        recognition.start();

    } catch (error) {
        console.error("Error accessing microphone:", error);
        if (error.name === 'NotAllowedError') {
            alert("Bạn đã từ chối quyền truy cập microphone. Vui lòng:\n1. Click vào biểu tượng khóa/microphone trên thanh địa chỉ\n2. Chọn 'Allow' cho microphone\n3. Reload trang và thử lại");
        } else if (error.name === 'NotFoundError') {
            alert("Không tìm thấy microphone. Vui lòng kiểm tra thiết bị âm thanh");
        } else {
            alert("Không thể truy cập microphone: " + error.message);
        }
        window.endRecognitionAnimation();
    }
};