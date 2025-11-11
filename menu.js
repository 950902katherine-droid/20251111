(function(){
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  // Modal 元素（改為使用 modalContent）
  const modalOverlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  // 必要元素檢查
  if (!hamburger || !sidebar || !overlay || !modalOverlay || !modalContent || !modalClose) {
    if (hamburger) {
      hamburger.setAttribute('aria-hidden', 'true');
      hamburger.disabled = true;
    }
    return;
  }

  function openMenu(){
    sidebar.classList.add('open');
    overlay.classList.add('show');
    hamburger.setAttribute('aria-expanded', 'true');
    sidebar.setAttribute('aria-hidden', 'false');
    const firstLink = sidebar.querySelector('a');
    if(firstLink) firstLink.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeMenu(){
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    sidebar.setAttribute('aria-hidden', 'true');
    hamburger.focus();
    document.body.style.overflow = '';
  }

  function openModalWithURL(url){
    if(!modalOverlay || !modalContent) return;
    modalContent.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.frameBorder = '0';
    iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups';
    modalContent.appendChild(iframe);

    modalOverlay.classList.add('show');
    modalOverlay.setAttribute('aria-hidden', 'false');
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function openModalWithImage(imgUrl){
    if(!modalOverlay || !modalContent) return;
    modalContent.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';
    wrap.style.height = '100%';
    wrap.style.padding = '12px';
    wrap.style.boxSizing = 'border-box';

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = '自我介紹照片';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '80%';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '6px';
    img.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)';
    wrap.appendChild(img);

    const caption = document.createElement('div');
    caption.textContent = '414730357 林○涵';
    caption.style.marginTop = '10px';
    caption.style.fontWeight = '700';
    caption.style.color = '#222';
    wrap.appendChild(caption);

    modalContent.appendChild(wrap);

    modalOverlay.classList.add('show');
    modalOverlay.setAttribute('aria-hidden', 'false');
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    if(!modalOverlay || !modalContent) return;
    modalOverlay.classList.remove('show');
    modalOverlay.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
    document.body.style.overflow = '';
    if(hamburger) hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    if(expanded) closeMenu(); else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // 監聽側邊選單中的連結：data-url 以 iframe 開啟；data-img 以 inline 圖片顯示
  sidebar.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const url = a.dataset && a.dataset.url;
    const img = a.dataset && a.dataset.img;
    if (url) {
      e.preventDefault();
      closeMenu();
      setTimeout(() => openModalWithURL(url), 160);
      return;
    }
    if (img) {
      e.preventDefault();
      closeMenu();
      setTimeout(() => openModalWithImage(img), 160);
      return;
    }
    // 若不是 data-url 或 data-img（例如回到首頁），則讓連結正常運作並關閉選單
    closeMenu();
  });

  // Modal 關閉事件
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);

  // Esc 鍵關閉任一介面
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalOverlay && modalOverlay.classList.contains('show')) {
        closeModal();
        return;
      }
      if (sidebar.classList.contains('open')) {
        closeMenu();
      }
    }
  });
})();