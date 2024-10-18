"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiRender = void 0;
const common_1 = require("@pdfme/common");
const constants_js_1 = require("./constants.js");
const helper_js_1 = require("./helper.js");
const utils_js_1 = require("../utils.js");
const mapVerticalAlignToFlex = (verticalAlignmentValue) => {
    switch (verticalAlignmentValue) {
        case constants_js_1.VERTICAL_ALIGN_TOP:
            return 'flex-start';
        case constants_js_1.VERTICAL_ALIGN_MIDDLE:
            return 'center';
        case constants_js_1.VERTICAL_ALIGN_BOTTOM:
            return 'flex-end';
    }
    return 'flex-start';
};
const getBackgroundColor = (value, schema) => {
    if (!value || !schema.backgroundColor)
        return 'transparent';
    return schema.backgroundColor;
};
const uiRender = async (arg) => {
    const { value, schema, rootElement, mode, onChange, stopEditing, tabIndex, placeholder, options, _cache, } = arg;
    const font = options?.font || (0, common_1.getDefaultFont)();
    let dynamicFontSize = undefined;
    const getCdfArg = (v) => ({
        textSchema: schema,
        font,
        value: v,
        startingFontSize: dynamicFontSize,
        _cache,
    });
    if (schema.dynamicFontSize && value) {
        dynamicFontSize = await (0, helper_js_1.calculateDynamicFontSize)(getCdfArg(value));
    }
    const fontKitFont = await (0, helper_js_1.getFontKitFont)(schema.fontName, font, _cache);
    // Depending on vertical alignment, we need to move the top or bottom of the font to keep
    // it within it's defined box and align it with the generated pdf.
    const { topAdj, bottomAdj } = (0, helper_js_1.getBrowserVerticalFontAdjustments)(fontKitFont, dynamicFontSize ?? schema.fontSize ?? constants_js_1.DEFAULT_FONT_SIZE, schema.lineHeight ?? constants_js_1.DEFAULT_LINE_HEIGHT, schema.verticalAlignment ?? constants_js_1.DEFAULT_VERTICAL_ALIGNMENT);
    const topAdjustment = topAdj.toString();
    const bottomAdjustment = bottomAdj.toString();
    const container = document.createElement('div');
    const containerStyle = {
        padding: 0,
        resize: 'none',
        backgroundColor: getBackgroundColor(value, schema),
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: mapVerticalAlignToFlex(schema.verticalAlignment),
        width: '100%',
        height: '100%',
        cursor: (0, utils_js_1.isEditable)(mode, schema) ? 'text' : 'default',
    };
    Object.assign(container.style, containerStyle);
    rootElement.innerHTML = '';
    rootElement.appendChild(container);
    const textBlockStyle = {
        // Font formatting styles
        fontFamily: schema.fontName ? `'${schema.fontName}'` : 'inherit',
        color: schema.fontColor ? schema.fontColor : constants_js_1.DEFAULT_FONT_COLOR,
        fontSize: `${dynamicFontSize ?? schema.fontSize ?? constants_js_1.DEFAULT_FONT_SIZE}pt`,
        letterSpacing: `${schema.characterSpacing ?? constants_js_1.DEFAULT_CHARACTER_SPACING}pt`,
        lineHeight: `${schema.lineHeight ?? constants_js_1.DEFAULT_LINE_HEIGHT}em`,
        textAlign: schema.alignment ?? constants_js_1.DEFAULT_ALIGNMENT,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        // Block layout styles
        resize: 'none',
        border: 'none',
        outline: 'none',
        marginBottom: `${bottomAdjustment}px`,
        paddingTop: `${topAdjustment}px`,
        backgroundColor: 'transparent',
    };
    const textBlock = document.createElement('div');
    Object.assign(textBlock.style, textBlockStyle);
    if ((0, utils_js_1.isEditable)(mode, schema)) {
        if (!(0, helper_js_1.isFirefox)()) {
            textBlock.contentEditable = 'plaintext-only';
        }
        else {
            textBlock.contentEditable = 'true';
            textBlock.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    document.execCommand('insertLineBreak', false, undefined);
                }
            });
            textBlock.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = e.clipboardData?.getData('text');
                const selection = window.getSelection();
                if (!selection?.rangeCount)
                    return;
                selection.deleteFromDocument();
                selection.getRangeAt(0).insertNode(document.createTextNode(paste || ''));
                selection.collapseToEnd();
            });
        }
        textBlock.tabIndex = tabIndex || 0;
        textBlock.innerText = value;
        textBlock.addEventListener('blur', (e) => {
            onChange && onChange({ key: 'content', value: e.target.innerText });
            stopEditing && stopEditing();
        });
        if (schema.dynamicFontSize) {
            textBlock.addEventListener('keyup', () => {
                setTimeout(() => {
                    void (async () => {
                        if (!textBlock.textContent)
                            return;
                        dynamicFontSize = await (0, helper_js_1.calculateDynamicFontSize)(getCdfArg(textBlock.textContent));
                        textBlock.style.fontSize = `${dynamicFontSize}pt`;
                        const { topAdj: newTopAdj, bottomAdj: newBottomAdj } = (0, helper_js_1.getBrowserVerticalFontAdjustments)(fontKitFont, dynamicFontSize ?? schema.fontSize ?? constants_js_1.DEFAULT_FONT_SIZE, schema.lineHeight ?? constants_js_1.DEFAULT_LINE_HEIGHT, schema.verticalAlignment ?? constants_js_1.DEFAULT_VERTICAL_ALIGNMENT);
                        textBlock.style.paddingTop = `${newTopAdj}px`;
                        textBlock.style.marginBottom = `${newBottomAdj}px`;
                    })();
                }, 0);
            });
        }
        if (placeholder && !value) {
            textBlock.innerText = placeholder;
            textBlock.style.color = constants_js_1.PLACEHOLDER_FONT_COLOR;
            if (schema.dynamicFontSize) {
                const fontSize = await (0, helper_js_1.calculateDynamicFontSize)(getCdfArg(placeholder));
                textBlock.style.fontSize = `${fontSize}pt`;
            }
            textBlock.addEventListener('focus', () => {
                if (textBlock.innerText === placeholder) {
                    textBlock.innerText = '';
                    textBlock.style.color = schema.fontColor ?? constants_js_1.DEFAULT_FONT_COLOR;
                }
            });
        }
        container.appendChild(textBlock);
        if (mode === 'designer') {
            setTimeout(() => {
                textBlock.focus();
                // Set the focus to the end of the editable element when you focus, as we would for a textarea
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(textBlock);
                range.collapse(false); // Collapse range to the end
                selection?.removeAllRanges();
                selection?.addRange(range);
            });
        }
    }
    else {
        textBlock.innerHTML = value
            .split('')
            .map((l, i) => `<span style="letter-spacing:${String(value).length === i + 1 ? 0 : 'inherit'};">${l}</span>`)
            .join('');
        container.appendChild(textBlock);
    }
};
exports.uiRender = uiRender;
//# sourceMappingURL=uiRender.js.map