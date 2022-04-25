/**
 * loading 화면 component
 */
function LoadingComponent({ $target, text }) {
  const $container = document.createElement('div');
  $container.className = 'loading';
  $target.appendChild($container);

  this.showLoad = () => {
    console.log('showload');
    $container.style.display = 'block';
  };
  this.hideLoad = () => {
    $container.style.display = 'none';
  };

  const render = () => {
    $container.innerHTML = `<span class="load-text">${text}</span>`;
  };
  render();
}

export default LoadingComponent;
