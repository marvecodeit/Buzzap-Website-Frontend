'use client';
import { useState } from 'react';
import Image from 'next/image';
import './product.css'

export default function Products() {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const products = [
        {
            title: 'Product One',
            desc: 'Innovative AI-powered solution for modern businesses looking to scale efficiently.',
            image: '/product1.jpeg'
        },
        {
            title: 'Product Two',
            desc: 'Smart automation tools that streamline workflows and boost productivity.',
            image: '/product2.jpeg'
        },
        {
            title: 'Product Three',
            desc: 'Advanced analytics platform for data-driven decision making.',
            image: '/product3.jpeg'
        },
        {
            title: 'Product Four',
            desc: 'Next-gen marketing automation for maximum reach and engagement.',
            image: '/product4.jpeg'
        }
    ];
    const bigProduct =[
        {
            title:'Product Five',
            desc:'Complete digital transformation suite for enterprises.',
            image:'/produc5.jpeg'
        }
    ]

    return (
        <section className="products">
            <div className="productsInner">
                <h3 className="productsHeading">Buzzap Agency Products</h3>
                
                <div className="productsGrid">
                    <div className="smallProductsColumn">
                        {products.map((p, i) => (
                            <div className="productCard" key={i}>
                                <div className="productImage">
                                    <Image src={p.image} alt={p.title} fill sizes="(max-width: 900px) 100vw, 300px" style={{ objectFit: 'cover' }} />
                                </div>
                                {/* <h4>{p.title}</h4> */}
                                <p>{p.desc}</p>
                                <button className="productButton" onClick={() => setSelectedProduct(p)}>View Details</button>
                            </div>
                        ))}
                    </div>

                    <div className="bigProduct">
                       {bigProduct.map((p,i)=>(
                        <div className="productCard featuredCard" key={i}>
                            <div className="featuredImage" style={{ position: 'relative' }}>
                                <Image src={p.image} alt={p.title} fill sizes="(max-width: 900px) 100vw, 600px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
                            </div>
                            <div className="featuredContent">
                                <span className="featuredBadge">Featured Product</span>
                                {/* <h4>{p.title}</h4> */}
                                <p>{p.desc}</p>
                                <button className="productButton" onClick={() => setSelectedProduct(p)}>View Details</button>
                            </div>
                        </div>))}
                    </div>
                </div>
            </div>

            {selectedProduct && (
                <div className="modalOverlay" onClick={() => setSelectedProduct(null)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <button className="closeButton" onClick={() => setSelectedProduct(null)}>&times;</button>
                        <div className="modalImage" style={{ position: 'relative' }}>
                            <Image src={selectedProduct.image} alt={selectedProduct.title} fill sizes="(max-width: 600px) 100vw, 500px" style={{ objectFit: 'contain' }} />
                        </div>
                        <div className="modalBody">
                            <span className="featuredBadge">Service Detail</span>
                            <h2>{selectedProduct.title}</h2>
                            <p>{selectedProduct.desc}</p>
                            <div className="productPrice">Premium Service</div>
                            <button className="productButton" style={{width: 'auto', padding: '12px 30px'}}>Inquire Now</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}