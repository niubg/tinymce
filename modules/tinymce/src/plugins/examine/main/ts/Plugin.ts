import PluginManager from 'tinymce/core/api/PluginManager';
import * as Api from './api/Api';


export default (delay: number = 300): void => {
  PluginManager.add('examine', (editor) => {
    const api = Api.get(editor);
    return api;
  });
};