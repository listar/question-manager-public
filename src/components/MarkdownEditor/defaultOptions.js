// doc: https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#ToastUIEditor
export default {
  minHeight: '100px',
  previewStyle: 'vertical',
  useCommandShortcut: true,
  useDefaultHTMLSanitizer: true,
  // usageStatistics: false,
    initialEditType: "wysiwyg", // 默认模式
    hideModeSwitch: true,  // 不需要 markdown 和 wysiwyg 的切换
    language: 'zh', // 中文
    usageStatistics: false, // 不要默认发谷歌统计
    html: '<h1>hello</h1>',
  toolbarItems: [
    'heading',
    'bold',
    'italic',
    'strike',
    'divider',
    'hr',
    'quote',
    'divider',
    'ul',
    'ol',
    // 'task',
    'indent',
    'outdent',
    'divider',
    'table',
    'image',
    'link',
    'divider',
    // 'code',
    // 'codeblock'
  ],
    exts: [
        'colorSyntax',
        // 'uml',
        // 'mark',
        // 'table'
    ]
}
