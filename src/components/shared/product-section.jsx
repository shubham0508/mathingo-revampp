import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function ProductSection({
  title,
  description,
  learnMoreLink,
  buttonText,
  image,
  isReversed = false,
  index,
}) {
  return (
    <section
      className={`relative w-full ${index === 0 ? "h-[415px] mt-[55px]" : "h-[405px] mt-[100px]"} flex ${isReversed ? "flex-row-reverse" : "flex-row"} items-center justify-between px-[177px]`}
    >
      <div className="max-w-[452px]">
        <h2 className="font-black text-[40px] text-[#012e62] [font-family:'Roca-Black',Helvetica]">
          {title}
        </h2>
        <p className="font-medium text-[25px] text-[#014662] mt-6 [font-family:'Avenir-Medium',Helvetica]">
          {description}
        </p>
        <Link
          href={learnMoreLink}
          className="font-medium text-[25px] text-[#1679bb] underline mt-2 inline-block [font-family:'Avenir-Medium',Helvetica]"
        >
          Learn More
        </Link>
        <Button className="mt-8 px-5 py-3 text-[25px] text-white rounded-[5px] border-[3px] border-[#00000099] shadow-[0px_4px_4px_#00000040] [background:linear-gradient(180deg,rgba(54,197,255,1)_0%,rgba(52,130,221,1)_100%)] [font-family:'Avenir-Medium',Helvetica]">
          {buttonText}
        </Button>
      </div>

      <div className="relative w-[450px] h-[350px]">
        <Image
          className="w-full h-full object-contain"
          alt={title}
          src={image}
          width={450}
          height={350}
        />
      </div>
    </section>
  );
}