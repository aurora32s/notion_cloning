/**
 * 하위 document가 없는 경우
 */
function NonChildComponent({ $target }) {
  const $container = document.createElement('li');
  $container.className = 'non-child';
  $container.innerHTML = `
        <span>하위 페이지가 없습니다.</span>
    `;
  $target.appendChild($container);
}

export default NonChildComponent;
