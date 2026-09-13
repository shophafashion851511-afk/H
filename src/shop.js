function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str;
}

function handleSearchInput(e) {
  searchQuery = e.target.value.trim();
  renderProducts();
}

function executeSearch() {
  const input = document.getElementById('searchInput');
  if (input) searchQuery = input.value.trim();
  renderProducts();
}

let sellerPin = "851011"; 
let isSellerAuthenticated = false;

let currentUser = JSON.parse(localStorage.getItem('vietshop_current_user')) || null;
let registeredUsers = JSON.parse(localStorage.getItem('vietshop_registered_users')) || [
  { phone: "0912345678", name: "Nguyễn Văn A", password: "123" }
];

let logoClickCount = 0;
let logoClickTimer = null;

let selectedVariationSize = '';
let selectedVariationColor = '';
let buyerOrderFilterStatus = 'all';

const defaultHeroBanners = [
  {
    id: "banner_img_0",
    type: "image",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80",
    tag: "Đại Tiệc Mua Sắm 2026",
    title: "SIÊU ĐẠI HỘI SALE VIETSHOP 9.9",
    subtitle: "Voucher 500K • Miễn Phí Vận Chuyển 0Đ • Giảm Sốc 50%"
  },
  {
    id: "banner_img_1",
    type: "image",
    image: "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=1200&auto=format&fit=crop&q=80",
    tag: "Công Nghệ Đột Phá",
    title: "TUẦN LỄ SIÊU CÔNG NGHỆ GIẢM 50%",
    subtitle: "Sắm Điện Thoại, Tai Nghe Chính Hãng - Trả Góp 0%"
  },
  {
    id: "banner_img_2",
    type: "image",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80",
    tag: "Xu Hướng Thời Trang",
    title: "BỘ SƯU TẬP THỜI TRANG HÀN QUỐC",
    subtitle: "Giảm tới 60% cho bộ sưu tập Mùa Thu Mới Nhất"
  },
  {
    id: "banner_img_3",
    type: "image",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&auto=format&fit=crop&q=80",
    tag: "Ưu Đãi Độc Quyền",
    title: "GIA DỤNG THÔNG MINH CHO GIA ĐÌNH",
    subtitle: "Đồng Giá Từ 99K • Đổi Trả 15 Ngày Miễn Phí"
  },
  {
    id: "banner_vid_0",
    type: "video",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    tag: "Video Trải Nghiệm",
    title: "TRẢI NGHIỆM MUA SẮM THÔNG MINH VIETSHOP",
    subtitle: "Khám phá video sản phẩm sống động • Cam kết 100% chính hãng • Giao hàng hỏa tốc",
    autoplay: true,
    muted: true,
    loop: true
  }
];

let heroBanners = JSON.parse(JSON.stringify(defaultHeroBanners));
let currentBannerIndex = 0;
let adminSimCurrentIndex = 0;
let bannerIntervalTimer = null;

let sellerOrdersData = [
  {
    id: "VS-883921",
    customerName: "Nguyễn Văn A",
    phone: "0912345678",
    fullAddress: "Số 12 Đường Hoàng Hoa Thám, Phường Cống Vị, Quận Ba Đình, Hà Nội",
    productInfo: "Áo Thun Nam Nữ Form Rộng x 2 (Màu: Trắng Sữa / Size: Size L)",
    items: [
      { id: "sp-01", name: "Áo Thun Nam Nữ Form Rộng Unisex Cotton 100% Thoáng Mát Basic Tee", price: 129000, qty: 2, selectedColor: "Trắng Sữa", selectedSize: "Size L" }
    ],
    amount: 258000,
    paymentMethod: "COD",
    time: "10 phút trước",
    status: "pending"
  },
  {
    id: "VS-883915",
    customerName: "Trần Thị B",
    phone: "0988123456",
    fullAddress: "Số 458 Nguyễn Thị Minh Khai, Phường 2, Quận 3, TP. Hồ Chí Minh",
    productInfo: "Tai Nghe Bluetooth ANC x 1 (Màu: Đen Huyền Bí / Size: Freesize)",
    items: [
      { id: "sp-02", name: "Tai Nghe Bluetooth Không Dây True Wireless Chống Ồn Chủ Động ANC Âm Bass Cực Căng", price: 389000, qty: 1, selectedColor: "Đen Huyền Bí", selectedSize: "Freesize" }
    ],
    amount: 389000,
    paymentMethod: "Ví VIETPay",
    time: "2 giờ trước",
    status: "pending"
  }
];

let productsData = [
  {
    id: "sp-01",
    name: "Áo Thun Nam Nữ Form Rộng Unisex Cotton 100% Thoáng Mát Basic Tee",
    price: 129000,
    originalPrice: 220000,
    discountPercent: 41,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80"
    ],
    videoUrl: "",
    category: "fashion_men",
    categoryName: "Thời Trang Nam",
    rating: 4.9,
    soldCount: 12500,
    stock: 245,
    sizes: ["Size M", "Size L", "Size XL"],
    colors: ["Đen Trơn", "Trắng Sữa", "Xám Khói"],
    description: "Áo thun phong cách Unisex form rộng hiện đại, phù hợp cho cả nam và nữ.\n- Chất liệu: 100% Cotton tự nhiên 2 chiều dày dặn.\n- Co giãn tốt, thấm hút mồ hôi vượt trội, thoáng mát suốt ngày dài.",
    reviews: [
      { name: "Hoàng Nam", comment: "Giao hàng siêu nhanh, đóng gói cẩn thận. Sản phẩm giống y như hình mô tả!" },
      { name: "Phương Thảo", comment: "Chất lượng tuyệt vời trong tầm giá. Shop tư vấn nhiệt tình 10/10!" }
    ],
    isFlashSale: true,
    isMall: true
  },
  {
    id: "sp-02",
    name: "Tai Nghe Bluetooth Không Dây True Wireless Chống Ồn Chủ Động ANC Âm Bass Cực Căng",
    price: 389000,
    originalPrice: 750000,
    discountPercent: 48,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    gallery: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"],
    videoUrl: "",
    category: "electronics",
    categoryName: "Thiết Bị Điện Tử",
    rating: 4.8,
    soldCount: 8901,
    stock: 119,
    sizes: ["Freesize"],
    colors: ["Đen Huyền Bí", "Trắng Tinh Khôi"],
    description: "Tai nghe bluetooth không dây thế hệ mới 2026 với công nghệ chống ồn ANC.\n- Bluetooth 5.3 kết nối siêu nhanh, độ trễ cực thấp.",
    reviews: [
      { name: "Minh Quân", comment: "Nghe nhạc cực hay, bass đập căng đét luôn shop ơi!" },
      { name: "Ngọc Ánh", comment: "Pin trâu dùng 2 ngày chưa hết, chống ồn rất đỉnh." }
    ],
    isFlashSale: true,
    isMall: true
  },
  {
    id: "sp-03",
    name: "Son Kem Lì Mịn Môi Lâu Trôi Lên Màu Chuẩn Siêu Xinh 6 Tone Hot Trend",
    price: 99000,
    originalPrice: 180000,
    discountPercent: 45,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80",
    gallery: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"],
    videoUrl: "",
    category: "beauty",
    categoryName: "Sắc Đẹp & Mỹ Phẩm",
    rating: 4.9,
    soldCount: 23100,
    stock: 350,
    sizes: ["Thỏi 3.5g"],
    colors: ["#01 Đỏ Đất", "#02 Cam Cháy", "#03 Hồng Khô"],
    description: "Dòng son kem lì Velvet Mịn Môi với kết cấu xốp mịn như nhung, không gây khô môi.",
    reviews: [
      { name: "Thanh Trúc", comment: "Son màu chuẩn xinh lắm ạ, không bị khô môi tẹo nào." }
    ],
    isFlashSale: true,
    isMall: true
  },
  {
    id: "sp-04",
    name: "Giày Sneaker Nam Nữ Thể Thao Đế Cao Su Non Êm Chân Phong Cách Hàn Quốc",
    price: 249000,
    originalPrice: 450000,
    discountPercent: 44,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    gallery: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"],
    videoUrl: "",
    category: "shoes",
    categoryName: "Giày Dép",
    rating: 4.8,
    soldCount: 7600,
    stock: 180,
    sizes: ["Size 38", "Size 39", "Size 40", "Size 41", "Size 42"],
    colors: ["Trắng Đỏ", "Trắng Đen"],
    description: "Mẫu giày sneaker hot hit trẻ trung, phối đồ cực kỳ tôn dáng và phong cách.",
    reviews: [
      { name: "Đức Anh", comment: "Giày đi êm chân, vừa vặn đúng size. Vote 5 sao!" }
    ],
    isFlashSale: true,
    isMall: false
  }
];

