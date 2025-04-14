// src/components/common/toggle_dark.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggle } from '@/store/darkModeSlice';
import { selectDarkMode } from '@/store/darkModeSlice';

const DarkModeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectDarkMode);

  // أنيميشن للتبديل بين الأيقونات
  const iconVariants = {
    initial: { opacity: 0, scale: 0.5, rotate: -90 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.5, rotate: 90 },
  };

  // إعدادات أنيميشن للزر
  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  return (
    <motion.button
      onClick={() => dispatch(toggle())}
      className={`p-2 rounded-full border focus:outline-none transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'
      }`}
      type="button"
      aria-label="Toggle Dark Mode"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <AnimatePresence mode="wait">
        {isDarkMode ? (
          <motion.span
            key="moon"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, type: 'tween' }}
            style={{ display: 'inline-block' }}
          >
            🌙
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, type: 'tween' }}
            style={{ display: 'inline-block' }}
          >
            ☀️
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default DarkModeToggle;