import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function QuestionItem({ question, onToggle, index, singleSelectionMode = false }) {
  const handleToggle = (checked) => {
    if (singleSelectionMode && !checked) {
      return;
    }
    onToggle(checked);
  };

  const handleRadioChange = () => {
    onToggle(true);
  };

  return (
    <motion.div
      className={`mb-2 flex items-start gap-3 p-4 rounded-lg ${question.checked ? 'bg-action-buttons-background' : 'bg-white'
        } hover:shadow-md transition-all duration-200`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <div className="mt-1">
        {singleSelectionMode ? (
          <RadioGroupItem
            value={question.id?.toString()}
            id={`question-${question.id}`}
            checked={question.checked}
            onClick={handleRadioChange}
            className={`${question.checked
              ? 'border-action-buttons-foreground text-action-buttons-foreground'
              : 'border-action-buttons-foreground'
              } w-5 h-5`}
          />
        ) : (
          <Checkbox
            id={index}
            checked={question.checked}
            onCheckedChange={handleToggle}
            className={`${question.checked
              ? 'bg-action-buttons-foreground border-action-buttons-foreground'
              : 'border-action-buttons-foreground'
              } rounded-md w-5 h-5`}
          />
        )}
      </div>
      <div className="flex-1">
        <Label
          htmlFor={`question-${question.id}`}
          className="font-medium text-[#000000e6] text-lg cursor-pointer select-none"
        >
          <Latex>{question.text || ""}</Latex>
        </Label>

        {question.subItems && (
          <div className="mt-3 ml-4 font-medium text-[#000000cc] space-y-2">
            {question.subItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="pl-3"
              >
                <Latex>{item || ""}</Latex>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}