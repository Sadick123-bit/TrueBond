import React, { useEffect, useMemo, useState } from 'react';
import {
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Search,
  SlidersHorizontal,
  UserRound,
  Menu,
  X,
  Check,
  ArrowRight,
  LockKeyhole,
  Camera,
  Crown,
  LogOut,
  Send,
  MapPin,
  BadgeCheck,
} from 'lucide-react';
import { supabase, supabaseConfigured } from './supabase';

const demoProfiles = [
  {
    id: 'demo-1',
    name: 'Amara',
    age: 27,
    city: 'Accra, Ghana',
    tagline: 'Looking for a love that feels like home.',
    interests: ['Travel', 'Brunch', 'Live music'],
    photo:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
    verified: true,
  },
  {
    id: 'demo-2',
    name: 'Daniel',
    age: 30,
    city: 'Kumasi, Ghana',
    tagline: 'Big on kindness, family, and spontaneous road trips.',
    interests: ['Hiking', 'Cooking', 'Fitness'],
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85',
    verified: true,
  },
  {
    id: 'demo-3',
    name: 'Nana',
    age: 26,
    city: 'Tema, Ghana',
    tagline: 'A curious mind, a warm heart, and a passport ready.',
    interests: ['Books', 'Art', 'Travel'],
    photo:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85',
    verified: false,
  },
  {
    id: 'demo-4',
    name: 'Michael',
    age: 29,
    city: 'Accra, Ghana',
    tagline: 'Building a good life and hoping to share it.',
    interests: ['Music', 'Coffee', 'Beach days'],
    photo:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85',
    verified: true,
  },
  {
    id: 'demo-5',
    name: 'Esi',
    age: 28,
    city: 'Cape Coast, Ghana',
    tagline: 'I love thoughtful conversations and new places.',
    interests: ['Food', 'Nature', 'Movies'],
    photo:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
    verified: true,
  },
  {
    id: 'demo-6',
    name: 'Kojo',
    age: 31,
    city: 'Accra, Ghana',
    tagline: 'Easygoing, intentional, and always learning.',
    interests: ['Design', 'Football', 'Cooking'],
    photo:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85',
    verified: false,
  },
];

function Brand() {
  return (
    <a className="brand" href="#" aria-label="TrueBond home">
      <span className="brand-mark">
        <Heart size={19} fill="currentColor" />
      </span>
      <span>
        TrueBond<span className="brand-dot">.</span>
      </span>
    </a>
  );
}

function AuthModal({ onClose, onSession }) {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMessage('');

    if (!supabaseConfigured) {
      setMessage(
        'Connect your Supabase project first. Check SETUP.md for instructions.'
      );
      return;
    }

    setBusy(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name.trim() },
          },
        });

        if (error) throw error;

        if (data.session) onSession(data.session);

        setMessage(
          'Account created. Check your email to confirm your address, then sign in.'
        );
        setMode('signin');
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw error;

        onSession(data.session);
        onClose();
      }
    } catch (err) {
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <button
          className="icon-btn modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="modal-brand">
          <span className="brand-mark">
            <Heart size={18} fill="currentColor" />
          </span>
        </div>

        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>

        <h2 id="auth-title">
          {mode === 'signup' ? 'Make room for love.' : 'Welcome back.'}
        </h2>

        <p className="muted">
          {mode === 'signup'
            ? 'Create your account and meet people with intention.'
            : 'Sign in to continue your TrueBond journey.'}
        </p>

        <form onSubmit={submit} className="auth-form">
          {mode === 'signup' && (
            <label>
              Your name
              <input
                required
                minLength="2"
                maxLength="60"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How should we call you?"
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Email address
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              required
              minLength="8"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete={
                mode === 'signup' ? 'new-password' : 'current-password'
              }
            />
          </label>

          <button
            className="btn btn-primary btn-full"
            disabled={busy}
          >
            {busy
              ? 'Please wait…'
              : mode === 'signup'
                ? 'Create free account'
                : 'Sign in'}
            <ArrowRight size={17} />
          </button>
        </form>

        {message && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}

        <p className="auth-switch">
          {mode === 'signup' ? 'Already a member?' : 'New to TrueBond?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setMessage('');
            }}
          >
            {mode === 'signup' ? 'Sign in' : 'Create account'}
          </button>
        </p>

        <p className="legal-note">
          <LockKeyhole size={13} />
          Your details are protected. Never share your password.
        </p>
      </section>
    </div>
  );
}

