import { updateDocument } from '../data/documentRepository.js';
import { ROUTE_CHANGE_EVENT } from '../util/constants.js';

function DocumentEditor({ $target, onTitleChange, onSave, onSaveComplete }) {
  const $container = document.createElement('div');
  $container.className = 'editor';
  $target.appendChild($container);

  this.state = {
    history: [],
  };

  this.setState = (nextState) => {
    this.state = nextState;
    render();
  };

  const render = () => {
    if (this.state == undefined) {
      $container.innerHTML = '';
      return;
    }
    const { path, document } = this.state;
    const { title, content } = document;
    $container.innerHTML = `
      <div class="history">
      ${path
        .map(
          ({ title, id }) =>
            `<a class="path" id="${id}">${title ? title : 'Document'}</a>`
        )
        .join(' / ')}
      </div>
      <div class="edit-area">
        <input type="text" class="title" value="${title}" placeholder="제목 없음">
        <hr/>
        <div class="edit-btn">
          <button id="bold"><b>B</b></button>
          <button id="italic"><i>I</i></button>
          <button id="underline"><u>U</u></button>
          <button id="strikeThrough"><s>S</s></button>
        </div>
        <div contenteditable class="content">${content ? content : ''}</div>
      </div>
    `;
  };

  // 입력 event
  $container.addEventListener('keyup', (event) => {
    const { className } = event.target;

    if (className === 'title') {
      const title = event.target.value;
      // 제목인 경우에는 리스트 제목에 바로 변경
      const { document } = this.state;
      document.title = title;
      onTitleChange();
      changeDocument();
    } else if (className === 'content') {
      changeDocument();
    }
  });

  let timer = undefined;
  const changeDocument = () => {
    // 디바운스
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(editDocument, 3000);
  };

  const editDocument = async () => {
    const document = this.state.document;
    if (!document) return;
    const { id } = document;
    if (!id) return;

    const title = $container.querySelector('.title').value;
    const content = $container.querySelector('.content').innerHTML;
    try {
      onSave();
      await updateDocument(id, {
        title,
        content,
      });
      document.title = title;
      document.content = content;
    } catch (exception) {
      alert('수정 정보를 저장하는 도중 문제가 발생하였습니다.');
    } finally {
      setTimeout(onSaveComplete, 3000);
    }
  };

  // 클릭 event
  $container.addEventListener('click', (event) => {
    const { className } = event.target;

    // 경로 클릭 시, 해당 document로 이동
    if (className === 'path') {
      const { id } = event.target;
      if (id != 'undefined') {
        event.stopPropagation();
        history.pushState(null, null, `/${id}`);
        window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_EVENT, {}));
      }
    } else {
      const button = event.target.closest('button');

      if (button) {
        const { id } = button;
        if (id) {
          document.execCommand(id, true);
          changeDocument();
        }
      }
    }
  });
}

export default DocumentEditor;