const categoriesList = [
  { id: 'all', name: '🌟 Tất Cả', icon: '' },
  { id: 'fashion_men', name: 'Thời Trang Nam', img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=300&auto=format&fit=crop&q=80' },
  { id: 'fashion_women', name: 'Thời Trang Nữ', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80' },
  { id: 'tech_phones', name: 'Điện Thoại & Phụ Kiện', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80' },
  { id: 'electronics', name: 'Thiết Bị Điện Tử', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80' },
  { id: 'beauty', name: 'Sắc Đẹp & Mỹ Phẩm', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80' },
  { id: 'home_living', name: 'Nhà Cửa & Đời Sống', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&auto=format&fit=crop&q=80' },
  { id: 'shoes', name: 'Giày Dép', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80' }
];

const defaultPromotionsConfig = {
  marqueeBadge: "SIÊU SALE 2026",
  marqueePromoText: "⚡ FLASH SALE GIẢM 50%: Săn deal sốc 9K - 99K - 199K hôm nay! • 🎟️ Mã VIETSHOP50K - Giảm 50.000đ đơn từ 200K • 🚚 FREESHIP 0Đ: Miễn phí vận chuyển toàn quốc cho mọi đơn hàng • 🎁 Mã FREESHIP100 - Tặng voucher giảm phí ship 15K • 💳 Giảm thêm 10.000đ khi thanh toán qua Ví điện tử VIETPay • ✨ 100% Hàng chính hãng - Đổi trả miễn phí 7 ngày",
  activePromoCode: "VIETSHOP50K",
  vietpayDiscount: 10000,
  shippingMode: "threshold", // 'threshold' | 'free' | 'fixed'
  defaultShippingFee: 25000,
  freeShippingThreshold: 200000,
  shippingNotice: "Miễn phí vận chuyển toàn quốc cho đơn hàng từ 200.000₫",
  vouchers: [
    { code: "VIETSHOP50K", type: "fixed", value: 50000, minOrder: 200000, desc: "Giảm 50.000₫ cho đơn từ 200K", active: true },
    { code: "FREESHIP100", type: "shipping", value: 15000, minOrder: 0, desc: "Giảm 15.000₫ phí vận chuyển", active: true },
    { code: "SALE10", type: "percent", value: 10, minOrder: 150000, desc: "Giảm 10% tối đa 50K cho đơn từ 150K", active: true }
  ]
};

let savedPromotions = null;
try {
  savedPromotions = JSON.parse(localStorage.getItem('vietshop_promotions_config'));
} catch (e) {
  savedPromotions = null;
}

let siteConfig = {
  brandTitle: "VIETSHOP",
  topAnnouncement: "VIETSHOP bao ship 0Đ - Đăng ký nhận ngay 100k • Hàng ngàn mã giảm giá 50%",
  heroTitle: "SIÊU ĐẠI HỘI SALE VIETSHOP 9.9",
  heroSubtitle: "Voucher 500K • Miễn Phí Vận Chuyển 0Đ • Giảm Sốc 50%",
  searchBtn: "Tìm",
  cartBtn: "Giỏ Hàng",
  hotline: "1900 1221 (8h00 - 21h00)",
  bankName: "MB Bank (Ngân Hàng Quân Đội)",
  bankAccount: "0912345678",
  accountHolder: "VIETSHOP OFFICIAL",
  customQrUrl: "",
  geminiApiKey: localStorage.getItem('vietshop_gemini_api_key') || "",
  ...defaultPromotionsConfig,
  ...(savedPromotions || {}),
  aiKnowledgeRules: [
    { id: "r1", keyword: "ship", reply: "VIETSHOP miễn phí vận chuyển 0Đ toàn quốc cho đơn từ 200K hoặc áp dụng voucher FREESHIP100 hôm nay ạ!" },
    { id: "r2", keyword: "đổi trả", reply: "Shop hỗ trợ đổi trả hàng miễn phí trong vòng 15 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc không đúng mẫu." },
    { id: "r3", keyword: "bảo hành", reply: "Các sản phẩm điện tử tại VIETSHOP được bảo hành chính hãng 12 tháng, đổi mới trong 30 ngày đầu." },
    { id: "r4", keyword: "thanh toán", reply: "Shop hỗ trợ COD (nhận hàng rồi thanh toán), Ví VIETPay (giảm 10k) và Chuyển khoản QR Ngân hàng." }
  ]
};

let currentMode = 'buyer';
let currentCategory = 'all';
let currentFilterType = 'all';
let searchQuery = '';
let cart = [];
let appliedVoucher = null;

function formatVND(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

function renderBuyerAuthWidget() {
  const widget = document.getElementById('buyerAuthWidget');
  if (!widget) return;

  if (currentUser) {
    widget.innerHTML = `
      <div class="flex items-center gap-1.5">
        <button onclick="openBuyerOrdersModal()" class="px-2.5 py-0.5 bg-white text-[#ee4d2d] hover:bg-orange-50 rounded-full font-extrabold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs">
          <span>📦</span> <span class="hidden sm:inline">Đơn Hàng Của Tôi</span>
        </button>
        <div class="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-white text-[11px]">
          <span class="font-bold truncate max-w-[90px] sm:max-w-none">👤 ${currentUser.name || currentUser.phone}</span>
          <button onclick="handleBuyerLogout()" title="Đăng Xuất" class="hover:text-amber-200 font-bold ml-0.5 cursor-pointer">🚪</button>
        </div>
      </div>
    `;
  } else {
    widget.innerHTML = `
      <button onclick="openBuyerAuthModal()" class="px-2.5 py-0.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full text-[11px] transition cursor-pointer flex items-center gap-1 border border-white/30">
        <span>🔒</span> <span>Đăng Nhập / Đăng Ký</span>
      </button>
    `;
  }
}

function openBuyerAuthModal() {
  switchAuthSubTab('login');
  document.getElementById('buyerAuthModal')?.classList.remove('hidden');
}

function closeBuyerAuthModal() {
  document.getElementById('buyerAuthModal')?.classList.add('hidden');
}

function switchAuthSubTab(tab) {
  const loginForm = document.getElementById('formBuyerLogin');
  const regForm = document.getElementById('formBuyerRegister');
  const loginBtn = document.getElementById('authTabLoginBtn');
  const regBtn = document.getElementById('authTabRegisterBtn');

  if (tab === 'register') {
    loginForm?.classList.add('hidden');
    regForm?.classList.remove('hidden');
    if (regBtn) regBtn.className = "flex-1 py-3 text-emerald-600 border-b-2 border-emerald-600 cursor-pointer font-bold";
    if (loginBtn) loginBtn.className = "flex-1 py-3 text-slate-500 border-b-2 border-transparent hover:text-slate-800 cursor-pointer font-bold";
  } else {
    regForm?.classList.add('hidden');
    loginForm?.classList.remove('hidden');
    if (loginBtn) loginBtn.className = "flex-1 py-3 text-[#ee4d2d] border-b-2 border-[#ee4d2d] cursor-pointer font-bold";
    if (regBtn) regBtn.className = "flex-1 py-3 text-slate-500 border-b-2 border-transparent hover:text-slate-800 cursor-pointer font-bold";
  }
}

function handleBuyerLogin(e) {
  e.preventDefault();
  const phone = document.getElementById('loginPhone').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();

  const user = registeredUsers.find(u => u.phone === phone && u.password === pass);
  if (user) {
    currentUser = user;
    localStorage.setItem('vietshop_current_user', JSON.stringify(currentUser));
    closeBuyerAuthModal();
    renderBuyerAuthWidget();
    autoFillCheckoutInfo();
    alert(`🎉 Xin chào ${user.name}! Đăng nhập thành công.`);
  } else {
    alert('⚠️ Số điện thoại hoặc mật khẩu không chính xác!');
  }
}

function handleBuyerRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const pass = document.getElementById('regPassword').value.trim();

  if (registeredUsers.some(u => u.phone === phone)) {
    return alert('⚠️ Số điện thoại này đã được đăng ký tài khoản!');
  }

  const newUser = { name, phone, password: pass };
  registeredUsers.push(newUser);
  currentUser = newUser;

  localStorage.setItem('vietshop_registered_users', JSON.stringify(registeredUsers));
  localStorage.setItem('vietshop_current_user', JSON.stringify(currentUser));

  closeBuyerAuthModal();
  renderBuyerAuthWidget();
  autoFillCheckoutInfo();
  alert(`🎉 Đăng ký tài khoản thành công! Xin chào ${name}.`);
}

function handleBuyerLogout() {
  if (confirm('Bạn có chắc muốn đăng xuất tài khoản?')) {
    currentUser = null;
    localStorage.removeItem('vietshop_current_user');
    renderBuyerAuthWidget();
  }
}

function autoFillCheckoutInfo() {
  if (currentUser) {
    const nameInput = document.getElementById('checkoutName');
    const phoneInput = document.getElementById('checkoutPhone');
    if (nameInput) nameInput.value = currentUser.name || '';
    if (phoneInput) phoneInput.value = currentUser.phone || '';
  }
}

function openBuyerOrdersModal() {
  if (!currentUser) {
    openBuyerAuthModal();
    return;
  }

  buyerOrderFilterStatus = 'all';
  filterBuyerOrders('all');
  document.getElementById('buyerOrdersModal')?.classList.remove('hidden');
}

function closeBuyerOrdersModal() {
  document.getElementById('buyerOrdersModal')?.classList.add('hidden');
}

function filterBuyerOrders(status) {
  buyerOrderFilterStatus = status;
  
  const btnAll = document.getElementById('btnBuyerOrderTabAll');
  const btnPending = document.getElementById('btnBuyerOrderTabPending');
  const btnShipping = document.getElementById('btnBuyerOrderTabShipping');
  const btnDelivered = document.getElementById('btnBuyerOrderTabDelivered');
  const btnCancelled = document.getElementById('btnBuyerOrderTabCancelled');

  [btnAll, btnPending, btnShipping, btnDelivered, btnCancelled].forEach(b => {
    if (b) b.className = "py-2.5 px-3 text-slate-500 border-b-2 border-transparent hover:text-slate-800 whitespace-nowrap cursor-pointer";
  });

  if (status === 'pending' && btnPending) btnPending.className = "py-2.5 px-3 text-[#ee4d2d] border-b-2 border-[#ee4d2d] whitespace-nowrap cursor-pointer";
  else if (status === 'shipping' && btnShipping) btnShipping.className = "py-2.5 px-3 text-[#ee4d2d] border-b-2 border-[#ee4d2d] whitespace-nowrap cursor-pointer";
  else if (status === 'delivered' && btnDelivered) btnDelivered.className = "py-2.5 px-3 text-[#ee4d2d] border-b-2 border-[#ee4d2d] whitespace-nowrap cursor-pointer";
  else if (status === 'cancelled' && btnCancelled) btnCancelled.className = "py-2.5 px-3 text-[#ee4d2d] border-b-2 border-[#ee4d2d] whitespace-nowrap cursor-pointer";
  else if (btnAll) btnAll.className = "py-2.5 px-3 text-[#ee4d2d] border-b-2 border-[#ee4d2d] whitespace-nowrap cursor-pointer";

  renderBuyerOrdersList();
}

function getStatusStepIndex(status) {
  switch (status) {
    case 'pending': return 1;
    case 'packing': return 2;
    case 'shipping': return 3;
    case 'delivered': return 4;
    case 'cancelled': return 0;
    default: return 1;
  }
}

function renderBuyerOrdersList() {
  const container = document.getElementById('buyerOrdersContainer');
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `<div class="text-center py-8 text-slate-400">Vui lòng đăng nhập để xem lịch sử đơn hàng.</div>`;
    return;
  }

  let userOrders = sellerOrdersData.filter(o => o.phone === currentUser.phone);

  if (buyerOrderFilterStatus === 'pending') {
    userOrders = userOrders.filter(o => o.status === 'pending' || o.status === 'packing');
  } else if (buyerOrderFilterStatus === 'shipping') {
    userOrders = userOrders.filter(o => o.status === 'shipping');
  } else if (buyerOrderFilterStatus === 'delivered') {
    userOrders = userOrders.filter(o => o.status === 'delivered');
  } else if (buyerOrderFilterStatus === 'cancelled') {
    userOrders = userOrders.filter(o => o.status === 'cancelled');
  }

  if (userOrders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 space-y-2">
        <div class="text-4xl">🛍️</div>
        <p class="font-bold text-slate-700 text-sm">Chưa có đơn hàng nào trong mục này!</p>
        <p class="text-slate-400 text-xs">Hãy đặt mua sản phẩm để theo dõi tiến trình giao hàng trực tiếp tại đây.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = userOrders.map(o => {
    const stepIdx = getStatusStepIndex(o.status);
    const isCancelled = o.status === 'cancelled';
    const isDelivered = o.status === 'delivered';

    return `
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5 shadow-2xs">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <span class="font-black text-slate-900 text-sm">Đơn hàng #${o.id}</span>
            <span class="text-[10px] text-slate-400 block">${o.time}</span>
          </div>
          <div class="text-right">
            <span class="font-black text-[#ee4d2d] text-sm block">${formatVND(o.amount)}</span>
            <span class="text-[10px] text-slate-500">${o.paymentMethod || 'COD'}</span>
          </div>
        </div>

        <p class="text-xs text-slate-800 font-bold bg-white p-2.5 rounded-xl border border-slate-200 leading-snug">
          🛒 ${o.productInfo}
        </p>

        ${o.convertedToCod ? `
          <div class="p-3 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs flex items-start gap-2.5 shadow-2xs">
            <span class="text-base shrink-0">🚚</span>
            <div class="space-y-0.5">
              <span class="font-extrabold text-[#ee4d2d] block">Chuyển sang Ship COD (Thu tiền tận nơi khi nhận hàng)</span>
              <p class="text-[11px] text-amber-800 leading-relaxed">
                Shop chưa thấy tiền chuyển về tài khoản từ ví/ngân hàng nên đã chuyển đơn sang hình thức <b>Ship COD</b>. Bạn vui lòng chuẩn bị <b>${formatVND(o.amount)}</b> tiền mặt để thanh toán cho bưu tá khi nhận hàng nhé!
              </p>
            </div>
          </div>
        ` : ''}

        ${isCancelled ? `
          <div class="bg-red-50 text-red-700 p-2.5 rounded-xl border border-red-200 text-center font-bold text-xs">
            ❌ Đơn hàng này đã bị hủy / hoàn lại.
          </div>
        ` : `
          <div class="pt-2">
            <div class="text-[11px] font-extrabold text-slate-700 mb-2 flex justify-between">
              <span>TRẠNG THÁI TIẾN TRÌNH:</span>
              <span class="text-[#ee4d2d]">
                ${stepIdx === 1 ? '⏳ Chờ shop xác nhận' : ''}
                ${stepIdx === 2 ? '📦 Shop đang đóng gói' : ''}
                ${stepIdx === 3 ? '🚚 Đang vận chuyển' : ''}
                ${stepIdx === 4 ? '✅ Giao hàng thành công' : ''}
              </span>
            </div>

            <div class="grid grid-cols-4 gap-1 relative text-center">
              <div class="space-y-1">
                <div class="h-2 rounded-full ${stepIdx >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}"></div>
                <span class="text-[9px] font-bold ${stepIdx >= 1 ? 'text-emerald-700' : 'text-slate-400'}">1. Đã đặt</span>
              </div>
              <div class="space-y-1">
                <div class="h-2 rounded-full ${stepIdx >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}"></div>
                <span class="text-[9px] font-bold ${stepIdx >= 2 ? 'text-emerald-700' : 'text-slate-400'}">2. Đóng gói</span>
              </div>
              <div class="space-y-1">
                <div class="h-2 rounded-full ${stepIdx >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}"></div>
                <span class="text-[9px] font-bold ${stepIdx >= 3 ? 'text-emerald-700' : 'text-slate-400'}">3. Đang giao</span>
              </div>
              <div class="space-y-1">
                <div class="h-2 rounded-full ${stepIdx >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}"></div>
                <span class="text-[9px] font-bold ${stepIdx >= 4 ? 'text-emerald-700' : 'text-slate-400'}">4. Hoàn tất</span>
              </div>
            </div>
          </div>
        `}

        <div class="flex items-center justify-between border-t border-slate-200 pt-3 flex-wrap gap-2">
          <div class="text-[10px] text-slate-500">
            📍 Giao đến: <b>${o.customerName}</b> (${o.phone}) - ${o.fullAddress}
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            ${(stepIdx === 3 || (stepIdx === 4 && !isDelivered)) ? `
              <button onclick="confirmBuyerReceived('${o.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl shadow-xs cursor-pointer transition">
                ✅ Xác Nhận Đã Nhận Hàng
              </button>
            ` : ''}

            <button onclick="rebuyOrder('${o.id}')" class="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-[#ee4d2d] font-extrabold text-[11px] rounded-xl cursor-pointer transition">
              🔄 Mua Lại
            </button>

            <button onclick="openAiChatWithOrder('${o.id}')" class="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-extrabold text-[11px] rounded-xl cursor-pointer transition flex items-center gap-1" title="Trợ giúp đơn hàng">
              <span>✨</span> Trợ Giúp
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');
}

function confirmBuyerReceived(orderId) {
  if (confirm(`Bạn xác nhận đã nhận đầy đủ hàng cho đơn #${orderId}?`)) {
    const order = sellerOrdersData.find(o => o.id === orderId);
    if (order) {
      order.status = 'delivered';
      renderBuyerOrdersList();
      if (currentMode === 'seller') renderSellerOrders();
      alert('🎉 Cảm ơn bạn đã xác nhận nhận hàng! Đơn hàng đã chuyển sang trạng thái Hoàn Tất.');
    }
  }
}

function rebuyOrder(orderId) {
  const order = sellerOrdersData.find(o => o.id === orderId);
  if (!order) return;

  if (order.items && order.items.length > 0) {
    order.items.forEach(it => {
      const matchedProd = productsData.find(p => p.id === it.id) || {
        id: it.id,
        name: it.name,
        price: it.price,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
      };
      addToCart(matchedProd, it.selectedSize || '', it.selectedColor || '');
    });
  } else {
    const firstProd = productsData[0];
    addToCart(firstProd);
  }

  closeBuyerOrdersModal();
  openCartModal();
  alert(`🛒 Đã thêm các sản phẩm từ đơn hàng #${orderId} vào giỏ hàng của bạn!`);
}

function handleLogoClick() {
  if (currentMode === 'seller') {
    switchTab('buyer');
    return;
  }

  logoClickCount++;
  if (logoClickTimer) clearTimeout(logoClickTimer);

  if (logoClickCount >= 5) {
    logoClickCount = 0;
    if (!isSellerAuthenticated) {
      openPinModal();
    } else {
      switchTab('seller');
    }
  } else {
    logoClickTimer = setTimeout(() => {
      logoClickCount = 0;
    }, 2500);
  }
}

// IndexedDB Media Storage for Banner (Images & Video Files)
const BANNER_DB_NAME = 'vietshop_banner_db';
const BANNER_DB_VERSION = 1;
const BANNER_STORE = 'banner_media';

function openBannerDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) return resolve(null);
    const req = indexedDB.open(BANNER_DB_NAME, BANNER_DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(BANNER_STORE)) {
        db.createObjectStore(BANNER_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function saveBannerMediaDB(key, val) {
  try {
    const db = await openBannerDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(BANNER_STORE, 'readwrite');
      tx.objectStore(BANNER_STORE).put(val, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}

async function getBannerMediaDB(key) {
  try {
    const db = await openBannerDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(BANNER_STORE, 'readonly');
      const req = tx.objectStore(BANNER_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

async function deleteBannerMediaDB(key) {
  try {
    const db = await openBannerDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(BANNER_STORE, 'readwrite');
      tx.objectStore(BANNER_STORE).delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}

async function loadSavedBannerConfig() {
  try {
    const saved = localStorage.getItem('vietshop_banners_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 5) {
        parsed.forEach((item, idx) => {
          if (heroBanners[idx]) {
            if (item.tag) heroBanners[idx].tag = item.tag;
            if (item.title) heroBanners[idx].title = item.title;
            if (item.subtitle) heroBanners[idx].subtitle = item.subtitle;
            if (item.image && item.image !== '[indexeddb]') heroBanners[idx].image = item.image;
            if (item.video && item.video !== '[indexeddb]') heroBanners[idx].video = item.video;
            if (typeof item.autoplay === 'boolean') heroBanners[idx].autoplay = item.autoplay;
            if (typeof item.muted === 'boolean') heroBanners[idx].muted = item.muted;
            if (typeof item.loop === 'boolean') heroBanners[idx].loop = item.loop;
          }
        });
      }
    }

    // Restore uploaded images from IndexedDB
    for (let i = 0; i < 4; i++) {
      const imgData = await getBannerMediaDB(`banner_img_${i}`);
      if (imgData && heroBanners[i]) {
        heroBanners[i].image = imgData;
      }
    }

    // Restore uploaded video from IndexedDB
    const videoBlob = await getBannerMediaDB('banner_video_blob');
    if (videoBlob) {
      const blobUrl = URL.createObjectURL(videoBlob);
      const videoBanner = heroBanners.find(b => b.type === 'video') || heroBanners[4];
      if (videoBanner) {
        videoBanner.video = blobUrl;
        videoBanner.fileName = videoBlob.name || 'custom-video.mp4';
        videoBanner.fileSize = (videoBlob.size / (1024 * 1024)).toFixed(1) + ' MB';
      }
    }
  } catch (err) {
    console.warn('Error restoring banner media:', err);
  }

  updateBannerUI();
}

function nextBanner() {
  currentBannerIndex = (currentBannerIndex + 1) % heroBanners.length;
  updateBannerUI();
}

function prevBanner() {
  currentBannerIndex = (currentBannerIndex - 1 + heroBanners.length) % heroBanners.length;
  updateBannerUI();
}

function setBanner(index) {
  currentBannerIndex = index;
  updateBannerUI();
}

function updateBannerUI() {
  if (!heroBanners || heroBanners.length === 0) return;
  if (currentBannerIndex >= heroBanners.length) currentBannerIndex = 0;

  const b = heroBanners[currentBannerIndex];
  const img = document.getElementById('heroImage');
  const video = document.getElementById('heroVideo');
  const videoControls = document.getElementById('heroVideoControls');
  const mediaBadge = document.getElementById('heroMediaBadge');
  const tag = document.getElementById('heroTag');
  const title = document.getElementById('heroTitle');
  const sub = document.getElementById('heroSubtitle');

  if (tag) tag.textContent = b.tag || "VIETSHOP";
  if (title) title.textContent = b.title || "SIÊU ĐẠI HỘI SALE";
  if (sub) sub.textContent = b.subtitle || "";

  if (b.type === 'video') {
    // Show video slide
    if (img) img.classList.add('hidden');
    if (mediaBadge) mediaBadge.classList.remove('hidden');
    if (videoControls) videoControls.classList.remove('hidden');

    if (video) {
      video.classList.remove('hidden');
      if (video.src !== b.video && !video.src.endsWith(b.video)) {
        video.src = b.video;
        video.load();
      }
      video.muted = b.muted !== false;
      video.loop = b.loop !== false;
      if (b.autoplay !== false) {
        video.play().catch(() => {});
      }
      updateHeroVideoControlsUI();
    }
  } else {
    // Show image slide
    if (video) {
      try { video.pause(); } catch(e) {}
      video.classList.add('hidden');
    }
    if (mediaBadge) mediaBadge.classList.add('hidden');
    if (videoControls) videoControls.classList.add('hidden');

    if (img) {
      img.classList.remove('hidden');
      if (img.src !== b.image) {
        img.src = b.image;
      }
    }
  }

  renderBannerDotsUI();
}

function renderBannerDotsUI() {
  const container = document.getElementById('bannerDotsContainer');
  if (!container) return;

  container.innerHTML = heroBanners.map((item, idx) => {
    const isActive = idx === currentBannerIndex;
    if (item.type === 'video') {
      return `
        <button
          type="button"
          onclick="setBanner(${idx})"
          title="Xem Video Slide 5"
          class="px-2 py-0.5 rounded-full text-[10px] font-black cursor-pointer transition-all flex items-center gap-1 shadow-xs select-none ${
            isActive 
              ? 'bg-red-600 text-white ring-2 ring-white/90 scale-105' 
              : 'bg-black/50 hover:bg-black/80 text-white/90 backdrop-blur-xs'
          }"
        >
          <span>🎬</span>
          <span class="hidden sm:inline">Video</span>
        </button>
      `;
    } else {
      return `
        <button
          type="button"
          onclick="setBanner(${idx})"
          title="Slide Ảnh ${idx + 1}"
          class="banner-dot rounded-full transition-all cursor-pointer ${
            isActive 
              ? 'w-6 h-2 bg-white' 
              : 'w-2 h-2 bg-white/50 hover:bg-white'
          }"
        ></button>
      `;
    }
  }).join('');
}

function toggleHeroVideoSound() {
  const video = document.getElementById('heroVideo');
  if (!video) return;
  video.muted = !video.muted;
  const currentBanner = heroBanners[currentBannerIndex];
  if (currentBanner && currentBanner.type === 'video') {
    currentBanner.muted = video.muted;
  }
  updateHeroVideoControlsUI();
}

function toggleHeroVideoPlay() {
  const video = document.getElementById('heroVideo');
  if (!video) return;
  if (video.paused) {
    video.play().catch(() => {});
  } else {
    video.pause();
  }
  updateHeroVideoControlsUI();
}

function updateHeroVideoControlsUI() {
  const video = document.getElementById('heroVideo');
  const muteIcon = document.getElementById('heroMuteIcon');
  const muteText = document.getElementById('heroMuteText');
  const playIcon = document.getElementById('heroPlayIcon');

  if (video) {
    if (muteIcon) muteIcon.textContent = video.muted ? '🔇' : '🔊';
    if (muteText) muteText.textContent = video.muted ? 'Bật tiếng' : 'Tắt tiếng';
    if (playIcon) playIcon.textContent = video.paused ? '▶️' : '⏸️';
  }
}

// Carousel interval with intelligent pause while video is actively playing
function startBannerAutoPlay() {
  if (bannerIntervalTimer) clearInterval(bannerIntervalTimer);
  bannerIntervalTimer = setInterval(() => {
    const current = heroBanners[currentBannerIndex];
    if (current && current.type === 'video') {
      const vid = document.getElementById('heroVideo');
      if (vid && !vid.paused && !vid.ended && vid.currentTime < 15) {
        return; // Let user watch video
      }
    }
    nextBanner();
  }, 5000);
}

startBannerAutoPlay();

// Admin Banner Management Logic
const sampleBannerImages = {
  sale: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80",
  tech: "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=1200&auto=format&fit=crop&q=80",
  fashion: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80",
  home: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&auto=format&fit=crop&q=80"
};

const sampleBannerVideos = [
  {
    title: "TRẢI NGHIỆM MUA SẮM SIÊU TỐC VIETSHOP",
    sub: "Săn deal giảm sốc 50% • Freeship toàn quốc • Hàng chính hãng bảo đảm",
    tag: "Đại Tiệc Khuyến Mãi",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    title: "SIÊU HỘI CÔNG NGHỆ & ĐIỆN TỬ THÔNG MINH",
    sub: "Khám phá thế hệ thiết bị số mới nhất cùng ngàn voucher hấp dẫn",
    tag: "Đột Phá Công Nghệ",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4"
  },
  {
    title: "KHÔNG GIAN MUA SẮM GIA ĐÌNH ĐẦY MÀU SẮC",
    sub: "Đồng hành cùng mọi gia đình Việt với hàng triệu sản phẩm chất lượng",
    tag: "Gia Đình & Bé Yêu",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  }
];

function populateBannerAdminForm() {
  // Populate the 4 image cards (idx 0 to 3)
  for (let i = 0; i < 4; i++) {
    const item = heroBanners[i] || defaultHeroBanners[i];
    const thumb = document.getElementById(`bannerImgThumb_${i}`);
    const urlInput = document.getElementById(`bannerImgUrl_${i}`);
    const tagInput = document.getElementById(`bannerImgTag_${i}`);
    const titleInput = document.getElementById(`bannerImgTitle_${i}`);
    const subInput = document.getElementById(`bannerImgSub_${i}`);

    if (thumb) thumb.src = item.image;
    if (urlInput) {
      urlInput.value = item.image.startsWith('data:') ? '[Ảnh đã tải lên từ thiết bị]' : item.image;
    }
    if (tagInput) tagInput.value = item.tag || '';
    if (titleInput) titleInput.value = item.title || '';
    if (subInput) subInput.value = item.subtitle || '';
  }

  // Populate the 1 video card (idx 4)
  const videoItem = heroBanners.find(b => b.type === 'video') || heroBanners[4] || defaultHeroBanners[4];
  const adminVideoBox = document.getElementById('adminBannerVideoBox');
  const videoUrlInput = document.getElementById('bannerVideoUrl');
  const videoTagInput = document.getElementById('bannerVideoTag');
  const videoTitleInput = document.getElementById('bannerVideoTitle');
  const videoSubInput = document.getElementById('bannerVideoSub');
  const videoAutoplay = document.getElementById('bannerVideoAutoplay');
  const videoMuted = document.getElementById('bannerVideoMuted');
  const videoLoop = document.getElementById('bannerVideoLoop');
  const videoNameLabel = document.getElementById('bannerVideoFileName');

  if (adminVideoBox && videoItem) {
    if (adminVideoBox.src !== videoItem.video && !adminVideoBox.src.endsWith(videoItem.video)) {
      adminVideoBox.src = videoItem.video;
      adminVideoBox.muted = true;
      adminVideoBox.load();
    }
  }
  if (videoUrlInput && videoItem) {
    videoUrlInput.value = videoItem.video.startsWith('blob:') ? `[Tệp video đã tải từ thiết bị: ${videoItem.fileName || 'video.mp4'}]` : videoItem.video;
  }
  if (videoTagInput && videoItem) videoTagInput.value = videoItem.tag || '';
  if (videoTitleInput && videoItem) videoTitleInput.value = videoItem.title || '';
  if (videoSubInput && videoItem) videoSubInput.value = videoItem.subtitle || '';
  if (videoAutoplay && videoItem) videoAutoplay.checked = videoItem.autoplay !== false;
  if (videoMuted && videoItem) videoMuted.checked = videoItem.muted !== false;
  if (videoLoop && videoItem) videoLoop.checked = videoItem.loop !== false;
  if (videoNameLabel && videoItem) {
    if (videoItem.fileName) {
      videoNameLabel.innerHTML = `📹 <b>${videoItem.fileName}</b> (${videoItem.fileSize || 'Đã lưu'}) • <span class="text-emerald-600 font-bold">Đang áp dụng</span>`;
    } else {
      videoNameLabel.innerHTML = `📹 Đang dùng: Video mẫu giới thiệu VIETSHOP`;
    }
  }

  selectAdminSimSlide(adminSimCurrentIndex);
}

function selectAdminSimSlide(index) {
  adminSimCurrentIndex = index;
  const b = heroBanners[index] || defaultHeroBanners[index];
  if (!b) return;

  const simImg = document.getElementById('adminSimImg');
  const simVideo = document.getElementById('adminSimVideo');
  const simTag = document.getElementById('adminSimTag');
  const simBadge = document.getElementById('adminSimBadge');
  const simTitle = document.getElementById('adminSimTitle');
  const simSub = document.getElementById('adminSimSub');

  if (simTag) simTag.textContent = b.tag || "VIETSHOP";
  if (simTitle) simTitle.textContent = b.title || "";
  if (simSub) simSub.textContent = b.subtitle || "";

  if (b.type === 'video') {
    if (simImg) simImg.classList.add('hidden');
    if (simBadge) simBadge.classList.remove('hidden');
    if (simVideo) {
      simVideo.classList.remove('hidden');
      if (simVideo.src !== b.video && !simVideo.src.endsWith(b.video)) {
        simVideo.src = b.video;
        simVideo.load();
      }
      simVideo.play().catch(() => {});
    }
  } else {
    if (simVideo) {
      try { simVideo.pause(); } catch(e) {}
      simVideo.classList.add('hidden');
    }
    if (simBadge) simBadge.classList.add('hidden');
    if (simImg) {
      simImg.classList.remove('hidden');
      simImg.src = b.image;
    }
  }

  // Update simulator selector buttons
  for (let i = 0; i < 5; i++) {
    const dotBtn = document.getElementById(`btnSimDot_${i}`);
    if (dotBtn) {
      if (i === index) {
        dotBtn.className = i === 4 
          ? "px-3 py-1 bg-red-600 text-white text-xs font-black rounded-lg transition cursor-pointer shadow-md flex items-center gap-1 scale-105"
          : "px-3 py-1 bg-[#ee4d2d] text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-md scale-105";
      } else {
        dotBtn.className = i === 4
          ? "px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
          : "px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-lg transition cursor-pointer";
      }
    }
  }
}

function resizeImageForBanner(dataUrl, maxWidth = 1600, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function handleBannerFileUpload(index, event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const rawDataUrl = e.target.result;
    const resizedDataUrl = await resizeImageForBanner(rawDataUrl, 1600, 0.85);

    heroBanners[index].image = resizedDataUrl;
    await saveBannerMediaDB(`banner_img_${index}`, resizedDataUrl);

    // Update thumbnail and URL input
    const thumb = document.getElementById(`bannerImgThumb_${index}`);
    if (thumb) thumb.src = resizedDataUrl;
    const urlInput = document.getElementById(`bannerImgUrl_${index}`);
    if (urlInput) urlInput.value = `[Tệp ảnh: ${file.name}]`;

    selectAdminSimSlide(index);
    updateBannerUI();
    showAiToast(`📸 Đã tải ảnh lên cho Slide ${index + 1} (${file.name})!`);
  };
  reader.readAsDataURL(file);
}

async function handleBannerVideoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const blobUrl = URL.createObjectURL(file);

  await saveBannerMediaDB('banner_video_blob', file);

  const videoBanner = heroBanners.find(b => b.type === 'video') || heroBanners[4];
  if (videoBanner) {
    videoBanner.video = blobUrl;
    videoBanner.fileName = file.name;
    videoBanner.fileSize = `${sizeMb} MB`;
  }

  const nameLabel = document.getElementById('bannerVideoFileName');
  if (nameLabel) {
    nameLabel.innerHTML = `📹 <b>${file.name}</b> (${sizeMb} MB) • <span class="text-emerald-600 font-bold">Đã sẵn sàng trên banner!</span>`;
  }
  const urlInput = document.getElementById('bannerVideoUrl');
  if (urlInput) urlInput.value = `[Tệp video từ thiết bị: ${file.name}]`;

  const adminVideo = document.getElementById('adminBannerVideoBox');
  if (adminVideo) {
    adminVideo.src = blobUrl;
    adminVideo.load();
    adminVideo.play().catch(() => {});
  }

  selectAdminSimSlide(4);
  updateBannerUI();
  showAiToast(`🎬 Đã tải video "${file.name}" (${sizeMb} MB) lên Banner thành công!`);
}

function applySampleBannerImage(index, sampleType) {
  const url = sampleBannerImages[sampleType] || sampleBannerImages.sale;
  heroBanners[index].image = url;
  const thumb = document.getElementById(`bannerImgThumb_${index}`);
  if (thumb) thumb.src = url;
  const urlInput = document.getElementById(`bannerImgUrl_${index}`);
  if (urlInput) urlInput.value = url;
  selectAdminSimSlide(index);
  updateBannerUI();
  showAiToast(`✨ Đã áp dụng mẫu ảnh cho Slide ${index + 1}!`);
}

function applySampleBannerVideo(sampleIdx) {
  const sample = sampleBannerVideos[sampleIdx] || sampleBannerVideos[0];
  const videoBanner = heroBanners.find(b => b.type === 'video') || heroBanners[4];
  if (videoBanner) {
    videoBanner.video = sample.url;
    videoBanner.title = sample.title;
    videoBanner.subtitle = sample.sub;
    videoBanner.tag = sample.tag;
    delete videoBanner.fileName;
    delete videoBanner.fileSize;
  }

  const urlInput = document.getElementById('bannerVideoUrl');
  if (urlInput) urlInput.value = sample.url;
  const titleInput = document.getElementById('bannerVideoTitle');
  if (titleInput) titleInput.value = sample.title;
  const subInput = document.getElementById('bannerVideoSub');
  if (subInput) subInput.value = sample.sub;
  const tagInput = document.getElementById('bannerVideoTag');
  if (tagInput) tagInput.value = sample.tag;

  const adminVideo = document.getElementById('adminBannerVideoBox');
  if (adminVideo) {
    adminVideo.src = sample.url;
    adminVideo.load();
    adminVideo.play().catch(() => {});
  }

  const nameLabel = document.getElementById('bannerVideoFileName');
  if (nameLabel) {
    nameLabel.innerHTML = `📹 Đang dùng: <b>Mẫu ${sampleIdx + 1} - ${sample.tag}</b> (MP4)`;
  }

  selectAdminSimSlide(4);
  updateBannerUI();
  showAiToast(`🎬 Đã áp dụng Video Mẫu ${sampleIdx + 1} thành công!`);
}

function onBannerImgUrlChange(index) {
  const input = document.getElementById(`bannerImgUrl_${index}`);
  if (!input) return;
  const val = input.value.trim();
  if (val && (val.startsWith('http://') || val.startsWith('https://'))) {
    heroBanners[index].image = val;
    const thumb = document.getElementById(`bannerImgThumb_${index}`);
    if (thumb) thumb.src = val;
    selectAdminSimSlide(index);
    updateBannerUI();
  }
}

function onBannerVideoUrlChange() {
  const input = document.getElementById('bannerVideoUrl');
  if (!input) return;
  const val = input.value.trim();
  if (val && (val.startsWith('http://') || val.startsWith('https://'))) {
    const videoBanner = heroBanners.find(b => b.type === 'video') || heroBanners[4];
    if (videoBanner) {
      videoBanner.video = val;
      delete videoBanner.fileName;
      delete videoBanner.fileSize;
    }
    const adminVideo = document.getElementById('adminBannerVideoBox');
    if (adminVideo) {
      adminVideo.src = val;
      adminVideo.load();
    }
    selectAdminSimSlide(4);
    updateBannerUI();
  }
}

function saveBannerConfig() {
  // Read inputs for the 4 images
  for (let i = 0; i < 4; i++) {
    const urlVal = document.getElementById(`bannerImgUrl_${i}`)?.value.trim();
    if (urlVal && urlVal.startsWith('http')) {
      heroBanners[i].image = urlVal;
    }
    const tagVal = document.getElementById(`bannerImgTag_${i}`)?.value.trim();
    if (tagVal) heroBanners[i].tag = tagVal;
    const titleVal = document.getElementById(`bannerImgTitle_${i}`)?.value.trim();
    if (titleVal) heroBanners[i].title = titleVal;
    const subVal = document.getElementById(`bannerImgSub_${i}`)?.value.trim();
    if (subVal) heroBanners[i].subtitle = subVal;
  }

  // Read inputs for video
  const videoBanner = heroBanners.find(b => b.type === 'video') || heroBanners[4];
  if (videoBanner) {
    const vUrl = document.getElementById('bannerVideoUrl')?.value.trim();
    if (vUrl && vUrl.startsWith('http')) {
      videoBanner.video = vUrl;
    }
    const vTag = document.getElementById('bannerVideoTag')?.value.trim();
    if (vTag) videoBanner.tag = vTag;
    const vTitle = document.getElementById('bannerVideoTitle')?.value.trim();
    if (vTitle) videoBanner.title = vTitle;
    const vSub = document.getElementById('bannerVideoSub')?.value.trim();
    if (vSub) videoBanner.subtitle = vSub;
    videoBanner.autoplay = document.getElementById('bannerVideoAutoplay')?.checked ?? true;
    videoBanner.muted = document.getElementById('bannerVideoMuted')?.checked ?? true;
    videoBanner.loop = document.getElementById('bannerVideoLoop')?.checked ?? true;
  }

  // Save metadata to localStorage (without giant data URLs to save quota)
  const metaToSave = heroBanners.map(b => {
    const copy = { ...b };
    if (copy.image && copy.image.startsWith('data:')) {
      copy.image = '[indexeddb]';
    }
    if (copy.video && copy.video.startsWith('blob:')) {
      copy.video = '[indexeddb]';
    }
    return copy;
  });
  localStorage.setItem('vietshop_banners_config', JSON.stringify(metaToSave));

  updateBannerUI();
  populateBannerAdminForm();
  alert('💾 Đã lưu cấu hình Banner: 4 Ảnh & 1 Video thành công!\nTrang chủ đã được cập nhật.');
}

async function resetBannersToDefault() {
  if (confirm('Bạn có chắc chắn muốn khôi phục lại 4 ảnh và 1 video banner về mặc định ban đầu?')) {
    localStorage.removeItem('vietshop_banners_config');
    for (let i = 0; i < 4; i++) {
      await deleteBannerMediaDB(`banner_img_${i}`);
    }
    await deleteBannerMediaDB('banner_video_blob');

    heroBanners = JSON.parse(JSON.stringify(defaultHeroBanners));
    currentBannerIndex = 0;
    adminSimCurrentIndex = 0;

    updateBannerUI();
    populateBannerAdminForm();
    alert('↺ Đã khôi phục 4 ảnh & 1 video banner về mặc định thành công!');
  }
}

function previewBannerOnBuyerPage() {
  switchTab('buyer');
  window.scrollTo({ top: 120, behavior: 'smooth' });
  showAiToast('🖼️ Đang hiển thị Hero Banner trên trang chủ! Bạn có thể bấm mũi tên hoặc chấm tròn để chuyển qua 4 ảnh và 1 video.');
}

function toggleViewMode() {
  if (currentMode === 'buyer') {
    if (!isSellerAuthenticated) {
      openPinModal();
    } else {
      switchTab('seller');
    }
  } else {
    switchTab('buyer');
  }
}

function openPinModal() {
  const pinInput = document.getElementById('pinInput');
  if (pinInput) pinInput.value = '';
  document.getElementById('pinAuthModal')?.classList.remove('hidden');
}

function closePinModal() {
  document.getElementById('pinAuthModal')?.classList.add('hidden');
}

function verifyPin() {
  const pin = document.getElementById('pinInput').value.trim();
  if (pin === sellerPin) {
    isSellerAuthenticated = true;
    closePinModal();
    switchTab('seller');
  } else {
    alert('Mã PIN không chính xác! Vui lòng thử lại.');
  }
}

function openChangePinModal() {
  const oldP = document.getElementById('pinOld');
  const newP = document.getElementById('pinNew');
  if (oldP) oldP.value = '';
  if (newP) newP.value = '';
  document.getElementById('changePinModal')?.classList.remove('hidden');
}

function handleSaveNewPin(e) {
  e.preventDefault();
  const oldPin = document.getElementById('pinOld').value.trim();
  const newPin = document.getElementById('pinNew').value.trim();

  if (oldPin !== sellerPin) {
    return alert('Mã PIN hiện tại không chính xác!');
  }
  if (newPin.length < 4) {
    return alert('Mã PIN mới phải từ 4 chữ số trở lên!');
  }

  sellerPin = newPin;
  document.getElementById('changePinModal')?.classList.add('hidden');
  alert('🔑 Đã cập nhật mã PIN / Mật khẩu mới thành công!');
}

function switchTab(mode) {
  currentMode = mode;
  const buyerPage = document.getElementById('buyerPage');
  const sellerPage = document.getElementById('sellerPage');
  const buyerSearch = document.getElementById('buyerSearchContainer');
  const buyerAction = document.getElementById('buyerActionContainer');
  const sellerInfo = document.getElementById('sellerHeaderInfo');
  const toggleBtn = document.getElementById('btnToggleMode');
  const toggleBtnText = document.getElementById('toggleModeText');
  const subHeaderBrand = document.getElementById('subHeaderBrand');

  if (mode === 'seller') {
    buyerPage?.classList.add('hidden');
    sellerPage?.classList.remove('hidden');
    buyerSearch?.classList.add('hidden');
    buyerAction?.classList.add('hidden');
    sellerInfo?.classList.remove('hidden');
    toggleBtn?.classList.remove('hidden');
    if (toggleBtnText) toggleBtnText.textContent = 'Trang Mua Sắm';
    if (subHeaderBrand) subHeaderBrand.textContent = 'Seller Center Portal';
    renderSellerProducts();
    renderSellerOrders();
    populateCustomizerForm();
    renderAiRulesList();
    renderAiPhpCodeUI();
  } else {
    sellerPage?.classList.add('hidden');
    buyerPage?.classList.remove('hidden');
    buyerSearch?.classList.remove('hidden');
    buyerAction?.classList.remove('hidden');
    sellerInfo?.classList.add('hidden');
    toggleBtn?.classList.add('hidden');
    if (toggleBtnText) toggleBtnText.textContent = 'Kênh Người Bán';
    if (subHeaderBrand) subHeaderBrand.textContent = 'Siêu Thị Trực Tuyến';
    renderProducts();
  }
  applyAllCustomTextStyles();
}

function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;
  container.innerHTML = categoriesList.map(cat => {
    const isActive = currentCategory === cat.id;
    return `
      <button 
        onclick="filterCategory('${cat.id}')"
        class="cat-pill flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
          isActive 
            ? 'bg-orange-50 text-[#ee4d2d] border border-orange-200 font-bold' 
            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
        }"
      >
        ${cat.img ? `<img src="${cat.img}" class="w-4 h-4 rounded object-cover" />` : cat.icon}
        <span>${cat.name}</span>
      </button>
    `;
  }).join('');
  applyAllCustomTextStyles();
}

function renderFlashSaleProducts() {
  const container = document.getElementById('flashSaleProductsContainer');
  if (!container) return;

  const flashItems = productsData.filter(p => p.isFlashSale);

  container.innerHTML = flashItems.map(p => {
    const sold = p.soldCount || 85;
    const progressPercent = Math.min(Math.max(Math.round((sold % 100)), 55), 92);

    return `
      <div 
        data-product-card="true"
        data-product-id="${p.id}"
        onclick="openProductModal('${p.id}')"
        class="shrink-0 w-36 sm:w-44 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md cursor-pointer transition flex flex-col group bg-white relative"
      >
        <div class="relative aspect-square bg-slate-100 overflow-hidden">
          <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          <span class="absolute top-1.5 right-1.5 bg-[#ee4d2d] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">-${p.discountPercent}%</span>
          <span class="absolute bottom-1.5 left-1.5 bg-amber-500 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">⚡ HOT</span>
        </div>
        <div class="p-2.5 flex-1 flex flex-col justify-between space-y-2">
          <div>
            <h5 class="text-[11px] font-semibold text-slate-800 line-clamp-1 group-hover:text-[#ee4d2d] transition">${p.name}</h5>
            <div class="text-sm font-black text-[#ee4d2d] mt-1">${formatVND(p.price)}</div>
            ${p.originalPrice > p.price ? `<div class="text-[10px] text-slate-400 line-through">${formatVND(p.originalPrice)}</div>` : ''}
          </div>
          <div class="space-y-1">
            <div class="w-full bg-orange-100 rounded-full h-3 relative overflow-hidden flex items-center justify-center">
              <div class="bg-gradient-to-r from-amber-500 to-[#ee4d2d] h-full absolute left-0 top-0 rounded-full" style="width: ${progressPercent}%"></div>
              <span class="relative z-10 text-[9px] font-extrabold text-white uppercase tracking-wider">ĐÃ BÁN ${p.soldCount || 100}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function handleProductCardClick(event, id) {
  openProductModal(id);
}

function renderProducts() {
  renderFlashSaleProducts();

  const grid = document.getElementById('productGrid');
  if (!grid) return;

  let filtered = productsData.filter(p => {
    const matchCat = currentCategory === 'all' || currentCategory === 'flashsale' || p.category === currentCategory;
    
    const qClean = removeVietnameseTones(searchQuery);
    const nameClean = removeVietnameseTones(p.name);
    const matchSearch = !searchQuery || nameClean.includes(qClean) || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchFilter = true;
    if (currentFilterType === 'mall') matchFilter = p.isMall;
    if (currentFilterType === 'flash' || currentCategory === 'flashsale') matchFilter = p.isFlashSale;

    return matchCat && matchSearch && matchFilter;
  });

  const sortVal = document.getElementById('sortSelect')?.value || 'popular';
  if (sortVal === 'price-asc') filtered.sort((a,b) => a.price - b.price);
  if (sortVal === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if (sortVal === 'rating') filtered.sort((a,b) => (b.rating || 0) - (a.rating || 0));

  const countEl = document.getElementById('productCount');
  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="col-span-full py-12 text-center text-slate-400 font-medium text-sm">Không tìm thấy sản phẩm nào phù hợp.</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => {
    return `
      <div 
        data-product-card="true"
        data-product-id="${p.id}"
        onclick="openProductModal('${p.id}')"
        class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col group relative"
      >
        <div class="relative aspect-square bg-slate-100 overflow-hidden">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
          ${p.discountPercent > 0 ? `<span class="absolute top-2 right-2 bg-[#ee4d2d] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">-${p.discountPercent}%</span>` : ''}
          ${p.isMall ? `<span class="absolute top-2 left-2 bg-[#d0011b] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Mall</span>` : ''}
        </div>
        <div class="p-3 flex-1 flex flex-col justify-between space-y-2">
          <h4 class="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#ee4d2d] transition">
            ${p.name}
          </h4>
          <div class="space-y-1">
            <div class="flex items-baseline gap-1.5">
              <span class="text-sm font-black text-[#ee4d2d]">${formatVND(p.price)}</span>
              ${p.originalPrice > p.price ? `<span class="text-[10px] text-slate-400 line-through">${formatVND(p.originalPrice)}</span>` : ''}
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
              <span class="text-amber-500 font-bold">⭐ ${p.rating ? p.rating.toFixed(1) : '4.9'}</span>
              <span>Đã bán ${p.soldCount ? p.soldCount.toLocaleString('vi-VN') : 100}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterCategory(catId) {
  currentCategory = catId;
  renderCategories();
  renderProducts();
}

function filterType(type) {
  currentFilterType = type;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('bg-orange-100', 'text-[#ee4d2d]', 'font-bold');
    b.classList.add('bg-slate-100', 'text-slate-600');
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('bg-orange-100', 'text-[#ee4d2d]', 'font-bold');
  }
  renderProducts();
}

function openProductModal(id) {
  const p = productsData.find(x => x.id === id);
  if (!p) return;

  selectedVariationSize = (p.sizes && p.sizes.length > 0) ? p.sizes[0] : '';
  selectedVariationColor = (p.colors && p.colors.length > 0) ? p.colors[0] : '';

  document.getElementById('modalCategory').textContent = p.categoryName || 'Sản phẩm';
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalPrice').textContent = formatVND(p.price);
  document.getElementById('modalOrigPrice').textContent = p.originalPrice > p.price ? formatVND(p.originalPrice) : '';
  document.getElementById('modalDiscount').textContent = p.discountPercent > 0 ? `-${p.discountPercent}%` : '';
  document.getElementById('modalDesc').textContent = p.description || 'Sản phẩm chính hãng chất lượng cao.';
  
  const ratingVal = document.getElementById('modalRatingValue');
  if (ratingVal) ratingVal.textContent = p.rating ? p.rating.toFixed(1) : '4.9';

  const reviewsList = document.getElementById('modalReviewsList');
  if (reviewsList) {
    if (p.reviews && p.reviews.length > 0) {
      reviewsList.innerHTML = p.reviews.map(r => `
        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span class="font-bold text-slate-800">${r.name}:</span> "${r.comment}"
        </div>
      `).join('');
    } else {
      reviewsList.innerHTML = `
        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span class="font-bold text-slate-800">Khách hàng VIETSHOP:</span> "Sản phẩm chính hãng chất lượng rất tốt, đóng gói cẩn thận!"
        </div>
      `;
    }
  }

  const mainImg = document.getElementById('modalMainImg');
  const mainVid = document.getElementById('modalMainVideo');
  mainImg.src = p.image;
  mainImg.classList.remove('hidden');
  mainVid.classList.add('hidden');
  if (mainVid) mainVid.pause();

  const thumbs = document.getElementById('modalThumbnails');
  let thumbsHtml = '';
  currentModalProduct = p;
  const allImgs = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];
  allImgs.forEach((img, idx) => {
    thumbsHtml += `<img src="${img}" onclick="showModalGalleryItem(${idx})" class="w-12 h-12 rounded-lg object-cover border border-slate-300 cursor-pointer hover:border-[#ee4d2d]" />`;
  });
  if (p.videoUrl) {
    thumbsHtml += `
      <button onclick="showCurrentModalVideo()" class="w-12 h-12 rounded-lg bg-purple-50 border border-purple-300 flex items-center justify-center text-purple-700 text-[10px] font-bold cursor-pointer hover:bg-purple-100 transition">
        ▶ Video
      </button>
    `;
  }
  thumbs.innerHTML = thumbsHtml;

  const varContainer = document.getElementById('modalVariations');
  let varHtml = '';
  
  if (p.sizes && p.sizes.length > 0) {
    varHtml += `
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-slate-700">Kích thước (Size):</span>
          <span id="selectedSizeLabel" class="text-xs font-bold text-[#ee4d2d]">${selectedVariationSize}</span>
        </div>
        <div class="flex flex-wrap gap-1.5" id="sizeVariationGroup">
          ${p.sizes.map((s, i) => `
            <button 
              type="button"
              onclick="selectSizeVariation('${s.replace(/'/g, "\\'")}', this)" 
              class="px-3 py-1.5 text-xs border rounded-lg cursor-pointer transition ${i === 0 ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:border-[#ee4d2d]'}"
            >
              ${s}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (p.colors && p.colors.length > 0) {
    varHtml += `
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-slate-700">Màu sắc:</span>
          <span id="selectedColorLabel" class="text-xs font-bold text-[#ee4d2d]">${selectedVariationColor}</span>
        </div>
        <div class="flex flex-wrap gap-1.5" id="colorVariationGroup">
          ${p.colors.map((c, i) => `
            <button 
              type="button"
              onclick="selectColorVariation('${c.replace(/'/g, "\\'")}', this)" 
              class="px-3 py-1.5 text-xs border rounded-lg cursor-pointer transition ${i === 0 ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:border-[#ee4d2d]'}"
            >
              ${c}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }
  varContainer.innerHTML = varHtml;

  document.getElementById('modalAddCartBtn').onclick = () => {
    addToCart(p, selectedVariationSize, selectedVariationColor);
    closeProductModal();
  };

  document.getElementById('modalBuyNowBtn').onclick = () => {
    addToCart(p, selectedVariationSize, selectedVariationColor);
    closeProductModal();
    openCartModal();
  };

  document.getElementById('productModal')?.classList.remove('hidden');
}

function selectSizeVariation(size, btn) {
  selectedVariationSize = size;
  const lbl = document.getElementById('selectedSizeLabel');
  if (lbl) lbl.textContent = size;
  const parent = btn.parentElement;
  parent.querySelectorAll('button').forEach(b => {
    b.className = "px-3 py-1.5 text-xs border rounded-lg cursor-pointer transition bg-white border-slate-200 text-slate-700 hover:border-[#ee4d2d]";
  });
  btn.className = "px-3 py-1.5 text-xs border rounded-lg cursor-pointer transition bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] font-bold shadow-2xs";
}

function selectColorVariation(color, btn) {
  selectedVariationColor = color;
  const lbl = document.getElementById('selectedColorLabel');
  if (lbl) lbl.textContent = color;
  const parent = btn.parentElement;
  parent.querySelectorAll('button').forEach(b => {
    b.className = "px-3 py-1.5 text-xs border rounded-lg cursor-pointer transition bg-white border-slate-200 text-slate-700 hover:border-[#ee4d2d]";
  });
  btn.className = "px-3 py-1.5 text-xs border rounded-lg cursor-pointer transition bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] font-bold shadow-2xs";
}

let currentModalProduct = null;

function showModalGalleryItem(idx) {
  if (!currentModalProduct) return;
  const allImgs = currentModalProduct.gallery && currentModalProduct.gallery.length > 0 ? currentModalProduct.gallery : [currentModalProduct.image];
  if (allImgs[idx]) {
    showModalImage(allImgs[idx]);
  }
}

function showCurrentModalVideo() {
  if (!currentModalProduct || !currentModalProduct.videoUrl) return;
  showModalVideo(currentModalProduct.videoUrl);
}

function showModalImage(src) {
  const mainImg = document.getElementById('modalMainImg');
  const mainVid = document.getElementById('modalMainVideo');
  mainImg.src = src;
  mainImg.classList.remove('hidden');
  mainVid.classList.add('hidden');
  if (mainVid) mainVid.pause();
}

function showModalVideo(src) {
  const mainImg = document.getElementById('modalMainImg');
  const mainVid = document.getElementById('modalMainVideo');
  mainVid.src = src;
  mainVid.classList.remove('hidden');
  mainImg.classList.add('hidden');
  mainVid.play();
}

function closeProductModal() {
  document.getElementById('productModal')?.classList.add('hidden');
  const mainVid = document.getElementById('modalMainVideo');
  if (mainVid) mainVid.pause();
}

function addToCart(product, size = '', color = '') {
  const itemSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
  const itemColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : '');
  const cartKey = `${product.id}__${itemSize}__${itemColor}`;

  const existing = cart.find(item => item.cartKey === cartKey);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ 
      ...product, 
      cartKey: cartKey,
      selectedSize: itemSize,
      selectedColor: itemColor,
      qty: 1 
    });
  }
  updateCartBadge();
}

function updateCartBadge() {
  const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const badge1 = document.getElementById('cartBadge');
  const badge2 = document.getElementById('cartModalBadge');
  if (badge1) badge1.textContent = totalCount;
  if (badge2) badge2.textContent = totalCount;
}

function openCartModal() {
  renderCartItems();
  autoFillCheckoutInfo();
  document.getElementById('cartModal')?.classList.remove('hidden');
}

function closeCartModal() {
  document.getElementById('cartModal')?.classList.add('hidden');
}

function calculateShippingFee(subtotal) {
  if (subtotal <= 0) return 0;
  const mode = siteConfig.shippingMode || 'threshold';
  if (mode === 'free') return 0;
  if (mode === 'fixed') return Number(siteConfig.defaultShippingFee) || 25000;
  // threshold
  const threshold = Number(siteConfig.freeShippingThreshold) || 200000;
  if (subtotal >= threshold) return 0;
  return Number(siteConfig.defaultShippingFee) || 25000;
}

function getVoucherDetails(code) {
  if (!code) return null;
  const upper = code.trim().toUpperCase();
  const list = siteConfig.vouchers || [];
  return list.find(v => v.code.toUpperCase() === upper) || null;
}

function applyVoucherFromInput() {
  const input = document.getElementById('cartVoucherInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (!code) {
    alert('Vui lòng nhập mã voucher giảm giá!');
    return;
  }
  applyVoucherCode(code);
}

function applyVoucherCode(code) {
  const voucher = getVoucherDetails(code);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  if (!voucher) {
    alert(`❌ Mã voucher "${code}" không hợp lệ hoặc đã hết hạn!`);
    return;
  }

  if (voucher.active === false) {
    alert(`❌ Mã voucher "${code}" đang tạm dừng áp dụng!`);
    return;
  }

  if (voucher.minOrder && subtotal < voucher.minOrder) {
    alert(`⚠️ Mã "${code}" yêu cầu đơn hàng tối thiểu từ ${formatVND(voucher.minOrder)} (Hiện tại: ${formatVND(subtotal)})! Hãy mua thêm để áp dụng.`);
    return;
  }

  appliedVoucher = voucher.code;
  const input = document.getElementById('cartVoucherInput');
  if (input) input.value = voucher.code;
  alert(`🎉 Kích hoạt mã [${voucher.code}] thành công!\n${voucher.desc || ''}`);
  renderCartItems();
}

function removeAppliedVoucher() {
  appliedVoucher = null;
  const input = document.getElementById('cartVoucherInput');
  if (input) input.value = '';
  renderCartItems();
}

function claimActiveVoucher() {
  const code = siteConfig.activePromoCode || "VIETSHOP50K";
  openCartModal();
  applyVoucherCode(code);
}

function claimVoucher(code) {
  openCartModal();
  applyVoucherCode(code);
}

function renderCartItems() {
  const container = document.getElementById('cartItemsList');
  if (!container) return;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  if (cart.length === 0) {
    container.innerHTML = '<div class="py-12 text-center text-slate-400 font-medium">Giỏ hàng của bạn đang trống.</div>';
    document.getElementById('cartSubtotal').textContent = '0₫';
    document.getElementById('cartTotal').textContent = '0₫';
    const shipBadge = document.getElementById('cartShippingBadge');
    if (shipBadge) {
      shipBadge.textContent = "0₫";
      shipBadge.className = "text-[10px] px-1.5 py-0.2 rounded-md font-bold bg-slate-100 text-slate-700";
    }
    const shipVal = document.getElementById('cartShippingFeeVal');
    if (shipVal) shipVal.textContent = '0₫';
    const vRow = document.getElementById('cartVoucherDiscountRow');
    if (vRow) vRow.classList.add('hidden');
    const pRow = document.getElementById('cartPaymentDiscountRow');
    if (pRow) pRow.classList.add('hidden');
    return;
  }

  container.innerHTML = cart.map((item, index) => {
    const variationParts = [];
    if (item.selectedColor) variationParts.push(`Màu: ${item.selectedColor}`);
    if (item.selectedSize) variationParts.push(`Size: ${item.selectedSize}`);
    const variationDisplay = variationParts.join(' • ');

    return `
      <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 items-center">
        <img src="${item.image}" class="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0" />
        <div class="flex-1 min-w-0 space-y-1">
          <h4 class="font-bold text-slate-800 line-clamp-1 leading-snug">${item.name}</h4>
          
          ${variationDisplay ? `
            <div class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] text-slate-600 font-medium max-w-full">
              <span class="text-[#ee4d2d] font-bold">Phân loại:</span>
              <span class="truncate font-semibold text-slate-700">${variationDisplay}</span>
            </div>
          ` : ''}

          <div class="flex items-center justify-between pt-0.5">
            <div class="text-[#ee4d2d] font-black">${formatVND(item.price)}</div>
            <div class="flex items-center gap-2">
              <button onclick="changeQty(${index}, -1)" class="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-bold flex items-center justify-center cursor-pointer transition">-</button>
              <span class="font-bold text-slate-800 text-xs px-1">${item.qty}</span>
              <button onclick="changeQty(${index}, 1)" class="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-bold flex items-center justify-center cursor-pointer transition">+</button>
            </div>
          </div>
        </div>
        <button onclick="removeFromCart(${index})" title="Xóa" class="text-slate-400 hover:text-red-500 font-bold cursor-pointer p-1">✕</button>
      </div>
    `;
  }).join('');

  // 1. Phí ship ban đầu
  let baseShippingFee = calculateShippingFee(subtotal);
  let effectiveShippingFee = baseShippingFee;

  // 2. Voucher Discount calculation
  let voucherDiscount = 0;
  const vRow = document.getElementById('cartVoucherDiscountRow');
  if (appliedVoucher) {
    const voucher = getVoucherDetails(appliedVoucher);
    if (voucher && voucher.active !== false && (!voucher.minOrder || subtotal >= voucher.minOrder)) {
      if (voucher.type === 'shipping') {
        // Giảm trực tiếp vào phí vận chuyển
        const shipDiscount = Math.min(effectiveShippingFee, Number(voucher.value) || 0);
        effectiveShippingFee = Math.max(0, effectiveShippingFee - shipDiscount);
        voucherDiscount = shipDiscount;
      } else if (voucher.type === 'percent') {
        const pct = Number(voucher.value) || 0;
        voucherDiscount = Math.round(subtotal * pct / 100);
      } else {
        // fixed amount
        voucherDiscount = Number(voucher.value) || 0;
      }
      voucherDiscount = Math.min(voucherDiscount, subtotal + effectiveShippingFee);

      if (vRow) {
        vRow.classList.remove('hidden');
        document.getElementById('txtAppliedVoucherCode').textContent = voucher.code;
        document.getElementById('cartVoucherDiscountVal').textContent = '-' + formatVND(voucherDiscount);
      }
    } else {
      if (vRow) vRow.classList.add('hidden');
    }
  } else if (vRow) {
    vRow.classList.add('hidden');
  }

  // 3. Payment Method Discount
  const paymentMethod = document.getElementById('checkoutPayment')?.value || 'COD';
  let paymentDiscount = 0;
  const pRow = document.getElementById('cartPaymentDiscountRow');
  const configuredVietpayDisc = Number(siteConfig.vietpayDiscount) || 10000;
  if (paymentMethod === 'Ví VIETPay' && subtotal > 0) {
    paymentDiscount = configuredVietpayDisc;
    if (pRow) {
      pRow.classList.remove('hidden');
      const valEl = document.getElementById('cartPaymentDiscountVal');
      if (valEl) valEl.textContent = '-' + formatVND(paymentDiscount);
    }
  } else if (pRow) {
    pRow.classList.add('hidden');
  }

  // 4. Update Shipping UI
  const shipBadge = document.getElementById('cartShippingBadge');
  const shipVal = document.getElementById('cartShippingFeeVal');
  if (effectiveShippingFee === 0) {
    if (shipBadge) {
      shipBadge.textContent = "Freeship 0Đ";
      shipBadge.className = "text-[10px] px-1.5 py-0.2 rounded-md font-bold bg-emerald-100 text-emerald-700";
    }
    if (shipVal) shipVal.textContent = "0₫";
  } else {
    if (shipBadge) {
      shipBadge.textContent = "Tiêu chuẩn";
      shipBadge.className = "text-[10px] px-1.5 py-0.2 rounded-md font-bold bg-slate-100 text-slate-700";
    }
    if (shipVal) shipVal.textContent = formatVND(effectiveShippingFee);
  }

  // 5. Update Shipping Progress Notice
  const shipNoticeEl = document.getElementById('txtShippingProgressNotice');
  if (shipNoticeEl) {
    const mode = siteConfig.shippingMode || 'threshold';
    if (mode === 'free') {
      shipNoticeEl.innerHTML = '✨ <b>Freeship Toàn Sàn</b>: Bạn được miễn phí vận chuyển 100% cho mọi đơn hàng!';
    } else if (mode === 'threshold') {
      const threshold = Number(siteConfig.freeShippingThreshold) || 200000;
      if (subtotal >= threshold) {
        shipNoticeEl.innerHTML = '🎉 Chúc mừng! Đơn hàng của bạn đã đạt điều kiện <b>FREESHIP 0Đ TOÀN QUỐC</b>!';
      } else {
        const remaining = threshold - subtotal;
        shipNoticeEl.innerHTML = `🚚 Mua thêm <b>${formatVND(remaining)}</b> để được nhận ưu đãi <b>FREESHIP 0Đ</b>!`;
      }
    } else {
      shipNoticeEl.innerHTML = `🚚 ${siteConfig.shippingNotice || 'Phí vận chuyển đồng giá toàn quốc: ' + formatVND(siteConfig.defaultShippingFee || 25000)}`;
    }
  }

  // 6. Grand Total
  const grandTotal = Math.max(0, subtotal - (appliedVoucher && getVoucherDetails(appliedVoucher)?.type === 'shipping' ? 0 : voucherDiscount) - paymentDiscount + effectiveShippingFee);

  document.getElementById('cartSubtotal').textContent = formatVND(subtotal);
  document.getElementById('cartTotal').textContent = formatVND(grandTotal);
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCartBadge();
  renderCartItems();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartBadge();
  renderCartItems();
}

function handleCheckout() {
  if (cart.length === 0) return alert('Giỏ hàng trống! Vui lòng chọn sản phẩm trước khi đặt.');

  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const province = document.getElementById('checkoutProvince').value.trim();
  const district = document.getElementById('checkoutDistrict').value.trim();
  const ward = document.getElementById('checkoutWard').value.trim();
  const street = document.getElementById('checkoutStreet').value.trim();
  const note = document.getElementById('checkoutNote').value.trim();
  const payment = document.getElementById('checkoutPayment').value;

  if (!name || !phone || !province || !district || !ward || !street) {
    return alert('⚠️ Vui lòng điền đầy đủ các thông tin người nhận và địa chỉ giao hàng!');
  }

  const fullAddress = `${street}, Phường/Xã ${ward}, Quận/Huyện ${district}, ${province}` + (note ? ` (Ghi chú: ${note})` : '');
  
  let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  let baseShippingFee = calculateShippingFee(subtotal);
  let effectiveShippingFee = baseShippingFee;
  let voucherDiscount = 0;

  if (appliedVoucher) {
    const voucher = getVoucherDetails(appliedVoucher);
    if (voucher && voucher.active !== false && (!voucher.minOrder || subtotal >= voucher.minOrder)) {
      if (voucher.type === 'shipping') {
        const shipDiscount = Math.min(effectiveShippingFee, Number(voucher.value) || 0);
        effectiveShippingFee = Math.max(0, effectiveShippingFee - shipDiscount);
        voucherDiscount = shipDiscount;
      } else if (voucher.type === 'percent') {
        voucherDiscount = Math.round(subtotal * (Number(voucher.value) || 0) / 100);
      } else {
        voucherDiscount = Number(voucher.value) || 0;
      }
    }
  }

  let paymentDiscount = payment === 'Ví VIETPay' ? (Number(siteConfig.vietpayDiscount) || 10000) : 0;
  const totalAmount = Math.max(0, subtotal - (appliedVoucher && getVoucherDetails(appliedVoucher)?.type === 'shipping' ? 0 : voucherDiscount) - paymentDiscount + effectiveShippingFee);

  const productInfoSummary = cart.map(item => {
    const variantParts = [];
    if (item.selectedColor) variantParts.push(`Màu: ${item.selectedColor}`);
    if (item.selectedSize) variantParts.push(`Size: ${item.selectedSize}`);
    const variantText = variantParts.length > 0 ? ` (${variantParts.join(' / ')})` : '';
    return `${item.name} x ${item.qty}${variantText}`;
  }).join(', ');

  const orderId = "VS-" + Math.floor(100000 + Math.random() * 900000);
  const cartItemsCopy = JSON.parse(JSON.stringify(cart));

  const newOrderObj = {
    id: orderId,
    customerName: name,
    phone: phone,
    fullAddress: fullAddress,
    productInfo: productInfoSummary,
    items: cartItemsCopy,
    amount: totalAmount,
    paymentMethod: payment,
    time: "Vừa xong",
    status: "pending"
  };

  sellerOrdersData.unshift(newOrderObj);

  if (!currentUser) {
    let existing = registeredUsers.find(u => u.phone === phone);
    if (!existing) {
      existing = { name: name, phone: phone, password: "123" };
      registeredUsers.push(existing);
      localStorage.setItem('vietshop_registered_users', JSON.stringify(registeredUsers));
    }
    currentUser = existing;
    localStorage.setItem('vietshop_current_user', JSON.stringify(currentUser));
    renderBuyerAuthWidget();
  }

  document.getElementById('successOrderId').textContent = "#" + orderId;
  document.getElementById('successName').textContent = name;
  document.getElementById('successPhone').textContent = phone;
  document.getElementById('successFullAddress').textContent = fullAddress;
  document.getElementById('successPayment').textContent = "Phương thức thanh toán: " + payment;

  const payBox = document.getElementById('paymentInstructionsContainer');
  if (payment === 'Bank' || payment === 'Ví VIETPay') {
    const syntax = `${orderId} ${phone}`;
    const qrData = siteConfig.customQrUrl 
      ? siteConfig.customQrUrl 
      : `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=NGANHANG:${encodeURIComponent(siteConfig.bankName)}_STK:${encodeURIComponent(siteConfig.bankAccount)}_TENTK:${encodeURIComponent(siteConfig.accountHolder)}_SOTIEN:${totalAmount}_NOIDUNG:${encodeURIComponent(syntax)}`;
    
    payBox.innerHTML = `
      <div class="flex items-center justify-between border-b border-amber-200 pb-2">
        <h4 class="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
          <span>💳</span> THÔNG TIN CHUYỂN KHOẢN TRẢ TRƯỚC
        </h4>
        <span class="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
          ${payment === 'Ví VIETPay' ? 'Ví Điện Tử VIETPay' : 'Chuyển Khoản Ngân Hàng'}
        </span>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3">
        <img src="${qrData}" alt="Mã QR Chuyển Khoản" class="w-28 h-28 bg-white p-1 rounded-xl border border-amber-300 shadow-xs shrink-0 object-contain" />
        
        <div class="space-y-1 text-xs w-full">
          <p class="text-slate-600">Ngân hàng / Ví: <b class="text-slate-900">${siteConfig.bankName}</b></p>
          <p class="text-slate-600">Số tài khoản: <b class="text-slate-900 font-mono text-sm">${siteConfig.bankAccount}</b></p>
          <p class="text-slate-600">Tên chủ tài khoản: <b class="text-slate-900 uppercase">${siteConfig.accountHolder}</b></p>
          <p class="text-slate-600">Số tiền chuyển: <b class="text-[#ee4d2d] font-black text-sm">${formatVND(totalAmount)}</b></p>
          
          <div class="pt-1.5 flex items-center justify-between bg-white p-2 rounded-xl border border-amber-300">
            <div>
              <span class="text-[10px] text-slate-400 block font-bold">NỘI DUNG CHUYỂN KHOẢN:</span>
              <span id="txtTransferCode" class="font-mono font-black text-slate-900 text-xs">${syntax}</span>
            </div>
            <button onclick="copyTransferSyntax('${syntax}')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-[10px] rounded-lg transition cursor-pointer shrink-0">
              📋 Sao Chép
            </button>
          </div>
        </div>
      </div>
      <p class="text-[10px] text-amber-800 italic text-center">* Sau khi chuyển khoản, đơn hàng sẽ được tự động cập nhật tiến trình trong Kênh Người Bán.</p>
    `;
    payBox.classList.remove('hidden');
  } else {
    payBox.classList.add('hidden');
  }

  cart = [];
  appliedVoucher = null;
  updateCartBadge();
  closeCartModal();
  document.getElementById('orderSuccessModal')?.classList.remove('hidden');
}

function closeSuccessOrderModal() {
  document.getElementById('orderSuccessModal')?.classList.add('hidden');
}

function copyTransferSyntax(text) {
  const dummy = document.createElement('textarea');
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
  alert(`📋 Đã sao chép nội dung chuyển khoản: "${text}"!`);
}

function toggleAiChat(forceOpen) {
  const win = document.getElementById('aiChatWindow');
  const backdrop = document.getElementById('aiChatBackdrop');
  if (!win) return;

  const isCurrentlyOpen = !win.classList.contains('pointer-events-none');
  const shouldOpen = forceOpen !== undefined ? forceOpen : !isCurrentlyOpen;

  if (shouldOpen) {
    if (backdrop) {
      backdrop.classList.remove('hidden');
      requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100', 'pointer-events-auto');
      });
    }
    win.classList.remove('hidden');
    requestAnimationFrame(() => {
      win.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
      win.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
    });
    setTimeout(() => {
      const input = document.getElementById('aiInputText');
      if (input) input.focus();
      const msgs = document.getElementById('aiChatMessages');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, 60);
  } else {
    if (backdrop) {
      backdrop.classList.remove('opacity-100', 'pointer-events-auto');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => backdrop.classList.add('hidden'), 200);
    }
    win.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
    win.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
  }
}

function clearAiChat() {
  const msgs = document.getElementById('aiChatMessages');
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  if (msgs) {
    msgs.innerHTML = `
      <div class="flex items-start gap-2.5">
        <div class="w-9 h-9 rounded-full overflow-hidden border border-orange-200 shrink-0 shadow-xs ring-1 ring-orange-200 bg-white">
          <img src="/ai-assistant-avatar.jpg" alt="AI" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div class="bg-white p-3.5 sm:p-4 rounded-2xl rounded-tl-none border border-slate-200/90 shadow-2xs max-w-[88%] text-slate-800 leading-relaxed">
          <p>Dạ em chào bạn! Đoạn hội thoại đã được làm mới 🌸✨</p>
          <p class="mt-2">Em là <b>Trợ lý VIETSHOP ⚡</b>. Bạn cần tra cứu đơn hàng, tìm kiếm sản phẩm hot hay nhận mã giảm giá cứ nhắn em nhé!</p>
          <div class="text-[10px] text-slate-400 mt-2 font-medium">${timeStr}</div>
        </div>
      </div>
    `;
  }
  const input = document.getElementById('aiInputText');
  if (input) input.value = '';
  showAiToast("🧹 Đã làm mới đoạn hội thoại!");
}

function toggleSuperFastMode() {
  showAiToast("⚡ Trợ lý VIETSHOP sẵn sàng hỗ trợ tư vấn & tra cứu tức thì!");
}

function openAiChatWithOrder(orderId) {
  toggleAiChat(true);
  sendQuickAiQuery(`Trợ giúp đơn hàng #${orderId}`);
}

function sendQuickAiQuery(queryText) {
  const input = document.getElementById('aiInputText');
  if (input) input.value = queryText;
  handleSendAiMessage(new Event('submit'));
}

async function handleSendAiMessage(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('aiInputText');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const msgs = document.getElementById('aiChatMessages');
  const now = new Date();
  const userTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  // Render User Bubble
  msgs.innerHTML += `
    <div class="flex items-start justify-end gap-2">
      <div class="bg-gradient-to-r from-orange-500 to-[#ee4d2d] text-white p-3 rounded-2xl rounded-tr-none shadow-xs max-w-[85%] text-xs sm:text-[13px] leading-relaxed">
        <p>${text}</p>
        <div class="text-[9px] text-white/80 mt-1 text-right font-medium">${userTimeStr}</div>
      </div>
    </div>
  `;
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;

  // Ultra-Fast Typing indicator (0.1s)
  const loadingId = "aiLoading_" + Date.now();
  msgs.innerHTML += `
    <div id="${loadingId}" class="flex items-start gap-2.5 animate-pulse">
      <div class="w-9 h-9 rounded-full overflow-hidden border border-orange-200 shrink-0 shadow-xs ring-1 ring-orange-200 bg-white relative">
        <img src="/ai-assistant-avatar.jpg" alt="AI" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
      </div>
      <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-2xs text-slate-600 text-xs font-medium flex items-center gap-2">
        <span class="inline-flex gap-1 items-center">
          <span class="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></span>
          <span class="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.15s]"></span>
          <span class="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.3s]"></span>
        </span>
        <span class="font-bold text-[#ee4d2d]">⚡ Trợ lý VIETSHOP:</span> Đang tra cứu kho hàng...
      </div>
    </div>
  `;
  msgs.scrollTop = msgs.scrollHeight;

  // Execute in exactly 100ms (super fast feel!)
  setTimeout(() => {
    document.getElementById(loadingId)?.remove();

    const replyNow = new Date();
    const replyTimeStr = `${String(replyNow.getHours()).padStart(2, '0')}:${String(replyNow.getMinutes()).padStart(2, '0')}`;
    const textLow = text.toLowerCase();
    const textClean = removeVietnameseTones(textLow);

    let reply = "";
    let matchedProducts = [];
    let extraActionsHtml = "";

    // 1. Check custom seller rules
    let matchedCustomRule = siteConfig.aiKnowledgeRules?.find(r => r.keyword && textLow.includes(r.keyword.toLowerCase()));

    if (matchedCustomRule) {
      reply = `✨ ${matchedCustomRule.reply}`;
    } 
    // 2. Best seller query
    else if (textClean.includes("ban chay") || textClean.includes("hot") || textClean.includes("top") || textClean.includes("noi bat")) {
      matchedProducts = [...productsData].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 3);
      reply = `🔥 <b>Top sản phẩm BÁN CHẠY NHẤT tuần này tại VIETSHOP:</b><br>Đã có hơn 10.000+ lượt đặt mua với đánh giá 5 sao ⭐. Bạn bấm nút bên dưới để xem chi tiết và nhận mã giảm giá nhé!`;
    }
    // 3. Freeship query
    else if (textClean.includes("freeship") || textClean.includes("mien phi van chuyen") || textClean.includes("ship 0d") || textClean.includes("van chuyen")) {
      reply = `🚚 <b>Chính Sách Miễn Phí Vận Chuyển VIETSHOP 0Đ:</b><br>
      • Mã <b>FREESHIP0D</b>: Miễn phí vận chuyển toàn quốc cho đơn từ 0Đ (tối đa 30K).<br>
      • Mã <b>FREESHIP100</b>: Giảm ngay 50K phí vận chuyển cho đơn từ 300K.<br>
      • Thời gian giao hỏa tốc: 2 - 4 giờ nội thành, 1 - 3 ngày toàn quốc.`;
      extraActionsHtml = `
        <div class="mt-2.5 flex flex-wrap gap-2">
          <button onclick="applyVoucherFromInput('FREESHIP0D')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-black cursor-pointer shadow-2xs transition flex items-center gap-1">
            <span>🎁</span> <span>Áp Dụng FREESHIP0D Ngay</span>
          </button>
        </div>
      `;
    }
    // 4. Voucher query
    else if (textClean.includes("voucher") || textClean.includes("ma giam") || textClean.includes("50k") || textClean.includes("100k") || textClean.includes("khuyen mai") || textClean.includes("giam gia")) {
      reply = `🎟️ <b>Tổng hợp Voucher HOT nhất hôm nay:</b><br>
      • <b>VIETSHOP50K</b>: Giảm 50.000đ cho đơn từ 200.000đ.<br>
      • <b>SIEUVE100K</b>: Giảm 100.000đ cho đơn từ 500.000đ.<br>
      • <b>VIETPAY10K</b>: Giảm thêm 10.000đ khi thanh toán qua Ví VIETPay.`;
      extraActionsHtml = `
        <div class="mt-2.5 flex flex-wrap gap-2">
          <button onclick="applyVoucherFromInput('VIETSHOP50K')" class="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#ee4d2d] border border-orange-300 rounded-xl text-xs font-black cursor-pointer shadow-2xs transition flex items-center gap-1">
            <span>🎟️</span> <span>Lưu Mã 50K</span>
          </button>
          <button onclick="applyVoucherFromInput('SIEUVE100K')" class="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#ee4d2d] border border-orange-300 rounded-xl text-xs font-black cursor-pointer shadow-2xs transition flex items-center gap-1">
            <span>🎟️</span> <span>Lưu Mã 100K</span>
          </button>
        </div>
      `;
    }
    // 5. Order inquiry
    else if (textClean.includes("don hang") || textClean.includes("tien trinh") || textClean.includes("tra cuu don") || textClean.includes("trang thai")) {
      const ordersCount = (currentUser && currentUser.orders) ? currentUser.orders.length : sellerOrdersData.length;
      reply = `📦 <b>Thông Tin Tra Cứu Đơn Hàng:</b><br>
      Hệ thống ghi nhận đơn hàng của bạn đang được điều phối giao nhanh.<br>
      • Bạn có thể bấm nút bên dưới để mở ngay lịch sử & tiến trình chi tiết từng đơn hàng!`;
      extraActionsHtml = `
        <div class="mt-2.5">
          <button onclick="openBuyerOrdersModal(); toggleAiChat(false);" class="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-[#ee4d2d] text-white rounded-xl text-xs font-black cursor-pointer shadow-xs transition flex items-center gap-1.5">
            <span>📦</span> <span>Xem Lịch Sử Đơn Hàng Của Tôi</span>
          </button>
        </div>
      `;
    }
    // 6. Return policy
    else if (textClean.includes("doi tra") || textClean.includes("bao hanh") || textClean.includes("hoan tien")) {
      reply = `🔄 <b>Chính Sách Đổi Trả & Bảo Hành Chính Hãng:</b><br>
      • <b>Đổi trả 15 ngày miễn phí</b> nếu có lỗi từ nhà sản xuất hoặc giao sai mẫu.<br>
      • Bảo hành điện tử chính hãng 12 tháng với tất cả sản phẩm công nghệ.<br>
      • Hotline giải quyết khiếu nại: <b>${siteConfig.hotline || '1900 1221'}</b> (Hỗ trợ 24/7).`;
      extraActionsHtml = `
        <div class="mt-2.5">
          <button onclick="openFooterInfo('shipping'); toggleAiChat(false);" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition">
            📄 Xem Quy Trình Đổi Trả Chi Tiết
          </button>
        </div>
      `;
    }
    // 7. Search in product catalog
    else {
      matchedProducts = productsData.filter(p => {
        const pNameClean = removeVietnameseTones(p.name.toLowerCase());
        const pCatClean = removeVietnameseTones((p.categoryName || '').toLowerCase());
        const pDescClean = removeVietnameseTones((p.description || '').toLowerCase());
        
        // Exact or fuzzy word match
        const words = textClean.split(' ').filter(w => w.length >= 2);
        const matchesWord = words.some(w => pNameClean.includes(w) || pCatClean.includes(w) || pDescClean.includes(w));
        return matchesWord || pNameClean.includes(textClean) || textClean.includes(pNameClean);
      });

      if (matchedProducts.length > 0) {
        reply = `✨ <b>Trợ lý VIETSHOP tìm thấy ${matchedProducts.length} sản phẩm phù hợp trong kho:</b><br>Giá tốt nhất hôm nay, cam kết 100% chính hãng và sẵn sàng giao hỏa tốc!`;
        matchedProducts = matchedProducts.slice(0, 3);
      } else {
        // Fallback to top products
        matchedProducts = productsData.slice(0, 2);
        reply = `🤖 <b>Dạ VIETSHOP đã tiếp nhận câu hỏi của bạn!</b><br>Em xin gợi ý các sản phẩm đang được yêu thích và nhận ưu đãi Freeship 0Đ nhiều nhất hôm nay:`;
      }
    }

    // Build rich product cards if matched
    let productCardsHtml = "";
    if (matchedProducts && matchedProducts.length > 0) {
      productCardsHtml = `
        <div class="mt-2.5 space-y-2">
          ${matchedProducts.map(p => `
            <div class="p-2.5 bg-orange-50/80 hover:bg-orange-100/90 border border-orange-200 rounded-2xl transition cursor-pointer flex items-center gap-3 shadow-2xs group" onclick="openProductModal('${p.id}'); toggleAiChat(false);">
              <img src="${p.image}" class="w-12 h-12 rounded-xl object-cover border border-orange-200/90 shrink-0 shadow-2xs group-hover:scale-105 transition" />
              <div class="flex-1 min-w-0">
                <span class="font-extrabold text-[#ee4d2d] text-xs line-clamp-1 block group-hover:underline">${p.name}</span>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-xs font-black text-slate-900">${formatVND(p.price)}</span>
                  ${p.originalPrice > p.price ? `<span class="text-[10px] text-slate-400 line-through">${formatVND(p.originalPrice)}</span>` : ''}
                  <span class="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.2 rounded-full">Freeship</span>
                </div>
              </div>
              <button type="button" class="px-3 py-1.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-[11px] font-black rounded-xl shrink-0 shadow-xs group-hover:scale-105 transition">
                Xem ➔
              </button>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Append AI reply bubble
    msgs.innerHTML += `
      <div class="flex items-start gap-2.5">
        <div class="w-9 h-9 rounded-full overflow-hidden border border-orange-200 shrink-0 shadow-xs ring-1 ring-orange-200 bg-white">
          <img src="/ai-assistant-avatar.jpg" alt="AI" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div class="bg-white p-3.5 sm:p-4 rounded-2xl rounded-tl-none border border-slate-200/90 shadow-2xs max-w-[88%] text-slate-800 text-xs sm:text-[13px] leading-relaxed">
          <div>${reply}</div>
          ${extraActionsHtml}
          ${productCardsHtml}
          <div class="text-[10px] text-slate-400 mt-2 font-medium">${replyTimeStr}</div>
        </div>
      </div>
    `;
    msgs.scrollTop = msgs.scrollHeight;
  }, 100);
}

function renderAiRulesList() {
  const container = document.getElementById('aiRulesContainer');
  if (!container) return;

  if (!siteConfig.aiKnowledgeRules || siteConfig.aiKnowledgeRules.length === 0) {
    container.innerHTML = `<div class="p-2 text-slate-400 italic">Chưa có từ khóa tùy chỉnh nào. Hãy thêm từ khóa mới bên trên.</div>`;
    return;
  }

  container.innerHTML = siteConfig.aiKnowledgeRules.map(rule => `
    <div class="flex items-center justify-between gap-2 p-2 bg-slate-800/80 rounded-lg border border-purple-500/20 text-xs">
      <div class="flex items-center gap-2 min-w-0">
        <span class="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded shrink-0">
          🔑 ${rule.keyword}
        </span>
        <span class="text-slate-300 truncate">➡️ ${rule.reply}</span>
      </div>
      <button onclick="deleteAiRule('${rule.id}')" class="text-red-400 hover:text-red-300 font-bold px-1.5 cursor-pointer shrink-0">
        ✕
      </button>
    </div>
  `).join('');
}

function addAiRule() {
  const keyInput = document.getElementById('newAiKeyword');
  const repInput = document.getElementById('newAiReply');
  if (!keyInput || !repInput) return;

  const keyword = keyInput.value.trim();
  const reply = repInput.value.trim();

  if (!keyword || !reply) {
    return alert('⚠️ Vui lòng nhập cả từ khóa lẫn câu trả lời tự động!');
  }

  siteConfig.aiKnowledgeRules.unshift({
    id: "r_" + Date.now(),
    keyword: keyword,
    reply: reply
  });

  keyInput.value = '';
  repInput.value = '';
  renderAiRulesList();
  alert(`✨ Đã thêm từ khóa [${keyword}] vào bảng phản hồi AI thành công!`);
}

function deleteAiRule(ruleId) {
  siteConfig.aiKnowledgeRules = siteConfig.aiKnowledgeRules.filter(r => r.id !== ruleId);
  renderAiRulesList();
}

function updateAiKeyStatusUI() {
  const hasKey = !!(siteConfig.geminiApiKey && siteConfig.geminiApiKey.trim());

  // 1. Seller Overview Badge
  const badge = document.getElementById('txtAiStatusBadge');
  const desc = document.getElementById('txtAiStatusDesc');
  if (badge) {
    badge.textContent = hasKey ? "Đã Kết Nối Key" : "Chế Độ Thường";
    badge.className = `text-xl font-black ${hasKey ? 'text-emerald-500' : 'text-amber-500'} block mt-1`;
  }
  if (desc) {
    desc.textContent = hasKey ? "Đang dùng Gemini API Key của bạn" : "Tự động trả lời theo từ khóa";
  }

  // 2. Seller Config Section
  const adminBadge = document.getElementById('txtAiStatusBadgeAdmin');
  const noticeBox = document.getElementById('aiKeyNoticeBox');
  const noticeText = document.getElementById('aiKeyNoticeText');
  const adminKeyInput = document.getElementById('cfgGeminiApiKey');
  const btnRemoveAdmin = document.getElementById('btnRemoveAiKeyAdmin');

  if (adminBadge) {
    if (hasKey) {
      adminBadge.className = "text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1";
      adminBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Đã Kết Nối API Key Của Bạn';
    } else {
      adminBadge.className = "text-[10px] bg-slate-700/50 text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1";
      adminBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Chưa Có API Key Riêng';
    }
  }

  if (noticeBox && noticeText) {
    if (hasKey) {
      noticeBox.className = "bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-200 flex items-center gap-2";
      noticeText.innerHTML = '✅ Trợ lý AI đang kết nối trực tiếp với <b>Google Gemini API Key của bạn</b>. AI tư vấn sản phẩm và giải đáp khách hàng thông minh 24/7!';
    } else {
      noticeBox.className = "bg-slate-900/60 border border-slate-700/60 rounded-xl p-2.5 text-xs text-slate-200 flex items-center gap-2";
      noticeText.innerHTML = '💡 Nhập khóa Google Gemini API Key của bạn để kích hoạt Trợ lý AI đọc trực tiếp kho hàng, tư vấn sản phẩm và giải đáp khách hàng 24/7.';
    }
  }

  if (adminKeyInput && document.activeElement !== adminKeyInput) {
    adminKeyInput.value = siteConfig.geminiApiKey || '';
  }

  if (btnRemoveAdmin) {
    btnRemoveAdmin.classList.toggle('hidden', !hasKey);
  }
}

function saveGeminiApiKey() {
  const keyInput = document.getElementById('cfgGeminiApiKey');
  if (!keyInput) return;
  
  const key = keyInput.value.trim();
  if (!key) {
    return removeGeminiApiKey();
  }

  siteConfig.geminiApiKey = key;
  localStorage.setItem('vietshop_gemini_api_key', key);
  updateAiKeyStatusUI();
  alert('🚀 Đã lưu và kích hoạt Google Gemini API Key của bạn thành công! Trợ lý AI VIETSHOP đã kết nối với tài khoản cá nhân của bạn.');
}

function removeGeminiApiKey() {
  siteConfig.geminiApiKey = "";
  localStorage.removeItem('vietshop_gemini_api_key');
  updateAiKeyStatusUI();
  alert('Đã gỡ API Key riêng. Trợ lý AI chuyển về chế độ phản hồi tự động theo kho hàng.');
}

const footerPages = {
  guide: {
    title: "Hướng Dẫn Mua Hàng & Thanh Toán",
    content: `
      <p class="font-semibold text-slate-800"><b class="font-black text-slate-950">Bước 1:</b> Tìm kiếm sản phẩm yêu thích thông qua thanh tìm kiếm hoặc danh mục hàng hóa trên VIETSHOP.</p>
      <p class="font-semibold text-slate-800"><b class="font-black text-slate-950">Bước 2:</b> Chọn phân loại màu sắc, kích thước (size) và bấm <b class="font-black text-slate-950">"Thêm vào giỏ"</b> hoặc <b class="font-black text-slate-950">"Mua ngay"</b>.</p>
      <p class="font-semibold text-slate-800"><b class="font-black text-slate-950">Bước 3:</b> Nhập thông tin người nhận & địa chỉ giao hàng chi tiết (Tỉnh/Thành, Quận/Huyện, Số nhà...).</p>
      <p class="font-semibold text-slate-800"><b class="font-black text-slate-950">Bước 4:</b> Lựa chọn phương thức thanh toán COD (Nhận hàng thanh toán) hoặc ví VIETPay/Thẻ ngân hàng và bấm <b class="font-black text-slate-950">"Đặt Hàng"</b>.</p>
    `
  },
  shipping: {
    title: "Chính Sách Vận Chuyển & Đổi Trả",
    content: `
      <p class="font-semibold text-slate-800"><b class="font-black text-slate-950">Chính sách Freeship:</b> VIETSHOP hỗ trợ miễn phí vận chuyển 0Đ toàn quốc cho các đơn hàng áp mã ưu đãi.</p>
      <p class="font-semibold text-slate-800"><b class="font-black text-slate-950">Thời gian giao hàng:</b> Từ 1 - 3 ngày làm việc đối với khu vực nội thành, 3 - 5 ngày đối với các tỉnh thành khác.</p>
      <p class="font-semibold text-slate-800"><b class="font-black text-slate-950">Chính sách đổi trả 15 ngày:</b> Quý khách được quyền đổi trả hàng hoàn tiền miễn phí trong vòng 15 ngày nếu sản phẩm lỗi từ nhà sản xuất hoặc không đúng mô tả.</p>
    `
  },
  about: {
    title: "Giới Thiệu Về Sàn Thương Mại Điện Tử VIETSHOP",
    content: `
      <p class="font-semibold text-slate-800">VIETSHOP là nền tảng mua sắm trực tuyến uy tín, cung cấp hàng triệu sản phẩm từ Thời trang, Thiết bị điện tử đến Mỹ phẩm và Bách hóa gia đình.</p>
      <p class="font-semibold text-slate-800">Sứ mệnh của VIETSHOP là mang tới trải nghiệm mua sắm an toàn, minh bạch và tiết kiệm nhất cho người tiêu dùng Việt Nam.</p>
    `
  },
  careers: {
    title: "Tuyển Dụng Nhân Sự VIETSHOP 2026",
    content: `
      <p class="font-semibold text-slate-800">VIETSHOP liên tục tìm kiếm các tài năng trẻ trong các lĩnh vực: Kỹ sư Phần mềm, Chuyên viên Marketing, Chăm sóc khách hàng và Quản lý vận hành kho bãi.</p>
      <p class="font-semibold text-slate-800">Gửi CV ứng tuyển trực tiếp qua Email: <b class="text-[#ee4d2d] font-black">tuyendung@vietshop.vn</b>.</p>
    `
  },
  privacy: {
    title: "Chính Sách Bảo Mật Thông Tin VIETSHOP",
    content: `
      <p class="font-semibold text-slate-800">VIETSHOP cam kết bảo mật tuyệt đối thông tin cá nhân và dữ liệu thanh toán của khách hàng theo chuẩn mã hóa SSL 256-bit cao cấp nhất.</p>
      <p class="font-semibold text-slate-800">Chúng tôi không bao giờ chia sẻ dữ liệu người dùng cho bất kỳ bên thứ ba nào khi chưa có sự đồng ý.</p>
    `
  },
  terms: {
    title: "Điều Khoản Sử Dụng Dịch Vụ VIETSHOP",
    content: `
      <p class="font-semibold text-slate-800">Khi sử dụng trang web VIETSHOP, người dùng cam kết tuân thủ các quy định về mua bán hàng hóa, không phát tán nội dung vi phạm pháp luật và tôn trọng quyền sở hữu trí tuệ của các nhà bán hàng trên sàn VIETSHOP.</p>
    `
  }
};

function openFooterInfo(type) {
  const page = footerPages[type];
  if (!page) return;
  document.getElementById('footerModalTitle').textContent = page.title;
  document.getElementById('footerModalBody').innerHTML = page.content;
  document.getElementById('footerInfoModal')?.classList.remove('hidden');
}

function closeFooterModal() {
  document.getElementById('footerInfoModal')?.classList.add('hidden');
}

function closeFooterInfo() {
  closeFooterModal();
}

function switchSellerSubTab(subTab) {
  const prodTab = document.getElementById('sellerSubTabProducts');
  const orderTab = document.getElementById('sellerSubTabOrders');
  const customTab = document.getElementById('sellerSubTabCustomize');
  const aiCodeTab = document.getElementById('sellerSubTabAiCode');
  const promotionsTab = document.getElementById('sellerSubTabPromotions');
  const bannerTab = document.getElementById('sellerSubTabBanner');
  const textEditorTab = document.getElementById('sellerSubTabTextEditor');

  const prodBtn = document.getElementById('sellerTabProductsBtn');
  const orderBtn = document.getElementById('sellerTabOrdersBtn');
  const customBtn = document.getElementById('sellerTabCustomizeBtn');
  const aiCodeBtn = document.getElementById('sellerTabAiCodeBtn');
  const promotionsBtn = document.getElementById('sellerTabPromotionsBtn');
  const bannerBtn = document.getElementById('sellerTabBannerBtn');
  const textEditorBtn = document.getElementById('sellerTabTextEditorBtn');

  [prodTab, orderTab, customTab, aiCodeTab, promotionsTab, bannerTab, textEditorTab].forEach(t => t?.classList.add('hidden'));
  [prodBtn, orderBtn, customBtn, aiCodeBtn, promotionsBtn, bannerBtn, textEditorBtn].forEach(b => {
    if (b) b.className = "pb-2 text-slate-500 border-b-2 border-transparent hover:text-slate-800 cursor-pointer font-bold whitespace-nowrap flex items-center gap-1.5";
  });

  if (subTab === 'orders') {
    orderTab?.classList.remove('hidden');
    if (orderBtn) orderBtn.className = "pb-2 text-[#ee4d2d] border-b-2 border-[#ee4d2d] cursor-pointer font-bold whitespace-nowrap flex items-center gap-1.5";
  } else if (subTab === 'banner') {
    bannerTab?.classList.remove('hidden');
    if (bannerBtn) bannerBtn.className = "pb-2 text-[#ee4d2d] border-b-2 border-[#ee4d2d] cursor-pointer font-bold whitespace-nowrap flex items-center gap-1.5";
    populateBannerAdminForm();
  } else if (subTab === 'promotions') {
    promotionsTab?.classList.remove('hidden');
    if (promotionsBtn) promotionsBtn.className = "pb-2 text-[#ee4d2d] border-b-2 border-[#ee4d2d] cursor-pointer font-bold whitespace-nowrap flex items-center gap-1.5";
    populatePromotionsForm();
  } else if (subTab === 'customize') {
    customTab?.classList.remove('hidden');
    if (customBtn) customBtn.className = "pb-2 text-[#ee4d2d] border-b-2 border-[#ee4d2d] cursor-pointer font-bold whitespace-nowrap flex items-center gap-1.5";
  } else if (subTab === 'aicode') {
    aiCodeTab?.classList.remove('hidden');
    if (aiCodeBtn) aiCodeBtn.className = "pb-2 text-blue-600 border-b-2 border-blue-600 cursor-pointer font-bold whitespace-nowrap flex items-center gap-1.5";
    renderAiPhpCodeUI();
  } else if (subTab === 'texteditor') {
    textEditorTab?.classList.remove('hidden');
    if (textEditorBtn) textEditorBtn.className = "pb-2 text-emerald-600 border-b-2 border-emerald-600 cursor-pointer font-bold whitespace-nowrap flex items-center gap-1.5";
    renderTextEditorAdminView();
  } else {
    prodTab?.classList.remove('hidden');
    if (prodBtn) prodBtn.className = "pb-2 text-[#ee4d2d] border-b-2 border-[#ee4d2d] cursor-pointer font-bold whitespace-nowrap flex items-center gap-1.5";
  }
}

function renderMarqueeTicker() {
  const badgeEl = document.getElementById('txtBannerMarqueeBadge');
  if (badgeEl) {
    badgeEl.textContent = siteConfig.marqueeBadge || "SIÊU SALE 2026";
  }

  const claimBtn = document.getElementById('txtMarqueeQuickClaim');
  if (claimBtn) {
    claimBtn.textContent = siteConfig.activePromoCode ? `Nhận ${siteConfig.activePromoCode}` : "Nhận Voucher";
  }

  const trackContainer = document.getElementById('marqueeTrackContainer');
  if (!trackContainer) return;

  const rawText = siteConfig.marqueePromoText || "";
  const parts = rawText.split('•').map(p => p.trim()).filter(Boolean);

  const formattedHtml = parts.map(part => {
    let renderedPart = part;
    const vouchersList = siteConfig.vouchers || [];
    vouchersList.forEach(v => {
      if (renderedPart.includes(v.code)) {
        renderedPart = renderedPart.split(v.code).join(
          `<button type="button" onclick="claimVoucher('${v.code}')" class="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md transition font-black underline decoration-amber-300 decoration-2 cursor-pointer inline-flex items-center gap-1">${v.code}</button>`
        );
      }
    });
    return `<span>${renderedPart}</span>`;
  }).join('<span class="text-amber-200 mx-1.5 sm:mx-2">•</span>');

  const contentSpan = `<span class="inline-flex items-center space-x-2 sm:space-x-3 px-1 whitespace-nowrap">${formattedHtml}<span class="text-amber-200 mx-1.5 sm:mx-2">•</span></span>`;
  trackContainer.innerHTML = contentSpan + contentSpan.replace('inline-flex', 'inline-flex aria-hidden="true"');
}

function populatePromotionsForm() {
  const mode = siteConfig.shippingMode || 'threshold';
  const radio = document.querySelector(`input[name="cfgShippingMode"][value="${mode}"]`);
  if (radio) radio.checked = true;

  if (document.getElementById('cfgDefaultShippingFee')) {
    document.getElementById('cfgDefaultShippingFee').value = siteConfig.defaultShippingFee || 25000;
  }
  if (document.getElementById('cfgFreeShippingThreshold')) {
    document.getElementById('cfgFreeShippingThreshold').value = siteConfig.freeShippingThreshold || 200000;
  }
  if (document.getElementById('cfgShippingNotice')) {
    document.getElementById('cfgShippingNotice').value = siteConfig.shippingNotice || "Miễn phí vận chuyển toàn quốc cho đơn hàng từ 200.000₫";
  }

  if (document.getElementById('cfgMarqueeBadge')) {
    document.getElementById('cfgMarqueeBadge').value = siteConfig.marqueeBadge || "SIÊU SALE 2026";
  }
  if (document.getElementById('cfgMarqueePromoText')) {
    document.getElementById('cfgMarqueePromoText').value = siteConfig.marqueePromoText || "";
  }
  if (document.getElementById('cfgActivePromoCode')) {
    document.getElementById('cfgActivePromoCode').value = siteConfig.activePromoCode || "VIETSHOP50K";
  }
  if (document.getElementById('cfgVietpayDiscount')) {
    document.getElementById('cfgVietpayDiscount').value = siteConfig.vietpayDiscount || 10000;
  }

  onShippingModeChange();
  renderSellerVouchersTable();
  updateShippingSimulator();
}

function onShippingModeChange() {
  const selectedMode = document.querySelector('input[name="cfgShippingMode"]:checked')?.value || 'threshold';
  const wrapFee = document.getElementById('wrapperDefaultShippingFee');
  const wrapThreshold = document.getElementById('wrapperFreeShippingThreshold');

  if (selectedMode === 'free') {
    if (wrapFee) wrapFee.classList.add('opacity-40', 'pointer-events-none');
    if (wrapThreshold) wrapThreshold.classList.add('opacity-40', 'pointer-events-none');
  } else if (selectedMode === 'fixed') {
    if (wrapFee) wrapFee.classList.remove('opacity-40', 'pointer-events-none');
    if (wrapThreshold) wrapThreshold.classList.add('opacity-40', 'pointer-events-none');
  } else {
    // threshold
    if (wrapFee) wrapFee.classList.remove('opacity-40', 'pointer-events-none');
    if (wrapThreshold) wrapThreshold.classList.remove('opacity-40', 'pointer-events-none');
  }

  updateShippingSimulator();
}

function updateShippingSimulator() {
  const simSubtotalInput = document.getElementById('simCartSubtotalInput');
  const resultBox = document.getElementById('simShippingResult');
  if (!simSubtotalInput || !resultBox) return;

  const simSubtotal = Number(simSubtotalInput.value) || 0;
  const selectedMode = document.querySelector('input[name="cfgShippingMode"]:checked')?.value || 'threshold';
  const defaultFee = Number(document.getElementById('cfgDefaultShippingFee')?.value) || 25000;
  const threshold = Number(document.getElementById('cfgFreeShippingThreshold')?.value) || 200000;

  let fee = 0;
  let reason = '';

  if (simSubtotal <= 0) {
    fee = 0;
    reason = 'Giỏ trống';
  } else if (selectedMode === 'free') {
    fee = 0;
    reason = 'Áp dụng Freeship 0Đ toàn sàn';
  } else if (selectedMode === 'fixed') {
    fee = defaultFee;
    reason = 'Đồng giá cố định';
  } else {
    if (simSubtotal >= threshold) {
      fee = 0;
      reason = `Đạt mốc đơn ≥ ${formatVND(threshold)}`;
    } else {
      fee = defaultFee;
      const diff = threshold - simSubtotal;
      reason = `Thiếu ${formatVND(diff)} để được Freeship 0Đ`;
    }
  }

  resultBox.innerHTML = `
    <span>Phí ship tính cho đơn này: <small class="text-slate-500 font-normal">(${reason})</small></span>
    <b class="${fee === 0 ? 'text-emerald-600' : 'text-[#ee4d2d]'} font-black text-sm">${fee === 0 ? 'FREESHIP 0Đ' : formatVND(fee)}</b>
  `;
}

function renderSellerVouchersTable() {
  const tbody = document.getElementById('sellerVouchersTable');
  const badge = document.getElementById('voucherTotalBadge');
  if (!tbody) return;

  const list = siteConfig.vouchers || [];
  if (badge) badge.textContent = `${list.filter(v => v.active !== false).length} Mã Đang Hoạt Động`;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400 font-medium">Chưa có mã giảm giá nào. Hãy bấm thêm mã mới ở trên!</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((v) => {
    let typeDisplay = '';
    if (v.type === 'shipping') typeDisplay = `Giảm phí ship: <b class="text-blue-600">${formatVND(v.value)}</b>`;
    else if (v.type === 'percent') typeDisplay = `Giảm theo %: <b class="text-purple-600">${v.value}%</b>`;
    else typeDisplay = `Giảm tiền mặt: <b class="text-[#ee4d2d]">${formatVND(v.value)}</b>`;

    const isActive = v.active !== false;

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0">
        <td class="p-3">
          <span class="font-mono font-black text-slate-900 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg text-xs inline-flex items-center gap-1 shadow-2xs">
            🎟️ ${v.code}
          </span>
        </td>
        <td class="p-3 font-semibold text-slate-700">${typeDisplay}</td>
        <td class="p-3 font-bold text-slate-800">${v.minOrder ? formatVND(v.minOrder) : '0₫ (Không giới hạn)'}</td>
        <td class="p-3 text-slate-500 max-w-xs truncate">${v.desc || 'Ưu đãi đặt hàng'}</td>
        <td class="p-3">
          <button type="button" onclick="toggleVoucher('${v.code}')" class="px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}">
            ${isActive ? '🟢 Đang chạy' : '⚪ Tạm dừng'}
          </button>
        </td>
        <td class="p-3 text-right">
          <button type="button" onclick="deleteVoucher('${v.code}')" class="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded font-bold cursor-pointer transition text-xs" title="Xóa mã">
            🗑️ Xóa
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function addNewVoucher() {
  const codeIn = document.getElementById('newVoucherCode');
  const typeIn = document.getElementById('newVoucherType');
  const valIn = document.getElementById('newVoucherValue');
  const minIn = document.getElementById('newVoucherMinOrder');

  const code = codeIn?.value.trim().toUpperCase();
  const type = typeIn?.value || 'fixed';
  const val = Number(valIn?.value) || 0;
  const minOrder = Number(minIn?.value) || 0;

  if (!code || val <= 0) {
    return alert('⚠️ Vui lòng nhập Mã Voucher và Giá trị giảm giá hợp lệ!');
  }

  if ((siteConfig.vouchers || []).some(v => v.code === code)) {
    return alert(`⚠️ Mã voucher "${code}" đã tồn tại trong danh sách!`);
  }

  let desc = '';
  if (type === 'shipping') desc = `Giảm ${formatVND(val)} phí vận chuyển`;
  else if (type === 'percent') desc = `Giảm ${val}% cho đơn từ ${formatVND(minOrder)}`;
  else desc = `Giảm ${formatVND(val)} cho đơn từ ${formatVND(minOrder)}`;

  if (!siteConfig.vouchers) siteConfig.vouchers = [];
  siteConfig.vouchers.unshift({
    code,
    type,
    value: val,
    minOrder,
    desc,
    active: true
  });

  localStorage.setItem('vietshop_promotions_config', JSON.stringify({
    ...defaultPromotionsConfig,
    ...siteConfig
  }));

  if (codeIn) codeIn.value = '';
  if (valIn) valIn.value = '';
  if (minIn) minIn.value = '';

  renderSellerVouchersTable();
  renderMarqueeTicker();
  alert(`✨ Đã thêm mã voucher [${code}] thành công! Khách hàng có thể sử dụng ngay lập tức.`);
}

function deleteVoucher(code) {
  if (confirm(`Bạn có chắc chắn muốn xóa mã voucher "${code}"?`)) {
    siteConfig.vouchers = (siteConfig.vouchers || []).filter(v => v.code !== code);
    localStorage.setItem('vietshop_promotions_config', JSON.stringify({
      ...defaultPromotionsConfig,
      ...siteConfig
    }));
    renderSellerVouchersTable();
    renderMarqueeTicker();
  }
}

function toggleVoucher(code) {
  const v = (siteConfig.vouchers || []).find(item => item.code === code);
  if (v) {
    v.active = !(v.active !== false);
    localStorage.setItem('vietshop_promotions_config', JSON.stringify({
      ...defaultPromotionsConfig,
      ...siteConfig
    }));
    renderSellerVouchersTable();
  }
}

function applyMarqueePreset(type) {
  const textarea = document.getElementById('cfgMarqueePromoText');
  const badgeInput = document.getElementById('cfgMarqueeBadge');
  const codeInput = document.getElementById('cfgActivePromoCode');
  if (!textarea) return;

  if (type === 'sale50') {
    if (badgeInput) badgeInput.value = "SIÊU SALE 50%";
    if (codeInput) codeInput.value = "VIETSHOP50K";
    textarea.value = "⚡ FLASH SALE GIẢM 50%: Săn deal sốc 9K - 99K - 199K hôm nay! • 🎟️ Mã VIETSHOP50K - Giảm 50.000đ đơn từ 200K • 🚚 FREESHIP 0Đ: Miễn phí vận chuyển toàn quốc cho mọi đơn hàng • 🎁 Mã FREESHIP100 - Tặng voucher giảm phí ship 15K • 💳 Giảm thêm 10.000đ khi thanh toán qua Ví điện tử VIETPay • ✨ 100% Hàng chính hãng - Đổi trả miễn phí 7 ngày";
  } else if (type === 'trian') {
    if (badgeInput) badgeInput.value = "TRI ÂN KHÁCH HÀNG";
    if (codeInput) codeInput.value = "SALE10";
    textarea.value = "🎁 TUẦN LỄ TRI ÂN KHÁCH HÀNG: Giảm ngay 10% cho toàn bộ hóa đơn từ 150K với mã SALE10 • 🚚 Miễn phí vận chuyển tận nhà toàn quốc • 💎 Tích lũy điểm nhận quà tặng không giới hạn • 🌟 Hỗ trợ tư vấn trực tuyến 24/7";
  } else if (type === 'xakho') {
    if (badgeInput) badgeInput.value = "XẢ KHO ĐỒNG GIÁ";
    if (codeInput) codeInput.value = "FREESHIP100";
    textarea.value = "💥 ĐẠI TIỆC XẢ KHO LỚN NHẤT NĂM: Đồng giá 99K - 149K - 199K tất cả các ngành hàng • 🎟️ Nhập mã FREESHIP100 miễn ngay phí vận chuyển • ⚡ Số lượng có hạn - Chốt đơn ngay kẻo lỡ!";
  }
}

function savePromotionsConfig() {
  const selectedMode = document.querySelector('input[name="cfgShippingMode"]:checked')?.value || 'threshold';
  siteConfig.shippingMode = selectedMode;
  siteConfig.defaultShippingFee = Number(document.getElementById('cfgDefaultShippingFee')?.value) || 25000;
  siteConfig.freeShippingThreshold = Number(document.getElementById('cfgFreeShippingThreshold')?.value) || 200000;
  siteConfig.shippingNotice = document.getElementById('cfgShippingNotice')?.value.trim() || "Miễn phí vận chuyển toàn quốc cho đơn hàng từ 200.000₫";

  siteConfig.marqueeBadge = document.getElementById('cfgMarqueeBadge')?.value.trim() || "SIÊU SALE 2026";
  siteConfig.marqueePromoText = document.getElementById('cfgMarqueePromoText')?.value.trim() || "";
  siteConfig.activePromoCode = document.getElementById('cfgActivePromoCode')?.value.trim().toUpperCase() || "VIETSHOP50K";
  siteConfig.vietpayDiscount = Number(document.getElementById('cfgVietpayDiscount')?.value) || 10000;

  localStorage.setItem('vietshop_promotions_config', JSON.stringify({
    shippingMode: siteConfig.shippingMode,
    defaultShippingFee: siteConfig.defaultShippingFee,
    freeShippingThreshold: siteConfig.freeShippingThreshold,
    shippingNotice: siteConfig.shippingNotice,
    marqueeBadge: siteConfig.marqueeBadge,
    marqueePromoText: siteConfig.marqueePromoText,
    activePromoCode: siteConfig.activePromoCode,
    vietpayDiscount: siteConfig.vietpayDiscount,
    vouchers: siteConfig.vouchers
  }));

  renderMarqueeTicker();
  renderCartItems();

  alert('💾 Đã lưu cấu hình Khuyến mãi, Dòng chữ chạy và Phí vận chuyển thành công!\nCác thay đổi đã được áp dụng tức thì ra ngoài gian hàng.');
}

function resetPromotionsToDefault() {
  if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ cấu hình Khuyến mãi & Phí ship về mặc định ban đầu?')) {
    Object.assign(siteConfig, defaultPromotionsConfig);
    localStorage.removeItem('vietshop_promotions_config');
    populatePromotionsForm();
    renderMarqueeTicker();
    renderCartItems();
    alert('↺ Đã khôi phục cài đặt mặc định thành công!');
  }
}

// Custom Sales AI PHP Code Management
// ==========================================
// AI BUTTON GENERATOR & ADMIN CODE SUITE
// ==========================================

const defaultSalesData = {
  noticeTitle: "THÔNG BÁO CHO ĐỘI NGŨ SALES:",
  noticeBody: "Chương trình khuyến mãi Tháng 9 đã bắt đầu. Ưu đãi chiết khấu 15% cho đơn từ 2 triệu!",
  widgetTitle: "📌 Quy Trình Xử Lý Đơn Hotline",
  step1: "1. Xác nhận địa chỉ giao hàng và SĐT chính xác.",
  step2: "2. Kiểm tra tồn kho kho trung tâm trước khi ấn Chốt đơn.",
  step3: "3. Gửi mã Vận đơn qua tin nhắn SMS cho khách ngay sau khi tạo."
};

let customSalesData = JSON.parse(localStorage.getItem('vietshop_custom_sales_data')) || { ...defaultSalesData };

// State for Live AI simulated actions
let simState = {
  snowActive: false,
  maintenanceActive: false,
  promoActive: false,
  currentHotline: "0912.345.678"
};

function showAiToast(msg, isSuccess = true) {
  const toast = document.getElementById('aiToast');
  const toastMsg = document.getElementById('aiToastMsg');
  const toastIcon = document.getElementById('aiToastIcon');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  if (toastIcon) {
    toastIcon.className = isSuccess 
      ? "w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0"
      : "w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0";
    toastIcon.innerHTML = isSuccess ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-info"></i>';
  }

  toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
  if (window._aiToastTimer) clearTimeout(window._aiToastTimer);
  window._aiToastTimer = setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  }, 3500);
}

function switchSnippetPlatformTab(tabId) {
  const tabs = ['tab-wooc', 'tab-ajax', 'tab-js', 'tab-shopify'];
  tabs.forEach(t => {
    const el = document.getElementById(t);
    const btn = document.getElementById(`btn-${t}`);
    if (el) el.classList.add('hidden');
    if (btn) {
      btn.classList.remove('active', 'bg-blue-600', 'text-white');
      btn.classList.add('bg-slate-900', 'text-slate-300');
    }
  });

  const activeEl = document.getElementById(tabId);
  const activeBtn = document.getElementById(`btn-${tabId}`);
  if (activeEl) activeEl.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-blue-600', 'text-white');
    activeBtn.classList.remove('bg-slate-900', 'text-slate-300');
  }
}

function copyCodeSnippet(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showAiToast('📋 Đã sao chép mã vào bộ nhớ tạm!');
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text, label = 'mã') {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showAiToast(`📋 Đã sao chép ${label} vào bộ nhớ tạm!`);
  } catch (e) {
    prompt('Sao chép mã thủ công:', text);
  }
  document.body.removeChild(ta);
}

function updateSnippetCodeAndSimulator() {
  const inNoticeTitle = document.getElementById('input-notice-title');
  const inNoticeContent = document.getElementById('input-notice-content');
  const inNoticeStyle = document.getElementById('select-notice-style');
  const inWidgetTitle = document.getElementById('input-widget-title');
  const inWidgetContent = document.getElementById('input-widget-content');

  const title = inNoticeTitle?.value || defaultSalesData.noticeTitle;
  const content = inNoticeContent?.value || defaultSalesData.noticeBody;
  const style = inNoticeStyle?.value || 'info';
  const widgetTitle = inWidgetTitle?.value || '📌 Quy Trình Xử Lý Đơn Hotline';
  const widgetContent = inWidgetContent?.value || '<p>1. Xác nhận địa chỉ giao hàng và SĐT chính xác.</p><p>2. Kiểm tra tồn kho kho trung tâm trước khi ấn Chốt đơn.</p><p>3. Gửi mã Vận đơn qua tin nhắn SMS cho khách ngay sau khi tạo.</p>';

  // Update Simulator Notice
  const simNoticeTitle = document.getElementById('sim-notice-title');
  const simNoticeContent = document.getElementById('sim-notice-content');
  const simNoticeBox = document.getElementById('simulated-admin-notice');
  const simNoticeIcon = document.getElementById('sim-notice-icon');

  if (simNoticeTitle) simNoticeTitle.textContent = title;
  if (simNoticeContent) simNoticeContent.textContent = content;

  if (simNoticeBox) {
    simNoticeBox.className = 'p-4 rounded-xl text-sm flex items-start justify-between gap-3 shadow-lg transition-all duration-300 ';
    let iconClass = 'fa-solid fa-bullhorn';
    if (style === 'success') {
      simNoticeBox.className += 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-200';
      iconClass = 'fa-solid fa-circle-check text-emerald-400';
    } else if (style === 'warning') {
      simNoticeBox.className += 'bg-amber-600/20 border border-amber-500/40 text-amber-200';
      iconClass = 'fa-solid fa-triangle-exclamation text-amber-400';
    } else if (style === 'error') {
      simNoticeBox.className += 'bg-red-600/20 border border-red-500/40 text-red-200';
      iconClass = 'fa-solid fa-circle-exclamation text-red-400';
    } else {
      simNoticeBox.className += 'bg-blue-600/20 border border-blue-500/40 text-blue-200';
      iconClass = 'fa-solid fa-bullhorn text-blue-400';
    }
    if (simNoticeIcon) simNoticeIcon.className = `${iconClass} text-lg mt-0.5`;
  }

  // Update Simulator Widget (if not currently replaced by custom AI button)
  const simWidgetTitle = document.getElementById('sim-widget-title');
  const simWidgetContent = document.getElementById('sim-widget-content');
  if (simWidgetTitle && !window._showingAiWidgetInSim) {
    simWidgetTitle.innerHTML = `<i class="fa-solid fa-note-sticky text-amber-400 mr-2"></i> ${escapeHtml(widgetTitle)}`;
  }
  if (simWidgetContent && !window._showingAiWidgetInSim) {
    simWidgetContent.innerHTML = widgetContent;
  }

  // Update Top Banner Notice on Seller Page
  const liveTitle = document.getElementById('liveNoticeTitle');
  const liveText = document.getElementById('liveNoticeText');
  if (liveTitle) liveTitle.textContent = title;
  if (liveText) liveText.textContent = content;

  // Generate WooCommerce PHP Code
  const codeWooc = document.getElementById('code-wooc-php');
  if (codeWooc) {
    const noticeClass = `notice notice-${style} is-dismissible`;
    codeWooc.textContent = `<?php
/**
 * Mã chèn Thông Báo & Widget Tùy Chỉnh vào Admin WooCommerce / WordPress
 * Dán vào file functions.php của Theme
 */

// 1. Chèn Thanh Thông Báo ở đầu trang Quản Trị
add_action('admin_notices', 'custom_sales_admin_notice');
function custom_sales_admin_notice() {
    ?>
    <div class="${noticeClass}" style="padding: 12px 15px; font-size: 14px; border-left-width: 4px;">
        <p style="margin: 0;">
            <strong style="color: #1d2327;">${title}</strong> 
            <span>${content}</span>
        </p>
    </div>
    <?php
}

// 2. Tạo Khối Widget Tùy Chỉnh trên Dashboard Admin
add_action('wp_dashboard_setup', 'custom_sales_dashboard_widget');
function custom_sales_dashboard_widget() {
    wp_add_dashboard_widget(
        'custom_sales_info_widget',              // Widget ID
        '${widgetTitle}',                        // Widget Title
        'render_custom_sales_dashboard_widget'   // Display Function
    );
}

function render_custom_sales_dashboard_widget() {
    echo '<div style="font-size: 13px; line-height: 1.6; padding: 5px 0;">';
    echo '${widgetContent.replace(/'/g, "\\'")}';
    echo '</div>';
}
?>`;
  }

  // Generate JavaScript DOM Injection Code
  const codeJs = document.getElementById('code-js-dom');
  if (codeJs) {
    let bgColor = '#2563eb';
    if (style === 'success') bgColor = '#059669';
    if (style === 'warning') bgColor = '#d97706';
    if (style === 'error') bgColor = '#dc2626';

    codeJs.textContent = `/**
 * Mã JavaScript Tự Động Chèn Thông Báo & Widget Vào Admin Web Tùy Biến
 */
document.addEventListener('DOMContentLoaded', function() {
    // 1. Chèn thanh thông báo vào đầu trang
    const adminHeader = document.querySelector('header') || document.body;
    const noticeDiv = document.createElement('div');
    noticeDiv.style.cssText = 'background: ${bgColor}; color: #fff; padding: 12px 20px; font-size: 14px; font-weight: 500; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);';
    noticeDiv.innerHTML = '<div><strong>${title}</strong> ${content}</div><button onclick="this.parentElement.remove()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer;">&times;</button>';
    adminHeader.prepend(noticeDiv);

    // 2. Chèn Khối Widget Thông Tin vào Dashboard
    const dashboardGrid = document.querySelector('.dashboard-grid') || document.body;
    const widgetCard = document.createElement('div');
    widgetCard.style.cssText = 'background: #1e293b; color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 15px; font-family: sans-serif; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);';
    widgetCard.innerHTML = '<h3 style="margin-top:0; font-size:16px; border-bottom:1px solid #334155; padding-bottom:10px; color:#38bdf8;">${widgetTitle}</h3><div style="font-size:13px; line-height:1.6;">${widgetContent.replace(/'/g, "\\'")}</div>';
    dashboardGrid.appendChild(widgetCard);
});`;
  }
}

function applyPresetPrompt(promptText) {
  const input = document.getElementById('ai-prompt-input');
  if (input) {
    input.value = promptText;
    generateAiButton();
  }
}

function generateAiButton() {
  const input = document.getElementById('ai-prompt-input');
  const prompt = input?.value.trim() || '';
  if (!prompt) {
    showAiToast('Vui lòng nhập mô tả chức năng bạn muốn AI tạo nút!', false);
    input?.focus();
    return;
  }

  const btn = document.getElementById('btn-generate-ai');
  const btnText = document.getElementById('btn-ai-text');
  if (btn) btn.disabled = true;
  if (btnText) btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> AI đang phân tích & viết code...';

  setTimeout(() => {
    let result = buildAiButtonResult(prompt);

    const wrapper = document.getElementById('ai-output-wrapper');
    const outTitle = document.getElementById('ai-generated-title');
    const outDesc = document.getElementById('ai-generated-desc');
    const outCode = document.getElementById('ai-generated-code');

    if (wrapper) wrapper.classList.remove('hidden');
    if (outTitle) outTitle.textContent = result.widgetTitle;
    if (outDesc) outDesc.textContent = result.description;
    if (outCode) outCode.textContent = result.phpCode;

    // Inject live action button into simulator widget
    window._showingAiWidgetInSim = true;
    const simWidgetTitle = document.getElementById('sim-widget-title');
    const simWidgetContent = document.getElementById('sim-widget-content');
    if (simWidgetTitle) {
      simWidgetTitle.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles text-amber-400 mr-2"></i> ${escapeHtml(result.widgetTitle)}`;
    }
    if (simWidgetContent) {
      simWidgetContent.innerHTML = result.simHtml;
    }

    if (btn) btn.disabled = false;
    if (btnText) btnText.innerHTML = 'Tạo Code & Nút Ngay';

    showAiToast('✨ AI đã sinh mã và tạo nút bấm trên Simulator thành công!');

    // Smooth scroll to output or simulator
    const sim = document.getElementById('simulator');
    if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 600);
}

function buildAiButtonResult(prompt) {
  const pLow = prompt.toLowerCase();

  if (pLow.includes('tuyết') || pLow.includes('snow')) {
    return {
      widgetTitle: "❄️ Điều Khiển Hiệu Ứng Tuyết Rơi Ngoài Web",
      description: "Tạo nút bấm trong Dashboard Admin cho phép Bật/Tắt hiệu ứng tuyết rơi lấp lánh ngoài trang chủ tự động mà không cần chỉnh sửa theme.",
      simHtml: `
        <div class="space-y-3 p-3 bg-slate-950/80 rounded-xl border border-sky-500/30">
          <div class="flex items-center justify-between">
            <span class="text-xs text-sky-300 font-semibold">Trạng thái tuyết rơi:</span>
            <span id="aiSimSnowStatus" class="text-xs font-bold ${simState.snowActive ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400 bg-slate-800'} px-2 py-0.5 rounded border border-slate-700">
              ${simState.snowActive ? '🟢 ĐANG BẬT (Đang rơi ngoài Web)' : '🔴 ĐANG TẮT'}
            </span>
          </div>
          <button onclick="triggerSimulatedAiAction('snow')" class="w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer">
            <i class="fa-regular fa-snowflake"></i> <span>${simState.snowActive ? 'Tắt Hiệu Ứng Tuyết Rơi' : 'Bật Tuyết Rơi Ngoài Trang Chủ'}</span>
          </button>
          <p class="text-[11px] text-slate-400 leading-relaxed italic">Bấm nút trên để thử nghiệm lệnh trực tiếp trên Admin Simulator!</p>
        </div>
      `,
      phpCode: `<?php
/**
 * AI GENERATED: Nút Bật/Tắt Hiệu Ứng Tuyết Rơi Ngoài Web
 * Khi admin bấm nút -> Gửi AJAX -> Lưu Database -> Trang chủ tự động rơi tuyết!
 */

add_action('wp_dashboard_setup', 'ai_widget_snow_effect');
function ai_widget_snow_effect() {
    wp_add_dashboard_widget(
        'ai_snow_widget_box',
        '❄️ Điều Khiển Hiệu Ứng Tuyết Rơi',
        'render_ai_snow_widget_box'
    );
}

function render_ai_snow_widget_box() {
    $active = get_option('site_snow_effect', 'no');
    ?>
    <div style="padding:12px; font-family:sans-serif;">
        <p style="font-size:13px;">Trạng thái tuyết rơi: 
            <strong style="color: <?php echo $active === 'yes' ? '#10b981' : '#ef4444'; ?>;">
                <?php echo $active === 'yes' ? 'ĐANG BẬT (Đang chạy ngoài Web)' : 'ĐANG TẮT'; ?>
            </strong>
        </p>
        <button id="btn-toggle-snow" class="button button-primary" style="background:#0284c7; border:none; padding:7px 15px; border-radius:6px; color:#fff; cursor:pointer;">
            <?php echo $active === 'yes' ? '🔴 Tắt Tuyết Rơi' : '🟢 Kích Hoạt Tuyết Rơi'; ?>
        </button>
        <span id="snow-spinner" style="display:none; margin-left:8px; color:#64748b;">⏳ Đang lưu...</span>
        <script>
        jQuery(document).ready(function($) {
            $('#btn-toggle-snow').on('click', function() {
                $('#snow-spinner').show();
                $.post(ajaxurl, {
                    action: 'toggle_snow_effect_action',
                    nonce: '<?php echo wp_create_nonce("snow_action_nonce"); ?>'
                }, function(res) {
                    $('#snow-spinner').hide();
                    location.reload();
                });
            });
        });
        </script>
    </div>
    <?php
}

add_action('wp_ajax_toggle_snow_effect_action', function() {
    check_ajax_referer('snow_action_nonce', 'nonce');
    if (!current_user_can('manage_options')) wp_send_json_error('Không có quyền!');
    $cur = get_option('site_snow_effect', 'no');
    update_option('site_snow_effect', $cur === 'yes' ? 'no' : 'yes');
    wp_send_json_success();
});

// Chèn JS tuyết rơi ngoài Frontend
add_action('wp_footer', function() {
    if (get_option('site_snow_effect') === 'yes') {
        echo '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>';
        echo '<script>setInterval(function(){ confetti({ particleCount: 15, spread: 70, origin: { y: -0.1 }, ticks: 300, colors: ["#ffffff", "#e0f2fe"] }); }, 1500);</script>';
    }
});
?>`
    };
  }

  if (pLow.includes('bảo trì') || pLow.includes('maintenance')) {
    return {
      widgetTitle: "🛠️ Khóa Chế Độ Bảo Trì Website Khẩn Cấp",
      description: "Bật chế độ thông báo bảo trì khẩn cấp ngoài website cho khách hàng, chỉ tài khoản Admin mới xem được sản phẩm.",
      simHtml: `
        <div class="space-y-3 p-3 bg-slate-950/80 rounded-xl border border-red-500/30">
          <div class="flex items-center justify-between">
            <span class="text-xs text-red-300 font-semibold">Chế độ bảo trì Web:</span>
            <span id="aiSimMaintStatus" class="text-xs font-bold ${simState.maintenanceActive ? 'text-red-400 bg-red-950/60' : 'text-emerald-400 bg-emerald-950/60'} px-2 py-0.5 rounded border border-slate-700">
              ${simState.maintenanceActive ? '🔴 ĐANG BẢO TRÌ (Khách không xem được)' : '🟢 BÌNH THƯỜNG (Website Đang Mở)'}
            </span>
          </div>
          <button onclick="triggerSimulatedAiAction('maintenance')" class="w-full py-2.5 px-3 ${simState.maintenanceActive ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'} text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer">
            <i class="fa-solid fa-wrench"></i> <span>${simState.maintenanceActive ? 'Mở Lại Website Ngay' : 'Kích Hoạt Bảo Trì Khẩn Cấp'}</span>
          </button>
          <p class="text-[11px] text-slate-400 leading-relaxed italic">Bấm nút trên để thử nghiệm đóng/mở website trực tiếp!</p>
        </div>
      `,
      phpCode: `<?php
/**
 * AI GENERATED: Nút Bật/Tắt Chế Độ Bảo Trì Khẩn Cấp
 * Khi bật: Khách truy cập sẽ thấy trang bảo trì, Admin vẫn xem web bình thường.
 */

add_action('wp_dashboard_setup', 'ai_widget_maintenance_mode');
function ai_widget_maintenance_mode() {
    wp_add_dashboard_widget(
        'ai_maint_widget_box',
        '🛠️ Điều Khiển Chế Độ Bảo Trì',
        'render_ai_maint_widget_box'
    );
}

function render_ai_maint_widget_box() {
    $active = get_option('site_maint_active', 'no');
    ?>
    <div style="padding:12px; font-family:sans-serif;">
        <p style="font-size:13px;">Trạng thái: 
            <strong style="color: <?php echo $active === 'yes' ? '#ef4444' : '#10b981'; ?>;">
                <?php echo $active === 'yes' ? '🔴 ĐANG BẢO TRÌ' : '🟢 WEBSITE ĐANG HOẠT ĐỘNG'; ?>
            </strong>
        </p>
        <button id="btn-toggle-maint" class="button" style="background: <?php echo $active === 'yes' ? '#10b981' : '#dc2626'; ?>; border:none; padding:7px 15px; border-radius:6px; color:#fff; cursor:pointer;">
            <?php echo $active === 'yes' ? 'Mở Lại Website' : 'Khóa Bảo Trì Khẩn Cấp'; ?>
        </button>
        <script>
        jQuery(document).ready(function($) {
            $('#btn-toggle-maint').on('click', function() {
                $.post(ajaxurl, {
                    action: 'toggle_maint_mode_action',
                    nonce: '<?php echo wp_create_nonce("maint_nonce"); ?>'
                }, function() { location.reload(); });
            });
        });
        </script>
    </div>
    <?php
}

add_action('wp_ajax_toggle_maint_mode_action', function() {
    check_ajax_referer('maint_nonce', 'nonce');
    if (!current_user_can('manage_options')) wp_send_json_error();
    $cur = get_option('site_maint_active', 'no');
    update_option('site_maint_active', $cur === 'yes' ? 'no' : 'yes');
    wp_send_json_success();
});

// Chặn truy cập người dùng bình thường khi đang bảo trì
add_action('template_redirect', function() {
    if (get_option('site_maint_active') === 'yes' && !current_user_can('manage_options') && !is_user_logged_in()) {
        wp_die(
            '<div style="text-align:center; padding:50px; font-family:sans-serif;">
                <h1 style="color:#e11d48;">🛠️ Website Đang Bảo Trì Nâng Cấp Hệ Thống</h1>
                <p style="color:#475569; font-size:16px;">Chúng tôi đang cập nhật máy chủ. Quý khách vui lòng quay lại sau ít phút.</p>
                <p>Hotline hỗ trợ: <strong>0912.345.678</strong></p>
             </div>',
            'Bảo Trì Hệ Thống',
            ['response' => 503]
        );
    }
});
?>`
    };
  }

  if (pLow.includes('hotline') || pLow.includes('sđt') || pLow.includes('điện thoại')) {
    return {
      widgetTitle: "📞 Cập Nhật Hotline Trực Tuyến Nhanh",
      description: "Cập nhật số điện thoại Hotline tư vấn hiển thị ở góc màn hình ngoài website ngay lập tức từ trang Admin.",
      simHtml: `
        <div class="space-y-3 p-3 bg-slate-950/80 rounded-xl border border-emerald-500/30">
          <div class="flex items-center justify-between">
            <span class="text-xs text-emerald-300 font-semibold">Hotline đang chạy ngoài Web:</span>
            <span id="aiSimHotlineText" class="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              ${simState.currentHotline}
            </span>
          </div>
          <div class="flex gap-2">
            <input type="text" id="aiSimHotlineInput" value="${simState.currentHotline}" placeholder="Nhập số điện thoại mới..." class="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
            <button onclick="triggerSimulatedAiAction('hotline')" class="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition cursor-pointer shrink-0">
              Lưu & Đổi
            </button>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed italic">Bấm Lưu để cập nhật tức thì ra ngoài trang web!</p>
        </div>
      `,
      phpCode: `<?php
/**
 * AI GENERATED: Widget Đổi Số Hotline Trực Tuyến Nhanh
 */
add_action('wp_dashboard_setup', 'ai_widget_change_hotline');
function ai_widget_change_hotline() {
    wp_add_dashboard_widget(
        'ai_hotline_widget_box',
        '📞 Đổi Số Điện Thoại Hotline Nhanh',
        'render_ai_hotline_widget_box'
    );
}

function render_ai_hotline_widget_box() {
    $hotline = get_option('site_custom_hotline', '0912.345.678');
    ?>
    <div style="padding:12px; font-family:sans-serif;">
        <p style="font-size:13px;">Hotline hiện tại: <strong><?php echo esc_html($hotline); ?></strong></p>
        <div style="display:flex; gap:8px;">
            <input type="text" id="new-hotline-val" value="<?php echo esc_attr($hotline); ?>" style="padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1;" />
            <button id="btn-save-hotline" class="button button-primary" style="background:#16a34a; border:none; padding:6px 14px; border-radius:6px; color:#fff; cursor:pointer;">Lưu</button>
        </div>
        <script>
        jQuery(document).ready(function($) {
            $('#btn-save-hotline').on('click', function() {
                var val = $('#new-hotline-val').val();
                $.post(ajaxurl, {
                    action: 'update_custom_hotline_action',
                    hotline: val,
                    nonce: '<?php echo wp_create_nonce("hotline_nonce"); ?>'
                }, function(res) {
                    alert('Đã cập nhật Hotline mới thành công!');
                    location.reload();
                });
            });
        });
        </script>
    </div>
    <?php
}

add_action('wp_ajax_update_custom_hotline_action', function() {
    check_ajax_referer('hotline_nonce', 'nonce');
    if (!current_user_can('manage_options')) wp_send_json_error();
    $hotline = sanitize_text_field($_POST['hotline'] ?? '');
    update_option('site_custom_hotline', $hotline);
    wp_send_json_success();
});

// Chèn nút gọi Hotline nổi góc màn hình ngoài Frontend
add_action('wp_footer', function() {
    $hotline = get_option('site_custom_hotline', '0912.345.678');
    echo '<a href="tel:' . esc_attr($hotline) . '" style="position:fixed; bottom:25px; left:25px; z-index:99999; background:#16a34a; color:#fff; padding:12px 18px; border-radius:50px; text-decoration:none; font-weight:bold; box-shadow:0 10px 15px rgba(0,0,0,0.3); display:flex; align-items:center; gap:8px;">
            <span>📞 Hotline: ' . esc_html($hotline) . '</span>
          </a>';
});
?>`
    };
  }

  // Default / Generic custom button action
  const cleanTitle = prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt;
  return {
    widgetTitle: `⚡ Nút Điều Khiển: ${cleanTitle}`,
    description: `Tạo nút bấm thực thi lệnh tùy chỉnh theo yêu cầu: "${prompt}". Lệnh được xử lý an toàn bằng AJAX PHP và cập nhật tức thì.`,
    simHtml: `
      <div class="space-y-3 p-3 bg-slate-950/80 rounded-xl border border-indigo-500/30">
        <div class="flex items-center justify-between">
          <span class="text-xs text-indigo-300 font-semibold">Tác vụ:</span>
          <span class="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Sẵn sàng thực thi
          </span>
        </div>
        <button onclick="triggerSimulatedAiAction('custom')" class="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer">
          <i class="fa-solid fa-bolt"></i> <span>Kích Hoạt Lệnh Ngay</span>
        </button>
        <p class="text-[11px] text-slate-400 leading-relaxed italic">Bấm nút trên để thử nghiệm phản hồi AJAX mô phỏng!</p>
      </div>
    `,
    phpCode: `<?php
/**
 * AI GENERATED CODE CHO: ${prompt}
 * Chuẩn WordPress Hook & AJAX Security Nonce
 */

add_action('wp_dashboard_setup', 'ai_custom_action_widget');
function ai_custom_action_widget() {
    wp_add_dashboard_widget(
        'ai_custom_action_widget_id',
        '⚡ ${cleanTitle}',
        'render_ai_custom_action_widget'
    );
}

function render_ai_custom_action_widget() {
    $status = get_option('ai_custom_task_status', 'ready');
    ?>
    <div style="padding:12px; font-family:sans-serif;">
        <p style="font-size:13px;">Trạng thái tác vụ: <strong><?php echo esc_html($status); ?></strong></p>
        <button id="btn-run-ai-task" class="button button-primary" style="background:#4f46e5; border:none; padding:7px 16px; border-radius:6px; color:#fff; cursor:pointer;">
            ⚡ Kích Hoạt Lệnh Ngay
        </button>
        <span id="ai-task-msg" style="margin-left:8px; font-size:12px; color:#64748b;"></span>
        <script>
        jQuery(document).ready(function($) {
            $('#btn-run-ai-task').on('click', function() {
                $('#ai-task-msg').text('⏳ Đang thực thi...');
                $.post(ajaxurl, {
                    action: 'execute_ai_custom_task',
                    nonce: '<?php echo wp_create_nonce("ai_custom_task_nonce"); ?>'
                }, function(response) {
                    if (response.success) {
                        $('#ai-task-msg').css('color', '#10b981').text('✅ Thành công!');
                    } else {
                        $('#ai-task-msg').css('color', '#ef4444').text('❌ Lỗi: ' + response.data);
                    }
                });
            });
        });
        </script>
    </div>
    <?php
}

// Xử lý AJAX phía máy chủ
add_action('wp_ajax_execute_ai_custom_task', function() {
    check_ajax_referer('ai_custom_task_nonce', 'nonce');
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Không đủ quyền quản trị!');
    }

    // Logic thực thi theo yêu cầu: ${prompt}
    update_option('ai_custom_task_status', 'executed_' . time());

    wp_send_json_success(['message' => 'Lệnh đã hoàn thành tốt']);
});
?>`
  };
}

function triggerSimulatedAiAction(type) {
  if (type === 'snow') {
    simState.snowActive = !simState.snowActive;
    const badge = document.getElementById('aiSimSnowStatus');
    if (badge) {
      badge.className = `text-xs font-bold ${simState.snowActive ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400 bg-slate-800'} px-2 py-0.5 rounded border border-slate-700`;
      badge.textContent = simState.snowActive ? '🟢 ĐANG BẬT (Đang rơi ngoài Web)' : '🔴 ĐANG TẮT';
    }
    showAiToast(simState.snowActive 
      ? '❄️ [Mô Phỏng Admin] Đã BẬT hiệu ứng tuyết rơi ngoài website thành công!' 
      : '❄️ [Mô Phỏng Admin] Đã TẮT hiệu ứng tuyết rơi ngoài website!');
  } else if (type === 'maintenance') {
    simState.maintenanceActive = !simState.maintenanceActive;
    const badge = document.getElementById('aiSimMaintStatus');
    if (badge) {
      badge.className = `text-xs font-bold ${simState.maintenanceActive ? 'text-red-400 bg-red-950/60' : 'text-emerald-400 bg-emerald-950/60'} px-2 py-0.5 rounded border border-slate-700`;
      badge.textContent = simState.maintenanceActive ? '🔴 ĐANG BẢO TRÌ (Khách không xem được)' : '🟢 BÌNH THƯỜNG (Website Đang Mở)';
    }
    showAiToast(simState.maintenanceActive 
      ? '🛠️ [Mô Phỏng Admin] Đã KÍCH HOẠT chế độ bảo trì khẩn cấp!' 
      : '🛠️ [Mô Phỏng Admin] Đã MỞ LẠI website cho khách hàng truy cập bình thường!');
  } else if (type === 'hotline') {
    const inVal = document.getElementById('aiSimHotlineInput')?.value.trim();
    if (inVal) {
      simState.currentHotline = inVal;
      const text = document.getElementById('aiSimHotlineText');
      if (text) text.textContent = inVal;
      showAiToast(`📞 [Mô Phỏng Admin] Đã cập nhật Hotline mới: ${inVal} ra ngoài web!`);
    }
  } else {
    showAiToast('⚡ [Mô Phỏng Admin] Lệnh AJAX đã gửi tới máy chủ và hoàn tất thành công!');
  }
}

function dismissSellerNotice() {
  const banner = document.getElementById('sellerAdminNoticeBanner');
  if (banner) banner.classList.add('hidden');
}

function restoreSellerNotice() {
  const banner = document.getElementById('sellerAdminNoticeBanner');
  if (banner) banner.classList.remove('hidden');
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderAiPhpCodeUI() {
  updateSnippetCodeAndSimulator();

  // Attach live event listeners to input fields
  const ids = ['input-notice-title', 'input-notice-content', 'select-notice-style', 'input-widget-title', 'input-widget-content'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el._hasLiveListener) {
      el.addEventListener('input', updateSnippetCodeAndSimulator);
      el.addEventListener('change', updateSnippetCodeAndSimulator);
      el._hasLiveListener = true;
    }
  });
}

function renderSellerProducts() {
  const tbody = document.getElementById('sellerProductTable');
  if (!tbody) return;

  const countEl = document.getElementById('sellerProductsCount');
  if (countEl) countEl.textContent = productsData.length;

  tbody.innerHTML = productsData.map(p => `
    <tr class="hover:bg-slate-50 transition">
      <td class="p-3">
        <div class="flex items-center gap-3">
          <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover border border-slate-200" />
          <span class="font-bold text-slate-800 line-clamp-1 max-w-xs">${p.name}</span>
        </div>
      </td>
      <td class="p-3 text-slate-500">${p.categoryName || p.category}</td>
      <td class="p-3 font-bold text-[#ee4d2d]">${formatVND(p.price)}</td>
      <td class="p-3 font-extrabold text-slate-900">${p.soldCount ? p.soldCount.toLocaleString('vi-VN') : 0}</td>
      <td class="p-3 font-bold text-amber-500">⭐ ${p.rating ? p.rating.toFixed(1) : '5.0'}</td>
      <td class="p-3 font-semibold">${p.stock || 100}</td>
      <td class="p-3 text-slate-500">
        <div>Size: ${p.sizes ? p.sizes.length : 0}</div>
        <div>Màu: ${p.colors ? p.colors.length : 0}</div>
      </td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded ${p.isMall ? 'bg-red-100 text-red-700 font-bold' : 'bg-slate-100 text-slate-500'}">
          ${p.isMall ? 'Mall' : 'Thường'}
        </span>
      </td>
      <td class="p-3 text-right space-x-2">
        <button onclick="editSellerProduct('${p.id}')" class="text-blue-600 font-bold hover:underline cursor-pointer">Sửa</button>
        <button onclick="deleteSellerProduct('${p.id}')" class="text-red-500 font-bold hover:underline cursor-pointer">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function renderSellerOrders() {
  const container = document.getElementById('sellerOrdersContainer');
  if (!container) return;

  const pendingCount = sellerOrdersData.filter(o => o.status === 'pending').length;
  const badge = document.getElementById('txtOrderTabBadge');
  const count = document.getElementById('sellerOrdersCount');
  if (badge) badge.textContent = sellerOrdersData.length;
  if (count) count.textContent = pendingCount + " Đơn Mới";

  if (sellerOrdersData.length === 0) {
    container.innerHTML = '<div class="py-12 text-center text-slate-400 font-medium">Chưa có đơn hàng nào trong hệ thống.</div>';
    return;
  }

  container.innerHTML = sellerOrdersData.map(o => {
    const isWalletOrTransfer = o.paymentMethod && (o.paymentMethod.includes('Ví') || o.paymentMethod.includes('Bank') || o.paymentMethod.includes('Chuyển khoản') || o.originalPaymentMethod?.includes('Ví') || o.originalPaymentMethod?.includes('Bank'));
    const isCodConverted = o.convertedToCod || (o.paymentMethod && o.paymentMethod.toLowerCase().includes('chuyển từ ví'));

    return `
      <div class="p-4 rounded-xl ${isCodConverted ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-200' : 'bg-slate-50 border-slate-200'} border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs transition">
        <div class="space-y-1.5 flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-black text-slate-900">#${o.id}</span>
            ${getSellerStatusBadge(o.status)}
            <span class="text-slate-400 text-[11px]">${o.time}</span>
            
            ${isCodConverted ? `
              <span class="bg-gradient-to-r from-amber-500 to-[#ee4d2d] text-white font-black px-2 py-0.5 rounded-md text-[10px] inline-flex items-center gap-1 shadow-2xs">
                <span>🚚</span> <span>ĐÃ CHUYỂN SHIP COD (Chưa thấy tiền ví)</span>
              </span>
            ` : (isWalletOrTransfer && !o.paymentConfirmed ? `
              <span class="bg-purple-100 text-purple-900 border border-purple-300 font-extrabold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1 shadow-2xs">
                <span>💳</span> <span>Khách chọn ${o.paymentMethod}</span>
              </span>
            ` : (o.paymentConfirmed ? `
              <span class="bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                <span>✅</span> <span>Đã nhận đủ tiền TK</span>
              </span>
            ` : ''))}
          </div>

          <p class="text-xs text-slate-700">Khách hàng: <b>${o.customerName}</b> • SĐT: <b>${o.phone}</b></p>
          
          <p class="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 leading-relaxed">
            📍 <b>Địa chỉ giao hàng:</b> ${o.fullAddress || "Chưa cập nhật địa chỉ"}
          </p>

          <p class="text-xs font-bold text-slate-800">🛒 Sản phẩm: ${o.productInfo}</p>

          ${isCodConverted ? `
            <div class="p-2.5 bg-amber-100/90 text-amber-950 rounded-lg border border-amber-300 text-[11px] font-semibold flex items-center gap-2">
              <span class="text-base shrink-0">⚠️</span>
              <div>
                <b>Lưu ý thu tiền khi giao:</b> Khách chọn thanh toán qua ví nhưng shop chưa thấy tiền về tài khoản ngân hàng. Đã chuyển sang Ship COD. Bưu tá cần thu <b>${formatVND(o.amount)}</b> tiền mặt khi giao hàng tận nơi.
              </div>
            </div>
          ` : (isWalletOrTransfer && !o.paymentConfirmed ? `
            <div class="p-2 bg-purple-50/80 text-purple-900 rounded-lg border border-purple-200 text-[11px] flex items-center justify-between gap-2">
              <span class="flex items-center gap-1.5 font-medium">
                <span>ℹ️</span>
                <span>Khách chọn thanh toán <b>${o.paymentMethod}</b>. Nếu shop kiểm tra tài khoản chưa thấy tiền về, bấm <b>"Chuyển sang Ship COD"</b> để giao thu tiền mặt.</span>
              </span>
            </div>
          ` : '')}
        </div>

        <div class="flex flex-col sm:items-end justify-between gap-2.5 border-t sm:border-0 pt-2 sm:pt-0 shrink-0">
          <div class="text-left sm:text-right">
            <span class="font-black text-[#ee4d2d] text-base block leading-tight">${formatVND(o.amount)}</span>
            <span class="text-[11px] ${isCodConverted ? 'text-amber-800 font-extrabold' : 'text-slate-500'} font-medium">
              ${o.paymentMethod || 'COD'}
            </span>
          </div>

          <!-- Action buttons for Seller -->
          <div class="flex items-center gap-1.5 flex-wrap justify-end">
            ${isWalletOrTransfer && !isCodConverted ? `
              <!-- Nút chuyển sang ship COD nếu không thấy tiền về tài khoản -->
              <button 
                type="button"
                onclick="switchOrderToCod('${o.id}')" 
                title="Khách chọn ví nhưng chưa nhận được tiền về tài khoản? Bấm để chuyển sang bưu tá thu COD tận nơi" 
                class="px-3 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-[#ee4d2d] hover:opacity-95 text-white font-black text-xs rounded-lg transition cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95 border border-orange-600"
              >
                <span>🔄</span>
                <span>Chuyển sang Ship COD</span>
              </button>

              <button 
                type="button"
                onclick="confirmOrderPayment('${o.id}')" 
                title="Đã kiểm tra tài khoản ngân hàng và thấy tiền về? Bấm xác nhận đã nhận tiền" 
                class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow-2xs flex items-center gap-1 shrink-0 active:scale-95"
              >
                <span>✅ Đã nhận tiền</span>
              </button>
            ` : (isCodConverted ? `
              <button 
                type="button"
                onclick="revertOrderPayment('${o.id}')" 
                title="Nếu khách gửi bằng chứng đã chuyển tiền ví/ngân hàng thành công, bấm để hoàn tác lại thanh toán ví" 
                class="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>↩️ Hoàn tác về Ví</span>
              </button>
            ` : '')}

            <select onchange="updateOrderStatus('${o.id}', this.value)" class="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-[#ee4d2d]">
              <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>⏳ 1. Chờ xác nhận</option>
              <option value="packing" ${o.status === 'packing' ? 'selected' : ''}>📦 2. Shop đóng gói</option>
              <option value="shipping" ${o.status === 'shipping' ? 'selected' : ''}>🚚 3. Đang giao hàng</option>
              <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>✅ 4. Giao thành công</option>
              <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ Hủy đơn hàng</option>
            </select>

            <button onclick="deleteOrder('${o.id}')" title="Xóa đơn hàng" class="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 font-bold text-xs rounded-lg transition cursor-pointer">
              🗑️
            </button>
          </div>

        </div>
      </div>
    `;
  }).join('');
}

function getSellerStatusBadge(status) {
  switch (status) {
    case 'pending': return `<span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">Chờ xác nhận</span>`;
    case 'packing': return `<span class="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">Đang đóng gói</span>`;
    case 'shipping': return `<span class="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">Đang giao hàng</span>`;
    case 'delivered': return `<span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Giao thành công</span>`;
    case 'cancelled': return `<span class="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">Đã hủy</span>`;
    default: return `<span class="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">Chờ xử lý</span>`;
  }
}

function updateOrderStatus(orderId, newStatus) {
  const order = sellerOrdersData.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    renderSellerOrders();
    const modal = document.getElementById('buyerOrdersModal');
    if (modal && !modal.classList.contains('hidden')) {
      renderBuyerOrdersList();
    }
  }
}

