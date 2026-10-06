'use client';

import React, { useState } from 'react';
import {
  Star,
  Heart,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Camera,
  Coffee,
  Send,
  X
} from 'lucide-react';
import { CUSTOMER_REVIEWS, MENU_ITEMS } from '../../data/coffeeData';
import { CustomerReview } from '../../types/coffee';
import { playSoundEffect } from '../../utils/sound';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(CUSTOMER_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Review Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [favoriteItem, setFavoriteItem] = useState(MENU_ITEMS[0].name);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: name.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating,
      date: 'Just now',
      comment: comment.trim(),
      favoriteItem,
      verifiedVisit: true
    };

    setReviews([newRev, ...reviews]);
    setIsSubmitted(true);
    playSoundEffect('success');
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setName('');
      setComment('');
    }, 1500);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#FFF5F6] to-white border-t border-[#F8D7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#FFF0F3] border border-[#F8D7DF] px-3.5 py-1 rounded-full text-[10px] font-bold text-[#E84A74]">
              <Heart className="w-3.5 h-3.5 fill-[#E84A74]" />
              <span>Community Wall of Love</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#2D2020]">
              Loved by Coffee & Pastry Enthusiasts
            </h2>
            <p className="text-xs text-[#7A6767]">
              Real reviews from daily regulars and specialty brew travelers.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 px-5 rounded-2xl flex items-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-105"
          >
            <Camera className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Author & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[#F8D7DF]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#2D2020] flex items-center gap-1">
                        <span>{rev.author}</span>
                        {rev.verifiedVisit && (
                          <span title="Verified Customer">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#A88C8C]">{rev.date}</div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-[#5D4A4A] leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {/* Photo if present */}
                {rev.photoUrl && (
                  <div className="h-28 rounded-xl overflow-hidden border border-[#F8D7DF]">
                    <img
                      src={rev.photoUrl}
                      alt="Customer favorite"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Favorite Item Badge */}
              <div className="pt-2 border-t border-[#F8D7DF] flex items-center gap-1.5 text-[10px] font-bold text-[#E84A74] bg-[#FFF0F3] px-2.5 py-1 rounded-xl">
                <Coffee className="w-3 h-3" />
                <span className="truncate">Fav: {rev.favoriteItem}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border-2 border-[#F8D7DF] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-[#2D2020]">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-black text-xl text-[#2D2020]">
                Share Your Deja Brew Experience
              </h3>
              <p className="text-xs text-[#7A6767]">
                Help other coffee lovers discover the best brews and bakery treats!
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-[#EAFBF0] border border-emerald-300 text-emerald-800 rounded-2xl p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Thank You for Your Review! 🌸</div>
                <div className="text-xs">Your rating is now featured on our community wall.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#8C7575] uppercase block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full text-xs bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#E84A74]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8C7575] uppercase block mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-slate-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8C7575] uppercase block mb-1">
                    Favorite Drink / Snack
                  </label>
                  <select
                    value={favoriteItem}
                    onChange={(e) => setFavoriteItem(e.target.value)}
                    className="w-full text-xs bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E84A74]"
                  >
                    {MENU_ITEMS.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8C7575] uppercase block mb-1">
                    Review / Tasting Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved about the roast, microfoam, or pastry..."
                    className="w-full text-xs bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl p-3 focus:outline-none focus:border-[#E84A74] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#E84A74]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Review</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
