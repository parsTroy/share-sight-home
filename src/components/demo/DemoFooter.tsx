
import { Link } from "react-router-dom";

export const DemoFooter = () => {
  return (
    <footer className="bg-background border-t py-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold text-primary">Dividnd</h2>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Dividnd. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
