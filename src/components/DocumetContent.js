import NonChildComponent from './NonChildComponent.js';
import {
  DOWN_ARROW,
  PLUS_PNG,
  RIGHT_ARROW,
  TRASH_PNG,
} from '../util/resources.js';
import { createDocument, deleteDocument } from '../data/documentRepository.js';
import { ROUTE_CHANGE_EVENT } from '../util/constants.js';

/**
 * document content 내용
 */
function DocumentContent({ $target, initialState, onRemove }) {
  const $container = document.createElement('li');
  $container.className = 'documents';
  $target.appendChild($container);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
    this.renderChild();
  };

  // rendering method
  this.render = () => {
    const { isShowChildComponent, title } = this.state;
    $container.innerHTML = `
      <div class="document">
        <img class="open-btn" src="${
          isShowChildComponent ? DOWN_ARROW : RIGHT_ARROW
        }"/>
        <span class="name">${title ? title : 'Document'}</span>
        <div class="btn-con">
          <img class="add-btn" src="${PLUS_PNG}"/>
          <img class="del-btn" src="${TRASH_PNG}"/>
        </div>
      </div>
      <ul class="child"></ul>
    `;
  };
  // 하위 document
  this.renderChild = () => {
    const { isShowChildComponent, documents } = this.state;
    const $childContainer = $container.querySelector('.child');

    if ($childContainer && isShowChildComponent) {
      // console.log(documents);
      if (documents && documents.length > 0) {
        documents.forEach((document) => {
          new DocumentContent({
            $target: $childContainer,
            initialState: document,
            onRemove: removeChildDocument,
          });
        });
      } else {
        new NonChildComponent({
          $target: $childContainer,
        });
      }
    }
  };

  // Event
  $container.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { className } = event.target;
    if (className === 'open-btn') {
      // 하위 document open / close
      this.state.isShowChildComponent = !this.state.isShowChildComponent;
      this.setState(this.state);
    } else if (className === 'add-btn') {
      // 하위 document 생성
      addDocument();
    } else if (className === 'del-btn') {
      // 해당 document 제거
      delDocument();
    } else if (className === 'name') {
      // editor에 document 내용 setting
      focusDocument();
    }
  });
  // document 추가
  const addDocument = async () => {
    let { id, documents } = this.state;
    const document = await createDocument('제목 없음', id);
    documents.push({ ...document, documents: [] });
    this.setState(this.state);
  };
  // document 제거
  const delDocument = async () => {
    const { id, documents } = this.state;
    await deleteDocument(id);
    onRemove(id, documents);
  };
  // document edit page 이동
  const focusDocument = () => {
    const { id } = this.state;
    if (id != undefined) {
      history.pushState(null, null, `/${id}`);
      window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_EVENT, {}));
    }
  };
  // 하위 document가 제거되었을 때 호출
  const removeChildDocument = (childId, childDocuments) => {
    const { documents } = this.state;
    // 삭제할 하위 document id
    const index = documents.findIndex((document) => document.id == childId);
    documents.splice(index, 1);
    if (childDocuments) {
      documents.push(...childDocuments);
    }

    this.setState(this.state);
  };

  this.render();
  this.renderChild();
}

export default DocumentContent;
