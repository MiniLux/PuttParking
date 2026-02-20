export type PowerUpId =
  | 'steady_aim'
  | 'power_shot'
  | 'magnet'
  | 'rewind'
  | 'ghost_ball'
  | 'teleport'
  | 'super_size'
  | 'fun_size'
  | 'ice_rink'
  | 'reversiball'
  | 'twisted_aim'
  | 'zanyball'
  | 'steal'
  | 'fog'
  | 'earthquake';

export type PowerUpTarget = 'self' | 'opponent' | 'all_opponents';

export interface PowerUpDefinition {
  id: PowerUpId;
  name: string;
  description: string;
  target: PowerUpTarget;
  duration?: number; // seconds, undefined = instant
  icon: string;
  color: string;
}
