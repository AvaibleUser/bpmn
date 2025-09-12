import { Role } from '@core/auth/models/auth.model';
import { X } from 'lucide-angular';

export interface SidebarItem {
  name: string;
  icon: typeof X;
  path: string;
  roles?: Role[];
}
