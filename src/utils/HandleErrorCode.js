const HandleErrorCode = (errorCode) => {
    switch (errorCode) {
        case "01":
            return "Error:01, Username đã tồn tại";
        
    
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

//Auth: "01", "02", "05", "06", "07", "08", "09", "13", "14"

//User: "03", "04", "10"

//Xứ Đoàn: "11"

//Ngành: "12"
module.exports = HandleErrorCode