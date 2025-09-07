import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Shield className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-primary">SafeRoute</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering women through safe navigation and community support.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-primary transition-colors" data-testid="link-safety-tips">Safety Tips</a>
              <a href="#" className="block hover:text-primary transition-colors" data-testid="link-emergency">Emergency Contacts</a>
              <a href="#" className="block hover:text-primary transition-colors" data-testid="link-community">Community</a>
              <a href="#" className="block hover:text-primary transition-colors" data-testid="link-support">Support</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p data-testid="text-emergency">Emergency: 112</p>
              <p data-testid="text-helpline">Women Helpline: 1091</p>
              <p data-testid="text-email">support@saferoute.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-6 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 SafeRoute. Empowering women's safety through technology.</p>
        </div>
      </div>
    </footer>
  );
}
