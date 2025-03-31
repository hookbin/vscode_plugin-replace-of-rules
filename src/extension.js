const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    console.log('Replace plugin is now active!');

    // // 注册一个状态栏按钮
    // const replaceTextButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    // replaceTextButton.text = 'Replace Text';
    // replaceTextButton.command = 'extension.replaceText';
    // replaceTextButton.show();
    // context.subscriptions.push(replaceTextButton);

    // const replaceShowButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    // replaceShowButton.text = 'Replace Show';
    // replaceShowButton.command = 'extension.replaceShow';
    // replaceShowButton.show();
    // context.subscriptions.push(replaceShowButton);

    const decorationType = getDecorationType();

    // 清除装饰的函数
    const clearDecorations = () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.setDecorations(decorationType, []); // 清空所有装饰
        }
    };
    // 监听活动编辑器变化
    vscode.window.onDidChangeActiveTextEditor(clearDecorations, null, context.subscriptions);

    // 监听文档关闭事件
    vscode.workspace.onDidCloseTextDocument(clearDecorations, null, context.subscriptions);

    const disposableReplace = async (modifyDocument) => {

        // 获取当前活动的文本编辑器
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active text editor');
            return;
        }

        // 获取根目录路径
        const workspaceFolder = vscode.workspace.workspaceFolders;
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder opened');
            return;
        }

        const rootPath = workspaceFolder[0].uri.fsPath;

        // 读取.replace文件
        const replaceFilePath = path.join(rootPath, '.replace');
        if (!fs.existsSync(replaceFilePath)) {
            vscode.window.showErrorMessage('.replace file not found in the workspace root');
            return;
        }

        const replaceContent = fs.readFileSync(replaceFilePath, 'utf-8');
        const rules = replaceContent.split('\n').map(line => line.trim()).filter(line => {
            // 忽略空行和以#或//开头的注释行
            return line !== '' && !line.startsWith('#') && !line.startsWith('//');
        });

        // 解析规则
        const replaceRules = {};
        rules.forEach(rule => {
            const [pattern, replacement] = rule.split('=').map(s => s.trim());
            if (!pattern || !replacement) {
                vscode.window.showWarningMessage(`Invalid rule: ${rule}`);
                return;
            }
            replaceRules[pattern] = replacement;
        });
        if (modifyDocument) {
            // 方案 1：修改文档内容
            const edits = [];
            const decorations = []; // 用于存储高亮装饰
            for (const [pattern, replacement] of Object.entries(replaceRules)) {
                const regex = new RegExp(pattern, 'g');
                let match;
                while ((match = regex.exec(editor.document.getText())) !== null) {
                    const startPos = editor.document.positionAt(match.index);
                    const endPos = editor.document.positionAt(match.index + match[0].length);
                    const range = new vscode.Range(startPos, endPos);

                    // 动态生成替换内容：原内容 + 替换后的内容
                    const newText = `[${replacement}]`;
                    edits.push({ range, newText });
                }
            }
            if (edits.length > 0) {
                editor.edit(editBuilder => {
                    edits.forEach(edit => editBuilder.replace(edit.range, edit.newText));
                }).then(success => {
                    if (success) {
                        vscode.window.showInformationMessage('文档内容替换完成');
                    } else {
                        vscode.window.showErrorMessage('文档内容替换失败');
                    }
                });
            } else {
                vscode.window.showWarningMessage('未找到匹配的内容进行替换');
            }
        } else {
            // 方案 2：仅在显示时替换
            const decorations = [];
            for (const [pattern, replacement] of Object.entries(replaceRules)) {
                const regex = new RegExp(pattern, 'g');
                let match;
                while ((match = regex.exec(editor.document.getText())) !== null) {
                    const range = editor.document.getWordRangeAtPosition(editor.document.positionAt(match.index));
                    if (range) {
                        const displayText = `${replacement}`;
                        decorations.push({
                            range: range,
                            renderOptions: {
                                after: {
                                    contentText: displayText
                                }
                            }
                        });
                    }
                }
            }
            editor.setDecorations(decorationType, decorations);
        }
    }

    // 注册命令
    const disposableReplaceShow = vscode.commands.registerCommand('extension.replaceShow', async () => { await disposableReplace(false) });
    context.subscriptions.push(disposableReplaceShow);
    const disposableReplaceText = vscode.commands.registerCommand('extension.replaceText', async () => { await disposableReplace(true) });
    context.subscriptions.push(disposableReplaceText);
}

function getDecorationType() {
    const decorationTypeConfig = vscode.workspace.getConfiguration('replaceOfRules.decorationType');
    const color = decorationTypeConfig.get('color', '#000000');
    const backgroundColor = decorationTypeConfig.get('backgroundColor', 'rgba(255, 255, 0, 0.5)');
    const borderColor = decorationTypeConfig.get('borderColor', 'black');
    const borderWidth = decorationTypeConfig.get('borderWidth', '1px');
    const borderRadius = decorationTypeConfig.get('borderRadius', '3px');
    const padding = decorationTypeConfig.get('padding', '2px');

    const decorationType = vscode.window.createTextEditorDecorationType({
        after: {
            contentText: '',
            color: color, // 默认文字颜色为黑色
            backgroundColor: backgroundColor, // 高亮背景颜色为半透明黄色
            borderColor: borderColor, // 设置边框颜色为黑色
            borderWidth: borderWidth, // 设置边框宽度
            borderRadius: borderRadius, // 设置边框圆角
            padding: padding // 设置内边距
        }
    });
    return decorationType;
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};