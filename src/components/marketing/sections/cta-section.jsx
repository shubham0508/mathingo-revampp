import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section
      className="w-full h-[468px] bg-cover bg-center mt-[100px]"
      style={{ backgroundImage: "url('/images/cta-background.jpg')" }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="font-black text-[40px] text-[#274d7a] [font-family:'Roca-Black',Helvetica]">
          Learn Quickly &amp; Master Easily
        </h2>

        <h3 className="font-normal text-3xl text-[#012e62] mt-6 [font-family:'Avenir-Heavy',Helvetica]">
          From Elementary to college
        </h3>

        <Button 
          className="mt-10 px-5 py-3 text-[25px] text-white rounded-[5px] border-[3px] border-[#00000099] shadow-[0px_4px_4px_#00000040] [background:linear-gradient(180deg,rgba(54,197,255,1)_0%,rgba(52,130,221,1)_100%)] [font-family:'Avenir-Medium',Helvetica]"
          asChild
        >
          <Link href="/get-started">Start for Free</Link>
        </Button>
      </div>
    </section>
  );
}