function switchOrderToCod(orderId) {
  const order = sellerOrdersData.find(o => o.id === orderId);
  if (!order) return;
  const isConfirmed = confirm(
    `⚠️ CHUYỂN SANG SHIP COD:\n\nBạn chưa thấy tiền thanh toán về tài khoản từ khách cho đơn hàng #${orderId} (${formatVND(order.amount)})?\n\nBạn có muốn chuyển đơn này sang hình thức "Ship COD (Thu tiền tận nơi khi nhận)" để bưu tá thu tiền trực tiếp khi giao hàng không?`
  );
  if (isConfirmed) {
    order.originalPaymentMethod = order.originalPaymentMethod || order.paymentMethod;
    order.paymentMethod = "Ship COD (Chuyển từ ví do chưa nhận được tiền)";
    order.convertedToCod = true;
    order.isCod = true;
    order.paymentConfirmed = false;
    order.convertedAt = new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}) + ' ' + new Date().toLocaleDateString('vi-VN');
    order.paymentStatusNote = "Chưa thấy tiền về tài khoản, chuyển giao hàng thu COD tận nơi.";

    renderSellerOrders();
    const modal = document.getElementById('buyerOrdersModal');
    if (modal && !modal.classList.contains('hidden')) {
      renderBuyerOrdersList();
    }
    showAiToast(`🚚 Đã chuyển đơn hàng #${orderId} sang hình thức Ship COD thành công!`);
    alert(`✅ ĐÃ CHUYỂN SANG SHIP COD THÀNH CÔNG!\n\nĐơn hàng #${orderId} đã được cập nhật sang hình thức giao hàng thu tiền tận nơi. Bưu tá giao hàng sẽ thu ${formatVND(order.amount)} tiền mặt từ người nhận.`);
  }
}

