import './styles/main.css';
import { AppShell } from './ui/AppShell';

const appRoot = document.getElementById('app');
if (appRoot) {
  new AppShell(appRoot);
}
