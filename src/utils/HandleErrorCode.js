const HandleErrorCode = (errorCode) => {
    switch (errorCode) {
        case "01":
            return `Error: ${errorCode}, Có lỗi khi validate số điện thoại khách hàng`;
        case "02":
            return `Error: ${errorCode}, Sai định dạng số điện thoại`;
        case "03":
            return `Error: ${errorCode}, Device ID không hợp lệ`;
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

module.exports = HandleErrorCode