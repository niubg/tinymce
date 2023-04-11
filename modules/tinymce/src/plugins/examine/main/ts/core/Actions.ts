import Editor from 'tinymce/core/api/Editor';
export interface SearchState {
  readonly index: number;
  readonly count: number;
  readonly text: string;
  readonly matchCase: boolean;
  readonly wholeWord: boolean;
  readonly inSelection: boolean;
}

const custom = (editor: Editor): undefined => {
  const selectedContent = editor.selection.getContent();
  let newContent;
  if (selectedContent.length > 0) {
    // 检查是否包含指定类名
    if (selectedContent.includes('my-class')) {
      // 删除指定的类名
      newContent = selectedContent.replace('my-class', '');
    } else {
      // 添加指定的类名
      newContent = '<span class="my-class">' + selectedContent + '</span>';
    }

    // 替换选中的文本为新文本
    editor.selection.setContent(newContent);
  }
  return undefined;
};

export {
  custom
};