import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Example cart items for demo
    {
      id: '1',
      name: 'ملحف تقليدي أنيق',
      price: 25000,
      quantity: 1,
      image: 'https://i.postimg.cc/DzDqjCwx/alalalia-white-100-002-039-alt3-sq-gy-2000x2000.jpg'
    }
  ]);
  
  const [guestInfo, setGuestInfo] = useState({
    email: '',
    phone: ''
  });

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} أوقية`;
  };

  const handleCheckout = () => {
    const total = getTotalPrice();
    const itemsText = cartItems.map(item => 
      `${item.name} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}`
    ).join('\n');
    
    const message = `طلب جديد من متجر بنات:\n\n${itemsText}\n\nالإجمالي: ${formatPrice(total)}`;
    const whatsappUrl = `https://wa.me/22249055137?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">سلة المشتريات</h1>
          <p className="text-muted-foreground mb-4">سلتك فارغة حالياً</p>
          <Button asChild>
            <a href="/">متابعة التسوق</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-6">سلة المشتريات</h1>
        
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-banat-pink font-bold">
                  {formatPrice(item.price)}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeItem(item.id)}
                    className="mr-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card p-6 rounded-lg border space-y-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>الإجمالي:</span>
            <span className="text-banat-pink">{formatPrice(getTotalPrice())}</span>
          </div>

          {!user && (
            <div className="space-y-4">
              <h3 className="font-semibold">معلومات الاتصال</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleCheckout}
          >
            إرسال الطلب عبر واتساب
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;