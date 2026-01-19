import React from "react";
import { motion } from "framer-motion";
import {
    FaBrain,
    FaUserCheck,
    FaCar,
    FaLinkedin,
    FaGlobe,
    FaXTwitter,
} from "react-icons/fa6";
import Footer from "../../components/Footer/footer";
import ThemeToggle from "../../components/ThemeToggle/theme_toggle";

const Landing: React.FC = () => {
    return (
            <div className="dark:bg-primary_BGD text-gray-900 dark:text-white transition-colors duration-500">

                {/* NAVBAR */}
                <nav className="flex items-center justify-between px-10 py-6">

                    {/* LOGO TEXT */}
                    <img
                        src="/gearup-logo.png"
                        alt="GearUp"
                        className="w-20 dark:bg-white rounded-full p-2"
                    />

                    <div className="flex items-center gap-4">
                        <button className="bg-[#137FEC] px-6 py-2 rounded-xl text-white">
                            اشترك
                        </button>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="bg-black dark:bg-gray-800 text-white px-6 py-2 rounded-xl">
                            تسجيل الدخول
                        </button>

                        {/* DARK MODE TOGGLE */}
                        <ThemeToggle />
                        
                    </div>
                </nav>

                {/* HERO */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 px-10 py-24 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold leading-snug mb-6">
                            العناية بالسيارة بطريقة <br /> ذكية وسهلة تبدأ من هنا
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            تعمل منصة GearUp المدعومة بالذكاء الاصطناعي على تبسيط الصيانة والإصلاحات وإدارة الأجزاء، حتى تتمكن من القيادة بثقة.
                        </p>

                        <div className="flex gap-4">
                            <button className="bg-[#137FEC] text-white h-10 w-60 rounded-xl">
                                ابدأ الآن
                            </button>
                            <button className="bg-gray-900 dark:bg-white text-[#F6F7F8] dark:text-[#0F1323] h-10 w-40 rounded-xl">
                                المزيد
                            </button>
                        </div>
                    </motion.div>

                    <motion.img
                        src="/car-dashboard.png"
                        alt="Dashboard"
                        className="rounded-2xl shadow-2xl"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    />
                </section>

                {/* FEATURES */}
                <section className="px-10 py-20 text-center">
                    <h2 className="text-3xl font-bold mb-12">
                        كل ما تحتاجه سيارتك في مكان واحد
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((_, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gray-100 dark:bg-[#131A2E] p-8 rounded-2xl"
                            >
                                <FaBrain className="text-blue-500 text-4xl mx-auto mb-4" />
                                <h3 className="font-bold mb-2">
                                    تشخيصات الذكاء الاصطناعي
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    تحليل دقيق لمشاكل السيارة باستخدام بيانات حقيقية
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>
                {/* HOW IT WORKS */}
                <section className="mx-10 my-20 rounded-2xl px-10 py-16 text-center">
                    <h2 className="text-3xl font-bold mb-12">كيف يعمل</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-blue-50 dark:bg-primary_BGD p-8 rounded-xl"
                        >
                            <FaCar className="text-blue-600 text-4xl mx-auto mb-4" />
                            <h3 className="font-bold mb-2">
                                1. أدخل بيانات السيارة
                            </h3>
                            <p className="text-sm text-gray-600">
                                أدخل رقم تعريف المركبة VIN
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-blue-50 dark:bg-primary_BGD p-8  rounded-xl"
                        >
                            <FaBrain className="text-blue-600 text-4xl mx-auto mb-4" />
                            <h3 className="font-bold mb-2">
                                2. تشخيص ذكي
                            </h3>
                            <p className="text-sm text-gray-600">
                                الذكاء الاصطناعي يحدد الأعطال المحتملة
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-blue-50 dark:bg-primary_BGD p-8 rounded-xl"
                        >
                            <FaUserCheck className="text-blue-600 text-4xl mx-auto mb-4" />
                            <h3 className="font-bold mb-2">
                                3. احجز ميكانيكي
                            </h3>
                            <p className="text-sm text-gray-600">
                                تواصل مع خبراء معتمدين
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* TEAM */}
                <section className="px-10 py-20 text-center">
                    <h2 className="text-3xl font-bold mb-12">فريق العمل</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((_, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="bg-[#137FEC] dark:bg-[#137FEC80] text-white rounded-tr-[60px] rounded-bl-[60px] p-4 h-65 w-60 mx-auto"
                            >
                                <img
                                    src="/avatar-team.png"
                                    alt="Member"
                                    className="w-20 h-20 rounded-full mx-auto mb-4"
                                />
                                <h3 className="font-bold">ALI GAMAL</h3>
                                <p className="text-sm opacity-80 mb-4">
                                    UI / UX
                                </p>

                                <div className="flex justify-center gap-4 text-xl">
                                    <FaLinkedin />
                                    <FaGlobe />
                                    <FaXTwitter />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-[#137FEC] dark:bg-[#137FEC80] text-white text-center mx-10 rounded-2xl py-16 mb-20">
                    <h2 className="text-3xl font-bold mb-4">
                        جاهزون للسيطرة على العناية بسيارتك؟
                    </h2>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                        onClick={() => window.location.href = '/register'} 
                        className="bg-[#101922] text-white h-10 w-40 rounded-lg">
                            سجل الآن
                        </button>
                        <button
                        onClick={() => window.location.href = '/login'} 
                        className="border border-[#F6F7F81A] text-white h-10 w-40 rounded-lg">
                            تسجيل الدخول
                        </button>
                    </div>
                </section>
                {/* FOOTER */}
                <Footer />
            </div>
    );
};

export default Landing;