function confirmOrderPayment(orderId) {
  const order = sellerOrdersData.find(o => o.id === orderId);
  if (!order) return;
  if (confirm(`Xác nhận đã kiểm tra tài khoản ngân hàng và nhận đủ tiền ${formatVND(order.amount)} cho đơn hàng #${orderId}?`)) {
    order.paymentConfirmed = true;
    order.convertedToCod = false;
    order.paymentStatusNote = "Đã nhận đủ tiền vào tài khoản ngân hàng.";
    renderSellerOrders();
    const modal = document.getElementById('buyerOrdersModal');
    if (modal && !modal.classList.contains('hidden')) {
      renderBuyerOrdersList();
    }
    showAiToast(`✅ Đã xác nhận nhận đủ tiền cho đơn hàng #${orderId}!`);
  }
}

function revertOrderPayment(orderId) {
  const order = sellerOrdersData.find(o => o.id === orderId);
  if (!order) return;
  if (confirm(`Hoàn tác đơn hàng #${orderId} về phương thức thanh toán ban đầu (${order.originalPaymentMethod || 'Ví VIETPay'})?`)) {
    order.paymentMethod = order.originalPaymentMethod || "Ví VIETPay";
    order.convertedToCod = false;
    order.isCod = false;
    order.paymentStatusNote = "";
    renderSellerOrders();
    const modal = document.getElementById('buyerOrdersModal');
    if (modal && !modal.classList.contains('hidden')) {
      renderBuyerOrdersList();
    }
    showAiToast(`↩️ Đã hoàn tác đơn hàng #${orderId} về ${order.paymentMethod}!`);
  }
}

