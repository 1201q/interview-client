'use client';

import { useHydrateAtoms } from 'jotai/utils';
import { currentRequestStageAtom, RequestStage } from '@/store/request-stage';
import { SidebarSteps } from '@/components/new/SidebarSteps';

export default function SidebarStepsHydrated({
  initialStage,
}: {
  initialStage: RequestStage;
}) {
  useHydrateAtoms([[currentRequestStageAtom, initialStage]], {
    dangerouslyForceHydrate: false,
  });
  return <SidebarSteps />;
}
