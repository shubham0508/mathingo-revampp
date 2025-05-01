import { MessageSquare } from "lucide-react";

export function ChatButton() {
  return (
    <button className="fixed bottom-20 right-10 w-[76px] h-[76px] bg-[#03477b99] rounded-[38px] flex items-center justify-center cursor-pointer">
      <div className="relative">
        <MessageSquare className="w-16 h-16 text-[#025394]" />
        <span className="absolute top-[29px] left-4 [font-family:'Avenir-Roman',Helvetica] text-[#025394] text-[15px]">
          Ask Us
        </span>
      </div>
    </button>
  );
}