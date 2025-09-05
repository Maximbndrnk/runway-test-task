export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
}
