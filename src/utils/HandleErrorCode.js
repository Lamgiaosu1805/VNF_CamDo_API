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
            return `Error: ${errorCode}, Token Invalid, vui lòng đăng nhập lại`;
        case "21":
            return `Error: ${errorCode}, Có lỗi khi verify token`;
        case "22":
            return `Error: ${errorCode}, Not Authenticated, vui lòng đăng nhập lại`;
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
        case "40":
            return `Error: ${errorCode}, Có lỗi khi gửi vị trí khách hàng`;
        case "41":
            return `Error: ${errorCode}, Có lỗi khi đồng ý giải ngân`;
        case "42":
            return `Error: ${errorCode}, Có lỗi khi Ký hợp đồng`;
        case "43":
            return `Error: ${errorCode}, Số hợp đồng trong kỳ vay đã tồn tại`;
        case "44":
            return `Error: ${errorCode}, Có lỗi khi lấy danh sách khách hàng`;
        case "45":
            return `Error: ${errorCode}, Có lỗi khi lấy danh sách khoản vay`;
        case "46":
            return `Error: ${errorCode}, Có lỗi khi huỷ yêu cầu gọi vốn`;
        case "47":
            return `Error: ${errorCode}, Lý do huỷ không được bỏ trống`;
        case "48":
            return `Error: ${errorCode}, Ảnh và số tiền không được để rỗng`;
        case "49":
            return `Error: ${errorCode}, Có lỗi khi nạp tiền`;
        case "50":
            return `Error: ${errorCode}, Có lỗi khi lấy danh sách ngân hàng`;
        case "51":
            return `Error: ${errorCode}, Có lỗi khi liên kết tài khoản ngân hàng`;
        case "52":
            return `Error: ${errorCode}, Có lỗi khi generate OTP`;
        case "53":
            return `Error: ${errorCode}, Có lỗi khi rút tiền`;
        case "54":
            return `Error: ${errorCode}, Có lỗi khi lấy danh sách yêu cầu rút tiền`;
        case "55":
            return `Error: ${errorCode}, Có lỗi khi phê duyệt yêu cầu rút tiền`;
        case "56":
            return `Error: ${errorCode}, Có lỗi khi từ chối yêu cầu rút tiền`;
        case "57":
            return `Error: ${errorCode}, Có lỗi khi lấy danh sách tài khoản ngân hàng liên kết`;
        case "58":
            return `Error: ${errorCode}, Có lỗi khi lấy lịch sử giao dịch`;
        case "59":
            return `Error: ${errorCode}, Có lỗi khi thay đổi mật khẩu`;
        case "60":
            return `Error: ${errorCode}, Sai mật khẩu`;
        case "61":
            return `Error: ${errorCode}, Có lỗi khi lấy chi tiết khoản vay`;
        case "62":
            return `Error: ${errorCode}, Có lỗi khi thanh toán nợ kỳ tới`;
        case "63":
            return `Error: ${errorCode}, Có lỗi khi save firebase token admin`;
        case "64":
            return `Error: ${errorCode}, Có lỗi khi lấy danh sách thông báo`;
        case "65":
            return `Error: ${errorCode}, Có lỗi khi cập nhật thông tin loại tài sản`;
        case "66":
            return `Error: ${errorCode}, Có lỗi khi thêm mối quan hệ người tham chiếu`;
        case "67":
            return `Error: ${errorCode}, Có lỗi khi lấy danh sách mối quan hệ người tham chiếu`;
        case "68":
            return `Error: ${errorCode}, Có lỗi khi xoá mối quan hệ người tham chiếu`;
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

module.exports = HandleErrorCode