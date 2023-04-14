import { Pattern as PolarisPattern } from '@ephox/polaris';

import Editor from 'tinymce/core/api/Editor';
import Env from 'tinymce/core/api/Env';
import Tools from 'tinymce/core/api/util/Tools';

import * as FindMark from './FindMark';
import { Pattern } from './Types';
export interface SearchState {
  readonly index: number;
  readonly count: number;
  readonly text: string;
  readonly matchCase: boolean;
  readonly wholeWord: boolean;
  readonly inSelection: boolean;
}

const getElmIndex = (elm: Element): string | null => {
  return elm.getAttribute('data-mark-index');
};

const markAllMatches = (editor: Editor, pattern: Pattern, inSelection: boolean): number => {
  const marker = editor.dom.create('span', {
    'data-mce-bogus': 1
  });

  marker.className = 'mce-match-marker';
  const node = editor.getBody();


  if (inSelection) {
    return FindMark.findAndMarkInSelection(editor.dom, pattern, editor.selection, marker);
  } else {
    return FindMark.findAndMark(editor.dom, pattern, node, marker);
  }
};

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

const escapeSearchText = (text: string, wholeWord: boolean): string => {
  const escapedText = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/\s/g, '[^\\S\\r\\n\\uFEFF]');
  const wordRegex = '(' + escapedText + ')';
  return wholeWord ? `(?:^|\\s|${PolarisPattern.punctuation()})` + wordRegex + `(?=$|\\s|${PolarisPattern.punctuation()})` : wordRegex;
};


const tagPrompt = (editor: Editor, text: string, matchCase: boolean, wholeWord: boolean, inSelection: boolean): number => {
  const selection = editor.selection;
  const escapedText = escapeSearchText(text, wholeWord);
  const isForwardSelection = selection.isForward();

  const pattern = {
    regex: new RegExp(escapedText, matchCase ? 'g' : 'gi'),
    matchIndex: 1
  };
  const count = markAllMatches(editor, pattern, inSelection);

  // Safari has a bug whereby splitting text nodes breaks the selection (which is done when marking matches).
  // As such we need to manually reset it after doing a find action. See https://bugs.webkit.org/show_bug.cgi?id=230594
  if (Env.browser.isSafari()) {
    selection.setRng(selection.getRng(), isForwardSelection);
  }

  return count;
}

const unwrap = (node: Node): void => {
  const parentNode = node.parentNode as Node;

  if (node.firstChild) {
    parentNode.insertBefore(node.firstChild, node);
  }
  
  node.parentNode?.removeChild(node);
};

const done = (editor: Editor, keepEditorSelection?: boolean): Range | undefined => {
  let startContainer: Text | null | undefined;
  let endContainer: Text | null | undefined;
  const nodes = Tools.toArray(editor.getBody().getElementsByTagName('span'));
  for (let i = 0; i < nodes.length; i++) {
    const nodeIndex = getElmIndex(nodes[i]);
    // 消除所有span中包含data-mark-index属性的标签
    if (nodeIndex !== null && nodeIndex.length) {     
      unwrap(nodes[i]);
    }
  }

  if (startContainer && endContainer) {
    const rng = editor.dom.createRng();
    rng.setStart(startContainer, 0);
    rng.setEnd(endContainer, endContainer.data.length);

    if (keepEditorSelection !== false) {
      editor.selection.setRng(rng);
    }

    return rng;
  } else {
    return undefined;
  }
};

export {
  custom,
  tagPrompt,
  done
};