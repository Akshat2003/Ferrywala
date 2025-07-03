// src/navigation/types.ts
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  CategoryListing: {
    categoryId: string;
    categoryName: string;
  };
  VendorDetail: {
    vendorId: string;
  };
  Search: {
    query?: string;
  };
  Cart: undefined;
  Profile: undefined;
};