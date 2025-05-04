import { motion } from 'framer-motion';

const WaveAnimation = () => (
  <motion.div
    className="absolute bottom-0 left-0 w-[200%] h-[200px] flex overflow-hidden"
    initial={{ x: '0%' }}
    animate={{ x: ['0%', '-50%'] }}       // تحرّك نحو اليسار
    transition={{
      duration: 10,
      ease: 'linear',
      repeat: Infinity,
    }}
  >
    {[0].map((_, idx) => (
      <svg
        key={idx}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="w-[50%] h-full flex-shrink-0"
      >
        <path
          fill="#0099ff"
          d="M0,224L40,234.7C80,245,160,267,240,256C320,245,400,203,480,160C560,117,640,75,720,85.3C800,96,880,160,960,192C1040,224,1120,224,1200,208C1280,192,1360,160,1400,144L1440,128L1440,320L0,320Z"
        />
      </svg>
    ))}
  </motion.div>
);

export default WaveAnimation;
