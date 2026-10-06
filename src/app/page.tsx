'use client';

import React from 'react';
import Link from 'next/link';
import {
  Cake,
  Star,
  Sparkles,
  ArrowRight,
  Heart,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Flame,
  Award,
  ShieldCheck,
  Gift,
  Search,
  Radio
} from 'lucide-react';
import { MENU_ITEMS, CATEGORIES_LIST, REVIEWS_LIST, BLOG_POSTS } from '../data/coffeeData';
import { MenuCard } from '../components/menu/MenuCard';
import { useOrder } from '../context/OrderContext';

export default function HomePage() {
  const { addToCart } = useOrder();
  const bestsellerItems = MENU_ITEMS.slice(0, 5);

  return (
    <div className="space-y-16 text-[#2D2020]">
      
      {/* 1. HERO SECTION (Exact layout from user screenshot) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#FCE4EC] via-[#FFF0F3] to-[#FFF5F6] py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#F8D7DF]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-xs font-semibold text-[#8C7575] tracking-wide">
              Delicious Cakes for Every Celebration
            </span>
            
            <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl text-[#2D2020] leading-[1.15]">
              Made with Love, <br />
              <span className="text-[#E84A74]">Just for You!</span>
            </h1>

            {/* Heart flourish */}
            <div className="flex items-center gap-1.5 text-[#E84A74]">
              <Heart className="w-5 h-5 fill-[#E84A74]" />
              <div className="w-16 h-0.5 bg-[#E84A74]/40 rounded-full" />
            </div>

            <p className="text-sm text-[#7A6767] max-w-md leading-relaxed">
              From birthdays to anniversaries, we bake moments into every slice with artisan craft and freshly pulled coffee.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/order"
                className="bg-[#E84A74] hover:bg-[#D43862] text-white font-semibold text-xs py-3 px-6 rounded-lg flex items-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-105"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/kds"
                className="bg-white hover:bg-[#FFF0F3] border border-[#F8D7DF] text-[#E84A74] font-semibold text-xs py-3 px-4 rounded-lg flex items-center gap-2 transition-all"
              >
                <Radio className="w-4 h-4 text-[#E84A74]" />
                <span>Kitchen Display (KDS)</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=80"
                alt="Delicious Cake Made with Love"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#2D2020]">Shop by Category</h2>
          <div className="w-10 h-0.5 bg-[#E84A74] mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES_LIST.map((cat, idx) => (
            <Link
              key={idx}
              href="/order"
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-[#FDE8ED] border-2 border-[#F8D7DF] group-hover:border-[#E84A74] transition-all duration-300 shadow-xs group-hover:scale-105 flex items-center justify-center overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="font-semibold text-xs text-[#2D2020] group-hover:text-[#E84A74] mt-2.5 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. OUR BESTSELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <h2 className="font-serif font-bold text-2xl text-[#2D2020]">Our Bestsellers</h2>
          <div className="w-10 h-0.5 bg-[#E84A74] mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {bestsellerItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={(item, cust, qty) => addToCart(item, cust, qty)}
            />
          ))}
        </div>
      </section>

      {/* 4. A LITTLE ABOUT US & WHY CHOOSE US (Split Section as in screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: A Little About Us */}
          <div className="lg:col-span-6 bg-white border border-[#F8D7DF] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#E84A74] uppercase tracking-wider">
                A Little About Us
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#2D2020]">
                Baked with Passion, <br />Served with Love.
              </h3>
              <p className="text-xs text-[#7A6767] leading-relaxed">
                At SweetCrumbs, we believe every celebration deserves a perfect cake and freshly brewed beverage. We use the finest ingredients to craft delicious cakes and specialty coffee that bring joy to your special moments.
              </p>
              <div>
                <Link
                  href="/subscription"
                  className="inline-block bg-[#E84A74] hover:bg-[#D43862] text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
                >
                  Read More
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-2xl overflow-hidden border border-[#F8D7DF] aspect-16/9 bg-[#FFF0F3]">
              <img
                src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80"
                alt="Cake"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Why Choose Us? 4 Cards */}
          <div className="lg:col-span-6 bg-[#FFF9F9] border border-[#F8D7DF] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#E84A74] uppercase tracking-wider">
                Why Choose Us?
              </span>
              <div className="w-8 h-0.5 bg-[#E84A74] mt-1 mb-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 bg-white rounded-2xl border border-[#F8D7DF] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FDE8ED] text-[#E84A74] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#2D2020]">Premium Ingredients</h4>
                  <p className="text-[11px] text-[#7A6767] mt-0.5">We use only the finest and freshest ingredients.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#F8D7DF] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FDE8ED] text-[#E84A74] shrink-0">
                  <Cake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#2D2020]">Freshly Baked</h4>
                  <p className="text-[11px] text-[#7A6767] mt-0.5">Every cake is baked fresh daily, just for you.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#F8D7DF] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FDE8ED] text-[#E84A74] shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#2D2020]">Custom Designs</h4>
                  <p className="text-[11px] text-[#7A6767] mt-0.5">Unique designs tailored to your special occasions.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#F8D7DF] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FDE8ED] text-[#E84A74] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#2D2020]">On-Time Delivery</h4>
                  <p className="text-[11px] text-[#7A6767] mt-0.5">Punctual delivery to make your moments perfect.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. WHAT OUR CUSTOMERS SAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <h2 className="font-serif font-bold text-2xl text-[#2D2020]">What Our Customers Say</h2>
          <div className="w-10 h-0.5 bg-[#E84A74] mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS_LIST.map((review, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#F8D7DF] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#FDE8ED]"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#2D2020]">{review.name}</h4>
                  <div className="flex text-amber-400 mt-0.5">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#7A6767] italic leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LATEST FROM OUR BLOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <h2 className="font-serif font-bold text-2xl text-[#2D2020]">Latest from Our Blog</h2>
          <div className="w-10 h-0.5 bg-[#E84A74] mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-[#F8D7DF] rounded-2xl overflow-hidden shadow-xs group flex flex-col justify-between"
            >
              <div className="h-44 overflow-hidden bg-[#FFF0F3]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#2D2020] group-hover:text-[#E84A74] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#7A6767] mt-1 line-clamp-2">
                    {post.desc}
                  </p>
                </div>

                <div className="pt-3">
                  <Link
                    href="/brew-guides"
                    className="text-xs font-bold text-[#E84A74] hover:underline flex items-center gap-1"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SCALLOPED PINK FOOTER (Matching user screenshot) */}
      <footer className="relative bg-[#FF8EA8] text-[#3D2727] pt-8 pb-8 px-4 sm:px-6 lg:px-8 mt-20">
        
        {/* Scallop wave border at top */}
        <div className="absolute -top-3 left-0 right-0 h-3 bg-[#FF8EA8] rounded-t-[50%]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E84A74]">
                <Cake className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-lg text-white">SweetCrumbs</span>
            </div>
            <p className="text-white/90 leading-relaxed text-[11px]">
              We bake more than cakes, we bake happiness! Handcrafted cakes, pastries, and artisan coffee.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2 text-white/90">
            <h4 className="font-bold text-white text-xs mb-1">Quick Links</h4>
            <div><Link href="/" className="hover:underline">Home</Link></div>
            <div><Link href="/order" className="hover:underline">About Us</Link></div>
            <div><Link href="/order" className="hover:underline">Cakes & Pastries</Link></div>
            <div><Link href="/subscription" className="hover:underline">Custom Cakes</Link></div>
            <div><Link href="/brew-guides" className="hover:underline">Bake & Brew Blog</Link></div>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-2 text-white/90">
            <h4 className="font-bold text-white text-xs mb-1">Customer Service</h4>
            <div><Link href="/track" className="hover:underline">Track Pickup Order</Link></div>
            <div><Link href="/order" className="hover:underline">Shipping & Delivery</Link></div>
            <div><Link href="/kds" className="hover:underline">Kitchen Display System</Link></div>
            <div><Link href="/subscription" className="hover:underline">Tasting Box Club</Link></div>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs mb-1">Newsletter</h4>
            <p className="text-white/90 text-[11px]">
              Subscribe to get updates on new cakes, seasonal lattes & sweet offers!
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white text-[#2D2020] text-xs px-3 py-2 rounded-lg focus:outline-none placeholder-[#A88C8C]"
              />
              <button
                type="button"
                className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-xs"
              >
                Subscribe
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-4 border-t border-white/20 text-center text-[10px] text-white/80">
          © {new Date().getFullYear()} SweetCrumbs. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}
