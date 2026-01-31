import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Shop: [
            { name: 'All Products', path: '/products' },
            { name: 'Electronics', path: '/products?category=Electronics' },
            { name: 'Accessories', path: '/products?category=Accessories' },
            { name: 'New Arrivals', path: '/products' },
        ],
        Company: [
            { name: 'About Us', path: '#' },
            { name: 'Careers', path: '#' },
            { name: 'Sustainability', path: '#' },
            { name: 'Terms of Service', path: '#' },
        ],
        Support: [
            { name: 'Contact Us', path: '#' },
            { name: 'Shipping Info', path: '#' },
            { name: 'Returns', path: '#' },
            { name: 'FAQ', path: '#' },
        ]
    };

    return (
        <footer className="bg-slate-900 pt-24 pb-12 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="flex items-center space-x-3 mb-8 group">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl">
                                <span className="text-slate-900 font-black text-xl tracking-tighter">M.</span>
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">
                                MODERN<span className="text-primary-500">S.</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-sm">
                            Building the future of e-commerce with curated premium goods and an unparalleled shopping experience.
                        </p>
                        <div className="flex items-center space-x-4">
                            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                                <motion.a
                                    key={social}
                                    href="#"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
                                >
                                    <i className={`fab fa-${social}`}></i>
                                    {/* Using SVG for better reliability if FontAwesome is missing */}
                                    <span className="sr-only capitalize">{social}</span>
                                    <div className="w-5 h-5 border-2 border-current rounded-sm opacity-20" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="lg:col-span-2">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">{title}</h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-slate-400 hover:text-white font-medium transition-colors duration-300 text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Newsletter</h4>
                        <p className="text-slate-400 text-sm font-medium mb-6">
                            Join our community to get early access to new drops.
                        </p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-slate-800 border-none rounded-xl py-4 px-4 text-white text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-500"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute right-2 top-2 bottom-2 px-4 bg-primary-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-primary-600/20"
                            >
                                JOIN
                            </motion.button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
                        © {currentYear} MODERNS STORE. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center space-x-8">
                        {['Privacy', 'Cookies', 'Security'].map((item) => (
                            <a key={item} href="#" className="text-slate-500 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