function ProfileCard({ profile, onLike, liked, onChat }) {
  return (
    <article className="profile-card">
      <div className="profile-photo-wrap">
        <img
          className="profile-photo"
          src={
            profile.photo ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85'
          }
          alt={`${profile.name}'s profile`}
          loading="lazy"
        />

        <span className="photo-shade" />

        <div className="photo-topline">
          <span className="online-dot" />
          <span>Recently active</span>
        </div>

        <button
          className={`like-float ${liked ? 'is-liked' : ''}`}
          onClick={() => onLike(profile)}
          aria-label={`Like ${profile.name}`}
        >
          <Heart
            size={21}
            fill={liked ? 'currentColor' : 'none'}
          />
        </button>

        <div className="profile-photo-caption">
          <h3>
            {profile.name}, {profile.age}{' '}
            {profile.verified && (
              <BadgeCheck size={18} className="verified" />
            )}
          </h3>

          <p>
            <MapPin size={13} />
            {profile.city || 'Location not set'}
          </p>
        </div>
      </div>

      <div className="profile-card-body">
        <p className="profile-tagline">
          “{profile.tagline || 'Here to meet someone genuine.'}”
        </p>

        <div className="interest-row">
          {(profile.interests || ['Getting to know people'])
            .slice(0, 3)
            .map((interest) => (
              <span className="interest" key={interest}>
                {interest}
              </span>
            ))}
        </div>

        <div className="card-actions">
          <button
            className="btn btn-outline btn-small"
            onClick={() => onChat(profile)}
          >
            <MessageCircle size={15} />
            Say hello
          </button>

          <button
            className={`btn btn-like btn-small ${liked ? 'is-liked' : ''}`}
            onClick={() => onLike(profile)}
          >
            {liked ? <Check size={15} /> : <Heart size={15} />}
            {liked ? 'Liked' : 'Like'}
          </button>
        </div>
      </div>
    </article>
  );
}

