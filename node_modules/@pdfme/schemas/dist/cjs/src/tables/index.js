"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdfRender_js_1 = require("./pdfRender.js");
const uiRender_js_1 = require("./uiRender.js");
const propPanel_js_1 = require("./propPanel.js");
const tableSchema = {
    pdf: pdfRender_js_1.pdfRender,
    ui: uiRender_js_1.uiRender,
    propPanel: propPanel_js_1.propPanel,
};
exports.default = tableSchema;
//# sourceMappingURL=index.js.map