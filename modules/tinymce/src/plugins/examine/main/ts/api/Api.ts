import Editor from 'tinymce/core/api/Editor';

import * as Actions from '../core/Actions';

export interface Api {
  readonly custom: () => void;
}

const get = (editor: Editor): Api => {
  const custom = () => {
    return Actions.custom(editor);
  };

  return {
    custom
  };
};

export {
  get
};