function ChatPanel({ profile, onClose, session }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [notice, setNotice] = useState(
    'Chat becomes available after a mutual match.'
  );

  useEffect(() => {
    let alive = true;

    async function load() {
      if (
        !supabaseConfigured ||
        !session?.user ||
        !profile?.id ||
        String(profile.id).startsWith('demo-')
      ) {
        return;
      }

      const { data: matchRows } = await supabase
        .from('matches')
        .select('id')
        .or(
          `and(user_a.eq.${session.user.id},user_b.eq.${profile.id}),and(user_a.eq.${profile.id},user_b.eq.${session.user.id})`
        )
        .limit(1);

      if (!alive) return;

      if (!matchRows?.length) {
        setNotice('Like each other to unlock private messaging.');
        return;
      }

      const matchId = matchRows[0].id;
      setNotice('');

      const { data } = await supabase
        .from('messages')
        .select('id,sender_id,body,created_at')
        .eq('match_id', matchId)
        .order('created_at');

      if (alive) setMessages(data || []);
    }

    load();

    return () => {
      alive = false;
    };
  }, [profile, session]);

  async function send(e) {
    e.preventDefault();

    const body = text.trim();
    if (!body) return;

    if (
      !supabaseConfigured ||
      !session?.user ||
      String(profile?.id).startsWith('demo-')
    ) {
      setNotice(
        'Connect Supabase and match with a real member to send messages.'
      );
      return;
    }

    const { data: matchRows, error: matchError } = await supabase
      .from('matches')
      .select('id')
      .or(
        `and(user_a.eq.${session.user.id},user_b.eq.${profile.id}),and(user_a.eq.${profile.id},user_b.eq.${session.user.id})`
      )
      .limit(1);

    if (matchError || !matchRows?.length) {
      setNotice('Private chat is available only after a mutual match.');
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: matchRows[0].id,
        sender_id: session.user.id,
        body,
      })
      .select()
      .single();

    if (error) {
      setNotice(error.message);
    } else {
      setMessages((prev) => [...prev, data]);
      setText('');
      setNotice('');
    }
  }

  return (
    <div className="chat-overlay">
      <section
        className="chat-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Chat with ${profile.name}`}
      >
        <header className="chat-header">
          <div className="chat-person">
            <img src={profile.photo} alt="" />
            <div>
              <strong>{profile.name}</strong>
              <small>{notice ? 'TrueBond member' : 'Your match'}</small>
            </div>
          </div>

          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close chat"
          >
            <X />
          </button>
        </header>

        <div className="chat-safety">
          <ShieldCheck size={15} />
          Keep conversations respectful. Never send money to someone
          you have not met.
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender_id === session?.user?.id ? 'mine' : ''
              }`}
            >
              <p>{message.body}</p>
              <small>
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </small>
            </div>
          ))}

          {notice && (
            <div className="chat-empty">
              <MessageCircle size={28} />
              <p>{notice}</p>
            </div>
          )}
        </div>

        <form className="chat-compose" onSubmit={send}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a kind message…"
            aria-label="Message"
            maxLength={2000}
          />

          <button
            className="btn btn-primary send-btn"
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </form>
      </section>
    </div>
  );
}

function PremiumModal({ onClose, onInterest }) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <section
        className="auth-modal premium-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-title"
      >
        <button
          className="icon-btn modal-close"
          onClick={onClose}
          aria-label="Close TrueBond Plus"
        >
          <X size={20} />
        </button>

        <div className="modal-brand">
          <span className="brand-mark">
            <Crown size={20} />
          </span>
        </div>

        <p className="eyebrow">THE NEXT CHAPTER</p>

        <h2 id="premium-title">
          TrueBond <em>Plus.</em>
        </h2>

        <p className="muted">
          More possibilities for your journey. TrueBond's core
          connections remain free, with extra features planned for Plus.
        </p>

        <div className="premium-benefit-list">
          <div>
            <Check size={17} />
            <span>See who liked you</span>
          </div>
          <div>
            <Check size={17} />
            <span>Advanced discovery filters</span>
          </div>
          <div>
            <Check size={17} />
            <span>More daily likes</span>
          </div>
          <div>
            <Check size={17} />
            <span>Video-date enhancements</span>
          </div>
        </div>

        <div className="premium-price-row">
          <div>
            <strong>Free</strong>
            <p className="muted">Basic connections</p>
          </div>
          <strong>$0</strong>
        </div>

        <div className="premium-price-row">
          <div>
            <strong>TrueBond Plus</strong>
            <p className="muted">Planned membership</p>
          </div>
          <span className="premium-coming-soon">Coming soon</span>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={onInterest}
        >
          I'm interested <Heart size={17} />
        </button>

        <p className="legal-note">
          No payment is taken. Plus membership and payments are not
          available yet.
        </p>
      </section>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [chatProfile, setChatProfile] = useState(null);
  const [likedIds, setLikedIds] = useState([]);
  const [profiles, setProfiles] = useState(demoProfiles);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [myProfile, setMyProfile] = useState({
    display_name: '',
    age: '',
    city: '',
    bio: '',
    interests: '',
    photo_url: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => setSession(nextSession)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadProfiles() {
      if (!supabaseConfigured) return;

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id,display_name,age,city,bio,interests,photo_url,created_at'
        )
        .eq('is_visible', true)
        .neq(
          'id',
          session?.user?.id || '00000000-0000-0000-0000-000000000000'
        )
        .limit(40);

      if (!alive) return;

      if (error) {
        console.error('Error loading profiles:', error.message);
        setNotice('Could not load member profiles.');
      } else {
        setProfiles(
          (data || []).map((p) => ({
            id: p.id,
            name: p.display_name || 'TrueBond member',
            age: p.age || '—',
            city: p.city || 'Location not set',
            tagline: p.bio,
            interests: p.interests || [],
            photo: p.photo_url,
            verified: false,
          }))
        );
      }

      if (session?.user) {
        const { data: own } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!alive) return;

        if (own) {
          setMyProfile({
            display_name: own.display_name || '',
            age: own.age || '',
            city: own.city || '',
            bio: own.bio || '',
            interests: (own.interests || []).join(', '),
            photo_url: own.photo_url || '',
          });
        }
      }
    }

    loadProfiles();

    return () => {
      alive = false;
    };
  }, [session]);

  const filtered = useMemo(
    () =>
      profiles.filter((profile) => {
        const searchable = [
          profile.name,
          profile.city,
          profile.tagline,
          ...(profile.interests || []),
        ]
          .join(' ')
          .toLowerCase();

        return (
          searchable.includes(query.toLowerCase()) &&
          (activeTab !== 'liked' || likedIds.includes(profile.id))
        );
      }),
    [profiles, query, activeTab, likedIds]
  );

  async function likeProfile(profile) {
    if (!session?.user) {
      setAuthOpen(true);
      return;
    }

    if (String(profile.id).startsWith('demo-')) {
      setNotice(
        'Demo profiles are previews. Connect Supabase and create real accounts to use likes.'
      );
      return;
    }

    const already = likedIds.includes(profile.id);

    setLikedIds((prev) =>
      already
        ? prev.filter((id) => id !== profile.id)
        : [...prev, profile.id]
    );

    if (supabaseConfigured) {
      const result = already
        ? await supabase
            .from('likes')
            .delete()
            .eq('from_user', session.user.id)
            .eq('to_user', profile.id)
        : await supabase.from('likes').insert({
            from_user: session.user.id,
            to_user: profile.id,
          });

      if (result.error) {
        setNotice(result.error.message);
        return;
      }

      if (!already) {
        const { data: reverse } = await supabase
          .from('likes')
          .select('id')
          .eq('from_user', profile.id)
          .eq('to_user', session.user.id)
          .maybeSingle();

        if (reverse) {
          setNotice(`It's a match! You and ${profile.name} liked each other.`);
        } else {
          setNotice(
            `You liked ${profile.name}. If they like you too, you'll match.`
          );
        }
      } else {
        setNotice(`You removed your like for ${profile.name}.`);
      }
    }
  }

  async function saveProfile(e) {
    e.preventDefault();

    if (!session?.user || !supabaseConfigured) {
      setNotice(
        'Sign in with your connected Supabase project to save a profile.'
      );
      return;
    }

    const age = Number(myProfile.age);

    if (!Number.isInteger(age) || age < 18 || age > 100) {
      setNotice('TrueBond is for adults 18+. Enter a valid age.');
      return;
    }

    const interests = myProfile.interests
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 12);

    const payload = {
      id: session.user.id,
      display_name: myProfile.display_name.trim(),
      age,
      city: myProfile.city.trim(),
      bio: myProfile.bio.trim(),
      interests,
      photo_url: myProfile.photo_url || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload);

    if (error) {
      setNotice(error.message);
    } else {
      setNotice('Your profile has been saved.');
      setProfileOpen(false);

      const { data } = await supabase
        .from('profiles')
        .select(
          'id,display_name,age,city,bio,interests,photo_url,created_at'
        )
        .eq('is_visible', true)
        .neq('id', session.user.id)
        .limit(40);

      if (data) {
        setProfiles(
          data.map((p) => ({
            id: p.id,
            name: p.display_name || 'TrueBond member',
            age: p.age || '—',
            city: p.city || 'Location not set',
            tagline: p.bio,
            interests: p.interests || [],
            photo: p.photo_url,
            verified: false,
          }))
        );
      }
    }
  }

  async function uploadPhoto(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!session?.user || !supabaseConfigured) {
      setNotice('Sign in and connect Supabase before uploading photos.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setNotice('Please choose an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice('Please choose an image smaller than 5 MB.');
      return;
    }

    setUploading(true);

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${session.user.id}/${crypto.randomUUID()}-${safeName}`;

      const { error } = await supabase.storage
        .from('profile-photos')
        .upload(path, file, {
          upsert: false,
          contentType: file.type,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(path);

      setMyProfile((prev) => ({
        ...prev,
        photo_url: data.publicUrl,
      }));

      setNotice('Photo uploaded. Save your profile to publish it.');
    } catch (err) {
      setNotice(err.message || 'Could not upload the photo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function signOut() {
    if (supabaseConfigured) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setNotice(error.message);
        return;
      }
    }

    setSession(null);
    setLikedIds([]);
    setNotice('You have signed out.');
  }

  function showPremiumInterest() {
    setPremiumOpen(false);
    setNotice(
      "Thanks for your interest in TrueBond Plus! It's coming soon. No payment or notification signup has been made."
    );
    document.getElementById('discover')?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />

          <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
            <button
              className={
                activeTab === 'discover' ? 'nav-link active' : 'nav-link'
              }
              onClick={() => {
                setActiveTab('discover');
                setMenuOpen(false);
              }}
            >
              Discover
            </button>

            <button
              className={
                activeTab === 'liked' ? 'nav-link active' : 'nav-link'
              }
              onClick={() => {
                setActiveTab('liked');
                setMenuOpen(false);
              }}
            >
              Likes <span className="nav-count">{likedIds.length}</span>
            </button>

            <a
              className="nav-link"
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
            >
              How it works
            </a>
          </nav>

          <div className="topbar-actions">
            {session ? (
              <>
                <button
                  className="icon-btn profile-shortcut"
                  onClick={() => setProfileOpen(true)}
                  aria-label="Edit profile"
                >
                  <UserRound size={18} />
                </button>

                <button
                  className="btn btn-outline sign-in"
                  onClick={signOut}
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-text sign-in"
                  onClick={() => {
                    setAuthOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Log in
                </button>

                <button
                  className="btn btn-primary top-join"
                  onClick={() => {
                    setAuthOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Join TrueBond <ArrowRight size={16} />
                </button>
              </>
            )}

            <button
              className="icon-btn mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              DATING WITH INTENTION
            </div>

            <h1>
              Something real
              <br />
              starts with <em>hello.</em>
            </h1>

            <p className="hero-sub">
              Meet people who value the same things you do. Less swiping
              for the sake of it, more room for a real connection.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={() =>
                  session
                    ? document
                        .getElementById('discover')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    : setAuthOpen(true)
                }
              >
                Find your person <ArrowRight size={18} />
              </button>

              <a href="#how-it-works" className="learn-link">
                How it works <span>↗</span>
              </a>
            </div>

            <div className="hero-proof">
              <div className="avatar-stack">
                <img src={demoProfiles[0].photo} alt="" />
                <img src={demoProfiles[1].photo} alt="" />
                <img src={demoProfiles[2].photo} alt="" />
              </div>

              <div>
                <strong>A little more meaningful.</strong>
                <small>Made for connection, not endless scrolling.</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-image-main">
              <img
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1100&q=90"
                alt="A couple enjoying a happy moment together"
              />
            </div>

            <div className="floating-note note-match">
              <span className="note-icon">
                <Heart size={17} fill="currentColor" />
              </span>
              <span>
                <strong>A lovely possibility</strong>
                <small>One connection at a time</small>
              </span>
            </div>

            <div className="floating-note note-safe">
              <ShieldCheck size={19} />
              <span>
                <strong>Safety comes first</strong>
                <small>Respectful by design</small>
              </span>
            </div>

            <div className="sparkle sparkle-a">✦</div>
            <div className="sparkle sparkle-b">✧</div>
          </div>

          <div className="hero-bottom">
            <span>
              <Sparkles size={15} /> Thoughtful connections
            </span>
            <span>
              <ShieldCheck size={15} /> Safety-minded community
            </span>
            <span>
              <Heart size={15} /> Your pace, your story
            </span>
          </div>
        </section>

        <section className="discover-section section-wrap" id="discover">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A FEW PEOPLE TO GET TO KNOW</p>

              <h2>
                {activeTab === 'liked'
                  ? 'People you like'
                  : 'Your next hello could be here.'}
              </h2>

              <p className="muted">
                Look beyond a photo. Find a little something that makes
                you curious.
              </p>
            </div>

            <div className="discover-controls">
              <label className="search-box">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search profiles"
                  aria-label="Search profiles"
                />
              </label>

              <button
                className="filter-btn"
                onClick={() =>
                  setNotice(
                    'Profile filters are on the roadmap. For now, search by name, city, or interests.'
                  )
                }
              >
                <SlidersHorizontal size={17} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {!supabaseConfigured && (
            <div className="demo-banner">
              <span className="demo-dot" />
              <div>
                <strong>Preview mode</strong>
                <p>
                  These are sample profiles so you can explore the design.
                  Connect Supabase to enable real accounts, likes, photo
                  uploads and chat.
                </p>
              </div>
              <button
                onClick={() =>
                  setNotice(
                    'Open SETUP.md in the project folder for connection steps.'
                  )
                }
              >
                Setup guide <ArrowRight size={14} />
              </button>
            </div>
          )}

          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button
                onClick={() => setNotice('')}
                aria-label="Dismiss notice"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="profile-grid">
            {filtered.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                liked={likedIds.includes(profile.id)}
                onLike={likeProfile}
                onChat={setChatProfile}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <Search size={28} />
              <h3>No profiles found</h3>
              <p>Try another search, or switch back to Discover.</p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setQuery('');
                  setActiveTab('discover');
                }}
              >
                Show all profiles
              </button>
            </div>
          )}

          <div className="browse-footer">
            <span>Good connections take curiosity.</span>
            <span>
              {filtered.length}{' '}
              {filtered.length === 1 ? 'profile' : 'profiles'} to explore
            </span>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-wrap">
            <div className="center-heading">
              <p className="eyebrow">A BETTER WAY TO MEET</p>

              <h2>
                Simple by design.
                <br />
                <em>Meaningful by nature.</em>
              </h2>

              <p className="muted">
                No pressure to be perfect. Just a few thoughtful steps
                toward something real.
              </p>
            </div>

            <div className="steps-grid">
              <div className="step">
                <span className="step-num">01</span>
                <div className="step-icon">
                  <UserRound />
                </div>
                <h3>Show up as you</h3>
                <p>
                  Build a profile that reflects your interests, values,
                  and the kind of connection you hope to find.
                </p>
              </div>

              <div className="step">
                <span className="step-num">02</span>
                <div className="step-icon">
                  <Heart />
                </div>
                <h3>Find a mutual spark</h3>
                <p>
                  Explore profiles and like someone who catches your
                  attention. A match starts when interest goes both ways.
                </p>
              </div>

              <div className="step">
                <span className="step-num">03</span>
                <div className="step-icon">
                  <MessageCircle />
                </div>
                <h3>Start a conversation</h3>
                <p>
                  Say hello, get to know each other, and take the next
                  step when you both feel comfortable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUEBOND PLUS SECTION */}
        <section className="premium-section section-wrap">
          <div className="premium-card">
            <div className="premium-copy">
              <p className="eyebrow light-eyebrow">
                <Crown size={15} /> THE TRUEBOND PLUS IDEA
              </p>

              <h2>
                More possibilities.
                <br />
                <em>On your terms.</em>
              </h2>

              <p>
                TrueBond starts free. A future Plus membership could add
                thoughtful extras without putting genuine connection
                behind a paywall.
              </p>

              <ul>
                <li>
                  <Check size={16} /> See who liked you
                </li>
                <li>
                  <Check size={16} /> Advanced discovery filters
                </li>
                <li>
                  <Check size={16} /> More daily likes
                </li>
                <li>
                  <Check size={16} /> Video-date enhancements
                </li>
              </ul>

              <button
                type="button"
                className="btn btn-light"
                onClick={() => setPremiumOpen(true)}
              >
                Explore TrueBond Plus <ArrowRight size={16} />
              </button>
            </div>

            <div className="premium-art">
              <div className="premium-ring">
                <Heart size={60} strokeWidth={1.2} />
              </div>

              <div className="premium-pill pill-one">
                <Sparkles size={15} /> More meaningful
              </div>

              <div className="premium-pill pill-two">
                <ShieldCheck size={15} /> Your choice
              </div>
            </div>
          </div>
        </section>

        <section className="safety-section section-wrap">
          <div className="safety-icon">
            <ShieldCheck size={27} />
          </div>

          <div>
            <p className="eyebrow">CONNECTION NEEDS TRUST</p>
            <h2>Your comfort matters here.</h2>
            <p className="muted">
              TrueBond is designed around respect. Meet in public for
              first dates, protect your personal information, and report
              anyone who makes you feel unsafe. Safety tools should grow
              with the community.
            </p>
          </div>

          <div className="safety-points">
            <span>
              <Check size={15} /> Block and report tools planned
            </span>
            <span>
              <Check size={15} /> Adults 18+ only
            </span>
            <span>
              <Check size={15} /> Privacy-first foundations
            </span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <Brand />

          <p>For the moments that turn into something more.</p>

          <div className="footer-links">
            <a href="#how-it-works">How it works</a>
            <a href="#discover">Discover</a>
            <button
              onClick={() =>
                setNotice(
                  'Please publish your Privacy Policy and Terms of Service before launching TrueBond publicly.'
                )
              }
            >
              Privacy &amp; terms
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} TrueBond. Made for meaningful
            connections.
          </span>
          <span>Be kind. Be genuine. Be safe.</span>
        </div>
      </footer>

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSession={setSession}
        />
      )}

      {premiumOpen && (
        <PremiumModal
          onClose={() => setPremiumOpen(false)}
          onInterest={showPremiumInterest}
        />
      )}

      {chatProfile && (
        <ChatPanel
          profile={chatProfile}
          session={session}
          onClose={() => setChatProfile(null)}
        />
      )}

      {profileOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) =>
            e.target === e.currentTarget && setProfileOpen(false)
          }
        >
          <section
            className="auth-modal profile-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Edit your profile"
          >
            <button
              className="icon-btn modal-close"
              onClick={() => setProfileOpen(false)}
              aria-label="Close"
            >
              <X />
            </button>

            <p className="eyebrow">YOUR STORY</p>
            <h2>Make it yours.</h2>
            <p className="muted">A little honesty goes a long way.</p>

            <form className="auth-form" onSubmit={saveProfile}>
              <label>
                Display name
                <input
                  required
                  minLength="2"
                  maxLength="60"
                  value={myProfile.display_name}
                  onChange={(e) =>
                    setMyProfile({
                      ...myProfile,
                      display_name: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Age (18+)
                <input
                  required
                  type="number"
                  min="18"
                  max="100"
                  value={myProfile.age}
                  onChange={(e) =>
                    setMyProfile({
                      ...myProfile,
                      age: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                City
                <input
                  maxLength="100"
                  value={myProfile.city}
                  onChange={(e) =>
                    setMyProfile({
                      ...myProfile,
                      city: e.target.value,
                    })
                  }
                  placeholder="City or region"
                />
              </label>

              <label>
                About you
                <textarea
                  maxLength="500"
                  rows="3"
                  value={myProfile.bio}
                  onChange={(e) =>
                    setMyProfile({
                      ...myProfile,
                      bio: e.target.value,
                    })
                  }
                  placeholder="What would you like someone to know?"
                />
              </label>

              <label>
                Interests <small>(comma separated)</small>
                <input
                  maxLength="300"
                  value={myProfile.interests}
                  onChange={(e) =>
                    setMyProfile({
                      ...myProfile,
                      interests: e.target.value,
                    })
                  }
                  placeholder="Music, travel, cooking"
                />
              </label>

              <label className="upload-label">
                <Camera size={17} />
                {uploading ? 'Uploading…' : 'Upload profile photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadPhoto}
                  disabled={uploading}
                  hidden
                />
              </label>

              {myProfile.photo_url && (
                <img
                  className="photo-preview"
                  src={myProfile.photo_url}
                  alt="Your profile preview"
                />
              )}

              <button
                className="btn btn-primary btn-full"
                disabled={uploading}
              >
                Save profile <Check size={17} />
              </button>
            </form>

            {notice && (
              <p className="form-message" role="status">
                {notice}
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
