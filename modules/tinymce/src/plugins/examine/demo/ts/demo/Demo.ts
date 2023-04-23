import { TinyMCE } from 'tinymce/core/api/PublicApi';

declare let tinymce: TinyMCE;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'examine',
  // toolbar: 'searchreplace',
  height: 600,
  menubar: 'custom',
  // menu: {
  //   custom: { title: 'Custom', items: 'searchreplace' }
  // }
});

const tagPrompt = function (text:string): void {
  if (tinymce.activeEditor) {
    tinymce.activeEditor.plugins.examine.tagPrompt(text);
  }
};

export {
  tagPrompt
};
