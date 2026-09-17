import React, { useEffect, useState } from "react";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  { name: "Free", price: 0, features: ["Limited access", "1 download/day", "Standard quality"] },
  { name: "Bronze", price: 99, features: ["5 downloads/day", "HD quality", "No ads"] },
  { name: "Silver", price: 199, features: ["10 downloads/day", "Full HD quality", "Priority support"] },
  { name: "Gold", price: 499, features: ["20 downloads/day", "4K quality", "All premium features"] },
];

export default function SubscriptionPage() {
  const { user } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentSub, setCurrentSub] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get(`/api/subscription/status/${user._id}`);
        setCurrentSub(res.data?.result);
      } catch (e) {
        console.log(e);
      }
    };
    fetchStatus();
  }, [user]);

  const handleSubscribe = async (plan: string, price: number) => {
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }
    if (price === 0) {
      toast.success("You're already on the Free plan.");
      return;
    }

    setLoadingPlan(plan);
    try {
      const { data } = await axiosInstance.post("/api/subscription/create", {
        amount: price,
      });

      const options = {
        key: "rzp_test_Tc80zyiRXREkbZ",
        amount: data.order.amount,
        currency: "INR",
        name: "YourTube Subscription",
        description: `${plan} Plan Subscription`,
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            await axiosInstance.post("/api/subscription/verify", {
              userId: user._id,
              plan,
              amount: price,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });
            toast.success(`Successfully subscribed to ${plan} plan!`);
          } catch (err) {
            toast.error("Payment succeeded but saving subscription failed.");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Could not start payment. Try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {currentSub && (
  <div className="mb-4 p-4 bg-gray-100 rounded-lg">
    <p className="font-medium">Current Plan: {currentSub.plan}</p>
    <p className="text-sm text-gray-600">
      Expires: {new Date(currentSub.expiryDate).toLocaleDateString()}
    </p>
  </div>
)}
      <h1 className="text-2xl font-bold mb-6">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {PLANS.map((p) => (
          <div key={p.name} className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-2xl font-bold">
              {p.price === 0 ? "Free" : `₹${p.price}/mo`}
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              {p.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <Button
              className="w-full"
              onClick={() => handleSubscribe(p.name, p.price)}
              disabled={loadingPlan === p.name}
            >
              {loadingPlan === p.name ? "Processing..." : p.price === 0 ? "Current Plan" : "Subscribe"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}