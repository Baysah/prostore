import CheckOutSteps from "@/components/shared/checkout/CheckOutSteps";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Payment Method',
};

const PaymentMethodPage = () => {
    return (
      <>
        <CheckOutSteps current={2} />
        <div>Payment Method</div>
      </>
    );
}
 
export default PaymentMethodPage;