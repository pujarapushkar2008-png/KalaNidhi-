import { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Box,
  Camera,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  Home,
  IndianRupee,
  Loader2,
  LogOut,
  Mic,
  Package,
  Pencil,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  UserRound,
  Wallet,
  Wand2,
} from 'lucide-react';

type Page = 'home' | 'products' | 'orders' | 'payments' | 'settings' | 'add' | 'pricing' | 'preview' | 'inventory' | 'notifications';
type OrderStatus = 'New' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
type Product = { id: number; name: string; category: string; price: number; stock: number; color: string; description: string };
type Order = { id: string; product: string; marketplace: string; date: string; quantity: number; status: OrderStatus; payment: string };

const marketplaces = [
  { name: 'Amazon Karigar', short: 'A', earnings: 4000, orders: 14, color: 'navy', detail: 'Connected for demo' },
  { name: 'Flipkart Samarth', short: 'F', earnings: 1000, orders: 6, color: 'blue', detail: 'Connected for demo' },
  { name: 'ONDC', short: 'O', earnings: 2000, orders: 9, color: 'green', detail: 'Connected for demo' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Hand-thrown Clay Pot', category: 'Pottery', price: 450, stock: 12, color: 'terracotta', description: 'Unglazed terracotta, sun-dried and hand-finished in Khurja.' },
  { id: 2, name: 'Brass-tip Ink Pen', category: 'Stationery', price: 380, stock: 3, color: 'teal', description: 'Hand-turned rosewood body with a brass tip.' },
  { id: 3, name: 'Block-print Journal', category: 'Stationery', price: 320, stock: 24, color: 'mustard', description: 'Cotton rag paper and a hand-block printed cover.' },
];

const initialOrders: Order[] = [
  { id: '#KN-4821', product: 'Hand-thrown Clay Pot', marketplace: 'Amazon Karigar', date: 'Today, 10:42 AM', quantity: 2, status: 'Confirmed', payment: 'Paid' },
  { id: '#KN-4798', product: 'Brass-tip Ink Pen', marketplace: 'Flipkart Samarth', date: 'Yesterday, 9:05 AM', quantity: 1, status: 'Shipped', payment: 'Paid' },
  { id: '#KN-4762', product: 'Block-print Journal', marketplace: 'ONDC', date: '12 Sep 2026', quantity: 3, status: 'Delivered', payment: 'Settled' },
  { id: '#KN-4741', product: 'Hand-thrown Clay Pot', marketplace: 'Amazon Karigar', date: '11 Sep 2026', quantity: 1, status: 'New', payment: 'Pending' },
];

const mainTabs: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'home', label: 'Home', icon: <Home size={20} /> },
  { page: 'products', label: 'Products', icon: <Box size={20} /> },
  { page: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
  { page: 'payments', label: 'Payments', icon: <Wallet size={20} /> },
  { page: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

const secondaryPages: Page[] = ['add', 'pricing', 'preview', 'inventory', 'notifications'];

function App() {
  const [page, setPage] = useState<Page>('home');
  const [signedIn, setSignedIn] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [toast, setToast] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProducts[0]);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>(['Amazon Karigar', 'ONDC']);
  const [orderFilter, setOrderFilter] = useState<'All' | OrderStatus>('All');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const navigate = (next: Page) => {
    const isSecondary = secondaryPages.includes(next);
    setDirection(isSecondary ? 'forward' : 'back');
    setPage(next);
  };

  const goBack = (to: Page) => {
    setDirection('back');
    setPage(to);
  };

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate('preview');
  };

  const addProduct = (product: Product) => {
    setProducts((current) => [...current, { ...product, id: Date.now() }]);
    setSelectedProduct(product);
    navigate('preview');
    notify('Product saved as a draft');
  };

  const updateStock = (id: number, amount: number) => {
    setProducts((current) => current.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p));
    notify('Inventory updated');
  };

  const confirmOrder = (id: string) => {
    setOrders((current) => current.map((o) => o.id === id ? { ...o, status: 'Confirmed' } : o));
    notify('Order confirmed and stock updated');
  };

  if (!signedIn) {
    return (
      <PhoneFrame>
        <AuthScreen
          registering={registering}
          setRegistering={setRegistering}
          language={language}
          setLanguage={setLanguage}
          onLogin={() => setSignedIn(true)}
        />
      </PhoneFrame>
    );
  }

  const showTabBar = !secondaryPages.includes(page);

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col overflow-hidden bg-[#f7f1e6]">
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'none' }}>
          <div key={page} className={`app-screen app-screen-${direction}`}>
            {page === 'home' && <Dashboard navigate={navigate} products={products} />}
            {page === 'products' && <Products products={products} openProduct={openProduct} navigate={navigate} />}
            {page === 'orders' && <Orders orders={orders} filter={orderFilter} setFilter={setOrderFilter} confirmOrder={confirmOrder} />}
            {page === 'payments' && <Payments navigate={navigate} />}
            {page === 'settings' && <SettingsPage language={language} setLanguage={setLanguage} notify={notify} onLogout={() => setSignedIn(false)} />}
            {page === 'add' && <AddProduct onBack={() => goBack('products')} onContinue={(p) => { setSelectedProduct(p); navigate('pricing'); }} onSave={addProduct} />}
            {page === 'pricing' && <Pricing product={selectedProduct} onBack={() => goBack('add')} onContinue={(price) => { setSelectedProduct({ ...selectedProduct, price }); navigate('preview'); }} />}
            {page === 'preview' && <Preview product={selectedProduct} marketplaces={selectedMarketplaces} setMarketplaces={setSelectedMarketplaces} onBack={() => goBack('products')} onPublish={() => { notify(`Listing saved for ${selectedMarketplaces.length} marketplaces`); goBack('products'); }} />}
            {page === 'inventory' && <Inventory products={products} updateStock={updateStock} onBack={() => goBack('home')} />}
            {page === 'notifications' && <Notifications onBack={() => goBack('home')} />}
          </div>
        </div>
        {showTabBar && <TabBar page={page} navigate={navigate} />}
      </div>
      {toast && (
        <div className="absolute bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#202a3f] px-5 py-3 text-sm font-semibold text-white shadow-xl">
          <Check size={16} />{toast}
        </div>
      )}
    </PhoneFrame>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e8e0d0] p-0 sm:p-6">
      <div className="relative flex h-screen w-full max-w-[430px] flex-col overflow-hidden bg-[#f7f1e6] shadow-2xl sm:h-[860px] sm:rounded-[2.5rem] sm:border-[10px] sm:border-[#1a1a1a]">
        <div className="absolute left-1/2 top-0 z-50 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#1a1a1a] hidden sm:block" />
        {children}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold text-[#202a3f]">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]">●●●●</span>
        <span>5G</span>
        <span className="ml-1 inline-block h-3 w-6 rounded-sm border border-[#202a3f] px-0.5"><span className="block h-full w-3/4 rounded-[1px] bg-[#202a3f]" /></span>
      </div>
    </div>
  );
}

