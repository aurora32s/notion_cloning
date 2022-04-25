/**
 * api 요청
 */

import { BASE_URL } from '../util/constants.js';

export const request = async (url, option = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...option,
      headers: {
        'Content-Type': 'application/json',
        'x-username': 'seom',
      },
    });

    if (response.ok) {
      const data = response.json();
      return data;
    }

    throw new Error('서버로부터 데이터를 받아오는데 실패하였습니다.');
  } catch (exception) {
    console.log(exception);
    alert('작업을 수행하던 도중 문제가 발생하였습니다.');
  }
};
