import { Shield, User, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="gradient-bg text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Shield className="text-primary text-xl" />
            </div>
            <h1 className="text-2xl font-bold">SafeRoute</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button 
              className="hover:text-accent transition-colors"
              data-testid="button-profile"
            >
              <User className="text-xl" />
            </button>
            <button 
              className="hover:text-accent transition-colors"
              data-testid="button-settings"
            >
              <Settings className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
