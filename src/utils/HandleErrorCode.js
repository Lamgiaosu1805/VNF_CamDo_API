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
            return `Error: ${errorCode}, Phiên làm việc không hợp lệ, yêu cầu xác minh OTP trước`;
        case "12":
            return `Error: ${errorCode}, Có lỗi trong quá trình đăng ký tài khoản`;
        case "13":
            return `Error: ${errorCode}, Sai tên đăng nhập hoặc mật khẩu`;
        case "14":
            return `Error: ${errorCode}, Có lỗi trong quá trình login`;
        case "15":
            return `Error: ${errorCode}, Có lỗi trong quá trình tạo tài khoản Admin`;
        case "16":
            return `Error: ${errorCode}, Có lỗi trong quá trình đăng nhập tài khoản Admin`;
        case "17":
            return `Error: ${errorCode}, Có lỗi trong quá trình sử dụng tính năng quên mật khẩu`;
        case "18":
            return `Error: ${errorCode}, Có lỗi trong quá trình reset mật khẩu`;
        case "19":
            return `Error: ${errorCode}, Có lỗi trong quá trình thêm loại tài sản`;
        case "20":
            return `Error: ${errorCode}, Token Invalid`;
        case "21":
            return `Error: ${errorCode}, Có lỗi khi verify token`;
        case "22":
            return `Error: ${errorCode}, Not Authenticated`;
        case "23":
            return `Error: ${errorCode}, Lấy danh sách tài sản lỗi`;
        case "24":
            return `Error: ${errorCode}, Có lỗi khi upload ảnh`;
        case "25":
            return `Error: ${errorCode}, Không có ảnh để upload`;
        case "26":
            return `Error: ${errorCode}, Có lỗi khi gửi yêu cầu vay vốn`;
        case "27":
            return `Error: ${errorCode}, Đã tồn tại yêu cầu gọi vốn đang chờ phê duyệt`;
        case "28":
            return `Error: ${errorCode}, Tài khoản chưa EKYC`;
        case "29":
            return `Error: ${errorCode}, Có lỗi khi ekyc`;
        case "30":
            return `Error: ${errorCode}, Có lỗi khi save device Token`;
        case "31":
            return `Error: ${errorCode}, Có lỗi khi gửi thông báo`;
        case "32":
            return `Error: ${errorCode}, Có lỗi khi lấy danh sách yêu cầu vay vốn`;
        case "33":
            return `Error: ${errorCode}, Có lỗi khi gửi yêu cầu giải ngân`;
        case "34":
            return `Error: ${errorCode}, Có lỗi khi hoàn thành thẩm định`;
        case "35":
            return `Error: ${errorCode}, Không tìm thấy yêu cầu vay vốn`;
        case "36":
            return `Error: ${errorCode}, Có lỗi khi tính tiền trả hàng kỳ`;
        case "37":
            return `Error: ${errorCode}, Có lỗi khi lấy danh sách yêu cầu vay vốn`;
        case "38":
            return `Error: ${errorCode}, Có lỗi khi lấy thông tin cá nhân khách hàng`;
        case "39":
            return `Error: ${errorCode}, Số kỳ trả nợ phải lớn hơn 0`;
        
    
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

module.exports = HandleErrorCode