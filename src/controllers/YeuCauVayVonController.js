const { FailureResponse } = require("../utils/ResponseRequest");

const YeuCauVayVonController = {
    guiYeuCauVayVon: (req, res) => {
        if (!req.filePaths) {
            return res.json(FailureResponse("25"));
        }
        res.status(200).json({ files: req.filePaths });
    }
}
module.exports = YeuCauVayVonController