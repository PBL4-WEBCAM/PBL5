// Speech Recognition cho trang Translate
let recognition = null;
let isRecording = false;

window.startRecognition = function (dotnetHelper, language) {
    // Kiểm tra hỗ trợ Speech Recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('Trình duyệt không hỗ trợ Speech Recognition');
        alert('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome hoặc Edge.');
        return;
    }

    // Tạo instance của SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    // Cấu hình
    recognition.lang = language; // 'en-US' hoặc 'vi-VN'
    recognition.continuous = false; // Dừng sau khi nhận được kết quả
    recognition.interimResults = false; // Không cần kết quả tạm thời
    recognition.maxAlternatives = 1;

    // Xử lý kết quả
    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;

        console.log('Kết quả nhận dạng:', transcript);
        console.log('Độ tin cậy:', confidence);

        // Gọi callback về Blazor
        if (dotnetHelper) {
            dotnetHelper.invokeMethodAsync('OnSpeechResult', transcript)
                .catch(err => console.error('Lỗi gọi Blazor method:', err));
        }

        isRecording = false;
    };

    // Xử lý lỗi
    recognition.onerror = function (event) {
        console.error('Lỗi Speech Recognition:', event.error);
        isRecording = false;

        let errorMessage = 'Có lỗi xảy ra khi nhận dạng giọng nói';

        switch (event.error) {
            case 'no-speech':
                errorMessage = 'Không phát hiện giọng nói. Vui lòng thử lại.';
                break;
            case 'audio-capture':
                errorMessage = 'Không thể truy cập microphone. Vui lòng kiểm tra quyền.';
                break;
            case 'not-allowed':
                errorMessage = 'Quyền microphone bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.';
                break;
            case 'network':
                errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
                break;
            case 'aborted':
                errorMessage = 'Ghi âm đã bị hủy.';
                break;
        }

        alert(errorMessage);

        // Thông báo về Blazor rằng đã dừng
        if (dotnetHelper) {
            dotnetHelper.invokeMethodAsync('OnSpeechResult', '')
                .catch(err => console.error('Lỗi gọi Blazor method:', err));
        }
    };

    // Xử lý khi kết thúc
    recognition.onend = function () {
        console.log('Speech recognition đã kết thúc');
        isRecording = false;
    };

    // Xử lý khi bắt đầu
    recognition.onstart = function () {
        console.log('Speech recognition đã bắt đầu');
        isRecording = true;
    };

    // Bắt đầu nhận dạng
    try {
        recognition.start();
        console.log('Đang lắng nghe...');
    } catch (error) {
        console.error('Lỗi khi start recognition:', error);
        alert('Không thể bắt đầu nhận dạng giọng nói. Vui lòng thử lại.');
        isRecording = false;
    }
};

// Hàm dừng nhận dạng (nếu cần)
window.stopRecognition = function () {
    if (recognition && isRecording) {
        recognition.stop();
        console.log('Đã dừng nhận dạng giọng nói');
    }
};

// Kiểm tra hỗ trợ Speech Recognition
window.checkSpeechRecognitionSupport = function () {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
};