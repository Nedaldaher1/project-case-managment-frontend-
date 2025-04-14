import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ButtonBackPage = () => {
    const navigate = useNavigate();
    
    return (
        <Button
        variant="outline"
        className="mb-4"
        onClick={() => {
            navigate(-1);
        }}
        >
        الرجوع للصفحة السابقة
        </Button>
    );
}
export default ButtonBackPage;
