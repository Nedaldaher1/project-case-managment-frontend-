// ArchivesLayout.jsx
import { Outlet } from "react-router-dom";
import ButtonBackPage from "@/components/common/back_page";

const ArchivesLayout = () => {
    return (
        <div  className="flex flex-col ">
            <div className="flex justify-between self-end items-center p-4">
            <ButtonBackPage />

            </div>

            {/* محتوى الصفحات الفرعية */}
            <Outlet />
        </div>
    );
};

export default ArchivesLayout;