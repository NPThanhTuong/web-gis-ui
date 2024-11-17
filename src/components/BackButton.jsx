import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function BackButton({ label, href }) {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <Link to={href}>{label}</Link>
    </Button>
  );
}

export default BackButton;
