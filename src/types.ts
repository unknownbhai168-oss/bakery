export type Category = 'all' | 'entremets' | 'donuts' | 'macarons' | 'viennoiserie' | 'boxes';

export type GlazeFinish = 'mirror' | 'velours' | 'gold_leaf' | 'satin';

export interface PastryItem {
  id: string;
  name: string;
  frenchName: string;
  category: 'entremets' | 'donuts' | 'macarons' | 'viennoiserie' | 'boxes';
  price: number;
  description: string;
  flavorNotes: string[];
  allergens: string[];
  dietary: string[];
  originIngredients: string;
  modelType: 'cake' | 'donut' | 'macaron' | 'croissant' | 'choux';
  glazeColor?: string;
  accentColor?: string;
  servings?: string;
  badge?: string;
}

export interface CartItem {
  pastry: PastryItem;
  quantity: number;
  glazeFinish?: GlazeFinish;
  customMessage?: string;
}

export interface CakeConfig {
  tiers: number;
  sponge: string;
  filling: string;
  glaze: GlazeFinish;
  toppings: string[];
  inscription: string;
  servings: number;
  deliveryDate: string;
}