function AppHeader({ title, onBack, action }: { title: string; onBack?: () => void; action?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e8ddc9] bg-[#f7f1e6]/90 px-4 py-3 backdrop-blur-md">
      {onBack && (
        <button onClick={onBack} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-sm transition active:scale-90" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className={`font-bold ${onBack ? 'flex-1 text-center' : 'flex-1 text-lg'}`}>{title}</h1>
      {action || <div className="w-10" />}
    </div>
  );
}

function AuthScreen({ registering, setRegistering, language, setLanguage, onLogin }: { registering: boolean; setRegistering: (v: boolean) => void; language: string; setLanguage: (v: 'English' | 'Hindi') => void; onLogin: () => void }) {
  const [accountType, setAccountType] = useState<'Artisan' | 'SHG'>('Artisan');
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-6 pb-8" style={{ scrollbarWidth: 'none' }}>
        <div className="mt-6 flex items-center gap-2 text-2xl font-bold">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#c26b42] text-white"><Store size={22} /></span>
          Kala<span className="text-[#c26b42]">Nidhi</span>
        </div>
        <p className="mt-2 text-xs font-bold uppercase tracking-[.18em] text-[#969b91]">Seller Studio</p>

        <div className="mt-10">
          <h1 className="font-serif text-3xl font-bold leading-tight">{registering ? 'Create your seller profile' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm text-[#6f746f]">{registering ? 'Start selling your craft across trusted marketplaces.' : 'Sign in to manage your handmade business.'}</p>
        </div>

        <div className="mt-8 space-y-4">
          {registering && (
            <>
              <Field label="Your name" placeholder="Meera Devi" />
              <Field label="Craft category" placeholder="Handmade pottery" />
              <Field label="Location" placeholder="Khurja, Uttar Pradesh" />
            </>
          )}
          <Field label="Mobile number" placeholder="+91 98765 43210" />
          <div>
            <label className="mb-2 block text-sm font-semibold">One-time password</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input key={i} aria-label={`OTP digit ${i}`} maxLength={1} className="h-12 w-full rounded-xl border border-[#ddd2c1] bg-white text-center text-lg font-bold outline-none focus:border-[#c26b42]" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold">I am a</p>
          <div className="flex rounded-xl bg-[#ebe3d5] p-1">
            {(['Artisan', 'SHG'] as const).map((t) => (
              <button key={t} onClick={() => setAccountType(t)} className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${accountType === t ? 'bg-white shadow-sm' : 'text-[#697384]'}`}>{t}</button>
            ))}
          </div>
        </div>

        <button onClick={onLogin} className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#202a3f] font-bold text-white transition active:scale-[.97]">
          {registering ? 'Create seller account' : 'Continue to dashboard'}
        </button>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setRegistering(!registering)} className="text-sm font-bold text-[#c26b42]">
            {registering ? 'Already have an account? Sign in' : 'New seller? Create account'}
          </button>
          <div className="flex gap-1 rounded-lg border border-[#ddd2c1] p-1">
            <button onClick={() => setLanguage('English')} className={`rounded px-2.5 py-1 text-xs font-bold ${language === 'English' ? 'bg-[#202a3f] text-white' : 'text-[#6d7580]'}`}>EN</button>
            <button onClick={() => setLanguage('Hindi')} className={`rounded px-2.5 py-1 text-xs font-bold ${language === 'Hindi' ? 'bg-[#202a3f] text-white' : 'text-[#6d7580]'}`}>हि</button>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-[#7e827f]">Demo seller app. Marketplace and settlement info is simulated.</p>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, type = 'text' }: { label: string; placeholder?: string; value?: string | number; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="h-12 w-full rounded-xl border border-[#ddd2c1] bg-white px-4 text-sm outline-none transition placeholder:text-[#a4a5a0] focus:border-[#c26b42] focus:ring-2 focus:ring-[#c26b42]/10" />
    </div>
  );
}

function Dashboard({ navigate, products }: { navigate: (p: Page) => void; products: Product[] }) {
  const lowStock = products.filter((p) => p.stock <= 5).length;
  return (
    <div className="px-5 pb-8">
      <StatusBar />
      <header className="mt-2 flex items-start justify-between">
        <div>
          <p className="text-xs text-[#6f746f]">13 September 2026</p>
          <h1 className="mt-1 font-serif text-2xl font-bold">Namaste, Meera</h1>
        </div>
        <button onClick={() => navigate('notifications')} className="relative grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm">
          <Bell size={19} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#c26b42]" />
        </button>
      </header>

      <section className="relative mt-5 overflow-hidden rounded-3xl bg-[#202a3f] p-5 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10" />
        <div className="relative">
          <p className="text-xs text-white/60">Total earnings · this month</p>
          <p className="mt-2 font-serif text-4xl">₹90,000</p>
          <p className="mt-1 text-xs font-semibold text-[#a4c485]">↑ 12% vs last month</p>
          <div className="mt-5 flex h-10 items-end gap-1.5 opacity-80">
            {[30, 46, 38, 58, 50, 70, 62, 80, 74, 92, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-[#c26b42]" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Products" value={products.length} icon={<Box size={16} />} onClick={() => navigate('products')} />
        <Metric label="Orders" value="29" icon={<ShoppingBag size={16} />} onClick={() => navigate('orders')} />
        <Metric label="Low stock" value={lowStock} icon={<Clock3 size={16} />} alert onClick={() => navigate('inventory')} />
        <Metric label="Pending" value="₹8,450" icon={<IndianRupee size={16} />} onClick={() => navigate('payments')} />
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c26b42]">Quick actions</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          <Quick icon={<Plus size={20} />} label="Add" onClick={() => navigate('add')} primary />
          <Quick icon={<ShoppingBag size={20} />} label="Orders" onClick={() => navigate('orders')} />
          <Quick icon={<Package size={20} />} label="Stock" onClick={() => navigate('inventory')} />
          <Quick icon={<Wallet size={20} />} label="Pay" onClick={() => navigate('payments')} />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c26b42]">Sales channels</p>
            <h2 className="mt-1.5 font-serif text-xl font-bold">Earnings by marketplace</h2>
          </div>
          <button onClick={() => navigate('payments')} className="text-xs font-bold text-[#c26b42]">View all</button>
        </div>
        <div className="mt-3 space-y-3">
          {marketplaces.map((m) => <MarketplaceCard key={m.name} marketplace={m} />)}
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-[#d8c7ac] bg-[#fbf7ef] p-3 text-xs text-[#6f746f]">
          <Sparkles size={14} className="mr-1.5 inline text-[#c26b42]" />Marketplace figures are mock demo data.
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, icon, onClick, alert }: { label: string; value: string | number; icon: React.ReactNode; onClick: () => void; alert?: boolean }) {
  return (
    <button onClick={onClick} className="rounded-2xl border border-[#e3d8c7] bg-white p-4 text-left transition active:scale-[.96]">
      <span className={`mb-2.5 grid h-8 w-8 place-items-center rounded-lg ${alert ? 'bg-[#f8e2d8] text-[#c26b42]' : 'bg-[#eef0e6] text-[#6d8155]'}`}>{icon}</span>
      <p className="text-xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs text-[#757b7b]">{label}</p>
    </button>
  );
}

function Quick({ icon, label, onClick, primary }: { icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 transition active:scale-90 ${primary ? 'bg-[#c26b42] text-white' : 'border border-[#e3d8c7] bg-white text-[#202a3f]'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function MarketplaceCard({ marketplace: m }: { marketplace: typeof marketplaces[number] }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#e3d8c7] bg-white p-3.5">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white ${m.color === 'navy' ? 'bg-[#202a3f]' : m.color === 'blue' ? 'bg-[#4775a9]' : 'bg-[#718c57]'}`}>{m.short}</div>
      <div className="flex-1">
        <p className="text-sm font-bold">{m.name}</p>
        <p className="mt-0.5 text-xs text-[#757b7b]">{m.orders} orders · <span className="text-[#718c57]">Demo active</span></p>
      </div>
      <p className="font-serif text-lg">₹{m.earnings.toLocaleString('en-IN')}</p>
    </div>
  );
}

function TabBar({ page, navigate }: { page: Page; navigate: (p: Page) => void }) {
  return (
    <div className="relative flex items-center justify-around border-t border-[#ded3c3] bg-[#fbf7ef] px-2 pb-4 pt-2">
      {mainTabs.slice(0, 2).map((t) => (
        <button key={t.page} onClick={() => navigate(t.page)} className={`flex flex-1 flex-col items-center gap-1 py-1 transition active:scale-90 ${page === t.page ? 'text-[#c26b42]' : 'text-[#838886]'}`}>
          {t.icon}
          <span className="text-[9px] font-bold">{t.label}</span>
        </button>
      ))}
      <button onClick={() => navigate('add')} className="-mt-7 grid h-14 w-14 shrink-0 place-items-center rounded-full border-4 border-[#fbf7ef] bg-[#202a3f] text-white shadow-lg transition active:scale-90">
        <Plus size={24} />
      </button>
      {mainTabs.slice(2, 4).map((t) => (
        <button key={t.page} onClick={() => navigate(t.page)} className={`flex flex-1 flex-col items-center gap-1 py-1 transition active:scale-90 ${page === t.page ? 'text-[#c26b42]' : 'text-[#838886]'}`}>
          {t.icon}
          <span className="text-[9px] font-bold">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function Products({ products, openProduct, navigate }: { products: Product[]; openProduct: (p: Product) => void; navigate: (p: Page) => void }) {
  return (
    <div className="pb-8">
      <AppHeader title="Products" action={<button onClick={() => navigate('add')} className="grid h-10 w-10 place-items-center rounded-full bg-[#c26b42] text-white shadow-sm"><Plus size={20} /></button>} />
      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 rounded-xl border border-[#ddd2c1] bg-white px-4 py-3 text-sm text-[#9a9b95]">
          <Search size={16} /> Search products
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {['All', 'Pottery', 'Stationery', 'Textiles'].map((f, i) => (
            <button key={f} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${i === 0 ? 'bg-[#202a3f] text-white' : 'border border-[#ddd2c1] bg-white text-[#697384]'}`}>{f}</button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {products.map((p) => (
            <button key={p.id} onClick={() => openProduct(p)} className="flex w-full gap-3 rounded-2xl border border-[#e3d8c7] bg-white p-3 text-left transition active:scale-[.97]">
              <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-xl ${p.color === 'terracotta' ? 'bg-[#bd7543]' : p.color === 'teal' ? 'bg-[#225854]' : 'bg-[#bc8c29]'}`}>
                <Box className="text-white/75" size={32} strokeWidth={1.2} />
              </div>
              <div className="flex-1 py-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#c26b42]">{p.category}</p>
                <h2 className="mt-0.5 font-bold">{p.name}</h2>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#737974]">{p.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-serif text-lg">₹{p.price.toLocaleString('en-IN')}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.stock <= 5 ? 'bg-[#f8e2d8] text-[#b95735]' : 'bg-[#edf3e7] text-[#718c57]'}`}>{p.stock} left</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhotoUpload() {
  const [stage, setStage] = useState<'empty' | 'uploaded' | 'enhancing' | 'enhanced'>('empty');
  const [showBefore, setShowBefore] = useState(false);
  const handleEnhance = () => {
    setStage('enhancing');
    window.setTimeout(() => setStage('enhanced'), 2200);
  };
  if (stage === 'empty') {
    return (
      <button onClick={() => setStage('uploaded')} className="grid h-44 w-full place-items-center rounded-2xl border-2 border-dashed border-[#d6bf9c] bg-[#fbf7ef] transition active:scale-[.98]">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f5e1d4] text-[#c26b42]"><Camera size={22} /></div>
          <p className="mt-2 text-sm font-bold">Add a product photo</p>
          <p className="mt-0.5 text-xs text-[#828680]">Tap to upload from gallery</p>
        </div>
      </button>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e3d8c7]">
      <div className="relative h-44">
        <div className={`absolute inset-0 transition-opacity duration-300 ${showBefore ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid h-full place-items-center bg-[#9a6230]">
            <Box size={48} strokeWidth={1} className="text-white/40" />
          </div>
          <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">Before</span>
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300 ${showBefore ? 'opacity-0' : 'opacity-100'}`}>
          <div className="grid h-full place-items-center bg-gradient-to-br from-[#d08a58] to-[#a85a30] shadow-inner">
            <Box size={48} strokeWidth={1} className="text-white/85" />
          </div>
          {stage === 'enhanced' && <span className="absolute left-2 top-2 rounded-full bg-[#718c57] px-2 py-0.5 text-[10px] font-bold text-white">Enhanced</span>}
        </div>
        {stage === 'enhancing' && (
          <div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
            <div className="text-center text-white">
              <Loader2 size={28} className="mx-auto animate-spin" />
              <p className="mt-2 text-xs font-bold">Enhancing photo...</p>
            </div>
          </div>
        )}
      </div>
      {stage === 'uploaded' && (
        <div className="flex items-center justify-between bg-[#fbf7ef] px-3 py-2.5">
          <span className="text-xs font-semibold text-[#6f746f]">Photo uploaded</span>
          <div className="flex gap-2">
            <button onClick={() => setStage('empty')} className="text-xs font-bold text-[#9a9b95]">Replace</button>
            <button onClick={handleEnhance} className="flex items-center gap-1.5 rounded-lg bg-[#c26b42] px-3 py-1.5 text-xs font-bold text-white transition active:scale-95">
              <Wand2 size={14} /> AI Enhance
            </button>
          </div>
        </div>
      )}
      {stage === 'enhanced' && (
        <div className="bg-[#f1f5ed] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Check size={14} className="shrink-0 text-[#718c57]" />
            <div className="flex flex-1 flex-wrap gap-1">
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#718c57]">Brightness</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#718c57]">Background</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#718c57]">Color</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <button onClick={() => setStage('empty')} className="text-xs font-bold text-[#9a9b95]">Replace photo</button>
            <div className="flex gap-2">
              <button onClick={() => setShowBefore(!showBefore)} className="text-xs font-bold text-[#c26b42]">{showBefore ? 'Show enhanced' : 'Compare'}</button>
              <button onClick={handleEnhance} className="flex items-center gap-1.5 rounded-lg border border-[#ddd2c1] px-3 py-1 text-xs font-bold text-[#6f746f]"><Wand2 size={13} /> Re-enhance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VoiceInput({ field, onResult }: { field: 'title' | 'description'; onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const start = () => {
    setListening(true);
    window.setTimeout(() => {
      setListening(false);
      onResult(field === 'title' ? 'Hand-thrown Clay Pot' : 'Handcrafted using traditional Khurja pottery techniques. Each piece is shaped by hand on the wheel, sun-dried, and kiln-fired to a warm earthy finish.');
    }, 2500);
  };
  return (
    <button onClick={start} disabled={listening} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold transition active:scale-90 ${listening ? 'bg-[#c26b42] text-white voice-pulse' : 'bg-[#f5e1d4] text-[#c26b42]'}`} aria-label="Voice input">
      <Mic size={14} className={listening ? 'animate-pulse' : ''} />
      {listening ? 'Listening...' : 'Voice'}
    </button>
  );
}

function AddProduct({ onBack, onContinue, onSave }: { onBack: () => void; onContinue: (p: Product) => void; onSave: (p: Product) => void }) {
  const [form, setForm] = useState({ name: '', description: '', category: 'Pottery', materials: '', hours: '', quantity: '', packaging: '', price: '' });
  const update = (k: keyof typeof form, v: string) => setForm((c) => ({ ...c, [k]: v }));
  const valid = form.name && form.description && form.quantity && Number(form.quantity) > 0;
  const product: Product = { id: Date.now(), name: form.name || 'Untitled handmade product', category: form.category, price: Number(form.price) || 450, stock: Number(form.quantity) || 0, color: 'terracotta', description: form.description || 'Handmade product made with care.' };
  return (
    <div className="pb-8">
      <AppHeader title="Add Product" onBack={onBack} />
      <div className="px-5 pt-4">
        <PhotoUpload />
        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold">Product title *</label>
              <VoiceInput field="title" onResult={(text) => update('name', text)} />
            </div>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Hand-thrown Clay Pot" className="h-12 w-full rounded-xl border border-[#ddd2c1] bg-white px-4 text-sm outline-none transition placeholder:text-[#a4a5a0] focus:border-[#c26b42] focus:ring-2 focus:ring-[#c26b42]/10" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold">Description *</label>
              <VoiceInput field="description" onResult={(text) => update('description', text)} />
            </div>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the craft, technique and story" className="min-h-24 w-full resize-y rounded-xl border border-[#ddd2c1] bg-white p-4 text-sm outline-none focus:border-[#c26b42]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Category *</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="h-12 w-full rounded-xl border border-[#ddd2c1] bg-white px-4 text-sm outline-none">
              <option>Pottery</option><option>Stationery</option><option>Textiles</option><option>Home decor</option>
            </select>
          </div>
          <Field label="Materials used" placeholder="Rosewood, brass" value={form.materials} onChange={(e) => update('materials', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Labour hours" placeholder="3.5" type="number" value={form.hours} onChange={(e) => update('hours', e.target.value)} />
            <Field label="Quantity *" placeholder="12" type="number" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Packaging (₹)" placeholder="25" type="number" value={form.packaging} onChange={(e) => update('packaging', e.target.value)} />
            <Field label="Expected price (₹)" placeholder="450" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <button disabled={!valid} onClick={() => onContinue(product)} className="h-13 w-full rounded-2xl bg-[#202a3f] py-3.5 font-bold text-white transition active:scale-[.97] disabled:opacity-40">
            Continue to fair price
          </button>
          <button onClick={() => onSave(product)} className="w-full rounded-2xl border border-[#cdbda8] py-3.5 text-sm font-bold">Save as draft</button>
        </div>
        {!valid && <p className="mt-3 text-center text-xs text-[#b95735]">Add a title, description and positive quantity to continue.</p>}
      </div>
    </div>
  );
}

function Pricing({ product, onBack, onContinue }: { product: Product; onBack: () => void; onContinue: (price: number) => void }) {
  const [values, setValues] = useState({ material: '120', hours: '3', rate: '80', packaging: '25', shipping: '60', charges: '45', profit: '80' });
  const total = Object.values(values).reduce((s, v) => s + Number(v || 0), 0);
  const update = (k: keyof typeof values, v: string) => setValues((c) => ({ ...c, [k]: v }));
  return (
    <div className="pb-8">
      <AppHeader title="Fair-Price Calculator" onBack={onBack} />
      <div className="px-5 pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[#fbf7ef] p-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#bd7543] text-white"><Box size={22} /></div>
          <div><p className="text-sm font-bold">{product.name}</p><p className="text-xs text-[#777d76]">{product.category}</p></div>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Material cost (₹)" value={values.material} type="number" onChange={(e) => update('material', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Labour hours" value={values.hours} type="number" onChange={(e) => update('hours', e.target.value)} />
            <Field label="Rate / hour (₹)" value={values.rate} type="number" onChange={(e) => update('rate', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Packaging (₹)" value={values.packaging} type="number" onChange={(e) => update('packaging', e.target.value)} />
            <Field label="Shipping (₹)" value={values.shipping} type="number" onChange={(e) => update('shipping', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Marketplace charges (₹)" value={values.charges} type="number" onChange={(e) => update('charges', e.target.value)} />
            <Field label="Profit margin (₹)" value={values.profit} type="number" onChange={(e) => update('profit', e.target.value)} />
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-[#eadbc8] bg-[#fbf7ef] p-3 text-xs leading-5 text-[#6f746f]">
          <b className="text-[#202a3f]">Fair Price = </b>Material + Labour + Packaging + Shipping + Marketplace charges + Profit
        </div>
        <div className="mt-5 rounded-3xl bg-[#202a3f] p-5 text-white">
          <p className="text-xs text-white/60">Recommended price</p>
          <p className="mt-2 font-serif text-4xl">₹{total.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-[#a4c485]">Minimum: ₹{Math.round(total * .9).toLocaleString('en-IN')}</p>
          <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-white/60">Labour cost</span><span>₹{(Number(values.hours) * Number(values.rate)).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-white/60">Other costs</span><span>₹{(total - Number(values.hours) * Number(values.rate)).toLocaleString('en-IN')}</span></div>
          </div>
          <p className="mt-5 text-xs leading-5 text-white/65">This price covers your costs and gives you room to grow.</p>
          <button onClick={() => onContinue(total)} className="mt-4 h-12 w-full rounded-xl bg-[#c26b42] font-bold transition active:scale-[.97]">Use ₹{total.toLocaleString('en-IN')}</button>
        </div>
      </div>
    </div>
  );
}

function Preview({ product, marketplaces: selected, setMarketplaces: setSelected, onBack, onPublish }: { product: Product; marketplaces: string[]; setMarketplaces: (v: string[]) => void; onBack: () => void; onPublish: () => void }) {
  const toggle = (name: string) => setSelected(selected.includes(name) ? selected.filter((i) => i !== name) : [...selected, name]);
  return (
    <div className="pb-8">
      <AppHeader title="Preview & Publish" onBack={onBack} />
      <div className="px-5 pt-4">
        <div className="overflow-hidden rounded-2xl border border-[#e3d8c7] bg-white">
          <div className="grid h-52 place-items-center bg-[#bd7543]"><Box size={64} strokeWidth={1} className="text-white/80" /></div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#c26b42]">{product.category}</p>
                <h2 className="mt-1 font-serif text-xl font-bold">{product.name}</h2>
              </div>
              <button className="grid h-9 w-9 place-items-center rounded-lg border border-[#ddd2c1]"><Pencil size={15} /></button>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6f746f]">{product.description}</p>
            <div className="mt-4 flex items-end justify-between border-t border-[#eee7dc] pt-3">
              <span className="font-serif text-2xl">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="rounded-full bg-[#edf3e7] px-3 py-1 text-xs font-bold text-[#718c57]">{product.stock} in stock</span>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[#e3d8c7] bg-white p-4">
          <div className="flex items-center gap-2"><Store size={18} className="text-[#c26b42]" /><h2 className="font-bold">Select marketplaces</h2></div>
          <p className="mt-2 text-xs leading-5 text-[#747a74]">Mock connections for this demo. No live listing will be created.</p>
          <div className="mt-4 space-y-2.5">
            {marketplaces.map((m) => (
              <button key={m.name} onClick={() => toggle(m.name)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition active:scale-[.97] ${selected.includes(m.name) ? 'border-[#718c57] bg-[#f1f5ed]' : 'border-[#e3d8c7]'}`}>
                <span className={`grid h-9 w-9 place-items-center rounded-lg text-xs font-bold text-white ${m.color === 'navy' ? 'bg-[#202a3f]' : m.color === 'blue' ? 'bg-[#4775a9]' : 'bg-[#718c57]'}`}>{m.short}</span>
                <span className="flex-1"><span className="block text-sm font-bold">{m.name}</span><span className="block text-xs text-[#7d847c]">{m.detail}</span></span>
                <span className={`grid h-5 w-5 place-items-center rounded-full border ${selected.includes(m.name) ? 'border-[#718c57] bg-[#718c57] text-white' : 'border-[#cfc3b2]'}`}>{selected.includes(m.name) && <Check size={13} />}</span>
              </button>
            ))}
          </div>
        </div>
        <button disabled={!selected.length} onClick={onPublish} className="mt-5 h-13 w-full rounded-2xl bg-[#202a3f] py-3.5 font-bold text-white transition active:scale-[.97] disabled:opacity-40">
          Save and publish listing
        </button>
      </div>
    </div>
  );
}

function Orders({ orders, filter, setFilter, confirmOrder }: { orders: Order[]; filter: 'All' | OrderStatus; setFilter: (v: 'All' | OrderStatus) => void; confirmOrder: (id: string) => void }) {
  const shown = filter === 'All' ? orders : orders.filter((o) => o.status === filter);
  return (
    <div className="pb-8">
      <AppHeader title="Orders" />
      <div className="px-5 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {['All', 'New', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((f) => (
            <button key={f} onClick={() => setFilter(f as 'All' | OrderStatus)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${filter === f ? 'bg-[#202a3f] text-white' : 'border border-[#ddd2c1] bg-white text-[#697384]'}`}>{f}</button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {shown.map((o) => (
            <div key={o.id} className="rounded-2xl border border-[#e3d8c7] bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#f5e1d4] text-[#c26b42]"><Package size={20} /></div>
                  <div><p className="text-sm font-bold">{o.product}</p><p className="mt-0.5 text-xs text-[#777d76]">{o.id} · {o.date}</p></div>
                </div>
                <span className="rounded-full bg-[#f4eee4] px-3 py-1 text-xs font-bold text-[#667070]">{o.status}</span>
              </div>
              {o.status === 'New' && (
                <button onClick={() => confirmOrder(o.id)} className="mt-3 w-full rounded-xl bg-[#202a3f] py-2.5 text-xs font-bold text-white transition active:scale-[.97]">Confirm order</button>
              )}
              <div className="mt-3 grid grid-cols-3 gap-3 border-t border-[#eee7dc] pt-3 text-xs">
                <div><p className="text-[#858a83]">Market</p><p className="mt-0.5 font-semibold">{o.marketplace.split(' ')[0]}</p></div>
                <div><p className="text-[#858a83]">Qty</p><p className="mt-0.5 font-semibold">{o.quantity}</p></div>
                <div><p className="text-[#858a83]">Payment</p><p className="mt-0.5 font-semibold text-[#718c57]">{o.payment}</p></div>
              </div>
            </div>
          ))}
          {!shown.length && <div className="rounded-2xl border border-dashed border-[#d8c7ac] p-10 text-center text-sm text-[#737974]">No orders match this filter.</div>}
        </div>
      </div>
    </div>
  );
}

function Inventory({ products, updateStock, onBack }: { products: Product[]; updateStock: (id: number, amt: number) => void; onBack: () => void }) {
  const lowCount = products.filter((p) => p.stock <= 5).length;
  return (
    <div className="pb-8">
      <AppHeader title="Inventory" onBack={onBack} />
      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-[#f8e2d8] p-4">
          <div className="flex gap-3"><Clock3 className="shrink-0 text-[#b95735]" size={20} /><div><p className="font-bold text-[#8d422a]">{lowCount} products need attention</p><p className="mt-0.5 text-xs text-[#965940]">Restock low-quantity products to keep listings active.</p></div></div>
        </div>
        <div className="mt-4 space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-[#e3d8c7] bg-white p-3">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${p.color === 'terracotta' ? 'bg-[#bd7543]' : p.color === 'teal' ? 'bg-[#225854]' : 'bg-[#bc8c29]'}`}><Box className="text-white/80" size={22} /></div>
              <div className="flex-1"><p className="text-sm font-bold">{p.name}</p><p className="mt-0.5 text-xs text-[#7d847c]">{p.category} · ₹{p.price}</p></div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${p.stock <= 5 ? 'bg-[#f8e2d8] text-[#b95735]' : 'bg-[#edf3e7] text-[#718c57]'}`}>{p.stock}</span>
                <button onClick={() => updateStock(p.id, -1)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#ddd2c1] text-lg font-bold">−</button>
                <button onClick={() => updateStock(p.id, 1)} className="grid h-8 w-8 place-items-center rounded-lg bg-[#202a3f] text-lg font-bold text-white">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Payments({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div className="pb-8">
      <AppHeader title="Payments" action={<button onClick={() => navigate('settings')} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm"><Settings size={18} /></button>} />
      <div className="px-5 pt-4">
        <div className="space-y-3">
          <div className="rounded-2xl bg-[#202a3f] p-5 text-white"><p className="text-xs text-white/60">Total earnings</p><p className="mt-2 font-serif text-3xl">₹90,000</p><p className="mt-1 text-xs text-[#a4c485]">This month</p></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#e3d8c7] bg-white p-4"><p className="text-xs text-[#737974]">Pending</p><p className="mt-2 font-serif text-xl">₹8,450</p><p className="mt-1 text-[10px] text-[#c26b42]">2–4 days</p></div>
            <div className="rounded-2xl border border-[#e3d8c7] bg-white p-4"><p className="text-xs text-[#737974]">Completed</p><p className="mt-2 font-serif text-xl">₹81,550</p><p className="mt-1 text-[10px] text-[#718c57]">Paid out</p></div>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-[#e3d8c7] bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c26b42]">By marketplace</p>
          <div className="mt-4 space-y-4">
            {marketplaces.map((m) => (
              <div key={m.name}>
                <div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold">{m.name}</span><span className="font-bold">₹{m.earnings.toLocaleString('en-IN')}</span></div>
                <div className="h-2 rounded-full bg-[#f0e8db]"><div className="h-2 rounded-full bg-[#c26b42]" style={{ width: `${m.earnings / 45}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#eef3e8] p-4">
          <div className="flex gap-3"><Wallet className="shrink-0 text-[#718c57]" size={20} /><div><p className="text-sm font-bold">UPI: meeradevi@upi</p><p className="mt-0.5 text-xs text-[#687363]">Demo settlement account</p></div></div>
          <button onClick={() => navigate('settings')} className="rounded-lg border border-[#9eb18a] px-3 py-2 text-xs font-bold text-[#5f744b]">Edit</button>
        </div>
        <p className="mt-4 text-center text-xs text-[#7e827f]">Payment settlement follows the policy of each connected marketplace. Mock settlement view.</p>
      </div>
    </div>
  );
}

function Notifications({ onBack }: { onBack: () => void }) {
  const items = [
    { icon: <Check size={18} />, title: 'Order confirmed', text: 'Order #KN-4821 received. You\'ll be notified when it ships.', time: '10:42 AM', tone: 'green' },
    { icon: <Truck size={18} />, title: 'Out for delivery', text: 'Order #KN-4798 is with the delivery partner, arriving today.', time: '9:05 AM', tone: 'yellow' },
    { icon: <FileText size={18} />, title: 'Listing needs attention', text: '"Block-print Journal" is low on photos — add one more to keep it live.', time: 'Yesterday', tone: 'red' },
    { icon: <IndianRupee size={18} />, title: 'Settlement update', text: '₹4,000 from Amazon Karigar has been marked as paid.', time: 'Yesterday', tone: 'green' },
  ];
  return (
    <div className="pb-8">
      <AppHeader title="Notifications" onBack={onBack} />
      <div className="px-5 pt-4 space-y-3">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3 rounded-2xl border border-[#e3d8c7] bg-white p-4">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.tone === 'green' ? 'bg-[#edf3e7] text-[#718c57]' : item.tone === 'yellow' ? 'bg-[#f7efd9] text-[#b48b30]' : 'bg-[#f8e2d8] text-[#b95735]'}`}>{item.icon}</span>
            <div className="flex-1"><div className="flex justify-between gap-2"><p className="text-sm font-bold">{item.title}</p><span className="whitespace-nowrap text-xs text-[#92968f]">{item.time}</span></div><p className="mt-1 text-xs leading-5 text-[#737974]">{item.text}</p></div>
          </div>
        ))}
        <div className="rounded-2xl border border-dashed border-[#d8c7ac] p-5 text-center text-sm text-[#737974]">You're all caught up. New updates will appear here.</div>
      </div>
    </div>
  );
}

function SettingsPage({ language, setLanguage, notify, onLogout }: { language: string; setLanguage: (v: 'English' | 'Hindi') => void; notify: (m: string) => void; onLogout: () => void }) {
  const [upi, setUpi] = useState('meeradevi@upi');
  const [editing, setEditing] = useState(false);
  const validUpi = /^[\w.-]+@[\w.-]+$/.test(upi);
  return (
    <div className="pb-8">
      <AppHeader title="Settings" />
      <div className="px-5 pt-4">
        <div className="flex items-center gap-4 rounded-2xl border border-[#e3d8c7] bg-white p-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#e7d4bd] font-serif text-xl">M</div>
          <div className="flex-1"><h2 className="font-serif text-lg font-bold">Meera Devi</h2><p className="mt-0.5 text-xs text-[#737974]">KN-10442 · Handmade pottery</p></div>
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-[#ddd2c1]"><Pencil size={15} /></button>
        </div>
        <div className="mt-4 divide-y divide-[#eee7dc] rounded-2xl border border-[#e3d8c7] bg-white">
          <div className="flex items-center gap-3 p-4"><UserRound className="text-[#c26b42]" size={18} /><div className="flex-1"><p className="text-sm font-bold">Seller profile</p><p className="mt-0.5 text-xs text-[#737974]">Meera Devi · Khurja, UP</p></div><ChevronRight size={18} className="text-[#a9a69e]" /></div>
          <div className="flex items-center gap-3 p-4"><Sparkles className="text-[#c26b42]" size={18} /><div className="flex-1"><p className="text-sm font-bold">Language</p></div><div className="flex rounded-lg bg-[#f0e8db] p-1"><button onClick={() => setLanguage('English')} className={`rounded px-3 py-1 text-xs font-bold ${language === 'English' ? 'bg-white shadow-sm' : 'text-[#777d76]'}`}>EN</button><button onClick={() => setLanguage('Hindi')} className={`rounded px-3 py-1 text-xs font-bold ${language === 'Hindi' ? 'bg-white shadow-sm' : 'text-[#777d76]'}`}>हि</button></div></div>
          <div className="p-4">
            <div className="flex items-center gap-3"><Wallet className="text-[#c26b42]" size={18} /><div className="flex-1"><p className="text-sm font-bold">UPI / payment details</p></div><button onClick={() => setEditing(!editing)} className="text-xs font-bold text-[#c26b42]">{editing ? 'Close' : 'Edit'}</button></div>
            {editing && <div className="mt-3 flex gap-2"><input value={upi} onChange={(e) => setUpi(e.target.value)} className="h-10 flex-1 rounded-xl border border-[#ddd2c1] px-3 text-sm outline-none focus:border-[#c26b42]" /><button onClick={() => validUpi ? notify('Payment details saved') : notify('Enter a valid UPI ID')} className="rounded-xl bg-[#202a3f] px-4 text-sm font-bold text-white">Save</button></div>}
            <p className={`mt-2 text-xs ${validUpi ? 'text-[#718c57]' : 'text-[#b95735]'}`}>{upi}</p>
          </div>
          <div className="flex items-center gap-3 p-4"><Store className="text-[#c26b42]" size={18} /><div className="flex-1"><p className="text-sm font-bold">Connected marketplaces</p><p className="mt-0.5 text-xs text-[#737974]">Amazon Karigar · Flipkart Samarth · ONDC</p></div><span className="rounded-full bg-[#edf3e7] px-2 py-0.5 text-[10px] font-bold text-[#718c57]">Demo</span></div>
          <div className="flex items-center gap-3 p-4"><CircleHelp className="text-[#c26b42]" size={18} /><div className="flex-1"><p className="text-sm font-bold">Help and support</p></div><ChevronRight size={18} className="text-[#a9a69e]" /></div>
        </div>
        <button onClick={onLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f8e2d8] py-3.5 text-sm font-bold text-[#9d4932] transition active:scale-[.97]"><LogOut size={17} /> Log out</button>
      </div>
    </div>
  );
}

export default App;
