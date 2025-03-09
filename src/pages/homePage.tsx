"use client"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
const Home = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className="  flex items-center justify-center h-[60vh] ">
      <h1 className=' text-center text-6xl'>
        منظومة تيسير الاعمال داخل نيابات جنوب المنصورة الكلية 
      </h1>
    </div>
  );
}

export default Home;
