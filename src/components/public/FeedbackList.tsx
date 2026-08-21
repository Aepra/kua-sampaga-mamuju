'use client';

import { useEffect, useState } from 'react';
import { Star, MessageCircle, User } from 'lucide-react';
import type { Feedback } from '@prisma/client';

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('/api/feedback');
        const data = await res.json();
        if (data.success && data.data) {
          setFeedbacks(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch feedback', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-[#191b1f]/20 border-t-[#191b1f] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return null; // Don't show the section if no feedback is approved yet
  }

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-gray-800 border-t border-[#E5EBE5] dark:border-gray-700">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <MessageCircle className="w-8 h-8 text-[#186f64] mb-4" />
          <h2 className="text-[32px] sm:text-[46px] font-semibold text-[#191b1f] font-heading tracking-[0.92px] leading-[1.2] mb-4">
            Suara Pengunjung
          </h2>
          <p className="text-[16px] text-[#9fabad] max-w-2xl">
            Apa kata masyarakat tentang layanan publik kami? Berikut adalah beberapa masukan yang telah diberikan oleh para pengunjung KUA Kecamatan Sampaga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {feedbacks.map((item) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-gray-800 p-8 border border-[#e6ebec] hover:border-[#344245] hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`w-4 h-4 ${star <= item.rating ? 'fill-[#FBBF24] text-[#FBBF24]' : 'fill-[#E5EBE5] text-[#E5EBE5]'}`}
                  />
                ))}
              </div>
              <p className="text-[16px] text-[#191b1f] leading-[1.6] mb-8 flex-grow font-serif italic">
                &quot;{item.message}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#eefcef] text-[#186f64] flex items-center justify-center rounded-sm font-bold text-lg">
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#191b1f]">{item.name}</h4>
                  <span className="text-[12px] text-[#9fabad]">Pengunjung KUA</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