function deleteOrder(orderId) {
  if (confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderId} khỏi danh sách?`)) {
    sellerOrdersData = sellerOrdersData.filter(o => o.id !== orderId);
    renderSellerOrders();
  }
}

function updateProductImgPreview(slot) {
  const input = document.getElementById('formImg' + slot);
  const thumb = document.getElementById('formImgThumb' + slot);
  const placeholder = document.getElementById('formImgPlaceholder' + slot);
  if (!input || !thumb || !placeholder) return;
  const val = input.value.trim();
  if (val) {
    thumb.src = val;
    thumb.classList.remove('hidden');
    placeholder.classList.add('hidden');
  } else {
    thumb.src = '';
    thumb.classList.add('hidden');
    placeholder.classList.remove('hidden');
  }
}

function clearProductImgSlot(slot) {
  const input = document.getElementById('formImg' + slot);
  if (input) input.value = '';
  const fileInput = document.getElementById('formImgFile' + slot);
  if (fileInput) fileInput.value = '';
  updateProductImgPreview(slot);
}

async function handleProductSingleImageUpload(slot, event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const rawDataUrl = e.target.result;
      const resizedDataUrl = await resizeImageForBanner(rawDataUrl, 1200, 0.85);
      const input = document.getElementById('formImg' + slot);
      if (input) {
        input.value = resizedDataUrl;
        updateProductImgPreview(slot);
      }
      showAiToast(`📸 Đã tải ảnh từ máy vào Ảnh ${slot} (${file.name})!`);
    } catch (err) {
      console.error(err);
      const input = document.getElementById('formImg' + slot);
      if (input) {
        input.value = e.target.result;
        updateProductImgPreview(slot);
      }
    }
  };
  reader.readAsDataURL(file);
}

async function handleProductBatchImagesUpload(event) {
  const files = Array.from(event.target.files || []).slice(0, 4);
  if (files.length === 0) return;

  let loaded = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const slot = i + 1;
    await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const rawDataUrl = e.target.result;
          const resizedDataUrl = await resizeImageForBanner(rawDataUrl, 1200, 0.85);
          const input = document.getElementById('formImg' + slot);
          if (input) {
            input.value = resizedDataUrl;
            updateProductImgPreview(slot);
          }
          loaded++;
        } catch (err) {
          const input = document.getElementById('formImg' + slot);
          if (input) {
            input.value = e.target.result;
            updateProductImgPreview(slot);
          }
          loaded++;
        }
        resolve();
      };
      reader.onerror = resolve;
      reader.readAsDataURL(file);
    });
  }
  showAiToast(`📸 Đã tải ${loaded} ảnh từ máy vào biểu mẫu sản phẩm!`);
}

function handleProductVideoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const blobUrl = URL.createObjectURL(file);

  const videoInput = document.getElementById('formVideo');
  if (videoInput) {
    videoInput.value = blobUrl;
  }

  const box = document.getElementById('formVideoPreviewBox');
  const player = document.getElementById('formVideoPlayer');
  const status = document.getElementById('formVideoStatusText');
  const sizeText = document.getElementById('formVideoSizeText');

  if (box && player) {
    player.src = blobUrl;
    player.load();
    box.classList.remove('hidden');
    if (status) status.innerHTML = `📹 <b>${file.name}</b>`;
    if (sizeText) sizeText.textContent = `${sizeMb} MB (từ máy)`;
  }
  showAiToast(`🎬 Đã thêm video từ máy: ${file.name}!`);
}

function updateProductVideoPreview() {
  const videoInput = document.getElementById('formVideo');
  const box = document.getElementById('formVideoPreviewBox');
  const player = document.getElementById('formVideoPlayer');
  const status = document.getElementById('formVideoStatusText');
  const sizeText = document.getElementById('formVideoSizeText');

  if (!videoInput || !box || !player) return;
  const val = videoInput.value.trim();
  if (val) {
    player.src = val;
    player.load();
    box.classList.remove('hidden');
    if (status) status.textContent = '▶ Video xem trước';
    if (sizeText) sizeText.textContent = '';
  } else {
    player.pause();
    player.src = '';
    box.classList.add('hidden');
  }
}

function clearProductVideo() {
  const videoInput = document.getElementById('formVideo');
  if (videoInput) videoInput.value = '';
  const fileInput = document.getElementById('formVideoFileInput');
  if (fileInput) fileInput.value = '';
  const box = document.getElementById('formVideoPreviewBox');
  const player = document.getElementById('formVideoPlayer');
  if (player) {
    player.pause();
    player.src = '';
  }
  if (box) box.classList.add('hidden');
}

function openAddProductModal() {
  document.getElementById('sellerProductForm').reset();
  document.getElementById('formProductId').value = '';
  document.getElementById('formSoldCount').value = '1200';
  document.getElementById('formRating').value = '4.9';
  
  document.getElementById('formRevName1').value = 'Hoàng Nam';
  document.getElementById('formRevComment1').value = 'Giao hàng siêu nhanh, đóng gói cẩn thận. Sản phẩm giống y như hình mô tả!';
  document.getElementById('formRevName2').value = 'Phương Thảo';
  document.getElementById('formRevComment2').value = 'Chất lượng tuyệt vời trong tầm giá. Shop tư vấn nhiệt tình 10/10!';

  // Reset image preview slots & video
  for (let i = 1; i <= 4; i++) {
    clearProductImgSlot(i);
  }
  clearProductVideo();

  document.getElementById('sellerModalTitle').textContent = '➕ Đăng Sản Phẩm Mới Vào Gian Hàng';
  document.getElementById('sellerProductModal')?.classList.remove('hidden');
}

function closeSellerModal() {
  document.getElementById('sellerProductModal')?.classList.add('hidden');
}

function editSellerProduct(id) {
  const p = productsData.find(x => x.id === id);
  if (!p) return;

  document.getElementById('formProductId').value = p.id;
  document.getElementById('formName').value = p.name;
  document.getElementById('formCategory').value = p.category;
  document.getElementById('formStock').value = p.stock || 100;
  document.getElementById('formSoldCount').value = p.soldCount !== undefined ? p.soldCount : 1200;
  document.getElementById('formRating').value = p.rating !== undefined ? p.rating : 4.9;

  const revs = p.reviews || [];
  document.getElementById('formRevName1').value = revs[0]?.name || '';
  document.getElementById('formRevComment1').value = revs[0]?.comment || '';
  document.getElementById('formRevName2').value = revs[1]?.name || '';
  document.getElementById('formRevComment2').value = revs[1]?.comment || '';

  document.getElementById('formPrice').value = p.price;
  document.getElementById('formOrigPrice').value = p.originalPrice || '';
  
  const imgs = p.gallery || [p.image];
  document.getElementById('formImg1').value = imgs[0] || p.image || '';
  document.getElementById('formImg2').value = imgs[1] || '';
  document.getElementById('formImg3').value = imgs[2] || '';
  document.getElementById('formImg4').value = imgs[3] || '';
  for (let i = 1; i <= 4; i++) {
    updateProductImgPreview(i);
  }
  
  document.getElementById('formVideo').value = p.videoUrl || '';
  updateProductVideoPreview();

  document.getElementById('formSizes').value = p.sizes ? p.sizes.join(', ') : '';
  document.getElementById('formColors').value = p.colors ? p.colors.join(', ') : '';

  document.getElementById('formDesc').value = p.description || '';
  document.getElementById('formIsMall').checked = !!p.isMall;
  document.getElementById('formIsFlash').checked = !!p.isFlashSale;

  document.getElementById('sellerModalTitle').textContent = '✏️ Chỉnh Sửa Thông Tin Sản Phẩm';
  document.getElementById('sellerProductModal')?.classList.remove('hidden');
}

function deleteSellerProduct(id) {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho hàng?')) {
    productsData = productsData.filter(x => x.id !== id);
    renderSellerProducts();
    renderProducts();
  }
}

function handleSaveSellerProduct(e) {
  e.preventDefault();
  const id = document.getElementById('formProductId').value;
  const name = document.getElementById('formName').value;
  const category = document.getElementById('formCategory').value;
  const catObj = categoriesList.find(c => c.id === category);
  const categoryName = catObj ? catObj.name : 'Khác';
  const stock = parseInt(document.getElementById('formStock').value, 10);
  const soldCount = parseInt(document.getElementById('formSoldCount').value, 10) || 0;
  const rating = parseFloat(document.getElementById('formRating').value) || 5.0;

  const rName1 = document.getElementById('formRevName1').value.trim();
  const rComment1 = document.getElementById('formRevComment1').value.trim();
  const rName2 = document.getElementById('formRevName2').value.trim();
  const rComment2 = document.getElementById('formRevComment2').value.trim();

  const reviews = [];
  if (rName1 && rComment1) reviews.push({ name: rName1, comment: rComment1 });
  if (rName2 && rComment2) reviews.push({ name: rName2, comment: rComment2 });

  const price = parseFloat(document.getElementById('formPrice').value);
  const originalPrice = parseFloat(document.getElementById('formOrigPrice').value) || price;
  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  const img1 = document.getElementById('formImg1').value;
  const img2 = document.getElementById('formImg2').value;
  const img3 = document.getElementById('formImg3').value;
  const img4 = document.getElementById('formImg4').value;
  const gallery = [img1, img2, img3, img4].filter(x => x.trim().length > 0);
  
  const videoUrl = document.getElementById('formVideo').value.trim();

  const sizesRaw = document.getElementById('formSizes').value;
  const sizes = sizesRaw ? sizesRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  const colorsRaw = document.getElementById('formColors').value;
  const colors = colorsRaw ? colorsRaw.split(',').map(c => c.trim()).filter(Boolean) : [];

  const description = document.getElementById('formDesc').value;
  const isMall = document.getElementById('formIsMall').checked;
  const isFlashSale = document.getElementById('formIsFlash').checked;

  if (id) {
    const p = productsData.find(x => x.id === id);
    if (p) {
      Object.assign(p, { name, category, categoryName, stock, soldCount, rating, reviews, price, originalPrice, discountPercent, image: img1, gallery, videoUrl, sizes, colors, description, isMall, isFlashSale });
    }
  } else {
    const newProduct = {
      id: 'sp-' + Date.now(),
      name,
      category,
      categoryName,
      stock,
      soldCount,
      rating,
      reviews,
      price,
      originalPrice,
      discountPercent,
      image: img1,
      gallery,
      videoUrl,
      sizes,
      colors,
      description,
      isMall,
      isFlashSale
    };
    productsData.unshift(newProduct);
  }

  closeSellerModal();
  renderSellerProducts();
  renderProducts();
  alert('Đã lưu thông tin sản phẩm và đánh giá thành công!');
}

function populateCustomizerForm() {
  document.getElementById('cfgBrandTitle').value = siteConfig.brandTitle;
  document.getElementById('cfgTopAnnouncement').value = siteConfig.topAnnouncement;
  document.getElementById('cfgHeroTitle').value = siteConfig.heroTitle;
  document.getElementById('cfgHeroSubtitle').value = siteConfig.heroSubtitle;
  document.getElementById('cfgSearchBtn').value = siteConfig.searchBtn;
  document.getElementById('cfgCartBtn').value = siteConfig.cartBtn;
  document.getElementById('cfgHotline').value = siteConfig.hotline;

  if (document.getElementById('cfgBankName')) document.getElementById('cfgBankName').value = siteConfig.bankName || '';
  if (document.getElementById('cfgBankAccount')) document.getElementById('cfgBankAccount').value = siteConfig.bankAccount || '';
  if (document.getElementById('cfgAccountHolder')) document.getElementById('cfgAccountHolder').value = siteConfig.accountHolder || '';
  if (document.getElementById('cfgCustomQrUrl')) document.getElementById('cfgCustomQrUrl').value = siteConfig.customQrUrl || '';
  if (document.getElementById('cfgGeminiApiKey')) document.getElementById('cfgGeminiApiKey').value = siteConfig.geminiApiKey || '';
}

function handleSaveCustomTexts(e) {
  e.preventDefault();
  siteConfig.brandTitle = document.getElementById('cfgBrandTitle').value;
  siteConfig.topAnnouncement = document.getElementById('cfgTopAnnouncement').value;
  siteConfig.heroTitle = document.getElementById('cfgHeroTitle').value;
  siteConfig.heroSubtitle = document.getElementById('cfgHeroSubtitle').value;
  siteConfig.searchBtn = document.getElementById('cfgSearchBtn').value;
  siteConfig.cartBtn = document.getElementById('cfgCartBtn').value;
  siteConfig.hotline = document.getElementById('cfgHotline').value;

  siteConfig.bankName = document.getElementById('cfgBankName').value.trim() || "MB Bank";
  siteConfig.bankAccount = document.getElementById('cfgBankAccount').value.trim() || "0912345678";
  siteConfig.accountHolder = document.getElementById('cfgAccountHolder').value.trim() || "VIETSHOP OFFICIAL";
  siteConfig.customQrUrl = document.getElementById('cfgCustomQrUrl').value.trim();

  heroBanners[0].title = siteConfig.heroTitle;
  heroBanners[0].subtitle = siteConfig.heroSubtitle;

  document.getElementById('txtBrandTitle').textContent = siteConfig.brandTitle;
  document.getElementById('txtTopAnnouncement').textContent = siteConfig.topAnnouncement;
  document.getElementById('heroTitle').textContent = siteConfig.heroTitle;
  document.getElementById('heroSubtitle').textContent = siteConfig.heroSubtitle;
  document.getElementById('txtSearchBtn').textContent = siteConfig.searchBtn;
  document.getElementById('txtCartBtn').textContent = siteConfig.cartBtn;
  document.getElementById('txtHotlineValue').textContent = siteConfig.hotline;

  alert('🎨 Đã cập nhật giao diện & thông tin tài khoản nhận tiền thành công!');
}

setInterval(() => {
  const secEl = document.getElementById('secondsTimer');
  if (secEl) {
    let sec = parseInt(secEl.textContent, 10);
    sec = sec <= 0 ? 59 : sec - 1;
    secEl.textContent = sec.toString().padStart(2, '0');
  }
}, 1000);

/* ==========================================================================
   VISUAL IN-PLACE TEXT EDITOR ENGINE (CHỈNH SỬA CHỮ TRỰC TIẾP TRÊN TRANG)
   ========================================================================== */

let isVisualTextEditModeActive = false;
let currentVteElement = null;
let currentVteSelector = '';
let currentVteHoveredElement = null;
let isVtePanelMinimized = false;
const VTE_STORAGE_KEY = 'vietshop_custom_text_styles_v1';
let customTextStyles = {};

// Helper: Load saved styles from localStorage
function loadCustomTextStyles() {
  try {
    const raw = localStorage.getItem(VTE_STORAGE_KEY);
    if (raw) {
      customTextStyles = JSON.parse(raw);
    } else {
      customTextStyles = {};
    }
  } catch (e) {
    console.error('Lỗi khi tải customTextStyles:', e);
    customTextStyles = {};
  }
}

// Helper: Save styles to localStorage
function saveCustomTextStylesToStorage() {
  try {
    localStorage.setItem(VTE_STORAGE_KEY, JSON.stringify(customTextStyles));
  } catch (e) {
    console.error('Lỗi khi lưu customTextStyles:', e);
  }
}

// RGB to Hex helper
function rgbToHex(rgb) {
  if (!rgb) return '#000000';
  if (rgb.startsWith('#')) return rgb;
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return '#000000';
  const r = parseInt(match[0], 10).toString(16).padStart(2, '0');
  const g = parseInt(match[1], 10).toString(16).padStart(2, '0');
  const b = parseInt(match[2], 10).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

// Check if element belongs to internal UI that shouldn't be edited
function isInternalEditorElement(el) {
  if (!el) return true;
  return !!(
    el.closest('#visualTextEditorToolbar') ||
    el.closest('#textCustomizerPanel') ||
    el.closest('#vteHintBadge') ||
    el.closest('#vteGlobalTenClickBadge') ||
    el.closest('#vteProductMenuModal') ||
    el.closest('#sellerProductModal') ||
    el.closest('#aiToast') ||
    el.closest('#pinModal') ||
    el.closest('#changePinModal') ||
    el.closest('#aiChatFloatBtn') ||
    el.closest('#aiChatFloatModal') ||
    el.closest('#authModal') ||
    el.closest('#buyerAuthModal')
  );
}

// Compute deterministic CSS selector for element
function getElementVteSelector(el) {
  if (!el) return '';
  if (el.id) return '#' + el.id;
  if (el === document.body) return 'body';

  const path = [];
  let curr = el;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    if (curr.id) {
      path.unshift('#' + curr.id);
      break;
    }
    const parent = curr.parentNode;
    if (!parent) break;
    let siblingIndex = 1;
    for (let i = 0; i < parent.children.length; i++) {
      const sibling = parent.children[i];
      if (sibling === curr) {
        path.unshift(`${curr.tagName.toLowerCase()}:nth-child(${siblingIndex})`);
        break;
      }
      if (sibling.tagName === curr.tagName) {
        siblingIndex++;
      }
    }
    curr = parent;
  }
  return path.join(' > ');
}

// Friendly description for target element
function getElementDescription(el) {
  if (!el) return 'Chưa chọn phần tử nào';
  const tag = el.tagName.toLowerCase();
  let desc = `<${tag}>`;
  if (el.id) {
    desc += ` #${el.id}`;
  }
  const preview = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').substring(0, 35);
  if (preview) {
    desc += ` : "${preview}${preview.length >= 35 ? '...' : ''}"`;
  }
  return desc;
}

