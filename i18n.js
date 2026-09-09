(function () {
  const LOCALES = [
    { code: 'en', label: 'English' },
    { code: 'zh-CN', label: '简体中文' },
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ru', label: 'Русский' },
    { code: 'pt-BR', label: 'Português' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'th', label: 'ไทย' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'ar', label: 'العربية' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'pl', label: 'Polski' },
    { code: 'uk', label: 'Українська' },
  ];

  const T = {
    en: {
      nav_features: 'Features', nav_docs: 'Docs', nav_install: 'Install', nav_github: 'GitHub', nav_start: 'Get started',
      eyebrow: 'Mihomo · Self-hosted',
      hero_title: 'Manage Mihomo nodes and subscriptions with ease',
      hero_lead: '3m-ui is a lightweight web panel for Linux servers: inbound nodes, users and traffic, client configs, multi-node ops and alerts.',
      btn_install: 'One-click install', btn_docs: 'Read the docs', btn_github: 'GitHub',
      install_label: 'Linux install', copy: 'Copy', copied: 'Copied',
      feat_h: 'Built for operators', feat_p: 'From listeners to client subscriptions in one flow. Stable channel by default.',
      feat1_t: 'Nodes & protocols', feat1_p: 'Manage Mihomo inbound listeners across common protocols and REALITY targets.',
      feat2_t: 'Users & subscriptions', feat2_p: 'Bind nodes per user, control traffic and expiry, export YAML / URI / sing-box.',
      feat3_t: 'Panel ops', feat3_p: 'Install, update, port, password reset; Telegram alerts and backups.',
      steps_h: 'Three steps', steps_p: 'Use a clean Ubuntu / Debian host as root. Default panel port 8080.',
      step1_t: 'Run the installer', step1_p: 'Fetches the current stable binary, scripts and checksums.',
      step2_t: 'Save the initial password', step2_p: 'A one-time admin password is printed (user is usually admin). Change it after login.',
      step3_t: 'Open the panel', step3_p: 'Visit http://SERVER_IP:8080/. Manage the service with the 3m-ui menu.',
      update_label: 'Update',
      cta_h: 'Need more detail?', cta_p: 'Install, nodes, subscriptions, certificates and troubleshooting live under Docs on this site.',
      cta_docs: 'Open docs', cta_qs: 'Quick start',
      foot_tag: 'Lightweight self-hosted Mihomo panel',
      foot_product: 'Product', foot_docs: 'Docs', foot_community: 'Community',
      foot_features: 'Features', foot_install: 'Install', foot_releases: 'Releases',
      foot_docs_home: 'Docs home', foot_qs: 'Quick start', foot_tr: 'Troubleshooting',
    },
    'zh-CN': {
      nav_features: '功能', nav_docs: '文档', nav_install: '安装', nav_github: 'GitHub', nav_start: '开始使用',
      eyebrow: 'Mihomo · 自托管',
      hero_title: '轻松管理你的 Mihomo 节点与订阅',
      hero_lead: '3m-ui 是面向 Linux 服务器的轻量 Web 面板：创建入站、管理用户与流量、下发客户端配置，并支持多机与告警。',
      btn_install: '一键安装', btn_docs: '阅读文档', btn_github: 'GitHub',
      install_label: 'Linux 安装', copy: '复制', copied: '已复制',
      feat_h: '为运维设计的核心能力', feat_p: '从 Listener 到客户端订阅一条链路打通；默认稳定版通道。',
      feat1_t: '节点与协议', feat1_p: '管理 Mihomo 入站 Listener，覆盖常用协议与 REALITY 目标选择。',
      feat2_t: '用户与订阅', feat2_p: '按用户绑定节点，控制流量与到期，下发 YAML / URI / sing-box。',
      feat3_t: '面板运维', feat3_p: '安装、更新、改端口、重置密码；Telegram 告警与备份。',
      steps_h: '三步开始', steps_p: '推荐在干净的 Ubuntu / Debian 主机上以 root 执行。默认端口 8080。',
      step1_t: '运行安装脚本', step1_p: '自动拉取当前稳定版二进制、脚本与校验文件。',
      step2_t: '保存初始密码', step2_p: '首次安装会打印一次性管理员密码（用户名一般为 admin），登录后请立即修改。',
      step3_t: '打开面板', step3_p: '访问 http://服务器IP:8080/。之后用 3m-ui 管理服务与更新。',
      update_label: '更新',
      cta_h: '需要更细的步骤？', cta_p: '安装、节点、订阅、证书与排障说明已整合到本站文档。',
      cta_docs: '打开文档', cta_qs: '快速开始',
      foot_tag: '轻量自托管的 Mihomo 管理面板',
      foot_product: '产品', foot_docs: '文档', foot_community: '社区',
      foot_features: '功能', foot_install: '安装', foot_releases: 'Releases',
      foot_docs_home: '文档首页', foot_qs: '快速开始', foot_tr: '排障',
    },
  };

  // Fallback: clone en then overlay short titles for other langs (nav + hero minimal)
  const extra = {
    'zh-TW': { nav_features: '功能', nav_docs: '文件', nav_install: '安裝', nav_start: '開始使用', hero_title: '輕鬆管理 Mihomo 節點與訂閱', btn_install: '一鍵安裝', btn_docs: '閱讀文件', install_label: 'Linux 安裝', copy: '複製', feat_h: '核心能力', steps_h: '三步開始', cta_docs: '打開文件', foot_tag: '輕量自託管 Mihomo 管理面板' },
    ja: { nav_features: '機能', nav_docs: 'ドキュメント', nav_install: 'インストール', nav_start: 'はじめる', hero_title: 'Mihomo ノードと購読を簡単に管理', btn_install: 'ワンクリックインストール', btn_docs: 'ドキュメント', install_label: 'Linux インストール', copy: 'コピー', feat_h: '運用向けの機能', steps_h: '3ステップ', cta_docs: 'ドキュメントを開く', foot_tag: '軽量セルフホスト Mihomo パネル' },
    ko: { nav_features: '기능', nav_docs: '문서', nav_install: '설치', nav_start: '시작하기', hero_title: 'Mihomo 노드와 구독을 쉽게 관리', btn_install: '원클릭 설치', btn_docs: '문서 읽기', install_label: 'Linux 설치', copy: '복사', feat_h: '운영자를 위한 기능', steps_h: '세 단계', cta_docs: '문서 열기', foot_tag: '가벼운 셀프호스팅 Mihomo 패널' },
    es: { nav_features: 'Funciones', nav_docs: 'Docs', nav_install: 'Instalar', nav_start: 'Empezar', hero_title: 'Gestiona nodos y suscripciones Mihomo', btn_install: 'Instalación rápida', btn_docs: 'Documentación', install_label: 'Instalación Linux', copy: 'Copiar', feat_h: 'Hecho para operadores', steps_h: 'Tres pasos', cta_docs: 'Abrir docs', foot_tag: 'Panel Mihomo ligero y autoalojado' },
    fr: { nav_features: 'Fonctions', nav_docs: 'Docs', nav_install: 'Installer', nav_start: 'Commencer', hero_title: 'Gérez nœuds et abonnements Mihomo', btn_install: 'Installation en un clic', btn_docs: 'Documentation', install_label: 'Installation Linux', copy: 'Copier', feat_h: 'Conçu pour les ops', steps_h: 'Trois étapes', cta_docs: 'Ouvrir la doc', foot_tag: 'Panneau Mihomo léger auto-hébergé' },
    de: { nav_features: 'Funktionen', nav_docs: 'Docs', nav_install: 'Installieren', nav_start: 'Starten', hero_title: 'Mihomo-Knoten und Abos verwalten', btn_install: 'Ein-Klick-Installation', btn_docs: 'Dokumentation', install_label: 'Linux-Installation', copy: 'Kopieren', feat_h: 'Für Betreiber gebaut', steps_h: 'Drei Schritte', cta_docs: 'Docs öffnen', foot_tag: 'Leichtes self-hosted Mihomo-Panel' },
    ru: { nav_features: 'Возможности', nav_docs: 'Документация', nav_install: 'Установка', nav_start: 'Начать', hero_title: 'Управляйте узлами и подписками Mihomo', btn_install: 'Установка в один клик', btn_docs: 'Документация', install_label: 'Установка Linux', copy: 'Копировать', feat_h: 'Для администраторов', steps_h: 'Три шага', cta_docs: 'Открыть документацию', foot_tag: 'Лёгкая self-hosted панель Mihomo' },
    'pt-BR': { nav_features: 'Recursos', nav_docs: 'Docs', nav_install: 'Instalar', nav_start: 'Começar', hero_title: 'Gerencie nós e assinaturas Mihomo', btn_install: 'Instalação rápida', btn_docs: 'Documentação', install_label: 'Instalação Linux', copy: 'Copiar', feat_h: 'Feito para operadores', steps_h: 'Três passos', cta_docs: 'Abrir docs', foot_tag: 'Painel Mihomo leve e auto-hospedado' },
    vi: { nav_features: 'Tính năng', nav_docs: 'Tài liệu', nav_install: 'Cài đặt', nav_start: 'Bắt đầu', hero_title: 'Quản lý node và subscription Mihomo', btn_install: 'Cài một lệnh', btn_docs: 'Tài liệu', install_label: 'Cài Linux', copy: 'Sao chép', feat_h: 'Dành cho vận hành', steps_h: 'Ba bước', cta_docs: 'Mở tài liệu', foot_tag: 'Panel Mihomo nhẹ, tự lưu trữ' },
    id: { nav_features: 'Fitur', nav_docs: 'Docs', nav_install: 'Instal', nav_start: 'Mulai', hero_title: 'Kelola node dan langganan Mihomo', btn_install: 'Instal sekali klik', btn_docs: 'Dokumentasi', install_label: 'Instal Linux', copy: 'Salin', feat_h: 'Untuk operator', steps_h: 'Tiga langkah', cta_docs: 'Buka docs', foot_tag: 'Panel Mihomo ringan self-hosted' },
    th: { nav_features: 'ฟีเจอร์', nav_docs: 'เอกสาร', nav_install: 'ติดตั้ง', nav_start: 'เริ่มต้น', hero_title: 'จัดการโหนดและสับสไครบ์ Mihomo', btn_install: 'ติดตั้งคลิกเดียว', btn_docs: 'เอกสาร', install_label: 'ติดตั้ง Linux', copy: 'คัดลอก', feat_h: 'สำหรับผู้ดูแล', steps_h: 'สามขั้นตอน', cta_docs: 'เปิดเอกสาร', foot_tag: 'แผง Mihomo น้ำหนักเบา self-hosted' },
    tr: { nav_features: 'Özellikler', nav_docs: 'Belgeler', nav_install: 'Kurulum', nav_start: 'Başla', hero_title: 'Mihomo düğüm ve aboneliklerini yönetin', btn_install: 'Tek tık kurulum', btn_docs: 'Belgeler', install_label: 'Linux kurulumu', copy: 'Kopyala', feat_h: 'Operatörler için', steps_h: 'Üç adım', cta_docs: 'Belgeleri aç', foot_tag: 'Hafif self-hosted Mihomo paneli' },
    ar: { nav_features: 'الميزات', nav_docs: 'التوثيق', nav_install: 'التثبيت', nav_start: 'ابدأ', hero_title: 'إدارة عقد واشتراكات Mihomo بسهولة', btn_install: 'تثبيت بنقرة', btn_docs: 'التوثيق', install_label: 'تثبيت Linux', copy: 'نسخ', feat_h: 'مصمم للمشغّلين', steps_h: 'ثلاث خطوات', cta_docs: 'فتح التوثيق', foot_tag: 'لوحة Mihomo خفيفة مستضافة ذاتيًا' },
    hi: { nav_features: 'विशेषताएँ', nav_docs: 'दस्तावेज़', nav_install: 'इंस्टॉल', nav_start: 'शुरू करें', hero_title: 'Mihomo नोड और सब्सक्रिप्शन आसानी से प्रबंधित करें', btn_install: 'एक-क्लिक इंस्टॉल', btn_docs: 'दस्तावेज़', install_label: 'Linux इंस्टॉल', copy: 'कॉपी', feat_h: 'ऑपरेटरों के लिए', steps_h: 'तीन चरण', cta_docs: 'दस्तावेज़ खोलें', foot_tag: 'हल्का self-hosted Mihomo पैनल' },
    pl: { nav_features: 'Funkcje', nav_docs: 'Dokumentacja', nav_install: 'Instalacja', nav_start: 'Start', hero_title: 'Zarządzaj węzłami i subskrypcjami Mihomo', btn_install: 'Instalacja jednym kliknięciem', btn_docs: 'Dokumentacja', install_label: 'Instalacja Linux', copy: 'Kopiuj', feat_h: 'Dla operatorów', steps_h: 'Trzy kroki', cta_docs: 'Otwórz dokumentację', foot_tag: 'Lekki self-hosted panel Mihomo' },
    uk: { nav_features: 'Можливості', nav_docs: 'Документація', nav_install: 'Встановлення', nav_start: 'Почати', hero_title: 'Керуйте вузлами та підписками Mihomo', btn_install: 'Встановлення в один клік', btn_docs: 'Документація', install_label: 'Встановлення Linux', copy: 'Копіювати', feat_h: 'Для адміністраторів', steps_h: 'Три кроки', cta_docs: 'Відкрити документацію', foot_tag: 'Легка self-hosted панель Mihomo' },
  };
  for (const [code, ov] of Object.entries(extra)) {
    T[code] = Object.assign({}, T.en, ov);
  }

  function detect() {
    try {
      const s = localStorage.getItem('3m-ui-web-locale');
      if (s && T[s]) return s;
    } catch (_) {}
    const list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
    for (const l of list) {
      if (T[l]) return l;
      const short = String(l).split('-')[0];
      if (short === 'zh') return String(l).toLowerCase().includes('tw') || String(l).toLowerCase().includes('hk') ? 'zh-TW' : 'zh-CN';
      const hit = LOCALES.find((x) => x.code === l || x.code.startsWith(short));
      if (hit && T[hit.code]) return hit.code;
    }
    return 'en';
  }

  function apply(code) {
    const dict = T[code] || T.en;
    document.documentElement.lang = code === 'zh-CN' ? 'zh-CN' : code;
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      if (k && dict[k] != null) el.textContent = dict[k];
    });
    const sel = document.getElementById('lang-select');
    if (sel) sel.value = code;
    try { localStorage.setItem('3m-ui-web-locale', code); } catch (_) {}
  }

  function initSelect() {
    const sel = document.getElementById('lang-select');
    if (!sel) return;
    sel.innerHTML = '';
    LOCALES.forEach((l) => {
      const o = document.createElement('option');
      o.value = l.code; o.textContent = l.label;
      sel.appendChild(o);
    });
    sel.addEventListener('change', () => apply(sel.value));
  }

  window.ThreeMWebI18n = { apply, detect, LOCALES, T };
  document.addEventListener('DOMContentLoaded', () => {
    initSelect();
    apply(detect());
  });
})();
