import { z } from "zod";
import { cartItemSchema, insertCartSchema, insertProductSchema, shippingAddressSchema, insertOrderItemSchema, insertOrderSchema, paymentResultSchema, signUpFormSchema } from "@/lib/schemas";
export type Product = z.infer<typeof insertProductSchema> &{
    id: string;
    rating: string;
    createdAt: Date;
}

export type User = z.infer<typeof signUpFormSchema> & {
    id: string;
}


export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderitems : OrderItem[];
    user: {name: string, email: string};
}

export type PaymentResult = z.infer<typeof paymentResultSchema>;
