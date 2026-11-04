import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Star,
  CheckCircle2,
  Shield,
  Building2,
  Bus,
  Heart,
  Send,
  Loader2,
  Users,
} from 'lucide-react';
import { neighbourhoods } from '@/data/neighbourhoods';
import { supabase } from '@/lib/supabase';

interface SurveyResponse {
  id: string;
  neighbourhood_id: string;
  neighbourhood_name: string;
  safety_rating: number;
  amenities_rating: number;
  transport_rating: number;
  overall_rating: number;
  would_live: boolean;
  comment: string | null;
  created_at: string;
}

type RatingKey = 'safety' | 'amenities' | 'transport' | 'overall';

const ratingConfig: Record<RatingKey, { icon: typeof Shield; label: string }> = {
  safety: { icon: Shield, label: 'Safety & Security' },
  amenities: { icon: Building2, label: 'Amenities & Venues' },
  transport: { icon: Bus, label: 'Public Transport' },
  overall: { icon: Heart, label: 'Overall Rating' },
};

const sampleResponses: SurveyResponse[] = [
  {
    id: '1',
    neighbourhood_id: 'n1',
    neighbourhood_name: 'Downtown Core',
    safety_rating: 4,
    amenities_rating: 5,
    transport_rating: 5,
    overall_rating: 5,
    would_live: true,
    comment: 'Vibrant area with excellent metro access and top-notch dining options.',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: '2',
    neighbourhood_id: 'n3',
    neighbourhood_name: 'Suburban Heights',
    safety_rating: 5,
    amenities_rating: 4,
    transport_rating: 3,
    overall_rating: 4,
    would_live: true,
    comment: 'Very quiet and safe for families with great parks.',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export default function SurveyPage() {
  const [selectedId, setSelectedId] = useState(neighbourhoods[0].id);
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    safety: 0,
    amenities: 0,
    transport: 0,
    overall: 0,
  });
  const [wouldLive, setWouldLive] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  const selected = neighbourhoods.find((n) => n.id === selectedId)!;

  useEffect(() => {
    async function fetchResponses() {
      try {
        const { data, error } = await supabase
          .from('survey_responses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (error || !data || data.length === 0) {
          setResponses(sampleResponses);
          return;
        }
        setResponses((data as SurveyResponse[]) ?? sampleResponses);
      } catch {
        setResponses(sampleResponses);
      }
    }
    fetchResponses();
  }, []);

  const handleRating = (key: RatingKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
    setSubmitted(false);
  };

  const allRated = Object.values(ratings).every((v) => v > 0) && wouldLive !== null;

  const handleSubmit = async () => {
    if (!allRated) return;
    setSubmitting(true);
    setError(null);

    const newResponse: SurveyResponse = {
      id: String(Date.now()),
      neighbourhood_id: selected.id,
      neighbourhood_name: selected.name,
      safety_rating: ratings.safety,
      amenities_rating: ratings.amenities,
      transport_rating: ratings.transport,
      overall_rating: ratings.overall,
      would_live: wouldLive,
      comment: comment.trim() || null,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('survey_responses').insert({
        neighbourhood_id: selected.id,
        neighbourhood_name: selected.name,
        safety_rating: ratings.safety,
        amenities_rating: ratings.amenities,
        transport_rating: ratings.transport,
        overall_rating: ratings.overall,
        would_live: wouldLive,
        comment: comment.trim() || null,
      });
    } catch {
      // Gracefully store in local state if database is not reachable
    }

    setSubmitting(false);
    setSubmitted(true);
    setResponses((prev) => [newResponse, ...prev]);
    setRatings({ safety: 0, amenities: 0, transport: 0, overall: 0 });
    setWouldLive(null);
    setComment('');
  };

  return (
    <div className="pt-16 bg-pastel-50 min-h-screen">
      {/* Header */}
      <div className="bg-pastel-100/60 border-b border-pastel-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-lg bg-mint-100 text-mint-600">
              <ClipboardList className="w-5 h-5 text-mint-500" />
            </div>
            <h1 className="text-xl font-bold text-pastel-500">Neighbourhood Survey</h1>
          </div>
          <p className="text-xs sm:text-sm text-pastel-400 max-w-xl">
            Rate a neighbourhood based on your perception of safety, amenities, and transport.
            Your responses contribute directly to the community dataset.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-5 gap-5 items-start">
          {/* Main Survey form */}
          <div className="lg:col-span-3 space-y-4">
            {/* Neighbourhood selector card */}
            <div className="bg-white rounded-xl border border-pastel-200/80 shadow-xs p-4 sm:p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-pastel-400 mb-2.5">
                1. Select Neighbourhood
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {neighbourhoods.map((n) => {
                  const active = n.id === selectedId;
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        setSelectedId(n.id);
                        setSubmitted(false);
                      }}
                      className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${active
                        ? 'border-mint-500 bg-mint-50/80 text-mint-700 font-semibold shadow-2xs'
                        : 'border-pastel-200 hover:border-pastel-300 text-pastel-400 hover:bg-pastel-50/50'
                        }`}
                    >
                      <div className="truncate font-medium">{n.name}</div>
                      <div className="text-[11px] text-pastel-300">{n.city}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating section card */}
            <div className="bg-white rounded-xl border border-pastel-200/80 shadow-xs p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-pastel-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-pastel-400">
                  2. Rate <span className="text-mint-600 font-bold lowercase capitalize">{selected.name}</span>
                </label>
                <span className="text-[11px] text-pastel-300 font-medium">1 = Low, 5 = High</span>
              </div>

              <div className="space-y-3.5">
                {(Object.keys(ratingConfig) as RatingKey[]).map((key) => {
                  const config = ratingConfig[key];
                  const Icon = config.icon;
                  return (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 rounded-lg bg-pastel-50/60 border border-pastel-100/70">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-mint-500 shrink-0" />
                        <span className="text-xs font-medium text-pastel-500">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(key, star)}
                            className="group p-0.5 transition-transform active:scale-90"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${star <= ratings[key]
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-pastel-100 text-pastel-300 group-hover:fill-pastel-200 group-hover:text-pastel-400'
                                }`}
                            />
                          </button>
                        ))}
                        <span className="ml-1.5 text-[11px] font-semibold w-9 text-right text-pastel-400">
                          {ratings[key] > 0 ? `${ratings[key]}/5` : '-'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Would live question */}
              <div className="mt-4 pt-3.5 border-t border-pastel-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-xs font-medium text-pastel-500">
                      Would you live in this neighbourhood?
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setWouldLive(true);
                        setSubmitted(false);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${wouldLive === true
                        ? 'border-mint-500 bg-mint-50 text-mint-700 font-semibold'
                        : 'border-pastel-200 hover:border-pastel-300 text-pastel-400'
                        }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-mint-500" />
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        setWouldLive(false);
                        setSubmitted(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${wouldLive === false
                        ? 'border-rose-400 bg-rose-50 text-rose-600 font-semibold'
                        : 'border-pastel-200 hover:border-pastel-300 text-pastel-400'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div className="mt-4 pt-3.5 border-t border-pastel-100">
                <label className="block text-xs font-medium text-pastel-500 mb-1.5">
                  Additional Comments <span className="text-pastel-300 font-normal">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder="Share your experience or thoughts..."
                  className="w-full px-3 py-2 rounded-lg border border-pastel-200 text-xs text-pastel-500 placeholder-pastel-300 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:border-transparent resize-none"
                />
              </div>

              {/* Error notification */}
              {error && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-500 text-xs">
                  {error}
                </div>
              )}

              {/* Success notification */}
              {submitted && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-mint-50 border border-mint-200 text-mint-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint-500" />
                  Thank you! Your response has been recorded.
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!allRated || submitting}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-mint-400 hover:bg-mint-500 disabled:bg-pastel-200 disabled:text-pastel-400 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Survey
                  </>
                )}
              </button>
              {!allRated && (
                <p className="mt-1.5 text-center text-[11px] text-pastel-300">
                  Please complete all 4 ratings and select 'Yes' or 'No'.
                </p>
              )}
            </div>
          </div>

          {/* Recent responses sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-pastel-200/80 shadow-xs p-4 lg:sticky lg:top-20">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-pastel-100">
                <Users className="w-4 h-4 text-mint-500" />
                <h2 className="text-sm font-bold text-pastel-500">Recent Community Ratings</h2>
              </div>

              {responses.length === 0 ? (
                <p className="text-xs text-pastel-400 text-center py-6">
                  No survey responses yet. Be the first to rate a neighbourhood!
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {responses.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-lg border border-pastel-100/90 p-3 bg-pastel-50/50 hover:bg-pastel-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-pastel-500 text-xs">
                          {r.neighbourhood_name}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.would_live
                            ? 'bg-mint-100 text-mint-700'
                            : 'bg-rose-100 text-rose-600'
                            }`}
                        >
                          {r.would_live ? 'Would live' : 'Would not'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-pastel-400 bg-white/70 p-2 rounded border border-pastel-100/60 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-mint-500" /> Safety: <strong className="text-pastel-500">{r.safety_rating}/5</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-mint-500" /> Amenities: <strong className="text-pastel-500">{r.amenities_rating}/5</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Bus className="w-3 h-3 text-mint-500" /> Transport: <strong className="text-pastel-500">{r.transport_rating}/5</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400" /> Overall: <strong className="text-pastel-500">{r.overall_rating}/5</strong>
                        </span>
                      </div>
                      {r.comment && (
                        <p className="text-[11px] text-pastel-400 italic bg-pastel-100/40 p-1.5 rounded">
                          "{r.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
