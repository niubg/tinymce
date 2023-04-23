import PluginManager from 'tinymce/core/api/PluginManager';

import * as Api from './api/Api';

export default (): void => {
  PluginManager.add('examine', (editor) => {
    const api = Api.get(editor);
    return api;
  });
};