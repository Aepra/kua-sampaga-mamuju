'use client';

import { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FeedbackModal from './FeedbackModal';
import { useToast } from '@/components/ui/Toast';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const handleClick = () => {
    if (status === 'unauthenticated') {
      showToast('Silakan masuk (login) terlebih dahulu untuk memberikan masukan.', 'error');
      router.push('/login');
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-transparent hover:bg-white dark:bg-gray-800/10 text-white border-2 border-white/50 font-bold transition-all hover:-translate-y-0.5"
        style={{ padding: '10px 28px', borderRadius: '100px', fontSize: '14px' }}
      >
        <MessageSquarePlus className="w-4 h-4" />
        Berikan Masukan
      </button>
      {isOpen && <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}

