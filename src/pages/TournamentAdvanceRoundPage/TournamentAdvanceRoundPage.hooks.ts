import { RefObject, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useWizardSteps = (refs: RefObject<{ validate: () => void }>[]) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [step, setStep] = useState<number>(0);

  const handleCancel = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`${pathname.split('/').slice(0, -1).join('/')}`);
    }
  };

  const handleBack = (): void => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      handleCancel();
    }
  };

  const handleProceed = (): void => {
    refs[step].current?.validate();
  };

  return {
    step,
    cancel: handleCancel,
    back: handleBack,
    advance: () => setStep(step + 1),
    validatedAdvance: handleProceed,
  };
};
