const HandleErrorCode = (errorCode) => {
    switch (errorCode) {
        case "01":
            return `Error: ${errorCode}, Có lỗi khi validate số điện thoại khách hàng`;
        case "02":
            return `Error: ${errorCode}, Sai định dạng số điện thoại`;
        
    
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

module.exports = HandleErrorCode