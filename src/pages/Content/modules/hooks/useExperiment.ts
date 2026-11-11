import { ExperimentConfig } from '../types';
import { CLIENT_ID_LENGTH } from '../constants';
import { useEffect, useState, useMemo, useContext } from 'react';
import { ExperimentsContext } from '../contexts/contexts';

/*
 * Due This Week: experiments are disabled.
 *
 * Upstream fetched A/B-test config from a server we don't control
 * (canvas-task-static.onrender.com) and created a random per-user
 * `client_id` that was synced across devices and sent with the uninstall URL.
 * We don't make any network requests except to the user's own LMS, and we
 * don't create user identifiers, so this hub always reports
 * "no experiments, no user". <Experiment> therefore always renders its control
 * (first) child.
 */

export interface ExperimentsHubInterface {
  configs: ExperimentConfig[];
  userId: string;
}

const NO_EXPERIMENTS: ExperimentsHubInterface = { configs: [], userId: '' };

export function useExperiments(): ExperimentsHubInterface {
  return NO_EXPERIMENTS;
}

export interface ExperimentInterface {
  config: ExperimentConfig;
  userId: string;
  treated: boolean;
}

export function useExperiment(id: string): ExperimentInterface {
  const exp = useContext(ExperimentsContext);
  const [config, setConfig] = useState<ExperimentConfig>(
    {} as ExperimentConfig
  );
  useEffect(() => {
    const filtered = exp.configs.filter((e) => e.id == id);
    if (filtered.length) setConfig(filtered[0]);
  }, [exp.configs]);
  const treated = useMemo(() => {
    if (exp.userId && config) {
      if (new Date(config.start_time).valueOf() > Date.now()) return false;
      const rolloutSeed =
        (parseInt(exp.userId.slice(CLIENT_ID_LENGTH - 2)) +
          config.random_offset) %
        100;
      const treatmentSeed =
        (parseInt(
          exp.userId.slice(CLIENT_ID_LENGTH - 4, CLIENT_ID_LENGTH - 2)
        ) +
          config.random_offset) %
        100;
      return (
        rolloutSeed < config.rollout && treatmentSeed < config.treatment_split
      );
    }
    return false;
  }, [config, exp.userId]);

  return { config, userId: exp.userId, treated };
}
