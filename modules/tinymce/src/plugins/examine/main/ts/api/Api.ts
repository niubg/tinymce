import Editor from 'tinymce/core/api/Editor';

import * as Actions from '../core/Actions';

export interface Api {
  readonly custom: () => void;
  readonly tagPrompt: (text: string, matchCase: boolean, wholeWord: boolean, inSelection?: boolean) => number;
  readonly done: (editor: Editor) => Range | undefined;
}

const get = (editor: Editor): Api => {
  const custom = () => {
    return Actions.custom(editor);
  };

  const tagPrompt = (text: string, matchCase: boolean, wholeWord: boolean, inSelection: boolean = false) => {
    return Actions.tagPrompt(editor, text, matchCase, wholeWord, inSelection);
  };

  const done = () => {
    return Actions.done(editor);
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
