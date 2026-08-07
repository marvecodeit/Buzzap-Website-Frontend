'use client';
import Image from 'next/image';
import './brand.css';

export default function Brand() {
    return (
        <section className="brandSection">
            <div className="brandInner">
                <div className="brandContent">
                    <h2 className="brandHeading">Accelerate Your Brand Visibility</h2>
                    <p className="brandDesc">
                        Buzzap Agency empowers businesses through cutting-edge optimization and 
                        strategic brand positioning. We focus on results that matter.
                    </p>
                    
                    <div className="brandStates">
                        <div className="brandState">
                            <h3>Buzzap SEO</h3>
                            <p>Tailored search strategies designed to capture market share and drive organic traffic.</p>
                        </div>
                        <div className="brandState">
                            <h3>Brand Boost</h3>
                            <p>Enhance your market authority and establish a dominant digital footprint.</p>
                        </div>
                        <div className="brandState">
                            <h3>Fast SEO</h3>
                            <p>Agile optimization techniques that deliver rapid ranking improvements and measurable ROI.</p>
                        </div>
                    </div>
                </div>
                <div className="brandImageWrapper">
                    <Image src="/product.jpeg" alt="Buzzap Brand Services" className="brandHeroImage" width={1200} height={800} style={{ width: '100%', height: 'auto' }} />
                </div>
            </div>
        </section>
    );
}