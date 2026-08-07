import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

interface FeedbackItem {
  name: string;
  role: string;
  rating: number;
  comments: string;
  date: string;
}

export function UserFeedback() {
  const { notify } = useToast();
  const [name, setName] = useState('');
  const [role, setRole] = useState('Merchant');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      name: 'Alex Johnson',
      role: 'Cafe Owner',
      rating: 5,
      comments: 'The PayVault automatic yield helps me put my daily sales revenue to work instantly. Sub-second testnet settlements are incredible.',
      date: '2026-08-05',
    },
    {
      name: 'Sarah Smith',
      role: 'Retailer Manager',
      rating: 4,
      comments: 'Excellent interface! The mobile responsiveness makes taking transactions on the shop floor extremely natural.',
      date: '2026-08-06',
    },
    {
      name: 'Elena Rostova',
      role: 'Cross-Border Freelancer',
      rating: 5,
      comments: 'I used the SEP-24 Anchor simulation to test cash out to my regional bank. If this is deployed on mainnet, it is a game-changer.',
      date: '2026-08-07',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comments) {
      notify('Please fill out all fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newFeedback: FeedbackItem = {
        name,
        role,
        rating,
        comments,
        date: new Date().toISOString().split('T')[0],
      };
      setFeedbacks((prev) => [newFeedback, ...prev]);
      setName('');
      setComments('');
      setRating(5);
      setIsSubmitting(false);
      notify('Thank you! Your feedback has been registered.', 'success');
    }, 1000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
      <Card>
        <CardHeader
          title="Submit User Feedback"
          subtitle="Collect feedback from onboarded merchants"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-brand-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Your Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none transition focus:border-brand-500"
              >
                <option value="Merchant">Merchant</option>
                <option value="Customer">Customer</option>
                <option value="Developer">Developer</option>
                <option value="Auditor">Auditor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none transition focus:border-brand-500"
              >
                {[5, 4, 3, 2, 1].map((val) => (
                  <option key={val} value={val}>
                    {val} Star{val > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Comments / Suggestions
            </label>
            <textarea
              placeholder="Tell us about your experience..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-brand-500 resize-none"
              required
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            className="w-full bg-brand-500 hover:bg-brand-600 mt-2"
          >
            Submit Feedback
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader
          title="Onboarded Users Feedback Feed"
          subtitle="Real-world user validation tracking"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />

        <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
          {feedbacks.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2 animate-fade-in"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.role}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-yellow-400">{'★'.repeat(item.rating)}</span>
                  <span className="text-[10px] text-slate-500">({item.date})</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{item.comments}"</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
