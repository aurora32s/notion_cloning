import { getAllDocuments, getDocuments } from './data/documentRepository.js';
import { ROUTE_CHANGE_EVENT } from './util/constants.js';
import DocumentEditor from './components/DocumentEditor.js';
import DocumentList from './components/DocumentList.js';
import LoadingComponent from './components/LoadingComponent.js';

function App({ $target }) {
  const $container = document.createElement('div');
  $container.className = 'root';
  $target.appendChild($container);

  let state = {};

  this.setState = (nextState) => {
    state = nextState;
    documentList.setState(state);
  };

  const saveLoading = new LoadingComponent({
    $target: $container,
    text: '저장 중입니다.',
  });

  // TODO 로그인 기능 구현 후 사용자 닉네임으로 변경하기
  const documentList = new DocumentList({
    $target: $container,
    title: 'Seom Notion',
    initialState: {},
  });

  const documentEditor = new DocumentEditor({
    $target: $container,
    initialState: {},
    onTitleChange: () => {
      this.setState(state);
    },
    onSave: saveLoading.showLoad,
    onSaveComplete: saveLoading.hideLoad,
  });

  const fetchDocuments = async () => {
    const documents = await getAllDocuments();
    this.setState(documents);
  };

  // id에 맞는 document 객체와 경로 받아오기
  const fetchEditorData = async () => {
    const { pathname } = location;
    const id = pathname.substring(1);
    if (!id || id.trim().length == 0) {
      // id 가 없는 경우
      documentEditor.setState();
      return;
    }

    const path = [];
    const document = getDocumentPath(id, path, state);

    if (document) {
      documentEditor.setState({
        path,
        document,
      });
    }
  };

  function getDocumentPath(id, path, document) {
    path.push({
      title: document.title,
      id: document.id,
    });
    if (document.id == id) {
      return document;
    }
    for (const child of document.documents) {
      const result = getDocumentPath(id, path, child);
      if (result) {
        // id를 찾은 경로
        return result;
      } else {
        path.pop();
      }
    }
    return undefined;
  }

  // 1. document 리스트 요청
  fetchDocuments();
  // 2. window event 등록
  window.addEventListener(ROUTE_CHANGE_EVENT, fetchEditorData);
  window.addEventListener('popstate', fetchEditorData);
}

export default App;
