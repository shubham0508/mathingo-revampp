import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function PricingCard({
  title,
  price,
  period,
  features,
  buttonText,
  recommended = false,
  className = "",
  discount,
}) {
  return (
    <div className="relative">
      {recommended && (
        <Badge className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#fff7eb] text-[#274d7a] border-2 border-[#6798ac] rounded-[20px] px-6 py-2 [font-family:'Avenir-Heavy',Helvetica] text-xl">
          <Lightbulb className="w-5 h-5 mr-2" />
          Recommended
        </Badge>
      )}

      {discount && (
        <Badge className="absolute -top-10 -left-4 bg-[#274d7a] text-white rounded-[20px] rotate-[-13.55deg] [font-family:'Avenir-Medium',Helvetica] text-[15px]">
          {discount}
        </Badge>
      )}

      <Card
        className={`w-[328px] h-[370px] ${className} rounded-[15px] border-2 border-solid ${recommended ? "border-[#417e94]" : "border-[#025475]"} shadow-[0px_4px_4px_#00000040]`}
      >
        <CardContent className="p-0 pt-[29px] px-[45px] h-full flex flex-col">
          <h3 className="font-black text-black text-lg tracking-[0.90px] [font-family:'Avenir-Black',Helvetica]">
            {title}
          </h3>

          <div className="mt-[34px] [font-family:'Avenir-Regular',Helvetica] text-black text-[25px]">
            <span>{price} /</span>
            <span className="[font-family:'Avenir-Medium',Helvetica] text-xl">
              {" "}
              {period}
            </span>
          </div>

          <ul className="mt-[70px] space-y-[42px]">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="[font-family:'Avenir-Roman',Helvetica] text-black text-xl"
              >
                {feature}
              </li>
            ))}
          </ul>

          <Button className="mt-auto mb-[30px] w-[269px] mx-auto px-5 py-2.5 text-xl text-white rounded-[5px] border-[3px] border-[#00000099] shadow-[0px_4px_4px_#00000040] [background:linear-gradient(180deg,rgba(54,197,255,1)_0%,rgba(52,130,221,1)_100%)] [font-family:'Avenir-Medium',Helvetica]">
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}