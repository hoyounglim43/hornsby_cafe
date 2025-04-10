// src/app/page.tsx
// import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-800">Café Forest</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#menu" className="text-sm font-medium hover:text-green-700 transition-colors">Menu</a>
            <a href="#" className="text-sm font-medium hover:text-green-700 transition-colors">Blog</a>
            <a href="#" className="text-sm font-medium hover:text-green-700 transition-colors">Catering</a>
            <a href="#contact" className="text-sm font-medium hover:text-green-700 transition-colors">Contact</a>
          </nav>
          <Button variant="outline" className="hidden md:flex">Order Now</Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-green-50 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-green-900/70 to-green-700/50"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Café Forest</h1>
          {/* <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Escape to a tranquil oasis where premium coffee meets nature-inspired ambiance</p> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-700 hover:bg-green-800">View Our Menu</Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="menu" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Seasonal Favorites</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our handcrafted seasonal drinks and treats, made with locally sourced ingredients</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <Card className="overflow-hidden">
              <div className="h-60 bg-green-100 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-green-200 flex items-center justify-center text-green-800">Coffee Image</div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Forest Blend Latte</h3>
                <p className="text-gray-600 mb-4">Our signature espresso with hints of hazelnut and vanilla</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">$4.95</span>
                  <Button variant="outline" size="sm">Add to Order</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Product 2 */}
            <Card className="overflow-hidden">
              <div className="h-60 bg-green-100 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-green-200 flex items-center justify-center text-green-800">Pastry Image</div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Woodland Berry Tart</h3>
                <p className="text-gray-600 mb-4">Fresh seasonal berries on a buttery crust with mint garnish</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">$5.75</span>
                  <Button variant="outline" size="sm">Add to Order</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Product 3 */}
            <Card className="overflow-hidden">
              <div className="h-60 bg-green-100 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-green-200 flex items-center justify-center text-green-800">Sandwich Image</div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Harvest Vegetable Sandwich</h3>
                <p className="text-gray-600 mb-4">Roasted vegetables with herb cream cheese on artisan bread</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">$8.50</span>
                  <Button variant="outline" size="sm">Add to Order</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-green-700 hover:bg-green-800">View Full Menu</Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700 mb-6">
                Founded in 2020, Café Forest was born from a passion for exceptional coffee and a commitment to sustainability. Our space is designed to evoke the tranquility of a forest retreat in the heart of the city.
              </p>
              <p className="text-gray-700 mb-6">
                We source our beans ethically from small farms around the world and roast them in-house to ensure peak flavor and freshness. Our food menu features locally sourced ingredients from farmers we know by name.
              </p>
              <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white">Learn More About Us</Button>
            </div>
            <div className="bg-green-200 h-80 rounded-lg flex items-center justify-center">
              <span className="text-green-800">Café Interior Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Hours Section */}
      <section id="contact" className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
              <p className="mb-4">2A Florence St, Hornsby NSW 2077</p>
              {/* <p className="mb-6">Phone: (555) 123-4567</p> */}
              <Button className="bg-white text-green-800 hover:bg-gray-100">Get Directions</Button>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>6:30 AM - 3:30 PM</span>
                </div>
                <Separator className="bg-green-700" />
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>7:30 AM - 3:00 PM</span>
                </div>
                <Separator className="bg-green-700" />
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-green-950 text-green-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Café Forest</h3>
              {/* <p className="text-sm">A tranquil oasis in the heart of the city.</p> */}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#menu" className="hover:text-white">Menu</a></li>
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Café Forest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}