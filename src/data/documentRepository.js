/**
 * api 요청 repository
 */

import { request } from './api.js';

// root directory부터 모든 document 요청
export async function getAllDocuments() {
  const result = { documents: await request('/') };

  if (result.documents.length > 0) {
    const response = await Promise.all(
      result.documents.map((document) => getChildDocument(document))
    );
    result.documents = response;
  }
  return {
    ...result,
    isShowChildComponent: false,
    showDocNameInput: false,
  };
}

const getChildDocument = async (documents) => {
  documents = await request(`/${documents.id}`);
  if (documents.documents.length > 0) {
    const response = await Promise.all(
      documents.documents.map((document) => getChildDocument(document))
    );
    documents.documents = response;
  }
  return {
    ...documents,
    isShowChildComponent: false,
    showDocNameInput: false,
  };
};

// document 요청
export async function getDocuments(documentId = '') {
  return await request(`/${documentId}`);
}

// document 생성
export async function createDocument(title, parentId) {
  return request('/', {
    method: 'POST',
    body: JSON.stringify({ title: title, parent: parentId }),
  });
}

// document 수정
export async function updateDocument(documentId, document) {
  console.log(documentId);
  console.log(JSON.stringify(document));
  return request(`/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify(document),
  });
}

// document 삭제
export async function deleteDocument(documentId) {
  return request(`/${documentId}`, {
    method: 'DELETE',
  });
}
