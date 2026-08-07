'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ThumbsUp, Heart, Lightbulb, PartyPopper, Flame, MessageSquare, CornerDownRight, Send } from 'lucide-react';
import { getPostBySlug, reactToPost, addPostComment, likePostComment } from '@/lib/api';
import MarkdownContent from '@/components/MarkdownContent';
import './article.css';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

const reactionIcons = [
  { type: 'like', label: 'Like', icon: ThumbsUp, color: '#3b82f6', emoji: '👍' },
  { type: 'love', label: 'Love', icon: Heart, color: '#ef4444', emoji: '❤️' },
  { type: 'insightful', label: 'Insightful', icon: Lightbulb, color: '#eab308', emoji: '💡' },
  { type: 'celebrate', label: 'Celebrate', icon: PartyPopper, color: '#10b981', emoji: '🎉' },
  { type: 'mindblown', label: 'Mind Blown', icon: Flame, color: '#a855f7', emoji: '🤯' },
];

export default function ArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Reactions & Comments state
  const [reactions, setReactions] = useState({ like: 0, love: 0, insightful: 0, celebrate: 0, mindblown: 0 });
  const [activeReaction, setActiveReaction] = useState(null);
  const [likedComments, setLikedComments] = useState(new Set());
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    getPostBySlug(slug)
      .then((data) => {
        setPost(data.post);
        if (data.post.reactions) setReactions(data.post.reactions);
        if (data.post.comments) setComments(data.post.comments);

        if (data.post._id) {
          try {
            const savedReact = localStorage.getItem(`bz_react_${data.post._id}`);
            if (savedReact) setActiveReaction(savedReact);

            const savedLikes = JSON.parse(localStorage.getItem(`bz_comment_likes_${data.post._id}`) || '[]');
            setLikedComments(new Set(savedLikes));
          } catch {
            /* silent */
          }
        }
      })
      .catch((err) => {
        if (err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleReact = async (type) => {
    if (!post) return;

    const previousType = activeReaction;
    const isSameReaction = activeReaction === type;
    const newReaction = isSameReaction ? null : type;
    const action = isSameReaction ? 'remove' : 'add';

    setActiveReaction(newReaction);
    setReactions((prev) => {
      const updated = { ...prev };
      if (previousType && updated[previousType] > 0) {
        updated[previousType] = Math.max(0, updated[previousType] - 1);
      }
      if (action !== 'remove') {
        updated[type] = (updated[type] || 0) + 1;
      }
      return updated;
    });

    try {
      if (newReaction) {
        localStorage.setItem(`bz_react_${post._id}`, newReaction);
      } else {
        localStorage.removeItem(`bz_react_${post._id}`);
      }
    } catch {
      /* silent */
    }

    try {
      const res = await reactToPost(post._id, { type, previousType, action });
      if (res.reactions) setReactions(res.reactions);
    } catch {
      /* silent fallback */
    }
  };

  const handleAddComment = async (e, parentId = null) => {
    e.preventDefault();
    if (!post) return;
    const contentText = parentId ? replyContent : commentContent;
    if (!commentName.trim() || !contentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await addPostComment(post._id, {
        authorName: commentName,
        content: contentText,
        parentId,
      });
      if (res.comments) setComments(res.comments);
      if (parentId) {
        setReplyContent('');
        setReplyingToId(null);
      } else {
        setCommentContent('');
      }
    } catch (err) {
      alert(err.message || 'Error posting comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!post) return;

    const isLiked = likedComments.has(commentId);
    const action = isLiked ? 'unlike' : 'like';

    const newSet = new Set(likedComments);
    if (isLiked) {
      newSet.delete(commentId);
    } else {
      newSet.add(commentId);
    }
    setLikedComments(newSet);

    setComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          return { ...c, likes: Math.max(0, (c.likes || 0) + (isLiked ? -1 : 1)) };
        }
        return c;
      })
    );

    try {
      localStorage.setItem(`bz_comment_likes_${post._id}`, JSON.stringify(Array.from(newSet)));
    } catch {
      /* silent */
    }

    try {
      const res = await likePostComment(post._id, commentId, action);
      if (res.comments) setComments(res.comments);
    } catch {
      /* silent */
    }
  };

  // Group top-level comments and nested replies
  const topLevelComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId) => comments.filter((c) => c.parentId === parentId);

  return (
    <main className="article-page">
      <div className="article-glow" />
      <div className="article-container">
        <Link href="/insights" className="article-back">
          <ArrowLeft size={15} /> All insights
        </Link>

        {loading ? (
          <p className="article-status">Loading…</p>
        ) : notFound || !post ? (
          <div className="article-status">
            <h1 className="article-title">Article not found</h1>
            <p>This post may have been unpublished or moved.</p>
          </div>
        ) : (
          <article>
            {post.tags?.length > 0 && (
              <div className="article-tags">
                {post.tags.map((t) => (
                  <span key={t} className="article-tag">{t}</span>
                ))}
              </div>
            )}
            <h1 className="article-title">{post.title}</h1>
            <div className="article-meta">
              {post.author?.name && <span>{post.author.name}</span>}
              {post.author?.name && <span className="article-meta-sep">·</span>}
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.coverImage} alt={post.title} className="article-cover" />
            )}

            {/* Rich Markdown content */}
            <div className="article-content">
              <MarkdownContent content={post.content} />
            </div>

            {/* LinkedIn/Facebook-Style Reactions Bar */}
            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#818cf8', display: 'block', marginBottom: 12 }}>
                Reactions
              </span>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {reactionIcons.map((r) => {
                  const isActive = activeReaction === r.type;
                  return (
                    <button
                      key={r.type}
                      type="button"
                      onClick={() => handleReact(r.type)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        borderRadius: 100,
                        background: isActive ? 'rgba(99, 102, 241, 0.22)' : 'rgba(15, 23, 42, 0.8)',
                        border: isActive ? `1.5px solid ${r.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isActive ? '#fff' : '#cbd5e1',
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? `0 0 16px ${r.color}33` : 'none',
                        transform: isActive ? 'scale(1.04)' : 'none',
                      }}
                    >
                      <span>{r.emoji}</span>
                      <span>{r.label}</span>
                      <span style={{ padding: '2px 6px', borderRadius: 10, background: isActive ? r.color : 'rgba(255,255,255,0.08)', fontSize: 11, color: isActive ? '#fff' : r.color, fontWeight: 700 }}>
                        {reactions[r.type] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nested X/Twitter-Style Comment Thread */}
            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <MessageSquare size={18} style={{ color: '#818cf8' }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>Discussion ({comments.length})</h3>
              </div>

              {/* Main Comment Form */}
              <form onSubmit={(e) => handleAddComment(e, null)} style={{ marginBottom: 32, background: 'rgba(10, 17, 40, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    style={{ width: '100%', padding: '10px 14px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                  />
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="What are your thoughts on this article? Join the discussion…"
                  style={{ width: '100%', padding: '12px 14px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, fontSize: 13, marginBottom: 12, resize: 'vertical' }}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="contact-submit" style={{ padding: '8px 20px', fontSize: 13 }} disabled={submittingComment}>
                    Post Comment <Send size={13} />
                  </button>
                </div>
              </form>

              {/* Render Comments */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {topLevelComments.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: 14 }}>No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  topLevelComments.map((c) => {
                    const isCommentLiked = likedComments.has(c._id);
                    return (
                      <div key={c._id} style={{ background: 'rgba(8, 13, 30, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                              {c.authorName[0]?.toUpperCase() || 'U'}
                            </div>
                            <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{c.authorName}</span>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleLikeComment(c._id)}
                            style={{
                              background: isCommentLiked ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                              border: isCommentLiked ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                              borderRadius: 20,
                              padding: '3px 10px',
                              color: isCommentLiked ? '#818cf8' : '#94a3b8',
                              fontWeight: isCommentLiked ? 700 : 500,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                              fontSize: 12,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <ThumbsUp size={12} style={{ fill: isCommentLiked ? '#818cf8' : 'none' }} /> {c.likes || 0}
                          </button>
                        </div>

                        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6, marginBottom: 8, paddingLeft: 36 }}>{c.content}</p>

                        <div style={{ paddingLeft: 36 }}>
                          <button type="button" onClick={() => setReplyingToId(replyingToId === c._id ? null : c._id)} style={{ background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CornerDownRight size={12} /> Reply
                          </button>
                        </div>

                        {/* Reply Form */}
                        {replyingToId === c._id && (
                          <form onSubmit={(e) => handleAddComment(e, c._id)} style={{ marginTop: 12, marginLeft: 36, background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12 }}>
                            <input
                              type="text"
                              required
                              placeholder="Your Name *"
                              style={{ width: '100%', padding: '8px 12px', background: '#080d1e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6, fontSize: 12, marginBottom: 8 }}
                              value={commentName}
                              onChange={(e) => setCommentName(e.target.value)}
                            />
                            <textarea
                              rows={2}
                              required
                              placeholder={`Replying to ${c.authorName}…`}
                              style={{ width: '100%', padding: '8px 12px', background: '#080d1e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6, fontSize: 12, marginBottom: 8 }}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                              <button type="button" onClick={() => setReplyingToId(null)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                              <button type="submit" className="contact-submit" style={{ padding: '6px 14px', fontSize: 12 }}>Send Reply</button>
                            </div>
                          </form>
                        )}

                        {/* Nested Replies */}
                        {getReplies(c._id).length > 0 && (
                          <div style={{ marginTop: 12, marginLeft: 36, borderLeft: '2px solid rgba(99,102,241,0.2)', paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {getReplies(c._id).map((r) => {
                              const isReplyLiked = likedComments.has(r._id);
                              return (
                                <div key={r._id} style={{ background: 'rgba(2,6,23,0.4)', borderRadius: 10, padding: 10 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 13 }}>{r.authorName}</span>
                                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleLikeComment(r._id)}
                                      style={{
                                        background: isReplyLiked ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                                        border: isReplyLiked ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                                        borderRadius: 16,
                                        padding: '2px 8px',
                                        color: isReplyLiked ? '#818cf8' : '#94a3b8',
                                        fontWeight: isReplyLiked ? 700 : 500,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        fontSize: 11,
                                        transition: 'all 0.2s ease',
                                      }}
                                    >
                                      <ThumbsUp size={11} style={{ fill: isReplyLiked ? '#818cf8' : 'none' }} /> {r.likes || 0}
                                    </button>
                                  </div>
                                  <p style={{ color: '#94a3b8', fontSize: 13 }}>{r.content}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
