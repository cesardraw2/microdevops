import { createAction, props } from '@ngrx/store';
import { AlertConfig } from '@sicoob/ui';

export const appShowMessage = createAction(
  '[Sisbr 3.0] Show Message',
  props<AlertConfig>()
);

