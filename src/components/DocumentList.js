import DocumentContent from './DocumetContent.js';
// import plus from '../resources/image/plus.png'

/**
 * Doucment 리스트
 */
function DocumentList({ $target, title, initialState }) {
  const $container = document.createElement('div');
  $container.className = 'list-container';
  $target.appendChild($container);

  // root directory부터 모든 directory 요청
  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    render();
  };

  const render = () => {
    const documentList = this.state;
    $container.innerHTML = `
      <span class="title">${title} 🙌🏻</span>
      <ul class="document-list"></ul>
    `;
    // 최상위 Document
    new DocumentContent({
      $target: $container.querySelector('.document-list'),
      initialState: documentList,
    });
  };
}

export default DocumentList;
