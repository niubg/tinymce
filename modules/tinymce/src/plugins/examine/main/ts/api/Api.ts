import Editor from 'tinymce/core/api/Editor';
import * as Actions from '../core/Actions';

export interface Api {
  readonly custom: () => void;
}

const get = (editor: Editor): Api => {
 
  const custom = () => {
    return Actions.custom(editor);
    debugger
    var selectedContent = editor.selection.getContent();
    if (selectedContent.length > 0) {
      // 检查是否包含指定类名
      if (selectedContent.includes('my-class')) {
        // 删除指定的类名
        var newContent = selectedContent.replace('my-class', '');
      } else {
        // 添加指定的类名
        var newContent = '<span class="my-class">' + selectedContent + '</span>';
      }

      // 替换选中的文本为新文本
      editor.selection.setContent(newContent);
    }
  }

  return {
    custom
  };
};

export {
  get
};
