// src/pages/unauthorized/page.tsx
const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl text-red-500">غير مصرح لك بالوصول</h1>
            <p className="mt-4">يرجى التواصل مع المدير لطلب الصلاحيات.</p>
        </div>
    );
};

export default UnauthorizedPage;