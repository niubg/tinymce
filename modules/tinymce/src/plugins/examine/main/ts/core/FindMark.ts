import { Arr } from '@ephox/katamari';
import { Attribute, Insert, SugarElement, SugarText } from '@ephox/sugar';

import DOMUtils from 'tinymce/core/api/dom/DOMUtils';
import EditorSelection from 'tinymce/core/api/dom/Selection';

import * as TextCollect from './TextCollect';
import * as TextPosition from './TextPosition';
import { Pattern, TextMatch, TextSection } from './Types';

const find = (pattern: Pattern, sections: TextSection[]): TextMatch[][] =>
  Arr.bind(sections, (section) => {
    const elements = section.elements;
    const content = Arr.map(elements, SugarText.get).join('');
    const positions = TextPosition.find(content, pattern, section.sOffset, content.length - section.fOffset);
    return TextPosition.extract(elements, positions);
  });
// setAttribute给dom追加标签属性,这是查找标记后标签的唯一值
const mark = (matches: TextMatch[][], replacementNode: HTMLElement, setAttribute?: string): void => {
  const setAttributes:string = setAttribute ? setAttribute: 'data-mark-index';
  // Walk backwards and mark the positions
  // Note: We need to walk backwards so the position indexes don't change
  Arr.eachr(matches, (match, idx) => {
    Arr.eachr(match, (pos) => {
      const wrapper = SugarElement.fromDom(replacementNode.cloneNode(false) as HTMLElement);
      Attribute.set(wrapper, setAttributes, idx);
      const textNode = pos.element.dom;
      if (textNode.length === pos.finish && pos.start === 0) {
        Insert.wrap(pos.element, wrapper);
      } else {
        if (textNode.length !== pos.finish) {
          textNode.splitText(pos.finish);
        }
        const matchNode = textNode.splitText(pos.start);
        Insert.wrap(SugarElement.fromDom(matchNode), wrapper);
      }
    });
  });
};

const findAndMark = (dom: DOMUtils, pattern: Pattern, node: Node, replacementNode: HTMLElement, setAttribute?: string): number => {
  const textSections = TextCollect.fromNode(dom, node);
  const matches = find(pattern, textSections);
  mark(matches, replacementNode, setAttribute);
  return matches.length;
};

const findAndMarkInSelection = (dom: DOMUtils, pattern: Pattern, selection: EditorSelection, replacementNode: HTMLElement): number => {
  const bookmark = selection.getBookmark();

  // Handle table cell selection as the table plugin enables
  // you to fake select table cells and perform actions on them
  const nodes = dom.select('td[data-mce-selected],th[data-mce-selected]');
  const textSections = nodes.length > 0 ? TextCollect.fromNodes(dom, nodes) : TextCollect.fromRng(dom, selection.getRng());

  // Find and mark matches
  const matches = find(pattern, textSections);
  mark(matches, replacementNode);

  // Restore the selection
  selection.moveToBookmark(bookmark);
  return matches.length;
};

export {
  findAndMark,
  findAndMarkInSelection
};