// Apply text safely to element without removing structural icons where possible
function applyTextSafely(el, newText) {
  if (!el) return;
  if (el.children.length === 0) {
    el.textContent = newText;
    return;
  }
  let textNode = null;
  for (let i = 0; i < el.childNodes.length; i++) {
    const node = el.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
      textNode = node;
      break;
    }
  }
  if (textNode) {
    textNode.nodeValue = newText;
  } else {
    // If element contains span or children, update the text-holding span without touching icon
    const spans = el.querySelectorAll('span');
    if (spans.length > 0) {
      let targetSpan = spans[spans.length - 1];
      for (let s of spans) {
        if (s.id || s.textContent.trim().length > 1) {
          targetSpan = s;
          break;
        }
      }
      targetSpan.textContent = newText;
    } else {
      el.innerText = newText;
    }
  }
}

// Global highlight and click handlers
let vteClickTarget = null;
let vteClickCount = 0;
let vteClickTimer = null;

function resolveVteTextTarget(rawTarget) {
  if (!rawTarget) return null;
  let el = rawTarget.nodeType === 3 ? rawTarget.parentElement : rawTarget;
  if (!el || isInternalEditorElement(el)) return null;

  // Don't select the body or whole buyer page container on empty space clicks
  if (el === document.body || el === document.documentElement || el.id === 'buyerPage') {
    return null;
  }

  // If clicked an icon or inline media, resolve to its container
  if (el.tagName === 'I' || el.tagName === 'svg' || el.tagName === 'path') {
    const parent = el.closest('button, a, span, p, h1, h2, h3, h4, h5, h6, div, li');
    if (parent && !isInternalEditorElement(parent)) el = parent;
  }
  return el;
}

