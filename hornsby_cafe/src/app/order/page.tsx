// src/app/order/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Button,
  Card,
  CardContent,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Badge,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label
} from "@/components/ui";
import { ShoppingCart, Plus, Minus, X, ArrowLeft } from "lucide-react";
import { processMenu } from "@/utils/menuHelper";
import menuData from "@/utils/menu.json";

// Types
interface CustomizationOption {
  id: string;
  name: string;
  type: "radio" | "checkbox" | "select";
  options?: {
    id: string;
    name: string;
    price?: number;
  }[];
  required?: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  image: string;
  customizationOptions?: CustomizationOption[];
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations: Record<string, any>;
  totalPrice: number;
}

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [customizations, setCustomizations] = useState<Record<string, any>>({});
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const router = useRouter();

  // Process the menu data on component mount
  useEffect(() => {
    try {
      const processedMenu = processMenu(menuData);
      setMenuItems(processedMenu);
    } catch (error) {
      console.error("Error processing menu:", error);
      setMenuItems([]);
    }
  }, []);

  // Reset customizations when a new item is selected
  useEffect(() => {
    if (selectedItem) {
      const initialCustomizations: Record<string, any> = {};
      selectedItem.customizationOptions?.forEach(option => {
        if (option.type === "radio" && option.required && option.options?.length) {
          initialCustomizations[option.id] = option.options[0].id;
        } else if (option.type === "checkbox") {
          initialCustomizations[option.id] = {};
          option.options?.forEach(opt => {
            initialCustomizations[option.id][opt.id] = false;
          });
        } else if (option.type === "select" && option.required && option.options?.length) {
          initialCustomizations[option.id] = option.options[0].id;
        }
      });
      setCustomizations(initialCustomizations);
      setCurrentQuantity(1);
    }
  }, [selectedItem]);

  // Calculate total price based on selected options
  const calculateItemTotal = (item: MenuItem, quantity: number) => {
    let total = item.price;
    
    if (item.customizationOptions) {
      item.customizationOptions.forEach(option => {
        if (option.type === "radio" && customizations[option.id]) {
          const selectedOption = option.options?.find(opt => opt.id === customizations[option.id]);
          if (selectedOption?.price) {
            total += selectedOption.price;
          }
        } else if (option.type === "checkbox" && customizations[option.id]) {
          option.options?.forEach(opt => {
            if (customizations[option.id][opt.id] && opt.price) {
              total += opt.price;
            }
          });
        } else if (option.type === "select" && customizations[option.id]) {
          const selectedOption = option.options?.find(opt => opt.id === customizations[option.id]);
          if (selectedOption?.price) {
            total += selectedOption.price;
          }
        }
      });
    }
    
    return total * quantity;
  };

  // Add item to cart
  const addToCart = () => {
    if (!selectedItem) return;
    
    const totalPrice = calculateItemTotal(selectedItem, currentQuantity);
    
    const newItem: CartItem = {
      menuItem: selectedItem,
      quantity: currentQuantity,
      customizations: {...customizations},
      totalPrice
    };
    
    setCart([...cart, newItem]);
    setIsCustomizing(false);
    setSelectedItem(null);
  };

  // Remove item from cart
  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Update item quantity in cart
  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    newCart[index].totalPrice = calculateItemTotal(newCart[index].menuItem, newQuantity);
    
    setCart(newCart);
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Get customization option name
  const getOptionName = (item: MenuItem, optionId: string, valueId: string) => {
    const option = item.customizationOptions?.find(opt => opt.id === optionId);
    const value = option?.options?.find(opt => opt.id === valueId);
    return value?.name || valueId;
  };

  // Render customization summary for cart
  const renderCustomizationSummary = (item: CartItem) => {
    const { menuItem, customizations } = item;
    const summaryItems: string[] = [];
    
    menuItem.customizationOptions?.forEach(option => {
      if (option.type === "radio" && customizations[option.id]) {
        const optionName = getOptionName(menuItem, option.id, customizations[option.id]);
        summaryItems.push(`${option.name}: ${optionName}`);
      } else if (option.type === "checkbox" && customizations[option.id]) {
        const selected = option.options?.filter(opt => customizations[option.id][opt.id]);
        if (selected && selected.length > 0) {
          summaryItems.push(`${option.name}: ${selected.map(s => s.name).join(', ')}`);
        }
      } else if (option.type === "select" && customizations[option.id]) {
        const optionName = getOptionName(menuItem, option.id, customizations[option.id]);
        summaryItems.push(`${option.name}: ${optionName}`);
      }
    });
    
    return summaryItems.map((item, index) => (
      <div key={index} className="text-sm text-gray-500">{item}</div>
    ));
  };

  // Render radio option
  const renderRadioOption = (option: CustomizationOption) => {
    // For sugar options, use a select instead of radio buttons
    if (option.id === "sugar") {
      return renderSelectOption(option);
    }
    
    return (
      <div className="mb-4">
        <h4 className="font-medium mb-2">{option.name} {option.required && <span className="text-red-500">*</span>}</h4>
        <RadioGroup 
          value={customizations[option.id] || ''} 
          onValueChange={(value) => setCustomizations({...customizations, [option.id]: value})}
        >
          {option.options?.map(opt => (
            <div key={opt.id} className="flex items-center space-x-2 mb-1">
              <RadioGroupItem value={opt.id} id={`${option.id}-${opt.id}`} />
              <Label htmlFor={`${option.id}-${opt.id}`} className="flex justify-between w-full">
                <span>{opt.name}</span>
                {opt.price !== 0 && <span className="text-gray-500">{formatPrice(opt.price || 0)}</span>}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  // Render checkbox option
  const renderCheckboxOption = (option: CustomizationOption) => {
    return (
      <div className="mb-4">
        <h4 className="font-medium mb-2">{option.name}</h4>
        {option.options?.map(opt => (
          <div key={opt.id} className="flex items-center space-x-2 mb-1">
            <Checkbox 
              id={`${option.id}-${opt.id}`} 
              checked={customizations[option.id]?.[opt.id] || false}
              onCheckedChange={(checked) => {
                setCustomizations({
                  ...customizations,
                  [option.id]: {
                    ...customizations[option.id],
                    [opt.id]: checked
                  }
                });
              }} 
            />
            <Label htmlFor={`${option.id}-${opt.id}`} className="flex justify-between w-full">
              <span>{opt.name}</span>
              {opt.price !== 0 && <span className="text-gray-500">{formatPrice(opt.price || 0)}</span>}
            </Label>
          </div>
        ))}
      </div>
    );
  };

  // Render select option
  const renderSelectOption = (option: CustomizationOption) => {
    return (
      <div className="mb-4">
        <h4 className="font-medium mb-2">{option.name} {option.required && <span className="text-red-500">*</span>}</h4>
        <Select 
          value={customizations[option.id] || ''} 
          onValueChange={(value) => setCustomizations({...customizations, [option.id]: value})}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {option.options?.map(opt => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.name} {opt.price !== 0 && `(+${formatPrice(opt.price || 0)})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <button onClick={() => router.push('/')} className="flex items-center">
              <ArrowLeft className="mr-2" /> Back
            </button>
            <span className="ml-4 font-bold">Café Forest</span>
          </div>
          
          <Button 
            variant="outline" 
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="mr-2" />
            <span>Cart</span>
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2">{cart.length}</Badge>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-2">Order Online</h1>
        <p className="text-center mb-6">Select from our freshly made items</p>

        {/* Menu Tabs */}
        <Tabs defaultValue="hot">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="hot">Hot Coffee</TabsTrigger>
            <TabsTrigger value="cold">Iced Drinks</TabsTrigger>
            <TabsTrigger value="specialty">Specialty</TabsTrigger>
            <TabsTrigger value="tea">Tea</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
          </TabsList>
          
          {/* Hot Coffee */}
          <TabsContent value="hot">
            <h2 className="text-xl font-bold mb-4">Hot Coffee</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "beverage" && item.subcategory === "hot" && 
                              !["hot-chocolate", "hot-green-tea-latte", "hot-chai-latte"].includes(item.id))
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          {/* Cold Beverages */}
          <TabsContent value="cold">
            <h2 className="text-xl font-bold mb-4">Iced Drinks</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "beverage" && item.subcategory === "cold")
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Specialty Drinks */}
          <TabsContent value="specialty">
            <h2 className="text-xl font-bold mb-4">Specialty Drinks</h2>
            
            <h3 className="font-semibold mt-4 mb-2">Hot Specialty</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "beverage" && item.subcategory === "hot" && 
                              ["hot-chocolate", "hot-green-tea-latte", "hot-chai-latte"].includes(item.id))
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <h3 className="font-semibold mt-6 mb-2">Frappes</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "beverage" && item.subcategory === "frappe")
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <h3 className="font-semibold mt-6 mb-2">Smoothies & Juices</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "beverage" && 
                              (item.subcategory === "smoothie" || item.subcategory === "juice"))
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Tea */}
          <TabsContent value="tea">
            <h2 className="text-xl font-bold mb-4">Tea</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "beverage" && item.subcategory === "tea")
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          {/* Food */}
          <TabsContent value="food">
            <h2 className="text-xl font-bold mb-4">Food</h2>
            
            <h3 className="font-semibold mt-4 mb-2">Light Bites</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "food" && item.subcategory === "light-bite")
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <h3 className="font-semibold mt-6 mb-2">Desserts</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "food" && item.subcategory === "dessert")
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            
            <h3 className="font-semibold mt-6 mb-2">Sandwiches</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "food" && item.subcategory === "sandwich")
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            
            <h3 className="font-semibold mt-6 mb-2">All-Day Meals</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(item => item.category === "food" && item.subcategory === "all-day")
                .map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(item.price)}</span>
                        <Button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsCustomizing(true);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Item Customization Modal */}
        {isCustomizing && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                  <button 
                    onClick={() => {
                      setIsCustomizing(false);
                      setSelectedItem(null);
                    }}
                    className="text-gray-500"
                  >
                    <X />
                  </button>
                </div>
                
                <p className="mb-4">{selectedItem.description}</p>
                
                <div className="mb-6">
                  <p className="font-semibold mb-2">Base Price: {formatPrice(selectedItem.price)}</p>
                  
                  {/* Quantity selector */}
                  <div className="flex items-center mb-4">
                    <span className="mr-3">Quantity:</span>
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => currentQuantity > 1 && setCurrentQuantity(currentQuantity - 1)}
                        className="px-3 py-1 border-r"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1">{currentQuantity}</span>
                      <button 
                        onClick={() => setCurrentQuantity(currentQuantity + 1)}
                        className="px-3 py-1 border-l"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {selectedItem.customizationOptions && selectedItem.customizationOptions.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    
                    {/* Customization options */}
                    <div className="mb-6">
                      <h3 className="font-bold mb-3">Customize Your Order</h3>
                      
                      {selectedItem.customizationOptions?.map(option => (
                        <div key={option.id}>
                          {option.type === "radio" && renderRadioOption(option)}
                          {option.type === "checkbox" && renderCheckboxOption(option)}
                          {option.type === "select" && renderSelectOption(option)}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Total: {formatPrice(calculateItemTotal(selectedItem, currentQuantity))}</p>
                  </div>
                  <Button onClick={addToCart}>Add to Cart</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shopping Cart Sheet */}
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Order</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6">
              {cart.length === 0 ? (
                <div className="text-center py-6">
                  <p>Your cart is empty</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="border-b pb-4">
                        <div>
                          <div className="flex justify-between">
                            <h4>
                              {item.menuItem.name} 
                              <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                            </h4>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFromCart(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Render customizations summary */}
                          <div className="mt-1">
                            {renderCustomizationSummary(item)}
                          </div>
                          
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-2">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span>{formatPrice(item.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%)</span>
                      <span>{formatPrice(cartTotal * 0.10)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(cartTotal * 1.10)}</span>
                    </div>
                    
                    <Button className="w-full mt-6">
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}