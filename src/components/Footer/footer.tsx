const Footer: React.FC = () => {
  return (
    <footer className="mt-20">
      {/* الخط اللي فوق */}
      <div className="border-t border-gray-300 mb-6" />

      {/* محتوى الفوتر */}
      <div className="flex flex-col md:flex-row items-center justify-between px-10 pb-6 text-sm text-gray-700">

        {/* لينكات (يمين) */}
        <div className="flex gap-8 order-2 md:order-1">
          <a href="#" className="hover:text-blue-600 transition dark:text-white">
            شروط الخدمة
          </a>
          <a href="#" className="hover:text-blue-600 transition dark:text-white">
            سياسة الخصوصية
          </a>
          <a href="#" className="hover:text-blue-600 transition dark:text-white">
            معلومات عنا
          </a>
        </div>

        {/* الحقوق (شمال) */}
        <div className="order-1 md:order-2 mb-4 md:mb-0 dark:text-white">
          © 2025 GearUp. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
