import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ButtonBackPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className="pt-16">
            <Button
                variant="outline"
                className="mb-4"
                onClick={() => navigate(-1)}
            >
                العودة
            </Button>
        </div>
    );
}
export default ButtonBackPage;