function isSameVteTarget(el1, el2) {
  if (!el1 || !el2) return false;
  if (el1 === el2) return true;
  if (el1.contains(el2) || el2.contains(el1)) return true;
  const common = el1.closest('button, a, h1, h2, h3, h4, h5, h6, p, li, [id]');
  if (common && common === el2.closest('button, a, h1, h2, h3, h4, h5, h6, p, li, [id]')) {
    return true;
  }
  return false;
}

function showVteHintBadge(target, alreadyOpened = false, count = 1) {
  hideVteHintBadge();
}

function openCurrentTargetEditor() {
  const el = currentVteElement || vteClickTarget;
  if (el) {
    hideVteHintBadge();
    openEditorForTargetElement(el);
  }
}

function hideVteHintBadge() {
  const badge = document.getElementById('vteHintBadge');
  if (badge) {
    badge.style.display = 'none';
  }
}

function handleVtePointerOver(e) {
  if (!isVisualTextEditModeActive) return;
  const target = resolveVteTextTarget(e.target);
  if (!target || target === currentVteElement) return;

  if (currentVteHoveredElement && currentVteHoveredElement !== target && currentVteHoveredElement !== currentVteElement) {
    currentVteHoveredElement.style.outline = '';
    currentVteHoveredElement.style.outlineOffset = '';
  }

  currentVteHoveredElement = target;
  target.style.outline = '2px dashed #3b82f6';
  target.style.outlineOffset = '2px';
  target.style.cursor = 'pointer';
}

function handleVtePointerOut(e) {
  if (!isVisualTextEditModeActive) return;
  const target = resolveVteTextTarget(e.target);
  if (target && target === currentVteHoveredElement && target !== currentVteElement) {
    target.style.outline = '';
    target.style.outlineOffset = '';
    target.style.cursor = '';
    currentVteHoveredElement = null;
  }
}

function handleVteClick(e) {
  if (!isVisualTextEditModeActive) return;
  if (isInternalEditorElement(e.target)) return;

  const target = resolveVteTextTarget(e.target);
  if (!target) return;

  // Intercept normal click so link or button doesn't navigate
  e.preventDefault();
  e.stopPropagation();

  // If the editor panel is ALREADY open, single click switches to this element immediately!
  const panel = document.getElementById('textCustomizerPanel');
  const isPanelOpen = panel && !panel.classList.contains('hidden');
  if (isPanelOpen) {
    selectVteElement(target, true);
    return;
  }

  // Check if this is consecutive click on the same text/block
  const isSame = isSameVteTarget(target, vteClickTarget) || (currentVteElement && isSameVteTarget(target, currentVteElement));

  if (isSame) {
    vteClickCount++;
  } else {
    vteClickTarget = target;
    vteClickCount = 1;
  }

  if (vteClickTimer) {
    clearTimeout(vteClickTimer);
  }

  highlightTargetOnFirstClick(target, vteClickCount);

  // ĐÃ NHẤP ĐỦ 10 LẦN -> MỞ BẢNG SỬA CHỮ NGAY LẬP TỨC (KHÔNG HIỆN THÔNG BÁO)
  if (vteClickCount >= 10) {
    vteClickCount = 0;
    vteClickTarget = null;
    openEditorForTargetElement(target);
    return;
  }

  // Cho phép người dùng nhấp tiếp để đủ 10 lần trong vòng 4.5 giây
  vteClickTimer = setTimeout(() => {
    vteClickCount = 0;
    vteClickTarget = null;
    if (currentVteElement && !isPanelOpen) {
      currentVteElement.style.outline = '';
      currentVteElement.style.outlineOffset = '';
      currentVteElement = null;
    }
  }, 4500);
}

function handleVteDblClick(e) {
  if (!isVisualTextEditModeActive) return;
  if (isInternalEditorElement(e.target)) return;

  const target = resolveVteTextTarget(e.target);
  if (!target) return;

  e.preventDefault();
  e.stopPropagation();

  vteClickCount = 0;
  vteClickTarget = null;
  if (vteClickTimer) clearTimeout(vteClickTimer);

  openEditorForTargetElement(target);
}

function highlightTargetOnFirstClick(target, count = 1) {
  if (currentVteElement && currentVteElement !== target) {
    currentVteElement.style.outline = '';
    currentVteElement.style.outlineOffset = '';
  }
  currentVteElement = target;
  target.style.outline = '2px dashed #f97316';
  target.style.outlineOffset = '2px';

  // Preview element in memory but DO NOT OPEN the editor panel yet
  selectVteElement(target, false);
}

// =========================================================================
// TÍNH NĂNG TOÀN TRANG: NHẤP 10 LẦN VÀO BẤT KỲ CHỮ NÀO ĐỂ MỞ BẢNG SỬA CHỮ
// (Kể cả khi đang ở chế độ xem mua hàng bình thường - không hiện thông báo/bảng quản trị)
// =========================================================================
let globalTenClickTarget = null;
let globalTenClickCount = 0;
let globalTenClickTimer = null;

function handleGlobalTenClick(e) {
  // Nếu đã ở trong chế độ chỉnh sửa chữ chuyên sâu, handleVteClick sẽ xử lý
  if (isVisualTextEditModeActive) return;

  // Bỏ qua nếu nhấp vào bảng sửa chữ hoặc các ô nhập liệu
  if (isInternalEditorElement(e.target)) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

  const target = resolveVteTextTarget(e.target);
  if (!target) return;

  const isSame = isSameVteTarget(target, globalTenClickTarget);
  if (isSame) {
    globalTenClickCount++;
  } else {
    globalTenClickTarget = target;
    globalTenClickCount = 1;
  }

  if (globalTenClickTimer) {
    clearTimeout(globalTenClickTimer);
  }

  // KHI ĐÃ NHẤP ĐỦ 10 LẦN VÀO CHỮ: MỞ THẲNG BẢNG SỬA CHỮ
  if (globalTenClickCount >= 10) {
    e.preventDefault();
    e.stopPropagation();

    const clickedTarget = target;
    globalTenClickCount = 0;
    globalTenClickTarget = null;

    // 1. Kích hoạt chế độ sửa chữ ngầm (hoàn toàn không hiện thanh quản trị)
    startVisualTextEditorMode();
    // 2. Mở bảng sửa chữ cho chính đoạn chữ vừa nhấp 10 lần!
    openEditorForTargetElement(clickedTarget);
    return;
  }

  // Tự động reset bộ đếm sau 4.5 giây nếu người dùng dừng nhấp
  globalTenClickTimer = setTimeout(() => {
    globalTenClickCount = 0;
    globalTenClickTarget = null;
  }, 4500);
}

function showGlobalTenClickBadge(target, count) {
  hideGlobalTenClickBadge();
}

function triggerTenClickOpenNow() {
  const el = globalTenClickTarget;
  hideGlobalTenClickBadge();
  globalTenClickCount = 0;
  globalTenClickTarget = null;
  if (globalTenClickTimer) clearTimeout(globalTenClickTimer);
  if (el) {
    startVisualTextEditorMode();
    openEditorForTargetElement(el);
  }
}

function hideGlobalTenClickBadge() {
  const badge = document.getElementById('vteGlobalTenClickBadge');
  if (badge) badge.style.display = 'none';
}

// Product Edit Menu Functions
let currentVteProductTarget = null;

function openVteProductMenu(id, clickedEl = null) {
  const p = productsData.find(x => x.id === id);
  if (!p) {
    showAiToast('❌ Không tìm thấy thông tin sản phẩm này!');
    return;
  }

  currentVteProductTarget = { id, el: clickedEl, product: p };

  const modal = document.getElementById('vteProductMenuModal');
  if (!modal) return;

  const imgEl = document.getElementById('vteProdMenuImg');
  const catEl = document.getElementById('vteProdMenuCategory');
  const nameEl = document.getElementById('vteProdMenuName');
  const priceEl = document.getElementById('vteProdMenuPrice');
  const stockEl = document.getElementById('vteProdMenuStock');

  if (imgEl) imgEl.src = p.image || '';
  if (catEl) catEl.textContent = p.categoryName || p.category || 'Sản phẩm';
  if (nameEl) nameEl.textContent = p.name || '';
  if (priceEl) priceEl.textContent = formatVND(p.price || 0);
  if (stockEl) stockEl.textContent = `Kho: ${p.stock || 100} | Đã bán: ${(p.soldCount || 0).toLocaleString('vi-VN')}`;

  modal.classList.remove('hidden');
  showAiToast('📦 Đã mở Menu Sửa Sản Phẩm: ' + (p.name ? p.name.substring(0, 24) : ''));
}

function closeVteProductMenu() {
  const modal = document.getElementById('vteProductMenuModal');
  if (modal) modal.classList.add('hidden');
}

function vteActionEditFullProduct() {
  if (!currentVteProductTarget) return;
  const id = currentVteProductTarget.id;
  closeVteProductMenu();
  editSellerProduct(id);
}

function vteActionEditTextOnCard() {
  if (!currentVteProductTarget) return;
  const id = currentVteProductTarget.id;
  closeVteProductMenu();

  const card = document.querySelector(`[data-product-id="${id}"]`);
  if (card) {
    const textEl = card.querySelector('h4, h5') || card;
    selectVteElement(textEl, true);
    textEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showAiToast('🎨 Đã mở bảng sửa định dạng chữ cho sản phẩm!');
  }
}

function vteActionViewProductDetail() {
  if (!currentVteProductTarget) return;
  const id = currentVteProductTarget.id;
  closeVteProductMenu();
  openProductModal(id);
}

function vteActionDeleteProduct() {
  if (!currentVteProductTarget) return;
  const id = currentVteProductTarget.id;
  closeVteProductMenu();
  deleteSellerProduct(id);
}

function scrollToProductsAndPrompt() {
  const grid = document.getElementById('productGrid') || document.getElementById('flashSaleContainer');
  if (grid) {
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showAiToast('📦 Hãy nhấp vào bất kỳ sản phẩm nào để mở Menu Sửa Sản Phẩm!');
  }
}

function scrollToFooterAndEdit() {
  const footerEl = document.getElementById('footerCopyrightText') || document.querySelector('footer');
  if (footerEl) {
    footerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      openEditorForTargetElement(footerEl);
      showAiToast('✏️ Đã chọn dòng chữ cuối trang (bản quyền)! Bạn có thể sửa chữ ngay bây giờ.');
    }, 350);
  }
}

function openEditorForTargetElement(target) {
  hideVteHintBadge();
  hideGlobalTenClickBadge();
  selectVteElement(target, true);
}

function attachVteListeners() {
  document.addEventListener('pointerover', handleVtePointerOver, true);
  document.addEventListener('pointerout', handleVtePointerOut, true);
  document.addEventListener('click', handleVteClick, true);
  document.addEventListener('dblclick', handleVteDblClick, true);
}

function detachVteListeners() {
  document.removeEventListener('pointerover', handleVtePointerOver, true);
  document.removeEventListener('pointerout', handleVtePointerOut, true);
  document.removeEventListener('click', handleVteClick, true);
  document.removeEventListener('dblclick', handleVteDblClick, true);
  hideVteHintBadge();
  hideGlobalTenClickBadge();
}

function clearVteHighlight() {
  if (currentVteHoveredElement) {
    currentVteHoveredElement.style.outline = '';
    currentVteHoveredElement.style.outlineOffset = '';
    currentVteHoveredElement.style.cursor = '';
    currentVteHoveredElement = null;
  }
  hideVteHintBadge();
  hideGlobalTenClickBadge();
}

// Start Visual Text Editor Mode
function startVisualTextEditorMode() {
  isVisualTextEditModeActive = true;
  vteClickCount = 0;
  vteClickTarget = null;
  if (vteClickTimer) clearTimeout(vteClickTimer);
  hideVteHintBadge();
  hideGlobalTenClickBadge();

  if (currentMode === 'seller') {
    switchTab('buyer');
  }

  // KHÔNG hiện thanh quản trị trên cùng khi sửa chữ
  const toolbar = document.getElementById('visualTextEditorToolbar');
  if (toolbar) toolbar.classList.add('hidden');

  closeTextEditorPanel();
  attachVteListeners();
  updateVteAdminButtons(true);
}

