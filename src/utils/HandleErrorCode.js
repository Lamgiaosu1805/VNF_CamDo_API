const HandleErrorCode = (errorCode) => {
    switch (errorCode) {
        case "01":
            return `Error: ${errorCode}, Có lỗi khi validate số điện thoại khách hàng`;
        case "02":
            return `Error: ${errorCode}, Sai định dạng số điện thoại`;
        case "03":
            return `Error: ${errorCode}, Device ID không hợp lệ`;
        case "04":
            return `Error: ${errorCode}, Người dùng không tồn tại`;
        case "05":
            return `Error: ${errorCode}, Có lỗi khi validate Login`;
        case "06":
            return `Error: ${errorCode}, Có lỗi khi validate OTP`;
        case "07":
            return `Error: ${errorCode}, OTP không hợp lệ hoặc đã hết hạn`;
        case "08":
            return `Error: ${errorCode}, OTP không chính xác`;
        case "09":
            return `Error: ${errorCode}, Device ID không trùng khớp`;
        case "10":
            return `Error: ${errorCode}, Có lỗi khi check trùng device ID`;
        case "11":
            return `Error: ${errorCode}, Phiên làm việc không hợp lệ`;
        case "12":
            return `Error: ${errorCode}, Có lỗi trong quá trình đăng ký tài khoản`;
        case "13":
            return `Error: ${errorCode}, Sai tên đăng nhập hoặc mật khẩu`;
        case "14":
            return `Error: ${errorCode}, Có lỗi trong quá trình login`;
    
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

module.exports = HandleErrorCode