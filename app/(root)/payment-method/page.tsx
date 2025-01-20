import CheckOutSteps from "@/components/shared/checkout/CheckOutSteps";
import { Metadata } from "next";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./PaymentMethodForm";

export const metadata: Metadata = {
    title: 'Select Payment Method',
};

const PaymentMethodPage = async () => {
  const session = await auth()
  const userId = await session?.user?.id
  if (!userId) throw new Error('User not found')

  const user = await getUserById(userId)

    return (
      <>
        <CheckOutSteps current={2} />
        <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
      </>
    );
}
 
export default PaymentMethodPage;