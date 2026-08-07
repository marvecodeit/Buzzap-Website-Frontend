"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { submitLead } from '@/lib/api';
import './Footer.css';

export default function Footer() {
    const pathname = usePathname();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | done | error

    // Hide the marketing footer on the admin/login screens.
    if (pathname === '/login' || pathname.startsWith('/dashboard')) return null;

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (status === 'loading') return;
        setStatus('loading');
        try {
            // Newsletter only collects an email; derive a name from the local part
            // so it satisfies the lead schema's name requirement.
            const derivedName = email.split('@')[0] || 'Subscriber';
            await submitLead({ name: derivedName, email, source: 'newsletter' });
            setStatus('done');
            setEmail('');
        } catch {
            setStatus('error');
        }
    };

    return (
        <footer className="footer-section">
            <div className="footer-glow-core"></div>

            <div className="footer-container">
                <div className="footer-main-grid">

                    <div className="footer-brand-column">
                        <Image src="/logo.png" alt="Buzzap Agency" className="footer-logo" width={120} height={30} style={{ height: 30, width: 'auto' }} />
                        <p className="footer-brand-desc">
                            AI growth systems that generate leads, follow up automatically, and close deals faster than your competition.
                        </p>
                        <div className="footer-social-row">
                            <a href="https://twitter.com/buzzapagency" className="social-link-icon" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                                <span className="custom-icon">𝕏</span>
                            </a>
                            <a href="https://linkedin.com/company/buzzapagency" className="social-link-icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                                <span className="custom-icon">in</span>
                            </a>
                        </div>
                    </div>

                    <div className="footer-links-column">
                        <h4>Services</h4>
                        <ul>
                            <li><Link href="/services">AI Marketing</Link></li>
                            <li><Link href="/services">Brand Boost &amp; SEO</Link></li>
                            <li><Link href="/services">CRM &amp; Automation</Link></li>
                            <li><Link href="/contact">Custom AI Solutions</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-column">
                        <h4>Company</h4>
                        <ul>
                            <li><Link href="/about">About Buzzap</Link></li>
                            <li><Link href="/why-buzzap">Why Buzzap</Link></li>
                            <li><Link href="/case-studies">Case Studies</Link></li>
                            <li><Link href="/insights">Insights</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                            <li><Link href="/pricing">Pricing</Link></li>
                            <li><Link href="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    <div className="footer-newsletter-column">
                        <h4>Stay Updated</h4>
                        <p>Get our best AI growth frameworks and playbooks delivered weekly.</p>
                        {status === 'done' ? (
                            <p className="footer-subscribe-success">Thanks — you&apos;re on the list!</p>
                        ) : (
                            <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="footer-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="footer-submit-btn" disabled={status === 'loading'}>
                                    <span>{status === 'loading' ? '…' : 'Join'}</span>
                                </button>
                            </form>
                        )}
                        {status === 'error' && (
                            <p className="footer-subscribe-error">Something went wrong. Please try again.</p>
                        )}
                    </div>

                </div>

                <hr className="footer-divider" />

                <div className="footer-bottom-row">
                    <p className="copyright-text">
                        &copy; {new Date().getFullYear()} Buzzap Agency. All rights reserved.
                    </p>
                    <div className="footer-legal-links">
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/security">Security</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}