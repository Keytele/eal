import type { Market } from './context';
import type {
  ConfigurationRule,
  EntityId,
  Money,
  OptionSupplyStatus,
  VehicleConfiguration,
  VehicleLifecycle,
  VehicleOption,
} from './types';
import {
  invalid,
  isFiniteNumber,
  isPlainRecord,
  isSafeIdentifier,
  valid,
  type ValidationResult,
} from './validation';

export interface ConfigurationEvaluation {
  readonly valid: boolean;
  readonly violations: readonly {
    readonly ruleId: EntityId;
    readonly messageKey: string;
  }[];
}

export interface OptionEvaluationContext {
  readonly market: Market;
  readonly configuration: VehicleConfiguration;
  readonly supplyByOptionId?: Readonly<Record<EntityId, OptionSupplyStatus>>;
}

export interface OptionEvaluation {
  readonly optionId: EntityId;
  readonly selected: boolean;
  readonly enabled: boolean;
  /** A translated, accessible reason when selection is unavailable. */
  readonly explanationKey?: string;
  readonly appliedRuleIds: readonly EntityId[];
  readonly isDefault: boolean;
  /** Presentational only: a quote service remains the price source of truth. */
  readonly priceDeltas: readonly Money[];
}

/**
 * Evaluates data-supplied compatibility rules outside the UI. Rules never
 * perform pricing or mutate the selected configuration.
 */
export function evaluateConfiguration(
  configuration: VehicleConfiguration,
  rules: readonly ConfigurationRule[],
): ConfigurationEvaluation {
  const selected = new Set([configuration.trimId, ...configuration.optionIds]);
  const violations = rules.flatMap((rule) => {
    const applies = rule.whenSelected.every((id) => selected.has(id));
    if (!applies) {
      return [];
    }

    const includesExcludedOption = rule.excludes.some((id) => selected.has(id));
    const missesRequiredOption = rule.requires.some((id) => !selected.has(id));
    return includesExcludedOption || missesRequiredOption
      ? [{ ruleId: rule.id, messageKey: rule.messageKey }]
      : [];
  });

  return { valid: violations.length === 0, violations };
}

/**
 * Deterministically evaluates option state from PIM rules and live supply.
 * It neither mutates the configuration nor calculates a commercial total.
 */
export function evaluateOptions(
  context: OptionEvaluationContext,
  options: readonly VehicleOption[],
  rules: readonly ConfigurationRule[],
): readonly OptionEvaluation[] {
  const selected = new Set([context.configuration.trimId, ...context.configuration.optionIds]);

  return options.map((option) => {
    const selectedWithCandidate = new Set(selected);
    selectedWithCandidate.add(option.id);
    const relevantRules = rules.filter((rule) => isRuleRelevant(rule, context, option.id));
    const failures = relevantRules.filter((rule) =>
      hasRuleViolation(rule, selectedWithCandidate, context, option.id),
    );
    const priceDeltas = relevantRules.flatMap((rule) =>
      rule.priceDelta === undefined ? [] : [rule.priceDelta],
    );
    const defaultRule = relevantRules.find(
      (rule) => rule.kind === 'default' && rule.defaultOptionId === option.id,
    );

    return {
      optionId: option.id,
      selected: selected.has(option.id),
      enabled: failures.length === 0,
      explanationKey: failures[0]?.messageKey,
      appliedRuleIds: relevantRules.map((rule) => rule.id),
      isDefault: defaultRule !== undefined,
      priceDeltas,
    };
  });
}

/** Validates a decoded configurator URL before it is turned into build state. */
export function validateConfigurationUrlState(
  value: unknown,
): ValidationResult<VehicleConfiguration> {
  if (!isPlainRecord(value)) {
    return invalid('configuration', 'validation.configuration');
  }

  if (
    !isSafeIdentifier(value.modelId) ||
    !isSafeIdentifier(value.trimId) ||
    !isFiniteNumber(value.modelYear) ||
    !Number.isInteger(value.modelYear) ||
    !Array.isArray(value.optionIds) ||
    !value.optionIds.every(isSafeIdentifier)
  ) {
    return invalid('configuration', 'validation.configuration');
  }

  const optionIds = [...value.optionIds];
  if (new Set(optionIds).size !== optionIds.length || optionIds.includes(value.trimId)) {
    return invalid('configuration.optionIds', 'validation.configurationOptions');
  }

  return valid({
    modelId: value.modelId,
    modelYear: value.modelYear,
    trimId: value.trimId,
    optionIds,
  });
}

export type LifecycleCta = 'register-interest' | 'build' | 'view-inventory' | 'explore-archive';

export function getLifecycleCta(lifecycle: VehicleLifecycle): LifecycleCta {
  switch (lifecycle) {
    case 'announced':
    case 'coming-soon':
      return 'register-interest';
    case 'orderable':
      return 'build';
    case 'inventory-only':
      return 'view-inventory';
    case 'discontinued':
      return 'explore-archive';
  }
}

function isRuleRelevant(
  rule: ConfigurationRule,
  context: OptionEvaluationContext,
  optionId: EntityId,
): boolean {
  if (rule.market !== context.market || rule.modelId !== context.configuration.modelId) {
    return false;
  }

  if (rule.trimIds !== undefined && !rule.trimIds.includes(context.configuration.trimId)) {
    return false;
  }

  return (
    rule.appliesTo === undefined || rule.appliesTo.length === 0 || rule.appliesTo.includes(optionId)
  );
}

function hasRuleViolation(
  rule: ConfigurationRule,
  selected: ReadonlySet<EntityId>,
  context: OptionEvaluationContext,
  optionId: EntityId,
): boolean {
  const conditionsMatch = rule.whenSelected.every((id) => selected.has(id));
  if (!conditionsMatch) {
    return false;
  }

  if (rule.kind === 'supply') {
    const supply = context.supplyByOptionId?.[optionId] ?? rule.supplyStatus;
    return supply === 'unavailable';
  }

  return (
    rule.excludes.some((id) => selected.has(id)) || rule.requires.some((id) => !selected.has(id))
  );
}