// Stop Visual Text Editor Mode
function stopVisualTextEditorMode() {
  isVisualTextEditModeActive = false;
  vteClickCount = 0;
  vteClickTarget = null;
  if (vteClickTimer) clearTimeout(vteClickTimer);
  hideVteHintBadge();
  hideGlobalTenClickBadge();

  clearVteHighlight();
  if (currentVteElement) {
    currentVteElement.style.outline = '';
    currentVteElement.style.outlineOffset = '';
    currentVteElement = null;
    currentVteSelector = '';
  }

  const toolbar = document.getElementById('visualTextEditorToolbar');
  if (toolbar) toolbar.classList.add('hidden');

  closeTextEditorPanel();
  detachVteListeners();
  updateVteAdminButtons(false);
}

function toggleVisualTextEditorFromAdmin() {
  if (isVisualTextEditModeActive) {
    stopVisualTextEditorMode();
  } else {
    startVisualTextEditorMode();
  }
}

function updateVteAdminButtons(isActive) {
  const btnText = document.getElementById('vteAdminBtnText');
  const btnIcon = document.getElementById('vteAdminBtnIcon');
  if (btnText && btnIcon) {
    if (isActive) {
      btnIcon.textContent = '⏹️';
      btnText.textContent = 'Đang Bật Sửa Chữ - Bấm Để Tắt';
    } else {
      btnIcon.textContent = '🚀';
      btnText.textContent = 'Mở Bắt Đầu Chỉnh Sửa Chữ (Nhấn 2 Lần Vào Chữ)';
    }
  }
}

// Open/Close and Minimize Panel Controls
function toggleTextEditorPanel() {
  const panel = document.getElementById('textCustomizerPanel');
  if (!panel) return;
  if (panel.classList.contains('hidden')) {
    openTextEditorPanel();
  } else {
    closeTextEditorPanel();
  }
}

function openTextEditorPanel() {
  const panel = document.getElementById('textCustomizerPanel');
  if (panel) {
    panel.classList.remove('hidden');
  }
  updateToggleEditorPanelBtn(true);
}

function closeTextEditorPanel() {
  const panel = document.getElementById('textCustomizerPanel');
  if (panel) {
    panel.classList.add('hidden');
  }
  if (currentVteElement) {
    currentVteElement.style.outline = '';
    currentVteElement.style.outlineOffset = '';
    currentVteElement = null;
  }
  hideVteHintBadge();
  hideGlobalTenClickBadge();
  updateToggleEditorPanelBtn(false);
}

function updateToggleEditorPanelBtn(isOpen) {
  const icon = document.getElementById('txtToggleEditorPanelIcon');
  const text = document.getElementById('txtToggleEditorPanelText');
  if (icon && text) {
    if (isOpen) {
      icon.textContent = '✕';
      text.textContent = 'Ẩn Bảng Sửa';
    } else {
      icon.textContent = '📋';
      text.textContent = 'Mở Bảng Sửa';
    }
  }
}

function toggleMinimizeVtePanel() {
  const body = document.getElementById('vtePanelBody');
  const icon = document.getElementById('iconMinimizeVte');
  if (!body) return;
  isVtePanelMinimized = !isVtePanelMinimized;
  if (isVtePanelMinimized) {
    body.classList.add('hidden');
    if (icon) icon.textContent = '+';
  } else {
    body.classList.remove('hidden');
    if (icon) icon.textContent = '−';
  }
}

// Select an element on the page for editing
function selectVteElement(el, shouldOpenPanel = true) {
  if (!el) return;

  if (currentVteElement && currentVteElement !== el) {
    currentVteElement.style.outline = '';
    currentVteElement.style.outlineOffset = '';
  }

  currentVteElement = el;
  currentVteSelector = getElementVteSelector(el);

  // Mark selected element: solid green outline if opening panel, else dashed orange
  if (shouldOpenPanel) {
    el.style.outline = '3px solid #10b981';
    el.style.outlineOffset = '2px';
    openTextEditorPanel();
    if (isVtePanelMinimized) {
      toggleMinimizeVtePanel();
    }
  } else {
    el.style.outline = '2px dashed #f97316';
    el.style.outlineOffset = '2px';
  }

  const computed = window.getComputedStyle(el);
  const text = (el.innerText || el.textContent || '').trim();
  const colorHex = rgbToHex(computed.color);
  const fontSizePx = parseInt(computed.fontSize, 10) || 16;
  const fontFamily = computed.fontFamily;
  const isBold = parseInt(computed.fontWeight, 10) >= 600 || computed.fontWeight === 'bold';
  const isItalic = computed.fontStyle === 'italic';
  const textDec = computed.textDecorationLine || computed.textDecoration || '';
  const isUnderline = textDec.includes('underline');
  const isLineThrough = textDec.includes('line-through');
  const textTransform = computed.textTransform || 'none';
  const textAlign = computed.textAlign || 'left';

  // Record original values if not recorded yet
  if (!customTextStyles[currentVteSelector]) {
    customTextStyles[currentVteSelector] = {
      selector: currentVteSelector,
      originalText: text,
      originalColor: colorHex,
      originalFontSize: fontSizePx + 'px',
      originalFontFamily: fontFamily,
      originalFontWeight: computed.fontWeight,
      originalFontStyle: computed.fontStyle,
      originalTextDecoration: textDec,
      originalTextTransform: textTransform,
      originalTextAlign: textAlign
    };
  }

  const saved = customTextStyles[currentVteSelector];

  // Update target identifiers in UI
  const targetShortId = document.getElementById('vteTargetShortId');
  if (targetShortId) targetShortId.textContent = currentVteSelector;

  const descEl = document.getElementById('vteTargetDescription');
  if (descEl) descEl.textContent = getElementDescription(el);

  // Content
  const contentInput = document.getElementById('vteContentInput');
  if (contentInput) {
    contentInput.value = saved.text !== undefined ? saved.text : text;
  }

  // Color
  const activeColor = saved.color || colorHex;
  updateVteColorUI(activeColor);

  // Font Size
  const activeSize = saved.fontSize ? parseInt(saved.fontSize, 10) : fontSizePx;
  updateVteFontSizeUI(activeSize);

  // Font Family
  const activeFont = saved.fontFamily || fontFamily;
  updateVteFontFamilyUI(activeFont);

  // Formatting & Alignment
  const activeBold = saved.fontWeight ? (parseInt(saved.fontWeight, 10) >= 600 || saved.fontWeight === 'bold') : isBold;
  const activeItalic = saved.fontStyle ? (saved.fontStyle === 'italic') : isItalic;
  const activeUnderline = saved.textDecoration ? saved.textDecoration.includes('underline') : isUnderline;
  const activeLineThrough = saved.textDecoration ? saved.textDecoration.includes('line-through') : isLineThrough;
  const activeTransform = saved.textTransform || textTransform;
  const activeAlign = saved.textAlign || textAlign;

  updateVteFormattingUI({
    isBold: activeBold,
    isItalic: activeItalic,
    isUnderline: activeUnderline,
    isLineThrough: activeLineThrough,
    textTransform: activeTransform,
    textAlign: activeAlign
  });
}

function focusCurrentTarget() {
  if (currentVteElement) {
    currentVteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    currentVteElement.style.transition = 'all 0.3s ease';
    currentVteElement.style.outline = '4px solid #f97316';
    setTimeout(() => {
      if (currentVteElement) {
        currentVteElement.style.outline = '3px solid #10b981';
      }
    }, 800);
  }
}

// UI Update Helpers
function updateVteColorUI(colorHex) {
  const picker = document.getElementById('vteColorPicker');
  const hexInput = document.getElementById('vteColorHex');
  const codeDisplay = document.getElementById('vteCurrentColorCode');
  if (picker) picker.value = colorHex;
  if (hexInput) hexInput.value = colorHex.toUpperCase();
  if (codeDisplay) {
    codeDisplay.textContent = colorHex.toUpperCase();
    codeDisplay.style.color = colorHex === '#ffffff' ? '#64748b' : colorHex;
  }
}

function updateVteFontSizeUI(sizePx) {
  const slider = document.getElementById('vteFontSizeSlider');
  const display = document.getElementById('vteFontSizeDisplay');
  if (slider) slider.value = sizePx;
  if (display) display.textContent = `${sizePx}px`;
}

function updateVteFontFamilyUI(fontFamily) {
  const select = document.getElementById('vteFontFamilySelect');
  if (!select) return;
  let matched = false;
  for (let i = 0; i < select.options.length; i++) {
    const optVal = select.options[i].value;
    if (fontFamily.includes(optVal.split(',')[0].replace(/['"]/g, '')) || optVal.includes(fontFamily.split(',')[0].replace(/['"]/g, ''))) {
      select.selectedIndex = i;
      matched = true;
      break;
    }
  }
  if (!matched && select.options.length > 0) {
    select.selectedIndex = 0;
  }
}

function updateFormattingBtnState(btnId, isActive) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (isActive) {
    btn.classList.remove('bg-slate-100', 'text-slate-800', 'text-slate-700');
    btn.classList.add('bg-orange-500', 'text-white', 'border-orange-600', 'shadow-xs');
  } else {
    btn.classList.remove('bg-orange-500', 'text-white', 'border-orange-600', 'shadow-xs');
    btn.classList.add('bg-slate-100', 'text-slate-800');
  }
}

function updateVteFormattingUI(config) {
  updateFormattingBtnState('btnVteBold', config.isBold);
  updateFormattingBtnState('btnVteItalic', config.isItalic);
  updateFormattingBtnState('btnVteUnderline', config.isUnderline);
  updateFormattingBtnState('btnVteLineThrough', config.isLineThrough);

  ['none', 'uppercase', 'lowercase', 'capitalize'].forEach(t => {
    const id = 'btnVteTransform' + t.charAt(0).toUpperCase() + t.slice(1);
    updateFormattingBtnState(id, (config.textTransform || 'none') === t);
  });

  ['left', 'center', 'right', 'justify'].forEach(a => {
    const id = 'btnVteAlign' + a.charAt(0).toUpperCase() + a.slice(1);
    updateFormattingBtnState(id, (config.textAlign || 'left') === a);
  });
}

// Live Change Listeners
function onVteContentChange(e) {
  if (!currentVteElement) return;
  const val = e.target.value;
  applyTextSafely(currentVteElement, val);
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].text = val;
}

function onVteColorPickerChange(e) {
  setVteColor(e.target.value);
}

function onVteColorHexChange(e) {
  const val = e.target.value.trim();
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
    setVteColor(val);
  }
}

function setVteColor(colorHex) {
  if (!currentVteElement) return;
  currentVteElement.style.color = colorHex;
  updateVteColorUI(colorHex);
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].color = colorHex;
}

function onVteFontSizeSliderChange(e) {
  setVteFontSize(parseInt(e.target.value, 10));
}

function adjustVteFontSize(delta) {
  const slider = document.getElementById('vteFontSizeSlider');
  let cur = slider ? parseInt(slider.value, 10) : 16;
  let next = Math.max(10, Math.min(64, cur + delta));
  setVteFontSize(next);
}

function setVteFontSize(sizePx) {
  if (!currentVteElement) return;
  const pxVal = typeof sizePx === 'number' ? sizePx + 'px' : sizePx;
  currentVteElement.style.fontSize = pxVal;
  updateVteFontSizeUI(parseInt(pxVal, 10));
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].fontSize = pxVal;
}

function onVteFontFamilyChange(e) {
  if (!currentVteElement) return;
  const font = e.target.value;
  currentVteElement.style.fontFamily = font;
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].fontFamily = font;
}

function toggleVteBold() {
  if (!currentVteElement) return;
  const isBold = currentVteElement.style.fontWeight === 'bold' || parseInt(currentVteElement.style.fontWeight, 10) >= 600;
  const next = isBold ? 'normal' : 'bold';
  currentVteElement.style.fontWeight = next;
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].fontWeight = next;
  updateFormattingBtnState('btnVteBold', !isBold);
}

function toggleVteItalic() {
  if (!currentVteElement) return;
  const isItalic = currentVteElement.style.fontStyle === 'italic';
  const next = isItalic ? 'normal' : 'italic';
  currentVteElement.style.fontStyle = next;
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].fontStyle = next;
  updateFormattingBtnState('btnVteItalic', !isItalic);
}

function toggleVteUnderline() {
  if (!currentVteElement) return;
  const cur = currentVteElement.style.textDecoration || '';
  let next = cur.includes('underline') ? cur.replace('underline', '').trim() : (cur + ' underline').trim();
  if (!next) next = 'none';
  currentVteElement.style.textDecoration = next;
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].textDecoration = next;
  updateFormattingBtnState('btnVteUnderline', next.includes('underline'));
}

function toggleVteLineThrough() {
  if (!currentVteElement) return;
  const cur = currentVteElement.style.textDecoration || '';
  let next = cur.includes('line-through') ? cur.replace('line-through', '').trim() : (cur + ' line-through').trim();
  if (!next) next = 'none';
  currentVteElement.style.textDecoration = next;
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].textDecoration = next;
  updateFormattingBtnState('btnVteLineThrough', next.includes('line-through'));
}

function setVteTextTransform(transform) {
  if (!currentVteElement) return;
  currentVteElement.style.textTransform = transform;
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].textTransform = transform;
  ['none', 'uppercase', 'lowercase', 'capitalize'].forEach(t => {
    const id = 'btnVteTransform' + t.charAt(0).toUpperCase() + t.slice(1);
    updateFormattingBtnState(id, t === transform);
  });
}

function setVteTextAlign(align) {
  if (!currentVteElement) return;
  currentVteElement.style.textAlign = align;
  if (!customTextStyles[currentVteSelector]) customTextStyles[currentVteSelector] = { selector: currentVteSelector };
  customTextStyles[currentVteSelector].textAlign = align;
  ['left', 'center', 'right', 'justify'].forEach(a => {
    const id = 'btnVteAlign' + a.charAt(0).toUpperCase() + a.slice(1);
    updateFormattingBtnState(id, a === align);
  });
}

// Save Current Element Changes Permanently
function saveCurrentVteChanges() {
  if (!currentVteElement || !currentVteSelector) {
    return;
  }

  saveCustomTextStylesToStorage();
  renderTextEditorAdminView();

  const saveBtn = document.getElementById('btnSaveVteChanges');
  if (saveBtn) {
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span>✓</span> <span>Đã Lưu Xong!</span>';
    setTimeout(() => {
      saveBtn.innerHTML = originalText;
    }, 1500);
  }
}

// Reset Single Element to Original
function resetCurrentVteElement() {
  if (!currentVteElement || !currentVteSelector) return;
  const entry = customTextStyles[currentVteSelector];
  if (!entry) return;

  if (entry.originalText !== undefined) {
    applyTextSafely(currentVteElement, entry.originalText);
  }
  currentVteElement.style.color = entry.originalColor || '';
  currentVteElement.style.fontSize = entry.originalFontSize || '';
  currentVteElement.style.fontFamily = entry.originalFontFamily || '';
  currentVteElement.style.fontWeight = entry.originalFontWeight || '';
  currentVteElement.style.fontStyle = entry.originalFontStyle || '';
  currentVteElement.style.textDecoration = entry.originalTextDecoration || '';
  currentVteElement.style.textTransform = entry.originalTextTransform || '';
  currentVteElement.style.textAlign = entry.originalTextAlign || '';

  delete customTextStyles[currentVteSelector];
  saveCustomTextStylesToStorage();

  selectVteElement(currentVteElement);
  renderTextEditorAdminView();
}

// Reset All Elements to Original
function resetAllCustomTextStyles() {
  if (!confirm('Bạn có chắc muốn khôi phục toàn bộ chữ và định dạng đã chỉnh sửa về mặc định ban đầu không?')) {
    return;
  }

  Object.keys(customTextStyles).forEach(selector => {
    try {
      const el = document.querySelector(selector);
      const entry = customTextStyles[selector];
      if (el && entry) {
        if (entry.originalText !== undefined) {
          applyTextSafely(el, entry.originalText);
        }
        el.style.color = '';
        el.style.fontSize = '';
        el.style.fontFamily = '';
        el.style.fontWeight = '';
        el.style.fontStyle = '';
        el.style.textDecoration = '';
        el.style.textTransform = '';
        el.style.textAlign = '';
        el.style.outline = '';
      }
    } catch (err) {
      console.warn('Lỗi khôi phục selector:', selector, err);
    }
  });

  customTextStyles = {};
  localStorage.removeItem(VTE_STORAGE_KEY);

  if (currentVteElement) {
    currentVteElement.style.outline = '';
    currentVteElement = null;
    currentVteSelector = '';
  }

  closeTextEditorPanel();
  renderTextEditorAdminView();
  showAiToast('🔄 Toàn bộ chữ đã được khôi phục về mặc định ban đầu!');
}

// Apply all stored styles to the DOM
function applyAllCustomTextStyles() {
  loadCustomTextStyles();
  const keys = Object.keys(customTextStyles);
  if (keys.length === 0) return;

  keys.forEach(selector => {
    try {
      const el = document.querySelector(selector);
      const item = customTextStyles[selector];
      if (el && item) {
        if (item.text !== undefined && item.text !== null) {
          applyTextSafely(el, item.text);
        }
        if (item.color) el.style.color = item.color;
        if (item.fontSize) el.style.fontSize = item.fontSize;
        if (item.fontFamily) el.style.fontFamily = item.fontFamily;
        if (item.fontWeight) el.style.fontWeight = item.fontWeight;
        if (item.fontStyle) el.style.fontStyle = item.fontStyle;
        if (item.textDecoration) el.style.textDecoration = item.textDecoration;
        if (item.textTransform) el.style.textTransform = item.textTransform;
        if (item.textAlign) el.style.textAlign = item.textAlign;
      }
    } catch (err) {
      console.warn('Lỗi khi áp dụng customTextStyles cho:', selector, err);
    }
  });
}

// Render Admin Table of Customized Texts
function renderTextEditorAdminView() {
  const tbody = document.getElementById('vteCustomTextsTableBody');
  const countBadge = document.getElementById('vteCustomCountBadge');
  if (!tbody) return;

  const entries = Object.entries(customTextStyles).filter(([sel, data]) => {
    return data.text !== undefined || data.color || data.fontSize || data.fontFamily || data.fontWeight || data.fontStyle || data.textDecoration || data.textTransform || data.textAlign;
  });

  if (countBadge) {
    countBadge.textContent = `${entries.length} đoạn chữ đã sửa`;
  }

  if (entries.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-slate-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <span class="text-3xl">✏️</span>
            <p class="font-bold text-sm text-slate-600">Chưa có đoạn chữ nào được chỉnh sửa.</p>
            <p class="text-xs text-slate-400 max-w-sm">Bấm nút "Mở Trang & Bật Sửa Chữ" phía trên để chạm vào bất kỳ chữ nào trên trang và thay đổi định dạng!</p>
            <button onclick="startVisualTextEditorMode()" class="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition text-xs cursor-pointer">
              Bắt Đầu Chỉnh Sửa Ngay
            </button>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = entries.map(([sel, item]) => {
    const previewText = item.text || item.originalText || '(Nội dung gốc)';
    const colorSample = item.color || '#000000';
    const sizeSample = item.fontSize || '16px';
    const fontSample = (item.fontFamily || 'Plus Jakarta Sans').split(',')[0].replace(/['"]/g, '');
    const formatBadges = [];
    if (item.fontWeight === 'bold' || parseInt(item.fontWeight, 10) >= 600) formatBadges.push('Đậm');
    if (item.fontStyle === 'italic') formatBadges.push('Nghiêng');
    if (item.textDecoration?.includes('underline')) formatBadges.push('Gạch chân');
    if (item.textDecoration?.includes('line-through')) formatBadges.push('Gạch ngang');
    if (item.textTransform && item.textTransform !== 'none') formatBadges.push(item.textTransform);
    if (item.textAlign && item.textAlign !== 'left') formatBadges.push(item.textAlign);

    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3">
          <span class="font-mono font-bold text-[11px] text-slate-800 block truncate max-w-[140px]" title="${sel}">
            ${sel}
          </span>
        </td>
        <td class="p-3 font-semibold text-slate-900 max-w-[180px] truncate" title="${previewText}">
          ${previewText}
        </td>
        <td class="p-3">
          <div class="flex items-center gap-1.5">
            <span class="w-4 h-4 rounded-md border border-slate-300 shrink-0" style="background-color: ${colorSample};"></span>
            <span class="font-mono text-[11px] text-slate-600 uppercase">${colorSample}</span>
          </div>
        </td>
        <td class="p-3">
          <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[11px] mr-1">${sizeSample}</span>
          <span class="text-slate-500 text-[11px]">${fontSample}</span>
        </td>
        <td class="p-3">
          ${formatBadges.length > 0 
            ? formatBadges.map(b => `<span class="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] rounded font-bold mr-1">${b}</span>`).join('') 
            : '<span class="text-slate-400 text-[11px]">Chuẩn</span>'}
        </td>
        <td class="p-3 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button 
              type="button"
              onclick="selectVteElementBySelector('${sel.replace(/'/g, "\\'")}')" 
              class="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg transition cursor-pointer text-[11px]"
              title="Chuyển đến chữ này trên trang để sửa tiếp"
            >
              ✏️ Sửa Tiếp
            </button>
            <button 
              type="button"
              onclick="deleteCustomTextStyle('${sel.replace(/'/g, "\\'")}')" 
              class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg transition cursor-pointer text-[11px]"
              title="Khôi phục chữ này về gốc"
            >
              🔄 Khôi Phục
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function selectVteElementBySelector(selector) {
  startVisualTextEditorMode();
  setTimeout(() => {
    try {
      const el = document.querySelector(selector);
      if (el) {
        selectVteElement(el);
        focusCurrentTarget();
      } else {
        alert('Không tìm thấy phần tử này trên giao diện hiện tại!');
      }
    } catch (e) {
      console.error('Lỗi khi tìm selector:', selector, e);
    }
  }, 100);
}

function deleteCustomTextStyle(selector) {
  try {
    const el = document.querySelector(selector);
    const entry = customTextStyles[selector];
    if (el && entry) {
      if (entry.originalText !== undefined) {
        applyTextSafely(el, entry.originalText);
      }
      el.style.color = '';
      el.style.fontSize = '';
      el.style.fontFamily = '';
      el.style.fontWeight = '';
      el.style.fontStyle = '';
      el.style.textDecoration = '';
      el.style.textTransform = '';
      el.style.textAlign = '';
      el.style.outline = '';
    }
  } catch (err) {
    console.warn('Lỗi khi xóa style selector:', selector, err);
  }

  delete customTextStyles[selector];
  saveCustomTextStylesToStorage();
  renderTextEditorAdminView();
  showAiToast('🔄 Đã khôi phục chữ về mặc định.');
}

// Expose all functions called from inline HTML event handlers to window
Object.assign(window, {
  removeVietnameseTones,
  handleSearchInput,
  executeSearch,
  toggleViewMode,
  handleLogoClick,
  nextBanner,
  prevBanner,
  setBanner,
  claimVoucher,
  filterCategory,
  filterType,
  openProductModal,
  showModalImage,
  showModalVideo,
  selectSizeVariation,
  selectColorVariation,
  closeProductModal,
  addToCart,
  openCartModal,
  closeCartModal,
  changeQty,
  removeFromCart,
  renderCartItems,
  handleCheckout,
  closeSuccessOrderModal,
  copyTransferSyntax,
  toggleAiChat,
  clearAiChat,
  toggleSuperFastMode,
  openAiChatWithOrder,
  sendQuickAiQuery,
  handleSendAiMessage,
  openFooterInfo,
  closeFooterModal,
  closeFooterInfo,
  openBuyerAuthModal,
  closeBuyerAuthModal,
  switchAuthSubTab,
  handleBuyerLogin,
  handleBuyerRegister,
  handleBuyerLogout,
  openBuyerOrdersModal,
  closeBuyerOrdersModal,
  filterBuyerOrders,
  confirmBuyerReceived,
  rebuyOrder,
  openPinModal,
  closePinModal,
  verifyPin,
  openChangePinModal,
  handleSaveNewPin,
  switchTab,
  switchSellerSubTab,
  editSellerProduct,
  deleteSellerProduct,
  openAddProductModal,
  closeSellerModal,
  handleSaveSellerProduct,
  updateOrderStatus,
  switchOrderToCod,
  confirmOrderPayment,
  revertOrderPayment,
  deleteOrder,
  handleSaveCustomTexts,
  saveGeminiApiKey,
  addAiRule,
  deleteAiRule,
  dismissSellerNotice,
  restoreSellerNotice,
  switchSnippetPlatformTab,
  copyCodeSnippet,
  updateSnippetCodeAndSimulator,
  applyPresetPrompt,
  generateAiButton,
  triggerSimulatedAiAction,
  showAiToast,
  renderAiPhpCodeUI,
  renderMarqueeTicker,
  populatePromotionsForm,
  onShippingModeChange,
  updateShippingSimulator,
  renderSellerVouchersTable,
  addNewVoucher,
  deleteVoucher,
  toggleVoucher,
  applyMarqueePreset,
  savePromotionsConfig,
  resetPromotionsToDefault,
  applyVoucherFromInput,
  removeAppliedVoucher,
  claimActiveVoucher,
  calculateShippingFee,
  updateAiKeyStatusUI,
  saveGeminiApiKey,
  removeGeminiApiKey,
  nextBanner,
  prevBanner,
  setBanner,
  toggleHeroVideoSound,
  toggleHeroVideoPlay,
  populateBannerAdminForm,
  selectAdminSimSlide,
  handleBannerFileUpload,
  handleBannerVideoUpload,
  onBannerImgUrlChange,
  onBannerVideoUrlChange,
  applySampleBannerImage,
  applySampleBannerVideo,
  saveBannerConfig,
  resetBannersToDefault,
  previewBannerOnBuyerPage,
  showModalGalleryItem,
  showCurrentModalVideo,
  updateProductImgPreview,
  clearProductImgSlot,
  handleProductSingleImageUpload,
  handleProductBatchImagesUpload,
  handleProductVideoUpload,
  updateProductVideoPreview,
  clearProductVideo,
  // Visual In-Place Text Editor exports
  startVisualTextEditorMode,
  stopVisualTextEditorMode,
  toggleVisualTextEditorFromAdmin,
  toggleTextEditorPanel,
  openTextEditorPanel,
  closeTextEditorPanel,
  toggleMinimizeVtePanel,
  selectVteElement,
  selectVteElementBySelector,
  focusCurrentTarget,
  onVteContentChange,
  onVteColorPickerChange,
  onVteColorHexChange,
  setVteColor,
  onVteFontSizeSliderChange,
  setVteFontSize,
  adjustVteFontSize,
  onVteFontFamilyChange,
  toggleVteBold,
  toggleVteItalic,
  toggleVteUnderline,
  toggleVteLineThrough,
  setVteTextTransform,
  setVteTextAlign,
  saveCurrentVteChanges,
  resetCurrentVteElement,
  resetAllCustomTextStyles,
  deleteCustomTextStyle,
  renderTextEditorAdminView,
  applyAllCustomTextStyles,
  handleProductCardClick,
  openVteProductMenu,
  closeVteProductMenu,
  vteActionEditFullProduct,
  vteActionEditTextOnCard,
  vteActionViewProductDetail,
  vteActionDeleteProduct,
  scrollToProductsAndPrompt,
  scrollToFooterAndEdit,
  openCurrentTargetEditor,
  hideVteHintBadge,
  triggerTenClickOpenNow,
  hideGlobalTenClickBadge,
  handleGlobalTenClick
});

function updateAiChatTime() {
  const el = document.getElementById('aiInitialTime');
  if (el) {
    const now = new Date();
    el.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
}

// Luôn kích hoạt bộ theo dõi nhấp 10 lần vào bất kỳ chữ nào trên toàn trang
document.addEventListener('click', handleGlobalTenClick, true);

// Run initial renders on DOMContentLoaded or immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadSavedBannerConfig();
    renderCategories();
    renderProducts();
    renderBuyerAuthWidget();
    renderAiPhpCodeUI();
    renderMarqueeTicker();
    updateAiKeyStatusUI();
    updateAiChatTime();
    loadCustomTextStyles();
    applyAllCustomTextStyles();
  });
} else {
  loadSavedBannerConfig();
  renderCategories();
  renderProducts();
  renderBuyerAuthWidget();
  renderAiPhpCodeUI();
  renderMarqueeTicker();
  updateAiKeyStatusUI();
  updateAiChatTime();
  loadCustomTextStyles();
  applyAllCustomTextStyles();
}
