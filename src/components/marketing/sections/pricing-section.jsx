import { PricingCard } from "@/components/shared/pricing-card";
import { pricingPlansData } from "@/config/constant";

export function PricingSection() {
  return (
    <section className="w-full h-[720px] bg-[#c3edfe] mt-[100px]" id="pricing">
      <h2 className="text-center font-black text-[45px] text-[#274d7a] pt-[61px] [font-family:'Roca-Black',Helvetica]">
        Which plan is right for me ?
      </h2>

      <div className="flex justify-center gap-12 mt-[221px]">
        {pricingPlansData.map((plan, index) => (
          <PricingCard
            key={index}
            title={plan.title}
            price={plan.price}
            period={plan.period}
            features={plan.features}
            buttonText={plan.buttonText}
            recommended={plan.recommended}
            className={plan.className}
            discount={plan.discount}
          />
        ))}
      </div>
    </section>
  );
}