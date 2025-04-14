"use client"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '@/store/darkModeSlice';
const Home = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  const isDarkMode = useSelector(selectDarkMode);
  return (
    <div className="  flex items-center justify-center h-[100vh] ">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200" data-aos="fade-up">
        منظومة تيسير الاعمال داخل نيابات جنوب المنصورة الكلية 
      </h1>
    </div>
  );
}

export default Home;
