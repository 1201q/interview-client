'use client';

import { useHydrateAtoms } from 'jotai/utils';
import { currentRequestStageAtom, RequestStage } from '@/store/request-stage';

import { RequestSideSteps } from './RequestSideSteps';

export default function RequestSideStepsHydrated({
  initialStage,
  dangerouslyForceHydrate = false,
}: {
  dangerouslyForceHydrate?: boolean;
  initialStage: RequestStage;
}) {
  useHydrateAtoms([[currentRequestStageAtom, initialStage]], {
    dangerouslyForceHydrate: dangerouslyForceHydrate,
  });
  return <RequestSideSteps />;
}
