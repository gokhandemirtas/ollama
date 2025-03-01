import { Application } from 'express';
import adminRoutes from './admin';
import characterDesignerRoutes from './character-designer';
import healthCheckRoutes from './healthcheck';
import userRoutes from './user';

export default function setRoutes(app: Application): void {
  adminRoutes(app);
  userRoutes(app);
  healthCheckRoutes(app);
  characterDesignerRoutes(app);
}
