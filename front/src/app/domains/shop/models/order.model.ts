export type Status = 'CART' | 'PAID' | 'SENT';

export interface Order {
  id: number;
  total: number;
  status: Status;
  createdAt: Date;
}
