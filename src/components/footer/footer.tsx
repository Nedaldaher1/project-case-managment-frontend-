import { useNavigate } from 'react-router-dom';
import { FC } from 'react';

const Footer: FC = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="w-full h-[90px] flex justify-around items-center bg-gray-100">
            <div className='flex justify-center items-center gap-5'>
                <h1 className="text-black" onClick={() => handleNavigation('/')}>نيابة اجا الجزئية</h1>
            </div>
            <div className='flex justify-center items-center gap-5'>
                <h1 className="text-black">جميع الحقوق محفوظة لنيابة اجا الجزئية © 2024</h1>
            </div>
            <div className='flex justify-center items-center gap-5'>
                <img src={'/logo.png'} width={176} height={77} alt="logo" />
            </div>
        </div>
    );
}

export default Footer;