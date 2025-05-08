import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function FeatureCard({ title, image }) {
  return (
    <Card className="w-[334px] h-[423px] bg-[#eefaff] rounded-[10px] border-2 border-solid border-black shadow-[0px_4px_4px_#00000040]">
      <CardContent className="p-0 h-full flex flex-col items-center justify-between">
        <div className="w-full h-[250px] flex items-center justify-center">
          <Image
            className="max-w-full max-h-full object-contain"
            alt={title}
            src={image}
            width={250}
            height={200}
          />
        </div>
        <h3 className="font-normal text-[#014662] text-3xl mb-8 [font-family:'Avenir-Heavy',Helvetica]">
          {title}
        </h3>
      </CardContent>
    </Card>
  );
}