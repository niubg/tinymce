import Editor from 'tinymce/core/api/Editor';

import * as Actions from '../core/Actions';

export interface Api {
  readonly custom: () => void;
  readonly tagPrompt: (text: string, tipsText: string, matchCase: boolean, wholeWord: boolean, inSelection?: boolean, setAttribute?: string) => number;
  readonly done: (index?: string) => void;
}

const get = (editor: Editor): Api => {
  const custom = () => {
    return Actions.custom(editor);
  };

  const tagPrompt = (text: string, tipsText: string = '', matchCase: boolean, wholeWord: boolean, inSelection: boolean = false, setAttribute?: string) => {
    return Actions.tagPrompt(editor, text, matchCase, wholeWord, inSelection, tipsText, setAttribute);
  };

  const done = (index: string = '') => {
    return Actions.done(editor, index);
  };

  return {
    custom,
    tagPrompt,
    done,
  };
};

export {
  get
};
