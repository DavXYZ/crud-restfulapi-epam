interface Address {
  street: string;
}

interface Manufacturer {
  address: Address;
}

interface Stock {
  available: number;
  reserved: number;
  location: string;
}

export default interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: Stock;
  tags: string[];
  rating: number;
  deleted: boolean;
  manufacturer?: Manufacturer;
}
